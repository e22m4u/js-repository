import {ModelData} from '../types.js';

/**
 * Filter clause.
 */
export declare type FilterClause = {
  where?: WhereClause;
  order?: OrderClause;
  limit?: number;
  skip?: number;
  fields?: FieldsClause;
  include?: IncludeClause;
};

/**
 * Item filter clause.
 */
export declare type ItemFilterClause = Pick<FilterClause, 'fields' | 'include'>;

/**
 * Where clause.
 *
 * @example
 * ```ts
 * value => value.featured === true
 * {foo: 'bar'}
 * {foo: {eq: 'bar'}}
 * {foo: {neq: 'bar'}}
 * {foo: {gt: 5}}
 * {foo: {lt: 10}}
 * {foo: {gte: 5}}
 * {foo: {lte: 10}}
 * {foo: {inq: ['bar', 'baz']}}
 * {foo: {nin: ['bar', 'baz']}}
 * {foo: {between: [5, 10]}}
 * {foo: {exists: true}}
 * {foo: {like: 'bar'}}
 * {foo: {ilike: 'BaR'}}
 * {foo: {nlike: 'bar'}}
 * {foo: {nilike: 'BaR'}}
 * {foo: {regexp: 'ba.+'}}
 * {foo: {regexp: 'ba.+', flags: 'i'}}
 * {and: [...]}
 * {or: [...]}
 * ```
 */
export declare type WhereClause =
  | FunctionClause
  | PropertiesClause
  | AndClause
  | OrClause;

/**
 * Function clause.
 *
 * @example
 * ```ts
 * (value) => value.featured === true;
 * ```
 */
export type FunctionClause = (value: ModelData) => boolean;

/**
 * Properties clause.
 *
 * @example
 * ```ts
 * {
 *   name: {inq: ['John', 'Mary']},
 *   status: 'ACTIVE',
 *   age: {gte: 40}
 * }
 * ```
 */
export type PropertiesClause = {
  [property: string]:
    | OperatorClause
    | string
    | number
    | boolean
    | RegExp
    | null
    | undefined;
};

/**
 * Operator clause.
 *
 * @example
 * ```ts
 * {eq: 'bar'}
 * {neq: 'bar'}
 * {gt: 5}
 * {lt: 10}
 * {gte: 5}
 * {lte: 10}
 * {inq: ['bar', 'baz']}
 * {nin: ['bar', 'baz']}
 * {between: [5, 10]}
 * {exists: true}
 * {like: 'bar'}
 * {ilike: 'BaR'}
 * {nlike: 'bar'}
 * {nilike: 'BaR'}
 * {regexp: 'ba.+'}
 * {regexp: 'ba.+', flags: 'i'}
 * ```
 */
export declare type OperatorClause = {
  eq?: unknown;
  neq?: unknown;
  gt?: string | number;
  gte?: string | number;
  lt?: string | number;
  lte?: string | number;
  inq?: unknown[];
  nin?: unknown[];
  between?: readonly [string | number, string | number];
  exists?: boolean;
  like?: string | RegExp;
  nlike?: string | RegExp;
  ilike?: string | RegExp;
  nilike?: string | RegExp;
  regexp?: string | RegExp;
  flags?: string;
};

/**
 * And clause.
 *
 * @example
 * ```ts
 * {
 *   and: [...],
 * }
 * ```
 */
export interface AndClause {
  and?: WhereClause[];
}

/**
 * Or clause.
 *
 * @example
 * ```ts
 * {
 *   or: [...],
 * }
 * ```
 */
export interface OrClause {
  or?: WhereClause[];
}

/**
 * Order clause.
 *
 * @example
 * ```ts
 * 'prop'
 * 'prop ASC'
 * 'prop DESC';
 * ['prop1', 'prop2'];
 * ['prop1 ASC', 'prop2 DESC'];
 * ```
 */
export type OrderClause = string | string[];

/**
 * Fields.
 *
 * @example
 * ```ts
 * 'prop'
 * ['prop1', 'prop2']
 * ```
 */
export type FieldsClause = string | NormalizedFieldsClause;

/**
 * Normalized fields clause.
 *
 * @example
 * ```ts
 * [
 *   'prop1',
 *   'prop2',
 * ]
 * ```
 */
export type NormalizedFieldsClause = string[];

/**
 * Include clause.
 *
 * @example
 * ```ts
 * 'customers'
 * ```
 *
 * @example
 * ```ts
 * [
 *   'customers',
 *   'orders',
 * ]
 * ```
 *
 * @example
 * ```ts
 * {
 *   customer: 'orders'
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   customer: {
 *     address: 'city',
 *   },
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   customer: [
 *     'orders',
 *     {address: 'city'},
 *   ],
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   relation: 'customer',
 *   scope: {
 *     where: {removed: false},
 *     order: 'createdAt DESC',
 *     skip: 0,
 *     limit: 16,
 *     fields: ['id', 'name', 'removed'],
 *     include: 'address',
 *   }
 * }
 * ```
 */
export declare type IncludeClause =
  | string
  | string[]
  | NestedIncludeClause
  | NestedIncludeClause[]
  | NormalizedIncludeClause
  | NormalizedIncludeClause[];

/**
 * Nested include clause.
 *
 * @example
 * ```ts
 * {
 *   customer: 'orders'
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   customer: {
 *     address: 'city',
 *   },
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   customer: [
 *     'orders',
 *     {address: 'city'},
 *   ],
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   relation: 'customer',
 *   scope: {
 *     where: {removed: false},
 *     order: 'createdAt DESC',
 *     skip: 0,
 *     limit: 16,
 *     fields: ['id', 'name', 'removed'],
 *     include: 'address',
 *   }
 * }
 * ```
 */
export declare type NestedIncludeClause = {
  [property: string]: IncludeClause;
};

/**
 * Inclusion.
 *
 * @example
 * ```ts
 * {
 *   relation: 'customer',
 * }
 * ```
 *
 * @example
 * ```ts
 * {
 *   relation: 'customer',
 *   scope: {
 *     where: {removed: false},
 *     order: 'createdAt DESC',
 *     skip: 0,
 *     limit: 16,
 *     fields: ['id', 'name', 'removed'],
 *     include: 'address',
 *   }
 * }
 * ```
 */
export declare type NormalizedIncludeClause = {
  relation: string;
  scope?: FilterClause;
};
