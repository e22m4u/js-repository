import {Service} from '../service/index.js';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Slice clause tool.
 */
export class SliceClauseTool extends Service {
  /**
   * Filter.
   *
   * @param entities
   * @param skip
   * @param limit
   */
  slice(entities, skip, limit) {
    if (!Array.isArray(entities))
      throw new InvalidArgumentError(
        'A first argument of SliceClauseTool.slice ' +
          'should be an Array, but %s given.',
        entities,
      );
    if (skip && typeof skip !== 'number')
      throw new InvalidArgumentError(
        'The provided option "skip" should be a Number, but %s given.',
        skip,
      );
    if (limit && typeof limit !== 'number')
      throw new InvalidArgumentError(
        'The provided option "limit" should be a Number, but %s given.',
        limit,
      );
    skip = skip || 0;
    limit = limit || entities.length;
    return entities.slice(skip, skip + limit);
  }

  /**
   * Validate skip clause.
   *
   * @param skip
   */
  static validateSkipClause(skip) {
    if (!skip) return;
    if (typeof skip !== 'number')
      throw new InvalidArgumentError(
        'The provided option "skip" should be a Number, but %s given.',
        skip,
      );
  }

  /**
   * Validate limit clause.
   *
   * @param limit
   */
  static validateLimitClause(limit) {
    if (!limit) return;
    if (typeof limit !== 'number')
      throw new InvalidArgumentError(
        'The provided option "limit" should be a Number, but %s given.',
        limit,
      );
  }
}
