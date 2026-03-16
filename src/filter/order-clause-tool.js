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
    if (!Array.isArray(entities)) {
      throw new InvalidArgumentError(
        'Parameter "entities" must be an Array, but %v was given.',
        entities,
      );
    }
    if (clause == null) {
      return;
    }
    const isArrayClause = Array.isArray(clause);
    if (!clause || (typeof clause !== 'string' && !isArrayClause)) {
      throw new InvalidArgumentError(
        'Option "order" must be a non-empty String or an Array ' +
          'of non-empty String, but %v was given.',
        clause,
      );
    }
    if (!isArrayClause) {
      clause = [clause];
    } else if (!clause.length) {
      return;
    }
    const mapping = [];
    clause.forEach((element, index) => {
      if (!element || typeof element !== 'string') {
        throw new InvalidArgumentError(
          'Element %d of the option "order" must be a non-empty String, ' +
            'but %v was given.',
          index,
          element,
        );
      }
      let reverse = 1;
      const matches = element.match(/\s+(A|DE)SC$/i);
      if (matches) {
        element = element.replace(/\s+(A|DE)SC/i, '');
        if (matches[1].toLowerCase() === 'de') {
          reverse = -1;
        }
      }
      mapping[index] = {key: element, reverse};
    });
    entities.sort(compareFn.bind(mapping));
  }

  /**
   * Validate order clause.
   *
   * @param {string|string[]|undefined} clause
   */
  static validateOrderClause(clause) {
    if (clause == null) {
      return;
    }
    const isArrayClause = Array.isArray(clause);
    if (!clause || (typeof clause !== 'string' && !isArrayClause)) {
      throw new InvalidArgumentError(
        'Option "order" must be a non-empty String or an Array ' +
          'of non-empty String, but %v was given.',
        clause,
      );
    }
    if (!isArrayClause || !clause.length) {
      return;
    }
    clause.forEach((element, index) => {
      if (!element || typeof element !== 'string') {
        throw new InvalidArgumentError(
          'Element %d of the option "order" must be a non-empty String, ' +
            'but %v was given.',
          index,
          element,
        );
      }
    });
  }

  /**
   * Normalize order clause.
   *
   * @param {string|string[]|undefined} clause
   * @returns {string[]|undefined}
   */
  static normalizeOrderClause(clause) {
    if (clause == null) {
      return;
    }
    const isArrayClause = Array.isArray(clause);
    if (!clause || (typeof clause !== 'string' && !isArrayClause)) {
      throw new InvalidArgumentError(
        'Option "order" must be a non-empty String or an Array ' +
          'of non-empty String, but %v was given.',
        clause,
      );
    }
    if (!isArrayClause) {
      return [clause];
    } else if (!clause.length) {
      return;
    }
    clause.forEach((element, index) => {
      if (!element || typeof element !== 'string') {
        throw new InvalidArgumentError(
          'Element %d of the option "order" must be a non-empty String, ' +
            'but %v was given.',
          index,
          element,
        );
      }
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
