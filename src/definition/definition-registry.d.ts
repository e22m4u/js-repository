import {Service} from '@e22m4u/service';
import {ModelDefinition} from './model';
import {DatasourceDefinition} from './datasource';

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
