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
  FlatData extends object = Flatten<Data>,
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
    filter?: ItemFilterClause<FlatData>,
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
    filter?: ItemFilterClause<FlatData>,
  ): Promise<FlatData>;

  /**
   * Replace or create.
   *
   * @param data
   * @param filter
   */
  replaceOrCreate(
    data: OptionalUnlessRequiredId<IdName, FlatData>,
    filter?: ItemFilterClause<FlatData>,
  ): Promise<FlatData>;

  /**
   * Patch.
   *
   * @param data
   * @param where
   */
  patch(
    data: PartialWithoutId<FlatData, IdName>,
    where?: WhereClause<FlatData>,
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
    data: PartialWithoutId<FlatData, IdName>,
    filter?: ItemFilterClause<FlatData>,
  ): Promise<FlatData>;

  /**
   * Find.
   *
   * @param filter
   */
  find(filter?: FilterClause<FlatData>): Promise<FlatData[]>;

  /**
   * Find one.
   *
   * @param filter
   */
  findOne(filter?: FilterClause<FlatData>): Promise<FlatData | undefined>;

  /**
   * Find by id.
   *
   * @param id
   * @param filter
   */
  findById(id: IdType, filter?: ItemFilterClause<FlatData>): Promise<FlatData>;

  /**
   * Delete.
   *
   * @param where
   */
  delete(where?: WhereClause<FlatData>): Promise<number>;

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
  count(where?: WhereClause<FlatData>): Promise<number>;
}

/**
 * Removes id field.
 */
export declare type WithoutId<
  Data extends object,
  IdName extends string = 'id',
> = Flatten<Omit<Data, IdName>>;

/**
 * Makes fields as optional and remove id field.
 */
export declare type PartialWithoutId<
  Data extends object,
  IdName extends string = 'id',
> = Flatten<Partial<Omit<Data, IdName>>>;

/**
 * Makes the required id field as optional.
 */
export declare type OptionalUnlessRequiredId<
  IdName extends string,
  Data extends object,
> = Flatten<Data extends {[K in IdName]: any} ? PartialBy<Data, IdName> : Data>;
