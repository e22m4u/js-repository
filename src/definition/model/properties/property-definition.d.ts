import {DataType} from './data-type.js';
import {PropertyUniqueness} from './property-uniqueness.js';

/**
 * Full property definition.
 */
export declare type FullPropertyDefinition = {
  type: DataType;
  itemType?: DataType;
  itemModel?: string;
  model?: string;
  primaryKey?: boolean;
  columnName?: string;
  columnType?: string;
  required?: boolean;
  default?: unknown;
  unique?: boolean | PropertyUniqueness;
};

/**
 * Property definition.
 */
declare type PropertyDefinition = DataType | FullPropertyDefinition;
