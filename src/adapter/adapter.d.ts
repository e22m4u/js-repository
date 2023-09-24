import {ModelId} from '../types.js';
import {AnyObject} from '../types.js';
import {ModelData} from '../types.js';
import {Filter} from '../filter/index.js';
import {Service} from '@e22m4u/js-service';
import {ItemFilter} from '../filter/index.js';
import {WhereClause} from '../filter/index.js';
import {ServiceContainer} from '@e22m4u/js-service';

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
    id: ModelId,
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
    id: ModelId,
    modelData: ModelData,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Find.
   *
   * @param modelName
   * @param filter
   */
  find(modelName: string, filter?: Filter): Promise<ModelData[]>;

  /**
   * Find by id.
   *
   * @param modelName
   * @param id
   * @param filter
   */
  findById(modelName: string, id: ModelId, filter?: Filter): Promise<ModelData>;

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