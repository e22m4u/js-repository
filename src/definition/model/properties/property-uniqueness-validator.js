import {Service} from '@e22m4u/js-service';
import {isPlainObject} from '../../../utils/index.js';
import {PropertyUniqueness} from './property-uniqueness.js';
import {InvalidArgumentError} from '../../../errors/index.js';
import {ModelDefinitionUtils} from '../model-definition-utils.js';

/**
 * Property uniqueness validator.
 */
export class PropertyUniquenessValidator extends Service {
  /**
   * Validate.
   *
   * @param {Function} countMethod
   * @param {string} methodName
   * @param {string} modelName
   * @param {object} modelData
   * @param {*} modelId
   * @returns {Promise<undefined>}
   */
  async validate(
    countMethod,
    methodName,
    modelName,
    modelData,
    modelId = undefined,
  ) {
    if (typeof countMethod !== 'function') {
      throw new InvalidArgumentError(
        'Parameter "countMethod" must be a Function, but %v was given.',
        countMethod,
      );
    }
    if (!methodName || typeof methodName !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "methodName" must be a non-empty String, but %v was given.',
        methodName,
      );
    }
    if (!modelName || typeof modelName !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "modelName" must be a non-empty String, but %v was given.',
        modelName,
      );
    }
    if (!isPlainObject(modelData)) {
      throw new InvalidArgumentError(
        'Data of the model %v must be an Object, but %v was given.',
        modelName,
        modelData,
      );
    }
    const propDefs =
      this.getService(
        ModelDefinitionUtils,
      ).getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const isPartial = methodName === 'patch' || methodName === 'patchById';
    const propNames = Object.keys(isPartial ? modelData : propDefs);
    const idProp =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    const createError = (propName, propValue) =>
      new InvalidArgumentError(
        'Existing document of the model %v already has ' +
          'the property %v with the value %v and must be unique.',
        modelName,
        propName,
        propValue,
      );
    let willBeReplaced = undefined;
    for (const propName of propNames) {
      const propDef = propDefs[propName];
      if (
        !propDef ||
        typeof propDef === 'string' ||
        !propDef.unique ||
        propDef.unique === PropertyUniqueness.NON_UNIQUE
      ) {
        continue;
      }
      // в режиме "sparse" проверка на уникальность
      // должна игнорировать ложные значения
      const propValue = modelData[propName];
      if (propDef.unique === PropertyUniqueness.SPARSE && !propValue) {
        continue;
      }
      // create
      if (methodName === 'create') {
        const count = await countMethod({[propName]: propValue});
        if (count > 0) {
          throw createError(propName, propValue);
        }
      }
      // replaceById
      else if (methodName === 'replaceById') {
        const count = await countMethod({
          [idProp]: {neq: modelId},
          [propName]: propValue,
        });
        if (count > 0) {
          throw createError(propName, propValue);
        }
      }
      // replaceOrCreate
      else if (methodName === 'replaceOrCreate') {
        const idFromData = modelData[idProp];
        if (willBeReplaced == null && idFromData != null) {
          const count = await countMethod({[idProp]: idFromData});
          willBeReplaced = count > 0;
        }
        // replaceById by replaceOrCreate
        if (willBeReplaced) {
          const count = await countMethod({
            [idProp]: {neq: idFromData},
            [propName]: propValue,
          });
          if (count > 0) {
            throw createError(propName, propValue);
          }
        }
        // create by replaceOrCreate
        else {
          const count = await countMethod({[propName]: propValue});
          if (count > 0) {
            throw createError(propName, propValue);
          }
        }
      }
      // patch
      else if (methodName === 'patch') {
        const count = await countMethod({[propName]: propValue});
        if (count > 0) {
          throw createError(propName, propValue);
        }
      }
      // patchById
      else if (methodName === 'patchById') {
        const count = await countMethod({
          [idProp]: {neq: modelId},
          [propName]: propValue,
        });
        if (count > 0) {
          throw createError(propName, propValue);
        }
      }
      // unsupported method
      else {
        throw new InvalidArgumentError(
          'Adapter method %v is not supported.',
          methodName,
        );
      }
    }
  }
}
