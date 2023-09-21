import {Service} from '@e22m4u/service';
import {Repository} from './repository';
import {ModelDefinition} from './definition';
import {DatasourceDefinition} from './definition';

/**
 * Schema.
 */
export declare class Schema extends Service {
  /**
   * Define datasource.
   *
   * @param datasourceDef
   */
  defineDatasource(datasourceDef: DatasourceDefinition): this;

  /**
   * Define model.
   *
   * @param modelDef
   */
  defineModel(modelDef: ModelDefinition): this;

  /**
   * Get repository.
   *
   * @param modelName
   */
  getRepository(modelName: string): Repository;
}
