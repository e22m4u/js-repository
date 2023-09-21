import {Filter} from '../filter';
import {Adapter} from '../adapter';
import {ModelData} from '../types';
import {Identifier} from '../types';
import {ItemFilter} from '../filter';
import {WhereClause} from '../filter';
import {ServiceContainer} from '@e22m4u/service';

/**
 * Repository.
 */
export declare class Repository {
  /**
   * Model name.
   */
  get modelName(): string;

  /**
   * Datasource name.
   */
  get datasourceName(): string;

  /**
   * Constructor.
   *
   * @param container
   * @param modelName
   */
  constructor(container: ServiceContainer, modelName: string);

  /**
   * Get adapter.
   */
  getAdapter(): Promise<Adapter>;

  /**
   * Create.
   *
   * @param data
   * @param filter
   */
  create(data: ModelData, filter?: ItemFilter): Promise<ModelData>;

  /**
   * Replace by id.
   *
   * @param id
   * @param data
   * @param filter
   */
  replaceById(
    id: Identifier,
    data: ModelData,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Replace or create.
   *
   * @param data
   * @param filter
   */
  replaceOrCreate(data: ModelData, filter?: ItemFilter): Promise<ModelData>;

  /**
   * Patch by id.
   *
   * @param id
   * @param data
   * @param filter
   */
  patchById(
    id: Identifier,
    data: ModelData,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Find.
   *
   * @param filter
   */
  find(filter?: Filter): Promise<ModelData[]>;

  /**
   * Find one.
   *
   * @param filter
   */
  findOne(filter?: ItemFilter): Promise<ModelData | undefined>;

  /**
   * Find by id.
   *
   * @param id
   * @param filter
   */
  findById(id: Identifier, filter?: ItemFilter): Promise<ModelData>;

  /**
   * Delete.
   *
   * @param where
   */
  delete(where?: WhereClause): Promise<number>;

  /**
   * Delete by id.
   *
   * @param id
   */
  deleteById(id: Identifier): Promise<boolean>;

  /**
   * Exists.
   *
   * @param id
   */
  exists(id: Identifier): Promise<boolean>;

  /**
   * Count.
   *
   * @param where
   */
  count(where?: WhereClause): Promise<number>;
}
