import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../errors/index.js';
import {OperatorClauseTool} from './operator-clause-tool.js';
import {getValueByPath, isDeepEqual, isPureObject} from '../utils/index.js';

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
          'an Array of Object, but %v was given.',
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
        'The provided option "where" should be an Object, but %v was given.',
        whereClause,
      );
    const keys = Object.keys(whereClause);
    return data => {
      if (typeof data !== 'object')
        throw new InvalidArgumentError(
          'The first argument of WhereClauseTool.filter should be ' +
            'an Array of Object, but %v was given.',
          data,
        );
      return keys.every(key => {
        // AndClause (recursion)
        if (key === 'and' && key in whereClause) {
          const andClause = whereClause[key];
          if (Array.isArray(andClause))
            return andClause.every(clause => this._createFilter(clause)(data));
        }
        // OrClause (recursion)
        else if (key === 'or' && key in whereClause) {
          const orClause = whereClause[key];
          if (Array.isArray(orClause))
            return orClause.some(clause => this._createFilter(clause)(data));
        }
        // PropertiesClause (properties)
        const value = getValueByPath(data, key);
        const matcher = whereClause[key];
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
    // прямое сравнение
    if (example === value) {
      return true;
    }
    // условием является null
    if (example === null) {
      return value === null;
    }
    // условием является undefined
    if (example === undefined) {
      return value === undefined;
    }
    // условием является регулярное выражение
    if (example instanceof RegExp) {
      if (typeof value === 'string') {
        return example.test(value);
      }
      // если значением является массив,
      // то проверяется каждый элемент
      if (Array.isArray(value)) {
        return value.some(el => typeof el === 'string' && example.test(el));
      }
      return false;
    }
    // условием является простой объект
    if (isPureObject(example)) {
      const operatorsTest = this.getService(OperatorClauseTool).testAll(
        example,
        value,
      );
      if (operatorsTest !== undefined) {
        // особая логика для neq с массивами
        // {hobbies: {neq: 'yoga'}}
        //   должно вернуть true для
        // ['bicycle', 'meditation']
        if ('neq' in example && Array.isArray(value)) {
          return !value.some(el => isDeepEqual(el, example.neq));
        }
        return operatorsTest;
      }
    }
    // значением является массив
    if (Array.isArray(value)) {
      // если один из элементов массива соответствует
      // поиску, то возвращается true
      const isElementMatched = value.some(el => isDeepEqual(el, example));
      if (isElementMatched) return true;
    }
    return isDeepEqual(example, value);
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
        'The provided option "where" should be an Object, but %v was given.',
        clause,
      );
  }
}
