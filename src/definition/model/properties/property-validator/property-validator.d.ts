/**
 * Property validator context.
 */
export type PropertyValidatorContext = {
  validatorName: string,
  modelName: string,
  propName: string,
}

/**
 * Property validator.
 */
export type PropertyValidator = (
  value: unknown,
  options: unknown,
  context: PropertyValidatorContext,
) => boolean;

/**
 * Property validate options.
 */
export type PropertyValidateOptions =
  | (string | PropertyValidator)
  | (string | PropertyValidator)[]
  | {[key: string]: unknown};
