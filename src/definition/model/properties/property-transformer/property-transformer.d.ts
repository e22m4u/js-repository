import {ValueOrPromise} from '../../../../types.js';

/**
 * Property transformer context.
 */
export declare type PropertyTransformerContext = {
  transformerName: string,
  modelName: string,
  propName: string,
}

/**
 * Property transformer.
 */
export declare type PropertyTransformer = (
  value: unknown,
  options: unknown,
  context: PropertyTransformerContext,
) => ValueOrPromise<unknown>;

/**
 * Property transform options.
 */
export type PropertyTransformOptions =
  | string
  | string[]
  | {[key: string]: unknown};
