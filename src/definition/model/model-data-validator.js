import {Service} from '@e22m4u/js-service';
import {DataType} from './properties/index.js';
import {getCtorName} from '../../utils/index.js';
import {isPureObject} from '../../utils/index.js';
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
    if (!isPureObject(modelData))
      throw new InvalidArgumentError(
        'The data of the model %v should be an Object, but %v given.',
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
        'The property %v of the model %v is required, but %v given.',
        propName,
        modelName,
        propValue,
      );
    }
    // passes the property value
    // through property validators
    this._validateValueByPropertyValidators(
      modelName,
      propName,
      propDef,
      propValue,
    );
    // type checking of the property value
    this._validateValueByPropertyType(modelName, propName, propDef, propValue);
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
        ? 'The array property %v of the model %v must have %s element, but %s given.'
        : 'The property %v of the model %v must have %s, but %s given.';
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
        if (!isPureObject(propValue)) throw createError('an Object');
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
    const createError = validatorName =>
      new InvalidArgumentError(
        'The property %v of the model %v has an invalid value %v ' +
          'that caught by the validator %v.',
        propName,
        modelName,
        propValue,
        validatorName,
      );
    const validateBy = (validatorName, validatorOptions = undefined) => {
      const validator = validatorRegistry.getValidator(validatorName);
      const context = {validatorName, modelName, propName};
      const valid = validator(propValue, validatorOptions, context);
      if (valid instanceof Promise) {
        throw new InvalidArgumentError(
          'Asynchronous property validators are not supported, ' +
            'but the property validator %v returns a Promise.',
          validatorName,
        );
      } else if (valid !== true) {
        throw createError(validatorName);
      }
    };
    if (validateDef && typeof validateDef === 'string') {
      validateBy(validateDef);
    } else if (Array.isArray(validateDef)) {
      validateDef.forEach(validatorName => validateBy(validatorName));
    } else if (validateDef !== null && typeof validateDef === 'object') {
      Object.keys(validateDef).forEach(validatorName => {
        if (Object.prototype.hasOwnProperty.call(validateDef, validatorName)) {
          const validatorOptions = validateDef[validatorName];
          validateBy(validatorName, validatorOptions);
        }
      });
    } else {
      throw new InvalidArgumentError(
        'The provided option "validate" of the property %v in the model %v ' +
          'should be a non-empty String, an Array of String or an Object, ' +
          'but %v given.',
        propName,
        modelName,
        validateDef,
      );
    }
  }
}
