import {RelationType} from './relation-type.js';

/**
 * Relation definition.
 *
 * @example Available options.
 * ```ts
 * {
 *   type: RelationType;
 *   model?: string;
 *   foreignKey?: string;
 *   polymorphic?: boolean | string;
 *   discriminator?: string;
 * }
 * ```
 */
export declare type RelationDefinition =
  // belongsTo
  | BelongsToDefinition
  | PolyBelongsToDefinition
  // hasOne
  | HasOneDefinition
  | PolyHasOneDefinitionWithTargetRelationName
  | PolyHasOneDefinitionWithTargetKeys
  // hasMany
  | HasManyDefinition
  | PolyHasManyDefinitionWithTargetRelationName
  | PolyHasManyDefinitionWithTargetKeys
  // referencesMany
  | ReferencesManyDefinition;

/**
 * The regular "belongsTo" relation.
 *
 * @example Required options only.
 * ```
 * {
 *   type: RelationType.BELONGS_TO,
 *   model: 'model',
 * }
 * ```
 *
 * @example Verbose definition.
 * ```
 * {
 *   type: RelationType.BELONGS_TO,
 *   model: 'model',
 *   foreignKey: 'modelId',
 * }
 * ```
 */
export declare type BelongsToDefinition = {
  type: RelationType.BELONGS_TO;
  polymorphic?: false;
  model: string;
  foreignKey?: string;
};

/**
 * The polymorphic "belongsTo" relation.
 *
 * @example Required fields only.
 * ```
 * {
 *   type: RelationType.BELONGS_TO,
 *   polymorphic: true,
 * }
 * ```
 *
 * @example Verbose definition.
 * ```
 * {
 *   type: RelationType.BELONGS_TO,
 *   polymorphic: true,
 *   foreignKey: 'referenceId',
 *   discriminator: 'referenceType',
 * }
 * ```
 */
export declare type PolyBelongsToDefinition = {
  type: RelationType.BELONGS_TO;
  polymorphic: true;
  foreignKey?: string;
  discriminator?: string;
};

/**
 * The regular "hasOne" relation.
 *
 * @example
 * ```ts
 * {
 *   type: RelationType.HAS_ONE,
 *   model: 'model',
 *   foreignKey: 'modelId',
 * }
 * ```
 */
export declare type HasOneDefinition = {
  type: RelationType.HAS_ONE;
  model: string;
  foreignKey: string;
  polymorphic?: false;
  discriminator?: undefined;
};

/**
 * The polymorphic "hasOne" relation with a target relation name.
 *
 * @example
 * ```ts
 * {
 *   type: RelationType.HAS_ONE,
 *   model: 'model',
 *   polymorphic: 'reference',
 * }
 * ```
 */
export declare type PolyHasOneDefinitionWithTargetRelationName = {
  type: RelationType.HAS_ONE;
  model: string;
  polymorphic: string;
  foreignKey?: undefined;
  discriminator?: undefined;
};

/**
 * The polymorphic "hasOne" relation with target relation keys.
 *
 * @example
 * ```
 * {
 *   type: RelationType.HAS_ONE,
 *   model: 'model',
 *   polymorphic: true,
 *   foreignKey: 'referenceId',
 *   discriminator: 'referenceType,
 * }
 * ```
 */
export declare type PolyHasOneDefinitionWithTargetKeys = {
  type: RelationType.HAS_ONE;
  model: string;
  polymorphic: true;
  foreignKey: string;
  discriminator: string;
};

/**
 * The regular "hasMany" relation.
 *
 * @example
 * ```ts
 * {
 *   type: RelationType.HAS_MANY,
 *   model: 'model',
 *   foreignKey: 'modelId',
 * }
 * ```
 */
export declare type HasManyDefinition = {
  type: RelationType.HAS_MANY;
  model: string;
  foreignKey: string;
  polymorphic?: false;
  discriminator?: undefined;
};

/**
 * The polymorphic "hasMany" relation with a target relation name.
 *
 * @example
 * ```ts
 * {
 *   type: RelationType.HAS_MANY,
 *   model: 'model',
 *   polymorphic: 'reference',
 * }
 * ```
 */
export declare type PolyHasManyDefinitionWithTargetRelationName = {
  type: RelationType.HAS_MANY;
  model: string;
  polymorphic: string;
  foreignKey?: undefined;
  discriminator?: undefined;
};

/**
 * The polymorphic "hasMany" relation with target relation keys.
 *
 * @example
 * ```
 * {
 *   type: RelationType.HAS_MANY,
 *   model: 'model',
 *   polymorphic: true,
 *   foreignKey: 'referenceId',
 *   discriminator: 'referenceType,
 * }
 * ```
 */
export declare type PolyHasManyDefinitionWithTargetKeys = {
  type: RelationType.HAS_MANY;
  model: string;
  polymorphic: true;
  foreignKey: string;
  discriminator: string;
};

/**
 * The regular "referencesMany" relation.
 *
 * @example Required options only.
 * ```
 * {
 *   type: RelationType.REFERENCES_MANY,
 *   model: 'model',
 * }
 * ```
 *
 * @example Verbose definition.
 * ```
 * {
 *   type: RelationType.REFERENCES_MANY,
 *   model: 'model',
 *   foreignKey: 'modelIds',
 * }
 * ```
 */
export declare type ReferencesManyDefinition = {
  type: RelationType.REFERENCES_MANY;
  model: string;
  foreignKey?: string;
  discriminator?: undefined;
};
