import {ModelData} from '../../types.js';
import {Service} from '@e22m4u/js-service';

/**
 * Model data transformer.
 */
export declare class ModelDataTransformer extends Service {
  /**
   * Transform.
   *
   * @param modelName
   * @param modelData
   */
  transform(modelName: string, modelData: ModelData): ModelData;
}
