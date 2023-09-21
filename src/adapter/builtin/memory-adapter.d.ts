import {Adapter} from '../adapter';
import {Filter} from '../../filter';
import {ModelId} from '../../types';
import {AnyObject} from '../../types';
import {ModelData} from '../../types';
import {ItemFilter} from '../../filter';
import {WhereClause} from '../../filter';
import {ServiceContainer} from '@e22m4u/service';

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
