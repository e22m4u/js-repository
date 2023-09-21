import {Service} from '@e22m4u/service';
import {Repository} from './repository';
import {Constructor} from '@e22m4u/service';

/**
 * Repository registry.
 */
export declare class RepositoryRegistry extends Service {
  /**
   * Set repository registry.
   *
   * @param ctor
   */
  setRepositoryCtor(ctor: Constructor<Repository>): void;

  /**
   * Get repository.
   *
   * @param modelName
   */
  getRepository(modelName: string): Repository;
}
