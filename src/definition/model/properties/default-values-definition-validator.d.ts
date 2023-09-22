import {Service} from '@e22m4u/js-service';
import {PropertyDefinitionMap} from '../model-definition.js';

/**
 * Default values definition validator.
 */
export declare class DefaultValuesDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param propDefs
   */
  validate(modelName: string, propDefs: PropertyDefinitionMap): void;
}
