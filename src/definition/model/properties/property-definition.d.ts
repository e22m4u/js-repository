import {DataType} from './data-type';

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
};

/**
 * Property definition.
 */
declare type PropertyDefinition = DataType | FullPropertyDefinition;
