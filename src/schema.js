import {Service} from '@e22m4u/js-service';
import {Repository} from './repository/index.js';
import {DefinitionRegistry} from './definition/index.js';
import {RepositoryRegistry} from './repository/index.js';
import {ModelDecoratorUtils} from './decorators/index.js';

/**
 * Schema.
 */
export class Schema extends Service {
  /**
   * Define datasource.
   *
   * @param {object} datasourceDef
   * @returns {this}
   */
  defineDatasource(datasourceDef) {
    this.getService(DefinitionRegistry).addDatasource(datasourceDef);
    return this;
  }

  /**
   * Define model.
   *
   * @param {object|Function} modelDefOrCtor
   * @returns {this}
   */
  defineModel(modelDefOrCtor) {
    const modelDecoratorUtils = this.getService(ModelDecoratorUtils);
    const modelDef = modelDecoratorUtils.hasModelDefinitionIn(modelDefOrCtor)
      ? modelDecoratorUtils.getModelDefinitionFrom(modelDefOrCtor)
      : modelDefOrCtor;
    this.getService(DefinitionRegistry).addModel(modelDef);
    return this;
  }

  /**
   * Get repository.
   *
   * @param {string} modelName
   * @returns {Repository}
   */
  getRepository(modelName) {
    return this.getService(RepositoryRegistry).getRepository(modelName);
  }
}
