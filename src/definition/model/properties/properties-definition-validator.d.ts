import {Service} from '@e22m4u/service';
import {PropertyDefinitionMap} from '../model-definition';

/**
 * Properties definition validator.
 */
export declare class PropertiesDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param propDefs
   */
  validate(modelName: string, propDefs: PropertyDefinitionMap): void;
}
