import {Service} from '@e22m4u/service';
import {DataType} from './properties/index.js';
import {getCtorName} from '../../utils/index.js';
import {isPureObject} from '../../utils/index.js';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDefinitionUtils} from './model-definition-utils.js';

/**
 * Model data validator.
 */
export class ModelDataValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param modelData
   * @param isPartial
   */
  validate(modelName, modelData, isPartial = false) {
    if (!isPureObject(modelData))
      throw new InvalidArgumentError(
        'The data of the model %v must be an Object, but %v given.',
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
      this.validatePropertyValue(
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
   * @param modelName
   * @param propName
   * @param propDef
   * @param propValue
   */
  validatePropertyValue(modelName, propName, propDef, propValue) {
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
    this._validatePropertyValueType(modelName, propName, propDef, propValue);
  }

  /**
   * Validate value type.
   *
   * @param modelName
   * @param propName
   * @param propDef
   * @param propValue
   * @param isArrayValue
   */
  _validatePropertyValueType(
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
          this._validatePropertyValueType(
            modelName,
            propName,
            propDef,
            value,
            true,
          ),
        );
        break;
      // OBJECT
      case DataType.OBJECT:
        if (!isPureObject(propValue)) throw createError('an Object');
        if (typeof propDef === 'object' && propDef.model)
          this.validate(propDef.model, propValue);
        break;
    }
  }
}
