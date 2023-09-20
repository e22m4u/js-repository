import {Filter} from '../filter';
import {AnyObject} from '../types';
import {ModelData} from '../types';
import {Identifier} from '../types';
import {ItemFilter} from '../filter';
import {WhereClause} from '../filter';
import {Service} from '@e22m4u/service';
import {ServiceContainer} from '@e22m4u/service';

/**
 * Adapter.
 */
export declare class Adapter extends Service {
  /**
   * Settings.
   */
  get settings(): AnyObject | undefined;

  /**
   * Constructor.
   *
   * @param container
   * @param settings
   */
  constructor(
    container?: ServiceContainer,
    settings?: AnyObject,
  );

  /**
   * Create.
   *
   * @param modelName
   * @param modelData
   * @param filter
   */
  create(
    modelName: string,
    modelData: ModelData,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Replace by id.
   *
   * @param modelName
   * @param id
   * @param modelData
   * @param filter
   */
  replaceById(
    modelName: string,
    id: Identifier,
    modelData: ModelData,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Patch by id.
   *
   * @param modelName
   * @param id
   * @param modelData
   * @param filter
   */
  patchById(
    modelName: string,
    id: Identifier,
    modelData: ModelData,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Find.
   *
   * @param modelName
   * @param filter
   */
  find(
    modelName: string,
    filter?: Filter,
  ): Promise<ModelData[]>;

  /**
   * Find by id.
   *
   * @param modelName
   * @param id
   * @param filter
   */
  findById(
    modelName: string,
    id: Identifier,
    filter?: Filter,
  ): Promise<ModelData>;

  /**
   * Delete.
   *
   * @param modelName
   * @param where
   */
  delete(
    modelName: string,
    where?: WhereClause,
  ): Promise<number>;

  /**
   * Delete by id.
   *
   * @param modelName
   * @param id
   */
  deleteById(
    modelName: string,
    id: Identifier,
  ): Promise<boolean>;

  /**
   * Exists.
   *
   * @param modelName
   * @param id
   */
  exists(
    modelName: string,
    id: Identifier,
  ): Promise<boolean>;

  /**
   * Count.
   *
   * @param modelName
   * @param where
   */
  count(
    modelName: string,
    where?: WhereClause,
  ): Promise<number>;
}
