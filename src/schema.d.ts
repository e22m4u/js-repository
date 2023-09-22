import {ModelId} from './types.js';
import {ModelData} from './types.js';
import {Service} from '@e22m4u/js-service';
import {Repository} from './repository/index.js';
import {ModelDefinition} from './definition/index.js';
import {DatasourceDefinition} from './definition/index.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME} from './definition/index.js';

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
  getRepository<
    Data extends ModelData = ModelData,
    IdType extends ModelId = ModelId,
    IdName extends string = DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
  >(modelName: string): Repository<Data, IdType, IdName>;
}
