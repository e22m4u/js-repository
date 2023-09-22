import {ModelData} from '../types.js';
import {Filter} from '../filter/index.js';
import {Service} from '@e22m4u/js-service';

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
    scope?: Filter,
  ): Promise<void>;
}
