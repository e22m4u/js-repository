import {Service} from '@e22m4u/js-service';
import {ModelDefinition} from './model-definition.js';

/**
 * Model definition validator.
 */
export declare class ModelDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelDef
   */
  validate(modelDef: ModelDefinition): void;
}
