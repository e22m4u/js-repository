import {Service} from '@e22m4u/js-service';
import {DataType as Type} from './data-type.js';
import {capitalize} from '../../../utils/index.js';
import {PropertyUniqueness} from './property-uniqueness.js';
import {InvalidArgumentError} from '../../../errors/index.js';
import {PropertyValidatorRegistry} from './property-validator/index.js';
import {PropertyTransformerRegistry} from './property-transformer/index.js';
import {PrimaryKeysDefinitionValidator} from './primary-keys-definition-validator.js';

/**
 * Properties definition validator.
 */
export class PropertiesDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} propDefs
   */
  validate(modelName, propDefs) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of PropertiesDefinitionValidator.validate ' +
          'should be a non-empty String, but %v was given.',
        modelName,
      );
    if (!propDefs || typeof propDefs !== 'object' || Array.isArray(propDefs)) {
      throw new InvalidArgumentError(
        'The provided option "properties" of the model %v ' +
          'should be an Object, but %v was given.',
        modelName,
        propDefs,
      );
    }
    const propNames = Object.keys(propDefs);
    propNames.forEach(propName => {
      const propDef = propDefs[propName];
      this._validateProperty(modelName, propName, propDef);
    });
    this.getService(PrimaryKeysDefinitionValidator).validate(
      modelName,
      propDefs,
    );
  }

  /**
   * Validate property.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {object} propDef
   */
  _validateProperty(modelName, propName, propDef) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of PropertiesDefinitionValidator._validateProperty ' +
          'should be a non-empty String, but %v was given.',
        modelName,
      );
    if (!propName || typeof propName !== 'string')
      throw new InvalidArgumentError(
        'The property name of the model %v should be ' +
          'a non-empty String, but %v was given.',
        modelName,
        propName,
      );
    if (!propDef)
      throw new InvalidArgumentError(
        'The property %v of the model %v should have ' +
          'a property definition, but %v was given.',
        propName,
        modelName,
        propDef,
      );
    if (typeof propDef === 'string') {
      if (!Object.values(Type).includes(propDef))
        throw new InvalidArgumentError(
          'In case of a short property definition, the property %v ' +
            'of the model %v should have one of data types: %l, but %v was given.',
          propName,
          modelName,
          Object.values(Type),
          propDef,
        );
      return;
    }
    if (!propDef || typeof propDef !== 'object' || Array.isArray(propDef)) {
      throw new InvalidArgumentError(
        'In case of a full property definition, the property %v ' +
          'of the model %v should be an Object, but %v was given.',
        propName,
        modelName,
        propDef,
      );
    }
    if (!propDef.type || !Object.values(Type).includes(propDef.type))
      throw new InvalidArgumentError(
        'The property %v of the model %v requires the option "type" ' +
          'to have one of data types: %l, but %v was given.',
        propName,
        modelName,
        Object.values(Type),
        propDef.type,
      );
    if (propDef.itemType && !Object.values(Type).includes(propDef.itemType)) {
      throw new InvalidArgumentError(
        'The provided option "itemType" of the property %v in the model %v ' +
          'should have one of data types: %l, but %v was given.',
        propName,
        modelName,
        Object.values(Type),
        propDef.itemType,
      );
    }
    if (propDef.itemModel && typeof propDef.itemModel !== 'string') {
      throw new InvalidArgumentError(
        'The provided option "itemModel" of the property %v in the model %v ' +
          'should be a String, but %v was given.',
        propName,
        modelName,
        propDef.itemModel,
      );
    }
    if (propDef.model && typeof propDef.model !== 'string')
      throw new InvalidArgumentError(
        'The provided option "model" of the property %v in the model %v ' +
          'should be a String, but %v was given.',
        propName,
        modelName,
        propDef.model,
      );
    if (propDef.primaryKey && typeof propDef.primaryKey !== 'boolean')
      throw new InvalidArgumentError(
        'The provided option "primaryKey" of the property %v in the model %v ' +
          'should be a Boolean, but %v was given.',
        propName,
        modelName,
        propDef.primaryKey,
      );
    if (propDef.columnName && typeof propDef.columnName !== 'string')
      throw new InvalidArgumentError(
        'The provided option "columnName" of the property %v in the model %v ' +
          'should be a String, but %v was given.',
        propName,
        modelName,
        propDef.columnName,
      );
    if (propDef.columnType && typeof propDef.columnType !== 'string')
      throw new InvalidArgumentError(
        'The provided option "columnType" of the property %v in the model %v ' +
          'should be a String, but %v was given.',
        propName,
        modelName,
        propDef.columnType,
      );
    if (propDef.required && typeof propDef.required !== 'boolean')
      throw new InvalidArgumentError(
        'The provided option "required" of the property %v in the model %v ' +
          'should be a Boolean, but %v was given.',
        propName,
        modelName,
        propDef.required,
      );
    if (propDef.required && propDef.default !== undefined)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a required property, ' +
          'so it should not have the option "default" to be provided.',
        propName,
        modelName,
      );
    if (propDef.primaryKey && propDef.required)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a primary key, ' +
          'so it should not have the option "required" to be provided.',
        propName,
        modelName,
      );
    if (propDef.primaryKey && propDef.default !== undefined)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a primary key, ' +
          'so it should not have the option "default" to be provided.',
        propName,
        modelName,
      );
    if (propDef.itemType && propDef.type !== Type.ARRAY)
      throw new InvalidArgumentError(
        'The property %v of the model %v has a non-array type, ' +
          'so it should not have the option "itemType" to be provided.',
        propName,
        modelName,
        propDef.type,
      );
    if (propDef.itemModel && propDef.type !== Type.ARRAY)
      throw new InvalidArgumentError(
        'The option "itemModel" is not supported for %s property type, ' +
          'so the property %v of the model %v should not have ' +
          'the option "itemModel" to be provided.',
        capitalize(propDef.type),
        propName,
        modelName,
      );
    if (propDef.itemModel && propDef.itemType !== Type.OBJECT) {
      if (propDef.itemType) {
        throw new InvalidArgumentError(
          'The provided option "itemModel" requires the option "itemType" ' +
            'to be explicitly set to Object, but the property %v of ' +
            'the model %v has specified item type as %s.',
          propName,
          modelName,
          capitalize(propDef.itemType),
        );
      } else {
        throw new InvalidArgumentError(
          'The provided option "itemModel" requires the option "itemType" ' +
            'to be explicitly set to Object, but the property %v of ' +
            'the model %v does not have specified item type.',
          propName,
          modelName,
        );
      }
    }
    if (propDef.model && propDef.type !== Type.OBJECT)
      throw new InvalidArgumentError(
        'The option "model" is not supported for %s property type, ' +
          'so the property %v of the model %v should not have ' +
          'the option "model" to be provided.',
        capitalize(propDef.type),
        propName,
        modelName,
      );
    // если определена опция "validate", то проверяется значение
    // опции, которое может являться строкой, массивом или объектом
    if (propDef.validate != null) {
      const propertyValidatorRegistry = this.getService(
        PropertyValidatorRegistry,
      );
      // если опция "validate" содержит строку, то проверяется
      // наличие зарегистрированного валидатора по названию
      if (propDef.validate && typeof propDef.validate === 'string') {
        // если название валидатора не зарегистрировано,
        // то выбрасывается ошибка
        if (!propertyValidatorRegistry.hasValidator(propDef.validate))
          throw new InvalidArgumentError(
            'The property validator %v is not found.',
            propDef.validate,
          );
      }
      // если опция "validate" содержит функцию, то данная функция
      // воспринимается как пользовательский валидатор
      else if (propDef.validate && typeof propDef.validate === 'function') {
        // (допустимо)
      }
      // если опция "validate" содержит массив, то проверяется
      // каждый элемент массива
      else if (Array.isArray(propDef.validate)) {
        for (const validatorOrName of propDef.validate) {
          // если элемент массива является строкой, то проверяется
          // наличие зарегистрированного валидатора по названию
          if (validatorOrName && typeof validatorOrName === 'string') {
            if (!propertyValidatorRegistry.hasValidator(validatorOrName))
              throw new InvalidArgumentError(
                'The property validator %v is not found.',
                validatorOrName,
              );
          }
          // если элемент массива является функцией, то данная функция
          // воспринимается как пользовательский валидатор
          else if (validatorOrName && typeof validatorOrName === 'function') {
            // (допустимо)
          }
          // если элемент массива не является названием зарегистрированного
          // валидатора или функцией-валидатором, то выбрасывается ошибка
          else {
            throw new InvalidArgumentError(
              'The provided option "validate" for the property %v in the model %v ' +
                'has an Array value that should contain validator names or validator ' +
                'functions, but %v was given.',
              propName,
              modelName,
              validatorOrName,
            );
          }
        }
      }
      // если опция "validate" содержит объект, то проверяются ключи данного
      // объекта, которые должны являться названиями зарегистрированных
      // валидаторов, а значения их аргументами
      else if (typeof propDef.validate === 'object') {
        Object.keys(propDef.validate).forEach(validatorName => {
          // если ключ объекта не является названием зарегистрированного
          // валидатора, то выбрасывается ошибка
          if (!propertyValidatorRegistry.hasValidator(validatorName))
            throw new InvalidArgumentError(
              'The property validator %v is not found.',
              validatorName,
            );
        });
      }
      // если опция "validate" не является не пустой строкой, функцией,
      // массивом и объектом, то выбрасывается ошибка
      else {
        throw new InvalidArgumentError(
          'The provided option "validate" for the property %v in the model %v ' +
            'should be either a validator name, a validator function, an array ' +
            'of validator names or functions, or an object mapping validator ' +
            'names to their arguments, but %v was given.',
          propName,
          modelName,
          propDef.validate,
        );
      }
    }
    // если определена опция "transform", то проверяется значение
    // опции, которое может являться строкой, массивом или объектом
    if (propDef.transform != null) {
      const propertyTransformerRegistry = this.getService(
        PropertyTransformerRegistry,
      );
      // если опция "transform" содержит строку, то проверяется
      // наличие зарегистрированного трансформера по названию
      if (propDef.transform && typeof propDef.transform === 'string') {
        // если название трансформера не зарегистрировано,
        // то выбрасывается ошибка
        if (!propertyTransformerRegistry.hasTransformer(propDef.transform))
          throw new InvalidArgumentError(
            'The property transformer %v is not found.',
            propDef.transform,
          );
      }
      // если опция "transform" содержит функцию, то данная функция
      // воспринимается как пользовательский трансформер
      else if (propDef.transform && typeof propDef.transform === 'function') {
        // (допустимо)
      }
      // если опция "transform" содержит массив, то проверяется
      // каждый элемент массива
      else if (Array.isArray(propDef.transform)) {
        for (const transformerOrName of propDef.transform) {
          // если элемент массива является строкой, то проверяется
          // наличие зарегистрированного трансформера по названию
          if (transformerOrName && typeof transformerOrName === 'string') {
            if (!propertyTransformerRegistry.hasTransformer(transformerOrName))
              throw new InvalidArgumentError(
                'The property transformer %v is not found.',
                transformerOrName,
              );
          }
          // если элемент массива является функцией, то данная функция
          // воспринимается как пользовательский трансформер
          else if (
            transformerOrName &&
            typeof transformerOrName === 'function'
          ) {
            // (допустимо)
          }
          // если элемент массива не является названием зарегистрированного
          // трансформера или функцией-трансформером, то выбрасывается ошибка
          else {
            throw new InvalidArgumentError(
              'The provided option "transform" for the property %v in the model %v ' +
                'has an Array value that should contain transformer names or transformer ' +
                'functions, but %v was given.',
              propName,
              modelName,
              transformerOrName,
            );
          }
        }
      }
      // если опция "transform" содержит объект, то проверяются ключи данного
      // объекта, которые должны являться названиями зарегистрированных
      // трансформеров, а значения их аргументами
      else if (typeof propDef.transform === 'object') {
        Object.keys(propDef.transform).forEach(transformerName => {
          // если ключ объекта не является названием зарегистрированного
          // валидатора, то выбрасывается ошибка
          if (!propertyTransformerRegistry.hasTransformer(transformerName))
            throw new InvalidArgumentError(
              'The property transformer %v is not found.',
              transformerName,
            );
        });
      }
      // если опция "transform" не является не пустой строкой, функцией,
      // массивом и объектом, то выбрасывается ошибка
      else {
        throw new InvalidArgumentError(
          'The provided option "transform" for the property %v in the model %v ' +
            'should be either a transformer name, a transformer function, an array ' +
            'of transformer names or functions, or an object mapping transformer ' +
            'names to their arguments, but %v was given.',
          propName,
          modelName,
          propDef.transform,
        );
      }
    }
    if (propDef.unique) {
      if (
        typeof propDef.unique !== 'boolean' &&
        !Object.values(PropertyUniqueness).includes(propDef.unique)
      ) {
        throw new InvalidArgumentError(
          'The provided option "unique" of the property %v in the model %v ' +
            'should be a Boolean or one of values: %l, but %v was given.',
          propName,
          modelName,
          Object.values(PropertyUniqueness),
          propDef.unique,
        );
      }
    }
    if (propDef.unique && propDef.primaryKey)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a primary key, ' +
          'so it should not have the option "unique" to be provided.',
        propName,
        modelName,
      );
  }
}
