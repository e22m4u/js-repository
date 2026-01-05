import {DataType} from './data-type.js';
import {Service} from '@e22m4u/js-service';
import {BlankValuesService} from '@e22m4u/js-empty-values';
import {InvalidArgumentError} from '../../../errors/index.js';
import {ModelDefinitionUtils} from '../model-definition-utils.js';

/**
 * Required property validator.
 */
export class RequiredPropertyValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {boolean} [isPartial]
   */
  validate(modelName, modelData, isPartial = false) {
    if (!modelName || typeof modelName !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "modelName" must be a non-empty String, but %v was given.',
        modelName,
      );
    }
    if (
      !modelData ||
      typeof modelData !== 'object' ||
      Array.isArray(modelData)
    ) {
      throw new InvalidArgumentError(
        'Data of the model %v should be an Object, but %v was given.',
        modelName,
        modelData,
      );
    }
    if (typeof isPartial !== 'boolean') {
      throw new InvalidArgumentError(
        'Parameter "isPartial" must be a Boolean, but %v was given.',
        isPartial,
      );
    }
    const propDefs =
      this.getService(
        ModelDefinitionUtils,
      ).getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propNames = Object.keys(isPartial ? modelData : propDefs);
    const blankValuesService = this.getService(BlankValuesService);
    for (const propName of propNames) {
      const propDef = propDefs[propName];
      if (!propDef || typeof propDef !== 'object') {
        continue;
      }
      // проверка основного значения
      const propValue = modelData[propName];
      if (propDef.required) {
        const propType = propDef.type || DataType.ANY;
        if (blankValuesService.isBlankOf(propType, propValue)) {
          throw new InvalidArgumentError(
            'Property %v of the model %v is required, but %v was given.',
            propName,
            modelName,
            propValue,
          );
        }
      }
      // проверка вложенного объекта
      if (
        propDef.type === DataType.OBJECT &&
        propDef.model &&
        propValue !== null &&
        typeof propValue === 'object' &&
        !Array.isArray(propValue)
      ) {
        this.validate(propDef.model, propValue);
      }
      // проверка массива объектов
      else if (
        propDef.type === DataType.ARRAY &&
        propDef.itemType === DataType.OBJECT &&
        propDef.itemModel &&
        Array.isArray(propValue)
      ) {
        propValue.forEach(itemData => {
          if (
            itemData !== null &&
            typeof itemData === 'object' &&
            !Array.isArray(itemData)
          ) {
            this.validate(propDef.itemModel, itemData);
          }
        });
      }
    }
  }
}
