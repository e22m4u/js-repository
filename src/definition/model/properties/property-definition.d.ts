import {DataType} from './data-type.js';
import {PropertyValidateOptions} from './property-validator/index.js';
import {PropertyTransformOptions} from './property-transformer/index.js';

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
  transform?: PropertyTransformOptions;
};

/**
 * Property definition.
 */
declare type PropertyDefinition = DataType | FullPropertyDefinition;
