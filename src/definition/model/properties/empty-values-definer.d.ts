import {DataType} from './data-type.js';
import {Service} from '@e22m4u/js-service';

/**
 * Empty values definer.
 */
export class EmptyValuesDefiner extends Service {
  /**
   * Set empty values of.
   *
   * @param dataType
   * @param emptyValues
   */
  setEmptyValuesOf(dataType: DataType, emptyValues: unknown[]): this;

  /**
   * Is empty.
   *
   * @param dataType
   * @param value
   */
  isEmpty(dataType: DataType, value: unknown): boolean;
}
