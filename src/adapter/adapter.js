/* eslint no-unused-vars: 0 */
/* eslint jsdoc/require-returns-check: 0 */
import {Service} from '@e22m4u/js-service';
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
   *
   * @type {object|undefined}
   */
  _settings;

  /**
   * Settings.
   *
   * @returns {object|undefined}
   */
  get settings() {
    return this._settings;
  }

  /**
   * Constructor.
   *
   * @param {object|undefined} container
   * @param {object|undefined} settings
   */
  constructor(container = undefined, settings = undefined) {
    super(container);
    this._settings = settings;
    // decorate only extended classes
    if (this.constructor !== Adapter) {
      this.getService(DataSanitizingDecorator).decorate(this);
      this.getService(DefaultValuesDecorator).decorate(this);
      this.getService(DataValidationDecorator).decorate(this);
      this.getService(FieldsFilteringDecorator).decorate(this);
      this.getService(InclusionDecorator).decorate(this);
    }
  }

  /**
   * Create.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  create(modelName, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.create is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Replace by id.
   *
   * @param {string} modelName
   * @param {number|string} id
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  replaceById(modelName, id, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.replaceById is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Replace or create.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  replaceOrCreate(modelName, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.replaceOrCreate is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Patch.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {object|undefined} where
   * @returns {Promise<number>}
   */
  patch(modelName, modelData, where = undefined) {
    throw new NotImplementedError(
      '%s.patch is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Patch by id.
   *
   * @param {string} modelName
   * @param {number|string} id
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  patchById(modelName, id, modelData, filter = undefined) {
    throw new NotImplementedError(
      '%s.patchById is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Find.
   *
   * @param {string} modelName
   * @param {object|undefined} filter
   * @returns {Promise<object[]>}
   */
  find(modelName, filter = undefined) {
    throw new NotImplementedError(
      '%s.find is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Find by id.
   *
   * @param {string} modelName
   * @param {number|string} id
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  findById(modelName, id, filter = undefined) {
    throw new NotImplementedError(
      '%s.findById is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Delete.
   *
   * @param {string} modelName
   * @param {object|undefined} where
   * @returns {Promise<number>}
   */
  delete(modelName, where = undefined) {
    throw new NotImplementedError(
      '%s.delete is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Delete by id.
   *
   * @param {string} modelName
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  deleteById(modelName, id) {
    throw new NotImplementedError(
      '%s.deleteById is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Exists.
   *
   * @param {string} modelName
   * @param {number|string} id
   * @returns {Promise<boolean>}
   */
  exists(modelName, id) {
    throw new NotImplementedError(
      '%s.exists is not implemented.',
      this.constructor.name,
    );
  }

  /**
   * Count.
   *
   * @param {string} modelName
   * @param {object|undefined} where
   * @returns {Promise<number>}
   */
  count(modelName, where = undefined) {
    throw new NotImplementedError(
      '%s.count is not implemented.',
      this.constructor.name,
    );
  }
}
