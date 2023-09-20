/**
 * Filter.
 */
export declare type Filter = {
  where?: WhereClause;
  order?: string | string[];
  limit?: number;
  skip?: number;
  fields?: string | string[];
  include?: Record<string, unknown>;
};

/**
 * Item filter.
 */
export declare type ItemFilter =
  | Pick<Filter, 'fields' | 'include'>;

/**
 * Where clause.
 */
export declare type WhereClause = {
  [property: string]: unknown,
}
