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
        'The data of the model %v should be an Object, but %v was given.',
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
   * @returns {*|Promise<*>}
   */
  _transformPropertyValue(modelName, propName, propDef, propValue) {
    if (typeof propDef === 'string' || propDef.transform == null)
      return propValue;
    const transformDef = propDef.transform;
    const transformerRegistry = this.getService(PropertyTransformerRegistry);
    const transformFn = (
      value,
      transformerOrName,
      transformerOptions = undefined,
    ) => {
      let transformerName, transformerFn;
      // если второй аргумент является строкой, то строка
      // воспринимается как название зарегистрированного
      // трансформера
      if (typeof transformerOrName === 'string') {
        transformerName = transformerOrName;
        transformerFn = transformerRegistry.getTransformer(transformerName);
      }
      // если второй аргумент является функцией,
      // то функция воспринимается как трансформер
      else if (typeof transformerOrName === 'function') {
        transformerName =
          transformerOrName.name && transformerOrName.name !== 'transform'
            ? transformerOrName.name
            : undefined;
        transformerFn = transformerOrName;
      }
      // если второй аргумент не является строкой
      // и функцией, то выбрасывается ошибка
      else {
        throw new InvalidArgumentError(
          'Transformer must be a non-empty String or ' +
            'a Function, but %v was given.',
          transformerOrName,
        );
      }
      const context = {transformerName, modelName, propName};
      return transformerFn(value, transformerOptions, context);
    };
    // если значением опции "transform" является строка,
    // то строка воспринимается как название трансформера
    if (transformDef && typeof transformDef === 'string') {
      return transformFn(propValue, transformDef);
    }
    // если значением опции "transform" является функция,
    // то функция воспринимается как трансформер
    else if (transformDef && typeof transformDef === 'function') {
      return transformFn(propValue, transformDef);
    }
    // если значение опции "transform" является массив, то каждый
    // элемент массива воспринимается как название трансформера
    // или функция-валидатор
    else if (Array.isArray(transformDef)) {
      return transformDef.reduce((valueOrPromise, transformerOrName) => {
        if (
          !transformerOrName ||
          (typeof transformerOrName !== 'string' &&
            typeof transformerOrName !== 'function')
        ) {
          throw new InvalidArgumentError(
            'The provided option "transform" for the property %v ' +
              'in the model %v has an Array value that should contain ' +
              'transformer names or transformer functions, but %v was given.',
            propName,
            modelName,
            transformerOrName,
          );
        }
        return transformPromise(valueOrPromise, value => {
          return transformFn(value, transformerOrName);
        });
      }, propValue);
    }
    // если значение опции "transform" является объектом,
    // то ключи объекта воспринимаются как названия трансформеров,
    // а их значения аргументами
    else if (transformDef !== null && typeof transformDef === 'object') {
      return Object.keys(transformDef).reduce(
        (valueOrPromise, transformerName) => {
          const transformerOptions = transformDef[transformerName];
          return transformPromise(valueOrPromise, value => {
            return transformFn(value, transformerName, transformerOptions);
          });
        },
        propValue,
      );
    }
    // если значение опции "transform" не является строкой,
    // функцией и массивом, то выбрасывается ошибка
    else {
      throw new InvalidArgumentError(
        'The provided option "transform" for the property %v in the model %v ' +
          'should be either a transformer name, a transformer function, an array ' +
          'of transformer names or functions, or an object mapping transformer ' +
          'names to their arguments, but %v was given.',
        propName,
        modelName,
        transformDef,
      );
    }
  }
}
