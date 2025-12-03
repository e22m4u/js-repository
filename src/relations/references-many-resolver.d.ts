import {ModelData} from '../types.js';
import {Service} from '@e22m4u/js-service';
import {FilterClause} from '../filter/index.js';

/**
 * References many resolver.
 */
export declare class ReferencesManyResolver extends Service {
  /**
   * Include to.
   *
   * @param entities
   * @param sourceName
   * @param targetName
   * @param relationName
   * @param foreignKey
   * @param scope
   */
  includeTo(
    entities: ModelData[],
    sourceName: string,
    targetName: string,
    relationName: string,
    foreignKey?: string,
    scope?: FilterClause,
  ): Promise<void>;
}
