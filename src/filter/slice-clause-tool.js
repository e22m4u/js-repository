import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Slice clause tool.
 */
export class SliceClauseTool extends Service {
  /**
   * Slice.
   *
   * @param {object[]} entities
   * @param {number|undefined} skip
   * @param {number|undefined} limit
   * @returns {object[]}
   */
  slice(entities, skip = undefined, limit = undefined) {
    if (!Array.isArray(entities)) {
      throw new InvalidArgumentError(
        'Parameter "entities" must be an Array, but %v was given.',
        entities,
      );
    }
    if (skip != null && typeof skip !== 'number') {
      throw new InvalidArgumentError(
        'Option "skip" must be a Number, but %v was given.',
        skip,
      );
    }
    if (limit != null && typeof limit !== 'number') {
      throw new InvalidArgumentError(
        'Option "limit" must be a Number, but %v was given.',
        limit,
      );
    }
    skip = skip || 0;
    limit = limit || entities.length;
    return entities.slice(skip, skip + limit);
  }

  /**
   * Validate skip clause.
   *
   * @param {number|undefined} skip
   */
  static validateSkipClause(skip) {
    if (skip == null) {
      return;
    }
    if (typeof skip !== 'number') {
      throw new InvalidArgumentError(
        'Option "skip" must be a Number, but %v was given.',
        skip,
      );
    }
  }

  /**
   * Validate limit clause.
   *
   * @param {number|undefined} limit
   */
  static validateLimitClause(limit) {
    if (limit == null) {
      return;
    }
    if (typeof limit !== 'number') {
      throw new InvalidArgumentError(
        'Option "limit" must be a Number, but %v was given.',
        limit,
      );
    }
  }
}
