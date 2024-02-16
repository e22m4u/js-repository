import {Service} from '@e22m4u/js-service';
import {cloneDeep} from '../../utils/index.js';
import {isPureObject} from '../../utils/index.js';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDefinitionUtils} from './model-definition-utils.js';
import {PropertyTransformerRegistry} from './properties/index.js';

/**
 * Model data transformer.
 */
export class ModelDataTransformer extends Service {
  /**
   * Transform.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {boolean} isPartial
   * @returns {object}
   */
  transform(modelName, modelData, isPartial = false) {
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
    const transformedData = cloneDeep(modelData);
    const propNames = Object.keys(isPartial ? modelData : propDefs);
    propNames.forEach(propName => {
      const propDef = propDefs[propName];
      if (!propDef) return;
      const oldValue = modelData[propName];
      const newValue = this._transformPropertyValue(
        modelName,
        propName,
        propDef,
        oldValue,
      );
      if (oldValue !== newValue) {
        transformedData[propName] = newValue;
      }
    });
    return transformedData;
  }

  /**
   * Transform property value.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {string|object} propDef
   * @param {*} propValue
   * @returns {*}
   */
  _transformPropertyValue(modelName, propName, propDef, propValue) {
    if (typeof propDef === 'string' || propDef.transform == null)
      return propValue;
    const transformDef = propDef.transform;
    const transformerRegistry = this.getService(PropertyTransformerRegistry);
    const transformFn = (
      value,
      transformerName,
      transformerOptions = undefined,
    ) => {
      const transformer = transformerRegistry.getTransformer(transformerName);
      const context = {transformerName, modelName, propName};
      return transformer(value, transformerOptions, context);
    };
    if (transformDef && typeof transformDef === 'string') {
      return transformFn(propValue, transformDef);
    } else if (Array.isArray(transformDef)) {
      return transformDef.reduce(
        (value, transformerName) => transformFn(value, transformerName),
        propValue,
      );
    } else if (transformDef !== null && typeof transformDef === 'object') {
      return Object.keys(transformDef).reduce((value, transformerName) => {
        const transformerOptions = transformDef[transformerName];
        return transformFn(value, transformerName, transformerOptions);
      }, propValue);
    } else {
      throw new InvalidArgumentError(
        'The provided option "transform" of the property %v in the model %v ' +
          'should be a non-empty String, an Array of String or an Object, ' +
          'but %v given.',
        propName,
        modelName,
        transformDef,
      );
    }
  }
}
