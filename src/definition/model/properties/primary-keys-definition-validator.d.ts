import {Service} from '@e22m4u/js-service';
import {PropertyDefinitionMap} from '../model-definition.js';

/**
 * Primary keys definition validator.
 */
export declare class PrimaryKeysDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param propDefs
   */
  validate(modelName: string, propDefs: PropertyDefinitionMap): void;
}
