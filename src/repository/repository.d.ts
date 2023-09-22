import {Filter} from '../filter';
import {ModelId} from '../types';
import {Flatten} from '../types';
import {Adapter} from '../adapter';
import {ModelData} from '../types';
import {PartialBy} from '../types';
import {ItemFilter} from '../filter';
import {WhereClause} from '../filter';
import {Service} from '@e22m4u/service';
import {ServiceContainer} from '@e22m4u/service';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME} from '../definition';

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
