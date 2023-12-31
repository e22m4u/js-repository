import {RelationDefinition} from './relations/index.js';
import {PropertyDefinition} from './properties/index.js';

/**
 * Property definition map.
 */
export declare type PropertyDefinitionMap = {
  [name: string]: PropertyDefinition;
};

/**
 * Relation definition map.
 */
export declare type RelationDefinitionMap = {
  [name: string]: RelationDefinition;
};

/**
 * Model definition.
 */
export declare type ModelDefinition = {
  name: string;
  datasource?: string;
  base?: string;
  tableName?: string;
  properties?: PropertyDefinitionMap;
  relations?: RelationDefinitionMap;
};
