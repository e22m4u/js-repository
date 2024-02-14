import {ServiceContainer} from '@e22m4u/js-service';
import {FullPropertyDefinition} from '../property-definition.js';

/**
 * Property validator context.
 */
export type PropertyValidatorContext = {
  validatorName: string,
  modelName: string,
  propName: string,
  propDef: FullPropertyDefinition,
  container: ServiceContainer,
}

/**
 * Property validator.
 */
export type PropertyValidator = (
  value: unknown,
  options: unknown,
  context: PropertyValidatorContext,
) => Promise<boolean> | boolean;

/**
 * Property validate options.
 */
export type PropertyValidateOptions =
  | string
  | string[]
  | {[key: string]: unknown};
