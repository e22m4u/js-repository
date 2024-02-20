import {DataType} from './data-type.js';
import {Service} from '@e22m4u/js-service';
import {isDeepEqual} from '../../../utils/index.js';
import {InvalidArgumentError} from '../../../errors/index.js';

/**
 * Empty values definer.
 */
export class EmptyValuesDefiner extends Service {
  /**
   * Empty values map.
   *
   * @type {Map<string, *[]>}
   */
  _emptyValuesMap = new Map([
    [DataType.ANY, [undefined, null]],
    [DataType.STRING, [undefined, null, '']],
    [DataType.NUMBER, [undefined, null, 0]],
    [DataType.BOOLEAN, [undefined, null]],
    [DataType.ARRAY, [undefined, null, []]],
    [DataType.OBJECT, [undefined, null, {}]],
  ]);

  /**
   * Set empty values of data type.
   *
   * @param {string} dataType
   * @param {*[]} emptyValues
   * @returns {EmptyValuesDefiner}
   */
  setEmptyValuesOf(dataType, emptyValues) {
    if (!Object.values(DataType).includes(dataType))
      throw new InvalidArgumentError(
        'The argument "dataType" of the EmptyValuesDefiner.setEmptyValuesOf ' +
          'must be one of data types: %l, but %v given.',
        Object.values(DataType),
        dataType,
      );
    if (!Array.isArray(emptyValues))
      throw new InvalidArgumentError(
        'The argument "emptyValues" of the EmptyValuesDefiner.setEmptyValuesOf ' +
          'must be an Array, but %v given.',
        emptyValues,
      );
    this._emptyValuesMap.set(dataType, emptyValues);
    return this;
  }

  /**
   * Is empty.
   *
   * @param {string} dataType
   * @param {*} value
   * @returns {boolean}
   */
  isEmpty(dataType, value) {
    if (!Object.values(DataType).includes(dataType))
      throw new InvalidArgumentError(
        'The argument "dataType" of the EmptyValuesDefiner.isEmpty ' +
          'must be one of data types: %l, but %v given.',
        Object.values(DataType),
        dataType,
      );
    return this._emptyValuesMap.get(dataType).some(v => isDeepEqual(v, value));
  }
}
