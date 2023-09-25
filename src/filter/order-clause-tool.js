import {Service} from '@e22m4u/js-service';
import {getValueByPath} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Order clause tool.
 */
export class OrderClauseTool extends Service {
  /**
   * Sort.
   *
   * @param {object[]} entities
   * @param {string|string[]|undefined} clause
   */
  sort(entities, clause) {
    if (clause == null) return;
    if (Array.isArray(clause) === false) clause = [clause];
    if (!clause.length) return;
    const mapping = [];
    clause.forEach((key, index) => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of non-empty String, but %v given.',
          key,
        );
      let reverse = 1;
      const matches = key.match(/\s+(A|DE)SC$/i);
      if (matches) {
        key = key.replace(/\s+(A|DE)SC/i, '');
        if (matches[1].toLowerCase() === 'de') reverse = -1;
      }
      mapping[index] = {key: key, reverse};
    });
    entities.sort(compareFn.bind(mapping));
  }

  /**
   * Validate order clause.
   *
   * @param {string|string[]|undefined} clause
   */
  static validateOrderClause(clause) {
    if (clause == null) return;
    if (Array.isArray(clause) === false) clause = [clause];
    if (!clause.length) return;
    clause.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of non-empty String, but %v given.',
          field,
        );
    });
  }

  /**
   * Normalize order clause.
   *
   * @param {string|string[]|undefined} clause
   * @returns {string[]|undefined}
   */
  static normalizeOrderClause(clause) {
    if (clause == null) return;
    if (Array.isArray(clause) === false) clause = [clause];
    if (!clause.length) return;
    clause.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of non-empty String, but %v given.',
          field,
        );
    });
    return clause;
  }
}

/**
 * Compare fn.
 *
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
function compareFn(a, b) {
  let undefinedA, undefinedB;
  for (let i = 0, l = this.length; i < l; i++) {
    const aVal = getValueByPath(a, this[i].key);
    const bVal = getValueByPath(b, this[i].key);
    undefinedB = bVal === undefined && aVal !== undefined;
    undefinedA = aVal === undefined && bVal !== undefined;
    if (undefinedB || aVal > bVal) {
      return this[i].reverse;
    } else if (undefinedA || aVal < bVal) {
      return -1 * this[i].reverse;
    }
  }
  return 0;
}
