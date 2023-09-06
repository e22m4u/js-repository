import {Repository} from './repository.js';
import {Service} from '../service/index.js';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Repository registry.
 */
export class RepositoryRegistry extends Service {
  /**
   * Repositories.
   */
  _repositories = {};

  /**
   * Repository ctor.
   *
   * @type {typeof Repository}
   * @private
   */
  _repositoryCtor = Repository;

  /**
   * Set repository ctor.
   *
   * @param ctor
   */
  setRepositoryCtor(ctor) {
    if (
      !ctor ||
      typeof ctor !== 'function' ||
      !(ctor.prototype instanceof Repository)
    ) {
      throw new InvalidArgumentError(
        'The first argument of RepositoryRegistry.setRepositoryCtor ' +
          'must inherit from Repository class, but %s given.',
        ctor,
      );
    }
    this._repositoryCtor = ctor;
  }

  /**
   * Get repository.
   *
   * @param modelName
   */
  getRepository(modelName) {
    let repository = this._repositories[modelName];
    if (repository) return repository;
    repository = new this._repositoryCtor(this._services, modelName);
    this._repositories[modelName] = repository;
    return repository;
  }
}
