import {ModelData} from '../../types';
import {Service} from '@e22m4u/service';

/**
 * Model data sanitizer.
 */
export declare class ModelDataSanitizer extends Service {
  /**
   * Sanitize.
   *
   * @param modelName
   * @param modelData
   */
  sanitize(modelName: string, modelData: ModelData): ModelData;
}
