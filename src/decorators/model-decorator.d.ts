import {PartialBy} from '../types.js';
import {Constructor} from '../types.js';
import {ModelDefinition} from '../definition/index.js';

/**
 * Exclude properties and relations.
 */
type ExcludePropertiesAndRelations<T extends object> =
  | Omit<T, 'properties' | 'relations'>;

/**
 * Make the name property optional.
 */
type MakeTheNamePropertyOptional<T extends object> =
  | T extends {name: string} ? PartialBy<T, 'name'> : T;

/**
 * Base option value.
 */
type BaseOptionValue = string | Constructor;

/**
 * Short model definition.
 */
type ShortModelDefinition =
  | ExcludePropertiesAndRelations<MakeTheNamePropertyOptional<ModelDefinition>>
  | {base?: BaseOptionValue | (() => BaseOptionValue)};

/**
 * Model decorator.
 *
 * @param modelDef
 */
export declare function model<T>(
  modelDef?: ShortModelDefinition,
): (target: Constructor<T>) => void;
