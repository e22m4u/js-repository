import {Service} from '@e22m4u/js-service';
import {getValueByPath} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {OperatorClauseTool} from './operator-clause-tool.js';

/**
 * Where clause tool.
 *
 * @typedef {object|Function} WhereClause
 */
export class WhereClauseTool extends Service {
  /**
   * Filter by where clause.
   *
   * @example
   * ```
   * const entities = [
   *   {foo: 1, bar: 'a'},
   *   {foo: 2, bar: 'b'},
   *   {foo: 3, bar: 'b'},
   *   {foo: 4, bar: 'b'},
   * ];
   *
   * const result = filterByWhereClause(entities, {
   *   foo: {gt: 2},
   *   bar: 'b',
   * });
   *
   * console.log(result);
   * // [
   * //   {foo: 3, bar: 'b'},
   * //   {foo: 4, bar: 'b'},
   * // ];
   *
   * ```
   *
   * @param {object[]} entities
   * @param {WhereClause|undefined} where
   * @returns {object[]}
   */
  filter(entities, where = undefined) {
    if (!Array.isArray(entities))
      throw new InvalidArgumentError(
        'The first argument of WhereClauseTool.filter should be ' +
          'an Array of Object, but %v given.',
        entities,
      );
    if (where == null) return entities;
    return entities.filter(this._createFilter(where));
  }

  /**
   * Create where filter.
   *
   * @param {WhereClause} whereClause
   * @returns {Function}
   */
  _createFilter(whereClause) {
    if (typeof whereClause !== 'object' || Array.isArray(whereClause))
      throw new InvalidArgumentError(
        'The provided option "where" should be an Object, but %v given.',
        whereClause,
      );
    const keys = Object.keys(whereClause);
    return data => {
      if (typeof data !== 'object')
        throw new InvalidArgumentError(
          'The first argument of WhereClauseTool.filter should be ' +
            'an Array of Object, but %v given.',
          data,
        );
      return keys.every(key => {
        // AndClause (recursion)
        if (key === 'and' && key in whereClause) {
          const andClause = whereClause[key];
          if (Array.isArray(andClause))
            return andClause.every(clause => this._createFilter(clause)(data));
          // OrClause (recursion)
        } else if (key === 'or' && key in whereClause) {
          const orClause = whereClause[key];
          if (Array.isArray(orClause))
            return orClause.some(clause => this._createFilter(clause)(data));
        }
        // PropertiesClause (properties)
        const value = getValueByPath(data, key);
        const matcher = whereClause[key];
        // Property value is an array.
        if (Array.isArray(value)) {
          // {neq: ...}
          if (
            typeof matcher === 'object' &&
            matcher !== null &&
            'neq' in matcher &&
            matcher.neq !== undefined
          ) {
            // The following condition is for the case where
            // we are querying with a neq filter, and when
            // the value is an empty array ([]).
            if (value.length === 0) return true;
            // The neq operator requires each element
            // of the array to be excluded.
            return value.every((el, index) => {
              const where = {};
              where[index] = matcher;
              return this._createFilter(where)({...value});
            });
          }
          // Requires one of an array elements to be match.
          return value.some((el, index) => {
            const where = {};
            where[index] = matcher;
            return this._createFilter(where)({...value});
          });
        }
        // Test property value.
        if (this._test(matcher, value)) return true;
      });
    };
  }

  /**
   * Value testing.
   *
   * @param {*} example
   * @param {*} value
   * @returns {boolean}
   */
  _test(example, value) {
    // Test null.
    if (example == null) {
      return value == null;
    }
    // Test RegExp.
    // noinspection ALL
    if (example instanceof RegExp) {
      if (typeof value === 'string') return !!value.match(example);
      return false;
    }
    // Operator clause.
    if (typeof example === 'object') {
      const operatorsTest = this.getService(OperatorClauseTool).testAll(
        example,
        value,
      );
      if (operatorsTest !== undefined) return operatorsTest;
    }
    // Not strict equality.
    return example == value;
  }

  /**
   * Validate where clause.
   *
   * @param {WhereClause|undefined} clause
   */
  static validateWhereClause(clause) {
    if (clause == null || typeof clause === 'function') return;
    if (typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The provided option "where" should be an Object, but %v given.',
        clause,
      );
  }
}
