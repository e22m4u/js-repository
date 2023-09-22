import {ModelId} from '../types';
import {ModelData} from '../types';
import {Service} from '@e22m4u/service';
import {Repository} from './repository';
import {Constructor} from '@e22m4u/service';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME} from '../definition';

/**
 * Repository registry.
 */
export declare class RepositoryRegistry extends Service {
  /**
   * Set repository registry.
   *
   * @param ctor
   */
  setRepositoryCtor(ctor: Constructor<Repository<any, any, any>>): void;

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
