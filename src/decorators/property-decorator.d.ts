import {PropertyDefinition} from '../definition/index.js';

/**
 * Property decorator.
 *
 * @param propertyDef
 */
export declare function property(
  propertyDef: PropertyDefinition
): (target: object, propertyKey: string) => void;
