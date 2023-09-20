import {Service} from '@e22m4u/service';
import {DefinitionRegistry} from './definition/index.js';
import {RepositoryRegistry} from './repository/index.js';

/**
 * Schema.
 */
export class Schema extends Service {
  /**
   * Define datasource.
   *
   * @param {object} datasourceDef
   */
  defineDatasource(datasourceDef) {
    this.getService(DefinitionRegistry).addDatasource(datasourceDef);
    return this;
  }

  /**
   * Define model.
   *
   * @param {object} modelDef
   */
  defineModel(modelDef) {
    this.getService(DefinitionRegistry).addModel(modelDef);
    return this;
  }

  /**
   * Get repository.
   *
   * @param {Repository} modelName
   */
  getRepository(modelName) {
    return this.getService(RepositoryRegistry).getRepository(modelName);
  }
}
