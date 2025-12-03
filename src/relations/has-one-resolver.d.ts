import {ModelData} from '../types.js';
import {Service} from '@e22m4u/js-service';
import {FilterClause} from '../filter/index.js';

/**
 * Has one resolver.
 */
export declare class HasOneResolver extends Service {
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
    foreignKey: string,
    scope?: FilterClause,
  ): Promise<void>;

  /**
   * Include polymorphic to.
   *
   * @param entities
   * @param sourceName
   * @param targetName
   * @param relationName
   * @param foreignKey
   * @param discriminator
   * @param scope
   */
  includePolymorphicTo(
    entities: ModelData[],
    sourceName: string,
    targetName: string,
    relationName: string,
    foreignKey: string,
    discriminator: string,
    scope?: FilterClause,
  ): Promise<void>;

  /**
   * Include polymorphic by relation name.
   *
   * @param entities
   * @param sourceName
   * @param targetName
   * @param relationName
   * @param targetRelationName
   * @param scope
   */
  includePolymorphicByRelationName(
    entities: ModelData[],
    sourceName: string,
    targetName: string,
    relationName: string,
    targetRelationName: string,
    scope?: FilterClause,
  ): Promise<void>;
}
