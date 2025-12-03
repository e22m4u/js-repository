import {Service} from '@e22m4u/js-service';
import {ModelDefinition} from './model/index.js';
import {DatasourceDefinition} from './datasource/index.js';

/**
 * Definition registry.
 */
export declare class DefinitionRegistry extends Service {
  /**
   * Add datasource.
   *
   * @param datasourceDef
   */
  addDatasource(datasourceDef: DatasourceDefinition): void;

  /**
   * Has datasource.
   *
   * @param name
   */
  hasDatasource(name: string): boolean;

  /**
   * Get datasource.
   *
   * @param name
   */
  getDatasource(name: string): DatasourceDefinition;

  /**
   * Add model.
   *
   * @param modelDef
   */
  addModel(modelDef: ModelDefinition): void;

  /**
   * Has model.
   *
   * @param name
   */
  hasModel(name: string): boolean;

  /**
   * Get model.
   *
   * @param name
   */
  getModel(name: string): ModelDefinition;
}
