import {ModelData} from '../../types.js';
import {Service} from '@e22m4u/js-service';
import {ValueOrPromise} from '../../types.js';

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
  transform(modelName: string, modelData: ModelData): ValueOrPromise<ModelData>;
}
