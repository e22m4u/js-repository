import {Service} from '../service/index.js';
import {AdapterRegistry} from '../adapter/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {RepositoryEvent} from './repository-observer.js';
import {DefinitionRegistry} from '../definition/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';
import {RepositoryObserver} from './repository-observer.js';

/**
 * Repository method.
 *
 * @type {{
 *   DELETE: string,
 *   DELETE_BY_ID: string,
 *   CREATE: string,
 *   EXISTS: string,
 *   PATCH_BY_ID: string,
 *   FIND: string,
 *   FIND_BY_ID: string,
 *   COUNT: string,
 *   REPLACE_BY_ID: string,
 *   REPLACE_OR_CREATE: string,
 * }}
 */
export const RepositoryMethod = {
  CREATE: 'create',
  REPLACE_BY_ID: 'replaceById',
  REPLACE_OR_CREATE: 'replaceOrCreate',
  PATCH_BY_ID: 'patchById',
  FIND: 'find',
  FIND_ONE: 'findOne',
  FIND_BY_ID: 'findById',
  DELETE: 'delete',
  DELETE_BY_ID: 'deleteById',
  EXISTS: 'exists',
  COUNT: 'count',
};

/**
 * Repository.
 */
export class Repository extends Service {
  /**
   * Model name.
   */
  _modelName;

  /**
   * Model name.
   *
   * @return {string}
   */
  get modelName() {
    return this._modelName;
  }

  /**
   * Datasource name.
   */
  _datasourceName;

  /**
   * Datasource name.
   *
   * @return {string}
   */
  get datasourceName() {
    return this._datasourceName;
  }

  /**
   * Constructor.
   *
   * @param services
   * @param modelName
   */
  constructor(services, modelName) {
    super(services);
    this._modelName = modelName;
    const modelDef = this.get(DefinitionRegistry).getModel(modelName);
    const datasourceName = modelDef.datasource;
    if (!datasourceName)
      throw new InvalidArgumentError(
        'The model %s does not have a specified datasource.',
        modelName,
      );
    this._datasourceName = datasourceName;
  }

  /**
   * Get adapter.
   *
   * @return {Promise<Object>}
   */
  async getAdapter() {
    return this.get(AdapterRegistry).getAdapter(this.datasourceName);
  }

  /**
   * Create.
   *
   * @param {object} data
   * @param {object|undefined} filter
   * @return {Promise<object>}
   */
  async create(data, filter = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_CREATE,
      RepositoryMethod.CREATE,
      {data, filter},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.create(this.modelName, data, filter);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_CREATE,
      RepositoryMethod.CREATE,
      {data, filter, result},
    );
    return result;
  }

  /**
   * Replace by id.
   *
   * @param {number|string} id
   * @param {object} data
   * @param {object|undefined} filter
   * @return {Promise<object>}
   */
  async replaceById(id, data, filter = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_UPDATE,
      RepositoryMethod.REPLACE_BY_ID,
      {id, data, filter},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.replaceById(this.modelName, id, data, filter);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_UPDATE,
      RepositoryMethod.REPLACE_BY_ID,
      {id, data, filter, result},
    );
    return result;
  }

  /**
   * Replace or create.
   *
   * @param {object} data
   * @param {object|undefined} filter
   * @return {Promise<object>}
   */
  async replaceOrCreate(data, filter = undefined) {
    const pkPropName = this.get(
      ModelDefinitionUtils,
    ).getPrimaryKeyAsPropertyName(this.modelName);
    const pkValue = data[pkPropName];
    if (pkPropName == null) return this.create(data, filter);
    return this.replaceById(pkValue, data, filter);
  }

  /**
   * Patch by id.
   *
   * @param {number|string} id
   * @param {object} data
   * @param {object|undefined} filter
   * @return {Promise<object>}
   */
  async patchById(id, data, filter = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_UPDATE,
      RepositoryMethod.PATCH_BY_ID,
      {id, data, filter},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.patchById(this.modelName, id, data, filter);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_UPDATE,
      RepositoryMethod.PATCH_BY_ID,
      {id, data, filter, result},
    );
    return result;
  }

  /**
   * Find.
   *
   * @param {object|undefined} filter
   * @return {Promise<object[]>}
   */
  async find(filter = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_READ,
      RepositoryMethod.FIND,
      {filter},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.find(this.modelName, filter);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_READ,
      RepositoryMethod.FIND,
      {filter, result},
    );
    return result;
  }

  /**
   * Find one.
   *
   * @param {object|undefined} filter
   * @return {Promise<object|undefined>}
   */
  async findOne(filter = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_READ,
      RepositoryMethod.FIND_ONE,
      {filter},
    );
    const adapter = await this.getAdapter();
    filter = filter ?? {};
    filter.limit = 1;
    const resultArray = adapter.find(this.modelName, filter);
    const result = resultArray.length ? resultArray[0] : undefined;
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_READ,
      RepositoryMethod.FIND_ONE,
      {filter, result},
    );
    return result;
  }

  /**
   * Find by id.
   *
   * @param {number|string} id
   * @param {object|undefined} filter
   * @return {Promise<object>}
   */
  async findById(id, filter = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_READ,
      RepositoryMethod.FIND_BY_ID,
      {id, filter},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.findById(this.modelName, id, filter);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_READ,
      RepositoryMethod.FIND_BY_ID,
      {id, filter, result},
    );
    return result;
  }

  /**
   * Delete.
   *
   * @param {object|undefined} where
   * @return {Promise<number>}
   */
  async delete(where = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_DELETE,
      RepositoryMethod.DELETE,
      {where},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.delete(this.modelName, where);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_DELETE,
      RepositoryMethod.DELETE,
      {where, result},
    );
    return result;
  }

  /**
   * Delete by id.
   *
   * @param {number|string} id
   * @return {Promise<boolean>}
   */
  async deleteById(id) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_DELETE,
      RepositoryMethod.DELETE_BY_ID,
      {id},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.deleteById(this.modelName, id);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_DELETE,
      RepositoryMethod.DELETE_BY_ID,
      {id, result},
    );
    return result;
  }

  /**
   * Exists.
   *
   * @param {number|string} id
   * @return {Promise<boolean>}
   */
  async exists(id) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_READ,
      RepositoryMethod.EXISTS,
      {id},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.exists(this.modelName, id);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_READ,
      RepositoryMethod.EXISTS,
      {id, result},
    );
    return result;
  }

  /**
   * Count.
   *
   * @param {object|undefined} where
   * @return {Promise<number>}
   */
  async count(where = undefined) {
    const observer = this.get(RepositoryObserver);
    await observer.emit(
      this.modelName,
      RepositoryEvent.BEFORE_READ,
      RepositoryMethod.COUNT,
      {where},
    );
    const adapter = await this.getAdapter();
    const result = await adapter.count(this.modelName, where);
    await observer.emit(
      this.modelName,
      RepositoryEvent.AFTER_READ,
      RepositoryMethod.COUNT,
      {where, result},
    );
    return result;
  }
}
