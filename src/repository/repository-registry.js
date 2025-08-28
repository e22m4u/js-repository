import {Service} from '@e22m4u/js-service';
import {Repository} from './repository.js';
import {modelNameToModelKey} from '../utils/index.js';
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
    const modelKey = modelNameToModelKey(modelName);
    let repository = this._repositories[modelKey];
    if (repository) return repository;
    repository = new this._repositoryCtor(this.container, modelName);
    this._repositories[modelKey] = repository;
    return repository;
  }
}
