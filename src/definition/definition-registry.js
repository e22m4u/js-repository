import {Service} from '../service/index.js';
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
   * @type {{[name: string]: object}}
   */
  _datasources = {};

  /**
   * Models.
   *
   * @type {{[name: string]: object}}
   */
  _models = {};

  /**
   * Add datasource.
   *
   * @param datasourceDef
   */
  addDatasource(datasourceDef) {
    this.get(DatasourceDefinitionValidator).validate(datasourceDef);
    const name = datasourceDef.name;
    if (name in this._datasources)
      throw new InvalidArgumentError(
        'The datasource %s is already defined.',
        name,
      );
    this._datasources[name] = datasourceDef;
  }

  /**
   * Has datasource.
   *
   * @param name
   * @return {*}
   */
  hasDatasource(name) {
    return Boolean(this._datasources[name]);
  }

  /**
   * Get datasource.
   *
   * @param name
   * @return {Object}
   */
  getDatasource(name) {
    const datasourceDef = this._datasources[name];
    if (!datasourceDef)
      throw new InvalidArgumentError('The datasource %s is not defined.', name);
    return datasourceDef;
  }

  /**
   * Add model.
   *
   * @param modelDef
   */
  addModel(modelDef) {
    this.get(ModelDefinitionValidator).validate(modelDef);
    const name = modelDef.name;
    if (name in this._models)
      throw new InvalidArgumentError('The model %s is already defined.', name);
    this._models[name] = modelDef;
  }

  /**
   * Has model.
   *
   * @param name
   * @return {*}
   */
  hasModel(name) {
    return Boolean(this._models[name]);
  }

  /**
   * Get model.
   *
   * @param name
   * @return {Object}
   */
  getModel(name) {
    const modelDef = this._models[name];
    if (!modelDef)
      throw new InvalidArgumentError('The model %s is not defined.', name);
    return modelDef;
  }
}
