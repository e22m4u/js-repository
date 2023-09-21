import {Service} from '@e22m4u/service';
import {Repository} from './repository.js';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Repository registry.
 */
export class RepositoryRegistry extends Service {
  /**
   * Repositories.
   *
   * @type {object}
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
   * @param {typeof Repository} ctor
   */
  setRepositoryCtor(ctor) {
    if (
      !ctor ||
      typeof ctor !== 'function' ||
      !(ctor.prototype instanceof Repository)
    ) {
      throw new InvalidArgumentError(
        'The first argument of RepositoryRegistry.setRepositoryCtor ' +
          'must inherit from Repository class, but %v given.',
        ctor,
      );
    }
    this._repositoryCtor = ctor;
  }

  /**
   * Get repository.
   *
   * @param {string} modelName
   * @returns {Repository}
   */
  getRepository(modelName) {
    let repository = this._repositories[modelName];
    if (repository) return repository;
    repository = new this._repositoryCtor(this.container, modelName);
    this._repositories[modelName] = repository;
    return repository;
  }
}
