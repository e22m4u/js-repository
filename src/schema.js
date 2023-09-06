import {Service} from './service/index.js';
import {DefinitionRegistry} from './definition/index.js';
import {RepositoryRegistry} from './repository/index.js';

/**
 * Schema.
 */
export class Schema extends Service {
  /**
   * Define datasource.
   *
   * @param datasourceDef
   */
  defineDatasource(datasourceDef) {
    this.get(DefinitionRegistry).addDatasource(datasourceDef);
    return this;
  }

  /**
   * Define model.
   *
   * @param modelDef
   */
  defineModel(modelDef) {
    this.get(DefinitionRegistry).addModel(modelDef);
    return this;
  }

  /**
   * Get repository.
   *
   * @param modelName
   */
  getRepository(modelName) {
    return this.get(RepositoryRegistry).getRepository(modelName);
  }
}
