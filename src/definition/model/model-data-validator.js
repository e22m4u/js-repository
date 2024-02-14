import {Service} from '@e22m4u/js-service';
import {DataType} from './properties/index.js';
import {getCtorName} from '../../utils/index.js';
import {isPureObject} from '../../utils/index.js';
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
   * @returns {Promise<void>}
   */
  async validate(modelName, modelData, isPartial = false) {
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
    for (const propName of propNames) {
      const propDef = propDefs[propName];
      if (!propDef) continue;
      await this._validatePropertyValue(
        modelName,
        propName,
        propDef,
        modelData[propName],
      );
    }
  }

  /**
   * Validate property value.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @returns {Promise<void>}
   */
  async _validatePropertyValue(modelName, propName, propDef, propValue) {
    // undefined and null
    if (propValue == null) {
      const isRequired =
        typeof propDef === 'string' ? false : Boolean(propDef.required);
      if (!isRequired) return;
      throw new InvalidArgumentError(
        'The property %v of the model %v is required, but %v given.',
        propName,
        modelName,
        propValue,
      );
    }
    // DataType
    await this._validatePropertyValueType(
      modelName,
      propName,
      propDef,
      propValue,
    );
    // PropertyValidators
    await this._validateByPropertyValidators(
      modelName,
      propName,
      propDef,
      propValue,
    );
  }

  /**
   * Validate value type.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @param {boolean} isArrayValue
   * @returns {Promise<void>}
   */
  async _validatePropertyValueType(
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
        const arrayItemsValidationPromises = propValue.map(async value =>
          this._validatePropertyValueType(
            modelName,
            propName,
            propDef,
            value,
            true,
          ),
        );
        await Promise.all(arrayItemsValidationPromises);
        break;
      // OBJECT
      case DataType.OBJECT:
        if (!isPureObject(propValue)) throw createError('an Object');
        if (typeof propDef === 'object' && propDef.model)
          await this.validate(propDef.model, propValue);
        break;
    }
  }

  /**
   * Validate by property validators.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @returns {Promise<void>}
   */
  async _validateByPropertyValidators(modelName, propName, propDef, propValue) {
    if (typeof propDef === 'string' || propDef.validate == null) return;
    const options = propDef.validate;
    const propertyValidatorRegistry = this.getService(
      PropertyValidatorRegistry,
    );
    const createError = validatorName =>
      new InvalidArgumentError(
        'The property %v of the model %v has an invalid value %v ' +
          'that caught by the validator %v.',
        propName,
        modelName,
        propValue,
        validatorName,
      );
    const container = this.container;
    const validateBy = async (validatorName, validatorOptions = undefined) => {
      const validator = propertyValidatorRegistry.getValidator(validatorName);
      const context = {validatorName, modelName, propName, propDef, container};
      const valid = await validator(propValue, validatorOptions, context);
      if (valid !== true) throw createError(validatorName);
    };
    if (options && typeof options === 'string') {
      await validateBy(options);
    } else if (Array.isArray(options)) {
      const validationPromises = options.map(validatorName =>
        validateBy(validatorName),
      );
      await Promise.all(validationPromises);
    } else if (options !== null && typeof options === 'object') {
      const validationPromises = [];
      Object.keys(options).forEach(validatorName => {
        if (Object.prototype.hasOwnProperty.call(options, validatorName)) {
          const validatorOptions = options[validatorName];
          const validationPromise = validateBy(validatorName, validatorOptions);
          validationPromises.push(validationPromise);
        }
      });
      await Promise.all(validationPromises);
    } else {
      throw new InvalidArgumentError(
        'The provided option "validate" of the property %v in the model %v ' +
          'should be a non-empty String, an Array of String or an Object, ' +
          'but %v given.',
        propName,
        modelName,
        options,
      );
    }
  }
}
