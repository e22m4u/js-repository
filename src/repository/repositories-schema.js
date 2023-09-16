import {Service} from '@e22m4u/service';
import {DefinitionRegistry} from '../definition/index.js';
import {RepositoryRegistry} from './repository-registry.js';

/**
 * Repositories schema.
 */
export class RepositoriesSchema extends Service {
  /**
   * Define datasource.
   *
   * @param datasourceDef
   */
  defineDatasource(datasourceDef) {
    this.getService(DefinitionRegistry).addDatasource(datasourceDef);
    return this;
  }

  /**
   * Define model.
   *
   * @param modelDef
   */
  defineModel(modelDef) {
    this.getService(DefinitionRegistry).addModel(modelDef);
    return this;
  }

  /**
   * Get repository.
   *
   * @param modelName
   */
  getRepository(modelName) {
    return this.getService(RepositoryRegistry).getRepository(modelName);
  }
}
