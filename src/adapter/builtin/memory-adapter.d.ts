import {Adapter} from '../adapter.js';
import {ModelId} from '../../types.js';
import {AnyObject} from '../../types.js';
import {ModelData} from '../../types.js';
import {WhereClause} from '../../filter/index.js';
import {FilterClause} from '../../filter/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {ItemFilterClause} from '../../filter/index.js';

/**
 * Memory adapter.
 */
export declare class MemoryAdapter extends Adapter {
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
  constructor(container?: ServiceContainer, settings?: AnyObject);

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
    filter?: ItemFilterClause,
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
    id: ModelId,
    modelData: ModelData,
    filter?: ItemFilterClause,
  ): Promise<ModelData>;

  /**
   * Patch.
   *
   * @param modelName
   * @param modelData
   * @param where
   */
  patch(
    modelName: string,
    modelData: ModelData,
    where?: WhereClause,
  ): Promise<number>;

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
    id: ModelId,
    modelData: ModelData,
    filter?: ItemFilterClause,
  ): Promise<ModelData>;

  /**
   * Find.
   *
   * @param modelName
   * @param filter
   */
  find(modelName: string, filter?: FilterClause): Promise<ModelData[]>;

  /**
   * Find by id.
   *
   * @param modelName
   * @param id
   * @param filter
   */
  findById(
    modelName: string,
    id: ModelId,
    filter?: ItemFilterClause,
  ): Promise<ModelData>;

  /**
   * Delete.
   *
   * @param modelName
   * @param where
   */
  delete(modelName: string, where?: WhereClause): Promise<number>;

  /**
   * Delete by id.
   *
   * @param modelName
   * @param id
   */
  deleteById(modelName: string, id: ModelId): Promise<boolean>;

  /**
   * Exists.
   *
   * @param modelName
   * @param id
   */
  exists(modelName: string, id: ModelId): Promise<boolean>;

  /**
   * Count.
   *
   * @param modelName
   * @param where
   */
  count(modelName: string, where?: WhereClause): Promise<number>;
}
