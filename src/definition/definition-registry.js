import {Service} from '@e22m4u/js-service';
import {modelNameToModelKey} from '../utils/index.js';
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
    const modelKey = modelNameToModelKey(modelDef.name);
    if (modelKey in this._models)
      throw new InvalidArgumentError(
        'The model %v is already defined.',
        modelDef.name,
      );
    this._models[modelKey] = modelDef;
  }

  /**
   * Has model.
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasModel(name) {
    const modelKey = modelNameToModelKey(name);
    return Boolean(this._models[modelKey]);
  }

  /**
   * Get model.
   *
   * @param {string} name
   * @returns {object}
   */
  getModel(name) {
    const modelKey = modelNameToModelKey(name);
    const modelDef = this._models[modelKey];
    if (!modelDef)
      throw new InvalidArgumentError('The model %v is not defined.', name);
    return modelDef;
  }
}
