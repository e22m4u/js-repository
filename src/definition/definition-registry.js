import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../errors/index.js';
import {ModelDefinitionValidator} from './model/index.js';
import {DatasourceDefinitionValidator} from '../definition/index.js';

/**
 * Definition registry.
 */
export class DefinitionRegistry extends Service {
  /**
   * Datasources.
   *
   * @type {object}
   */
  _datasources = {};

  /**
   * Models.
   *
   * @type {object}
   */
  _models = {};

  /**
   * Add datasource.
   *
   * @param {object} datasourceDef
   */
  addDatasource(datasourceDef) {
    this.getService(DatasourceDefinitionValidator).validate(datasourceDef);
    const name = datasourceDef.name;
    if (name in this._datasources)
      throw new InvalidArgumentError(
        'The datasource %v is already defined.',
        name,
      );
    this._datasources[name] = datasourceDef;
  }

  /**
   * Has datasource.
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasDatasource(name) {
    return Boolean(this._datasources[name]);
  }

  /**
   * Get datasource.
   *
   * @param {string} name
   * @returns {object}
   */
  getDatasource(name) {
    const datasourceDef = this._datasources[name];
    if (!datasourceDef)
      throw new InvalidArgumentError('The datasource %v is not defined.', name);
    return datasourceDef;
  }

  /**
   * Add model.
   *
   * @param {object} modelDef
   */
  addModel(modelDef) {
    this.getService(ModelDefinitionValidator).validate(modelDef);
    const name = modelDef.name;
    if (name in this._models)
      throw new InvalidArgumentError('The model %v is already defined.', name);
    this._models[name] = modelDef;
  }

  /**
   * Has model.
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasModel(name) {
    return Boolean(this._models[name]);
  }

  /**
   * Get model.
   *
   * @param {string} name
   * @returns {object}
   */
  getModel(name) {
    const modelDef = this._models[name];
    if (!modelDef)
      throw new InvalidArgumentError('The model %v is not defined.', name);
    return modelDef;
  }
}
