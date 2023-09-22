import {ModelData} from '../../types.js';
import {Service} from '@e22m4u/js-service';
import {PropertyDefinition} from './properties/index.js';

/**
 * Model data validator.
 */
export declare class ModelDataValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param modelData
   * @param isPartial
   */
  validate(modelName: string, modelData: ModelData, isPartial?: boolean): void;

  /**
   * Validate property value.
   *
   * @param modelName
   * @param propName
   * @param propDef
   * @param propValue
   */
  validatePropertyValue(
    modelName: string,
    propName: string,
    propDef: PropertyDefinition,
    propValue: unknown,
  ): void;
}
