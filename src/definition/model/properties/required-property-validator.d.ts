import {Service} from '@e22m4u/js-service';

/**
 * Required property validator.
 */
export class RequiredPropertyValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param modelData
   * @param isPartial
   */
  validate(modelName: string, modelData: object, isPartial?: boolean): void;
}
