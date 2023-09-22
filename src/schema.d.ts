import {ModelId} from './types';
import {ModelData} from './types';
import {Service} from '@e22m4u/service';
import {Repository} from './repository';
import {ModelDefinition} from './definition';
import {DatasourceDefinition} from './definition';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME} from './definition';

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
