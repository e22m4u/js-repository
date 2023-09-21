import {Service} from '@e22m4u/service';
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
    if (!clause) return;
    if (!Array.isArray(clause)) clause = [clause];
    const mapping = [];
    clause.forEach((key, index) => {
      if (typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "order" should be a String ' +
            'or an Array of String, but %v given.',
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
    if (!clause) return;
    const tempClause = Array.isArray(clause) ? clause : [clause];
    tempClause.forEach(key => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of String, but %v given.',
          key,
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
    if (!clause) return;
    clause = Array.isArray(clause) ? clause : [clause];
    clause.forEach(key => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of String, but %v given.',
          key,
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
