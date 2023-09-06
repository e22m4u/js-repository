/* eslint no-unused-vars: 0 */
import {Service} from '../service/index.js';
import {NotImplementedError} from '../errors/index.js';
import {InclusionDecorator} from './decorator/index.js';
import {DefaultValuesDecorator} from './decorator/index.js';
import {DataValidationDecorator} from './decorator/index.js';
import {DataSanitizingDecorator} from './decorator/index.js';
import {FieldsFilteringDecorator} from './decorator/index.js';

/**
 * Adapter.
 */
export class Adapter extends Service {
  /**
   * Settings.
   */
  _settings;

  /**
   * Settings.
   *
   * @return {*}
   */
  get settings() {
    return this._settings;
  }

  /**
   * Constructor.
   *
   * @param services
   * @param settings
   */
  constructor(services = undefined, settings = undefined) {
    super(services);
    this._settings = settings;
    // decorate only extended classes
    if (this.constructor !== Adapter) {
      this.get(DataValidationDecorator).decorate(this);
      this.get(DataSanitizingDecorator).decorate(this);
      this.get(DefaultValuesDecorator).decorate(this);
      this.get(FieldsFilteringDecorator).decorate(this);
      this.get(InclusionDecorator).decorate(this);
    }
  }

  /**
   * Create.
   *
   * @param {string} modelName
   * @param {Record<string, unknown>} modelData
   * @param {Record<string, unknown>|undefined} filter
   * @return {Promise<object>}
   */
  create(modelName, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.create is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Replace by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @param {Record<string, unknown>} modelData
   * @param {Record<string, unknown>|undefined} filter
   * @return {Promise<object>}
   */
  replaceById(modelName, id, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.replaceById is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Patch by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @param {Record<string, unknown>} modelData
   * @param {Record<string, unknown>|undefined} filter
   * @return {Promise<object>}
   */
  patchById(modelName, id, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.patchById is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Find.
   *
   * @param {string} modelName
   * @param {Record<string, unknown>|undefined} filter
   * @return {Promise<object[]>}
   */
  find(modelName, filter = undefined) {
    throw new NotImplementedError(
      '%s.find is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Find by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @param {Record<string, unknown>|undefined} filter
   * @return {Promise<object>}
   */
  findById(modelName, id, filter = undefined) {
    throw new NotImplementedError(
      '%s.findById is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Delete.
   *
   * @param {string} modelName
   * @param {Record<string, unknown>|undefined} where
   * @return {Promise<number>}
   */
  delete(modelName, where = undefined) {
    throw new NotImplementedError(
      '%s.delete is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Delete by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @return {Promise<boolean>}
   */
  deleteById(modelName, id) {
    throw new NotImplementedError(
      '%s.deleteById is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Exists.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @return {Promise<boolean>}
   */
  exists(modelName, id) {
    throw new NotImplementedError(
      '%s.exists is not implemented.',
      new String(this.constructor.name),
    );
  }

  /**
   * Count.
   *
   * @param {string} modelName
   * @param {Record<string, unknown>|undefined} where
   * @return {Promise<number>}
   */
  count(modelName, where = undefined) {
    throw new NotImplementedError(
      '%s.count is not implemented.',
      new String(this.constructor.name),
    );
  }
}
