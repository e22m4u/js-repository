import {Service} from '@e22m4u/service';
import {PropertyDefinitionMap} from '../model-definition';

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
