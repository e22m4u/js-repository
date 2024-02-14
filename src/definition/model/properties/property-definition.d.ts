import {DataType} from './data-type.js';
import {PropertyValidateOptions} from './property-validator/index.js';

/**
 * Full property definition.
 */
export declare type FullPropertyDefinition = {
  type: DataType;
  itemType?: DataType;
  model?: string;
  primaryKey?: boolean;
  columnName?: string;
  columnType?: string;
  required?: boolean;
  default?: unknown;
  validate?: PropertyValidateOptions;
};

/**
 * Property definition.
 */
declare type PropertyDefinition = DataType | FullPropertyDefinition;
