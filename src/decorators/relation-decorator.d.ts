import {RelationDefinition} from '../definition/index.js';

/**
 * Relation decorator.
 *
 * @param relationDef
 */
export declare function relation(
  relationDef: RelationDefinition
): (target: object, propertyKey: string) => void;
