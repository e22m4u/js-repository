import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Slice clause tool.
 */
export class SliceClauseTool extends Service {
  /**
   * Filter.
   *
   * @param {object[]} entities
   * @param {number|undefined} skip
   * @param {number|undefined} limit
   * @returns {object[]}
   */
  slice(entities, skip = undefined, limit = undefined) {
    if (!Array.isArray(entities))
      throw new InvalidArgumentError(
        'A first argument of SliceClauseTool.slice ' +
          'should be an Array, but %v given.',
        entities,
      );
    if (skip && typeof skip !== 'number')
      throw new InvalidArgumentError(
        'The provided option "skip" should be a Number, but %v given.',
        skip,
      );
    if (limit && typeof limit !== 'number')
      throw new InvalidArgumentError(
        'The provided option "limit" should be a Number, but %v given.',
        limit,
      );
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
    if (!skip) return;
    if (typeof skip !== 'number')
      throw new InvalidArgumentError(
        'The provided option "skip" should be a Number, but %v given.',
        skip,
      );
  }

  /**
   * Validate limit clause.
   *
   * @param {number|undefined} limit
   */
  static validateLimitClause(limit) {
    if (!limit) return;
    if (typeof limit !== 'number')
      throw new InvalidArgumentError(
        'The provided option "limit" should be a Number, but %v given.',
        limit,
      );
  }
}
