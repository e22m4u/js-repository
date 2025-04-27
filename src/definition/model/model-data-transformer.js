import {Service} from '@e22m4u/js-service';
import {cloneDeep} from '../../utils/index.js';
import {isPureObject} from '../../utils/index.js';
import {transformPromise} from '../../utils/index.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
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
   * @returns {object|Promise<object>}
   */
  transform(modelName, modelData, isPartial = false) {
    if (!isPureObject(modelData))
      throw new InvalidArgumentError(
        'The data of the model %v should be an Object, but %v given.',
        modelName,
        modelData,
      );
    const emptyValuesService = this.getService(EmptyValuesService);
    const modelDefinitionUtils = this.getService(ModelDefinitionUtils);
    const propDefs =
      modelDefinitionUtils.getPropertiesDefinitionInBaseModelHierarchy(
        modelName,
      );
    const propNames = Object.keys(isPartial ? modelData : propDefs);
    const transformedData = cloneDeep(modelData);
    return propNames.reduce((transformedDataOrPromise, propName) => {
      const propDef = propDefs[propName];
      if (!propDef) return transformedDataOrPromise;
      const propType =
        modelDefinitionUtils.getDataTypeFromPropertyDefinition(propDef);
      const propValue = modelData[propName];
      const isEmpty = emptyValuesService.isEmptyByType(propType, propValue);
      if (isEmpty) return transformedDataOrPromise;
      const newPropValueOrPromise = this._transformPropertyValue(
        modelName,
        propName,
        propDef,
        propValue,
      );
      return transformPromise(newPropValueOrPromise, newPropValue => {
        return transformPromise(transformedDataOrPromise, resolvedData => {
          if (newPropValue !== propValue) resolvedData[propName] = newPropValue;
          return resolvedData;
        });
      });
    }, transformedData);
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
      return transformDef.reduce((valueOrPromise, transformerName) => {
        return transformPromise(valueOrPromise, value => {
          return transformFn(value, transformerName);
        });
      }, propValue);
    } else if (transformDef !== null && typeof transformDef === 'object') {
      return Object.keys(transformDef).reduce(
        (valueOrPromise, transformerName) => {
          const transformerOptions = transformDef[transformerName];
          return transformPromise(valueOrPromise, value => {
            return transformFn(value, transformerName, transformerOptions);
          });
        },
        propValue,
      );
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
