import {Service} from '../service/index.js';
import {AdapterRegistry} from '../adapter/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {DefinitionRegistry} from '../definition/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';

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
   * @return {Promise<Adapter>}
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
    const adapter = await this.getAdapter();
    return adapter.create(this.modelName, data, filter);
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
    const adapter = await this.getAdapter();
    return adapter.replaceById(this.modelName, id, data, filter);
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
    if (pkValue == null) return this.create(data, filter);
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
    const adapter = await this.getAdapter();
    return adapter.patchById(this.modelName, id, data, filter);
  }

  /**
   * Find.
   *
   * @param {object|undefined} filter
   * @return {Promise<object[]>}
   */
  async find(filter = undefined) {
    const adapter = await this.getAdapter();
    return adapter.find(this.modelName, filter);
  }

  /**
   * Find one.
   *
   * @param {object|undefined} filter
   * @return {Promise<object|undefined>}
   */
  async findOne(filter = undefined) {
    const adapter = await this.getAdapter();
    filter = filter ?? {};
    filter.limit = 1;
    const result = await adapter.find(this.modelName, filter);
    return result.length ? result[0] : undefined;
  }

  /**
   * Find by id.
   *
   * @param {number|string} id
   * @param {object|undefined} filter
   * @return {Promise<object>}
   */
  async findById(id, filter = undefined) {
    const adapter = await this.getAdapter();
    return adapter.findById(this.modelName, id, filter);
  }

  /**
   * Delete.
   *
   * @param {object|undefined} where
   * @return {Promise<number>}
   */
  async delete(where = undefined) {
    const adapter = await this.getAdapter();
    return adapter.delete(this.modelName, where);
  }

  /**
   * Delete by id.
   *
   * @param {number|string} id
   * @return {Promise<boolean>}
   */
  async deleteById(id) {
    const adapter = await this.getAdapter();
    return adapter.deleteById(this.modelName, id);
  }

  /**
   * Exists.
   *
   * @param {number|string} id
   * @return {Promise<boolean>}
   */
  async exists(id) {
    const adapter = await this.getAdapter();
    return adapter.exists(this.modelName, id);
  }

  /**
   * Count.
   *
   * @param {object|undefined} where
   * @return {Promise<number>}
   */
  async count(where = undefined) {
    const adapter = await this.getAdapter();
    return adapter.count(this.modelName, where);
  }
}
