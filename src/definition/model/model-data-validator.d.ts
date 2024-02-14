import {ModelData} from '../../types.js';
import {Service} from '@e22m4u/js-service';

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
}
