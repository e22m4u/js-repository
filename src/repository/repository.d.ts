import {Filter} from '../filter';
import {ModelId} from '../types';
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
    data: OptionalUnlessRequiredId<IdName, Data>,
    filter?: ItemFilter,
  ): Promise<ModelData>;

  /**
   * Replace by id.
   *
   * @param id
   * @param data
   * @param filter
   */
  replaceById(
    id: IdType,
    data: Omit<Data, IdName>,
    filter?: ItemFilter,
  ): Promise<Data>;

  /**
   * Replace or create.
   *
   * @param data
   * @param filter
   */
  replaceOrCreate(
    data: OptionalUnlessRequiredId<IdName, Data>,
    filter?: ItemFilter,
  ): Promise<Data>;

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
  ): Promise<Data>;

  /**
   * Find.
   *
   * @param filter
   */
  find(filter?: Filter): Promise<Data[]>;

  /**
   * Find one.
   *
   * @param filter
   */
  findOne(filter?: ItemFilter): Promise<Data | undefined>;

  /**
   * Find by id.
   *
   * @param id
   * @param filter
   */
  findById(id: IdType, filter?: ItemFilter): Promise<Data>;

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
 * Makes fields as optional and remove id field.
 */
type PartialWithoutId<IdName extends string, Data> = Partial<
  Omit<Data, IdName>
>;

/**
 * Makes the given id field as optional.
 */
type OptionalUnlessRequiredId<IdName extends string, Data> = Data extends {
  [K in IdName]: any;
}
  ? PartialBy<Data, IdName>
  : Data;
