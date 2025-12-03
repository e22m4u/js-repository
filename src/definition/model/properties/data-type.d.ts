/**
 * Data type.
 */
export declare const DataType: {
  ANY: 'any';
  STRING: 'string';
  NUMBER: 'number';
  BOOLEAN: 'boolean';
  ARRAY: 'array';
  OBJECT: 'object';
};

/**
 * Type of DataType.
 */
export type DataType = (typeof DataType)[keyof typeof DataType];
