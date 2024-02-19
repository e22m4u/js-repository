import {ModelId} from '../../../types.js';
import {Service} from '@e22m4u/js-service';
import {ModelData} from '../../../types.js';
import {WhereClause} from '../../../filter/index.js';

/**
 * Count method.
 */
type CountMethod = (where: WhereClause) => Promise<number>;

/**
 * Property uniqueness validator.
 */
export declare class PropertyUniquenessValidator extends Service {
  /**
   * Validate.
   *
   * @param countMethod
   * @param methodName
   * @param modelName
   * @param modelData
   * @param modelId
   */
  validate(
    countMethod: CountMethod,
    methodName: string,
    modelName: string,
    modelData: ModelData,
    modelId?: ModelId,
  ): Promise<void>;
}
