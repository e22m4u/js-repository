import {ModelData} from '../types.js';

/**
 * Filter clause.
 */
export declare type FilterClause<M extends object = ModelData> = {
  where?: WhereClause<M>;
  order?: OrderClause<M>;
  limit?: number;
  skip?: number;
  fields?: FieldsClause<M>;
  include?: IncludeClause<M>;
};

/**
 * Item filter clause.
 */
export declare type ItemFilterClause<M extends object = ModelData> = Pick<
  FilterClause<M>,
  'fields' | 'include'
>;

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
export declare type WhereClause<M extends object = ModelData> = Partial<
  AndClause<M>
> &
  Partial<OrClause<M>> &
  PropertiesClause<M>;

/**
 * Primitive values.
 */
export declare type PrimitiveValue =
  | string
  | number
  | boolean
  | null
  | undefined;

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
export declare type PropertiesClause<M extends object = ModelData> = {
  [property in keyof M]?: OperatorClause | PrimitiveValue | RegExp;
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
  eq?: PrimitiveValue;
  neq?: PrimitiveValue;
  gt?: string | number;
  gte?: string | number;
  lt?: string | number;
  lte?: string | number;
  inq?: PrimitiveValue[];
  nin?: PrimitiveValue[];
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
export interface AndClause<M extends object = ModelData> {
  and: WhereClause<M>[];
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
export interface OrClause<M extends object = ModelData> {
  or: WhereClause<M>[];
}

/**
 * Order clause item.
 *
 * @example
 * ```ts
 * 'prop'
 * 'prop ASC'
 * 'prop DESC';
 * ```
 */
export declare type OrderClauseItem<M extends object = ModelData> = {
  [prop in keyof M]: prop | `${prop & string} ASC` | `${prop & string} DESC`;
}[keyof M];

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
export declare type OrderClause<M extends object = ModelData> =
  | OrderClauseItem<M>
  | OrderClauseItem<M>[];

/**
 * Fields.
 *
 * @example
 * ```ts
 * 'prop'
 * ['prop1', 'prop2']
 * ```
 */
export declare type FieldsClause<M extends object = ModelData> =
  | keyof M
  | NormalizedFieldsClause<M>;

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
export declare type NormalizedFieldsClause<M extends object = ModelData> =
  (keyof M)[];

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
export declare type IncludeClause<M extends object = ModelData> =
  | keyof M
  | (keyof M)[]
  | NestedIncludeClause<M>
  | NormalizedIncludeClause<M>
  | IncludeClause[];

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
export declare type NestedIncludeClause<M extends object = ModelData> = {
  [property in keyof M]?: IncludeClause;
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
export declare interface NormalizedIncludeClause<M extends object = ModelData> {
  relation: keyof M;
  scope?: FilterClause;
}
