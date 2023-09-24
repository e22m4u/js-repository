import {ModelData} from '../types.js';
import {Filter} from '../filter/index.js';
import {Service} from '@e22m4u/js-service';

/**
 * Belongs to resolver.
 */
export declare class BelongsToResolver extends Service {
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

  /**
   * Include polymorphic to.
   *
   * @param entities
   * @param sourceName
   * @param relationName
   * @param foreignKey
   * @param discriminator
   * @param scope
   */
  includePolymorphicTo(
    entities: ModelData[],
    sourceName: string,
    relationName: string,
    foreignKey?: string,
    discriminator?: string,
    scope?: Filter,
  ): Promise<void>;
}