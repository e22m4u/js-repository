import {ModelId} from '../types.js';
import {Flatten} from '../types.js';
import {ModelData} from '../types.js';
import {PartialBy} from '../types.js';
import {Filter} from '../filter/index.js';
import {Service} from '@e22m4u/js-service';
import {Adapter} from '../adapter/index.js';
import {ItemFilter} from '../filter/index.js';
import {WhereClause} from '../filter/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME} from '../definition/index.js';

/**
 * Repository.
 */
export declare class Repository<
  Data extends ModelData = ModelData,
  IdType extends ModelId = ModelId,
  IdName extends string = DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
  FlatData extends ModelData = Flatten<Data>,
> extends Service {
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
  create(
    data: OptionalUnlessRequiredId<IdName, FlatData>,
    filter?: ItemFilter,
  ): Promise<FlatData>;

  /**
   * Replace by id.
   *
   * @param id
   * @param data
   * @param filter
   */
  replaceById(
    id: IdType,
    data: WithoutId<IdName, FlatData>,
    filter?: ItemFilter,
  ): Promise<FlatData>;

  /**
   * Replace or create.
   *
   * @param data
   * @param filter
   */
  replaceOrCreate(
    data: OptionalUnlessRequiredId<IdName, Data>,
    filter?: ItemFilter,
  ): Promise<FlatData>;

  /**
   * Patch by id.
   *
   * @param id
   * @param data
   * @param filter
   */
  patchById(
    id: IdType,
    data: PartialWithoutId<IdName, Data>,
    filter?: ItemFilter,
  ): Promise<FlatData>;

  /**
   * Find.
   *
   * @param filter
   */
  find(filter?: Filter): Promise<FlatData[]>;

  /**
   * Find one.
   *
   * @param filter
   */
  findOne(filter?: ItemFilter): Promise<FlatData | undefined>;

  /**
   * Find by id.
   *
   * @param id
   * @param filter
   */
  findById(id: IdType, filter?: ItemFilter): Promise<FlatData>;

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
  deleteById(id: IdType): Promise<boolean>;

  /**
   * Exists.
   *
   * @param id
   */
  exists(id: IdType): Promise<boolean>;

  /**
   * Count.
   *
   * @param where
   */
  count(where?: WhereClause): Promise<number>;
}

/**
 * Removes id field.
 */
type WithoutId<IdName extends string, Data extends ModelData> = Flatten<
  Omit<Data, IdName>
>;

/**
 * Makes fields as optional and remove id field.
 */
type PartialWithoutId<IdName extends string, Data extends ModelData> = Flatten<
  Partial<Omit<Data, IdName>>
>;

/**
 * Makes the required id field as optional.
 */
type OptionalUnlessRequiredId<
  IdName extends string,
  Data extends ModelData,
> = Flatten<Data extends {[K in IdName]: any} ? PartialBy<Data, IdName> : Data>;
