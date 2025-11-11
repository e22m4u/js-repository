import {Service} from '@e22m4u/js-service';
import {DataType} from './properties/index.js';
import {getCtorName} from '../../utils/index.js';
import {isPlainObject} from '../../utils/index.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
import {InvalidArgumentError} from '../../errors/index.js';
import {PropertyValidatorRegistry} from './properties/index.js';
import {ModelDefinitionUtils} from './model-definition-utils.js';

/**
 * Model data validator.
 */
export class ModelDataValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {boolean} isPartial
   * @returns {undefined}
   */
  validate(modelName, modelData, isPartial = false) {
    if (!isPlainObject(modelData))
      throw new InvalidArgumentError(
        'The data of the model %v should be an Object, but %v was given.',
        modelName,
        modelData,
      );
    const propDefs =
      this.getService(
        ModelDefinitionUtils,
      ).getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propNames = Object.keys(isPartial ? modelData : propDefs);
    propNames.forEach(propName => {
      const propDef = propDefs[propName];
      if (!propDef) return;
      this._validatePropertyValue(
        modelName,
        propName,
        propDef,
        modelData[propName],
      );
    });
  }

  /**
   * Validate property value.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @returns {undefined}
   */
  _validatePropertyValue(modelName, propName, propDef, propValue) {
    const propType =
      this.getService(ModelDefinitionUtils).getDataTypeFromPropertyDefinition(
        propDef,
      );
    const isEmpty = this.getService(EmptyValuesService).isEmptyByType(
      propType,
      propValue,
    );
    if (isEmpty) {
      // skips validation
      // for an empty value
      const isRequired =
        typeof propDef === 'string' ? false : Boolean(propDef.required);
      if (!isRequired) return;
      // a required property should
      // not have an empty value
      throw new InvalidArgumentError(
        'The property %v of the model %v is required, but %v was given.',
        propName,
        modelName,
        propValue,
      );
    }
    // проверка соответствия типа значения
    this._validateValueByPropertyType(modelName, propName, propDef, propValue);
    // проверка значения валидаторами
    this._validateValueByPropertyValidators(
      modelName,
      propName,
      propDef,
      propValue,
    );
  }

  /**
   * Validate value by property type.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @param {boolean} isArrayValue
   * @returns {undefined}
   */
  _validateValueByPropertyType(
    modelName,
    propName,
    propDef,
    propValue,
    isArrayValue = false,
  ) {
    let expectingType;
    if (isArrayValue) {
      if (typeof propDef === 'object') {
        expectingType = propDef.itemType ?? DataType.ANY;
      } else {
        expectingType = DataType.ANY;
      }
    } else {
      expectingType = typeof propDef !== 'string' ? propDef.type : propDef;
    }

    const createError = expected => {
      const pattern = isArrayValue
        ? 'The array property %v of the model %v must have %s element, but %s was given.'
        : 'The property %v of the model %v must have %s, but %s was given.';
      const ctorName = getCtorName(propValue);
      const givenStr = ctorName ?? typeof propValue;
      return new InvalidArgumentError(
        pattern,
        propName,
        modelName,
        expected,
        givenStr,
      );
    };
    switch (expectingType) {
      // STRING
      case DataType.STRING:
        if (typeof propValue !== 'string') throw createError('a String');
        break;
      // NUMBER
      case DataType.NUMBER:
        if (typeof propValue !== 'number') throw createError('a Number');
        break;
      // BOOLEAN
      case DataType.BOOLEAN:
        if (typeof propValue !== 'boolean') throw createError('a Boolean');
        break;
      // ARRAY
      case DataType.ARRAY:
        if (!Array.isArray(propValue)) throw createError('an Array');
        propValue.forEach(value =>
          this._validateValueByPropertyType(
            modelName,
            propName,
            propDef,
            value,
            true,
          ),
        );
        break;
      // OBJECT
      case DataType.OBJECT: {
        if (!isPlainObject(propValue)) throw createError('an Object');
        if (typeof propDef === 'object') {
          const modelOptionField = isArrayValue ? 'itemModel' : 'model';
          const modelOptionValue = propDef[modelOptionField];
          if (modelOptionValue) this.validate(modelOptionValue, propValue);
        }
        break;
      }
    }
  }

  /**
   * Validate value by property validators.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @returns {undefined}
   */
  _validateValueByPropertyValidators(modelName, propName, propDef, propValue) {
    if (typeof propDef === 'string' || propDef.validate == null) return;
    const validateDef = propDef.validate;
    const validatorRegistry = this.getService(PropertyValidatorRegistry);
    const createError = validatorName => {
      if (validatorName) {
        return new InvalidArgumentError(
          'The property %v of the model %v has the invalid value %v ' +
            'that caught by the property validator %v.',
          propName,
          modelName,
          propValue,
          validatorName,
        );
      } else {
        return new InvalidArgumentError(
          'The property %v of the model %v has the invalid value %v ' +
            'that caught by a property validator.',
          propName,
          modelName,
          propValue,
        );
      }
    };
    // объявление функции для проверки значения
    // с помощью указанного валидатора
    const validateBy = (validatorOrName, validatorOptions = undefined) => {
      let validatorName, validatorFn;
      // если первый аргумент является строкой, то строка
      // воспринимается как название зарегистрированного
      // валидатора
      if (typeof validatorOrName === 'string') {
        validatorName = validatorOrName;
        validatorFn = validatorRegistry.getValidator(validatorName);
      }
      // если первый аргумент является функцией,
      // то функция воспринимается как валидатор
      else if (typeof validatorOrName === 'function') {
        validatorName =
          validatorOrName.name && validatorOrName.name !== 'validate'
            ? validatorOrName.name
            : undefined;
        validatorFn = validatorOrName;
      }
      // если первый аргумент не является строкой
      // и функцией, то выбрасывается ошибка
      else {
        throw new InvalidArgumentError(
          'Validator must be a non-empty String or ' +
            'a Function, but %v was given.',
          validatorOrName,
        );
      }
      const context = {validatorName, modelName, propName};
      const valid = validatorFn(propValue, validatorOptions, context);
      // если валидатор возвращает Promise,
      // то выбрасывается ошибка
      if (valid instanceof Promise) {
        if (validatorName) {
          throw new InvalidArgumentError(
            'Asynchronous property validators are not supported, ' +
              'but the property %v of the model %v has the property ' +
              'validator %v that returns a Promise.',
            propName,
            modelName,
            validatorName,
          );
        } else {
          throw new InvalidArgumentError(
            'Asynchronous property validators are not supported, ' +
              'but the property %v of the model %v has a property ' +
              'validator that returns a Promise.',
            propName,
            modelName,
          );
        }
      }
      // если валидатор вернул значение отличное
      // от true, то выбрасывается ошибка
      else if (valid !== true) {
        throw createError(validatorName);
      }
    };
    // если значением опции "validate" является строка,
    // то строка воспринимается как название валидатора
    if (validateDef && typeof validateDef === 'string') {
      validateBy(validateDef);
    }
    // если значение опции "validate" является функция,
    // то функция воспринимается как валидатор
    else if (validateDef && typeof validateDef === 'function') {
      validateBy(validateDef);
    }
    // если значение опции "validate" является массив, то каждый
    // элемент массива воспринимается как название валидатора
    // или функция-валидатор
    else if (Array.isArray(validateDef)) {
      validateDef.forEach(validatorOrName => {
        if (
          !validatorOrName ||
          (typeof validatorOrName !== 'string' &&
            typeof validatorOrName !== 'function')
        ) {
          throw new InvalidArgumentError(
            'The provided option "validate" for the property %v in the model %v ' +
              'has an Array value that should contain validator names or validator ' +
              'functions, but %v was given.',
            propName,
            modelName,
            validatorOrName,
          );
        }
        validateBy(validatorOrName);
      });
    }
    // если значение опции "validate" является объектом,
    // то ключи объекта воспринимаются как названия валидаторов,
    // а их значения аргументами
    else if (validateDef !== null && typeof validateDef === 'object') {
      Object.keys(validateDef).forEach(validatorName => {
        const validatorOptions = validateDef[validatorName];
        validateBy(validatorName, validatorOptions);
      });
    }
    // если значение опции "validate" не является строкой,
    // функцией и массивом, то выбрасывается ошибка
    else {
      throw new InvalidArgumentError(
        'The provided option "validate" for the property %v in the model %v ' +
          'should be either a validator name, a validator function, an array ' +
          'of validator names or functions, or an object mapping validator ' +
          'names to their arguments, but %v was given.',
        propName,
        modelName,
        validateDef,
      );
    }
  }
}
