import {ModelId} from '../types.js';
import {Flatten} from '../types.js';
import {ModelData} from '../types.js';
import {PartialBy} from '../types.js';
import {Service} from '@e22m4u/js-service';
import {Adapter} from '../adapter/index.js';
import {WhereClause} from '../filter/index.js';
import {FilterClause} from '../filter/index.js';
import {ItemFilterClause} from '../filter/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME} from '../definition/index.js';

/**
 * Repository.
 */
export declare class Repository<
  Data extends object = ModelData,
  IdType extends ModelId = ModelId,
  IdName extends string = typeof DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
  FlatData extends ModelData = Flatten<Data>,
> extends Service {
  // it fixes unused generic bug
  private _Data?: Data;
  private _IdType?: IdType;
  private _IdName?: IdName;
  private _FlatData?: FlatData;

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
    filter?: ItemFilterClause,
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
    data: WithoutId<FlatData, IdName>,
    filter?: ItemFilterClause,
  ): Promise<FlatData>;

  /**
   * Replace or create.
   *
   * @param data
   * @param filter
   */
  replaceOrCreate(
    data: OptionalUnlessRequiredId<IdName, Data>,
    filter?: ItemFilterClause,
  ): Promise<FlatData>;

  /**
   * Patch.
   *
   * @param data
   * @param where
   */
  patch(
    data: PartialWithoutId<Data, IdName>,
    where?: WhereClause,
  ): Promise<number>;

  /**
   * Patch by id.
   *
   * @param id
   * @param data
   * @param filter
   */
  patchById(
    id: IdType,
    data: PartialWithoutId<Data, IdName>,
    filter?: ItemFilterClause,
  ): Promise<FlatData>;

  /**
   * Find.
   *
   * @param filter
   */
  find(filter?: FilterClause): Promise<FlatData[]>;

  /**
   * Find one.
   *
   * @param filter
   */
  findOne(filter?: FilterClause): Promise<FlatData | undefined>;

  /**
   * Find by id.
   *
   * @param id
   * @param filter
   */
  findById(id: IdType, filter?: ItemFilterClause): Promise<FlatData>;

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
type WithoutId<Data extends object, IdName extends string = 'id'> = Flatten<
  Omit<Data, IdName>
>;

/**
 * Makes fields as optional and remove id field.
 */
type PartialWithoutId<
  Data extends object,
  IdName extends string = 'id',
> = Flatten<Partial<Omit<Data, IdName>>>;

/**
 * Makes the required id field as optional.
 */
type OptionalUnlessRequiredId<
  IdName extends string,
  Data extends object,
> = Flatten<Data extends {[K in IdName]: any} ? PartialBy<Data, IdName> : Data>;
