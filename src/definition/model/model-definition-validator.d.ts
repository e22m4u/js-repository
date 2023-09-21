import {Service} from '@e22m4u/service';
import {ModelDefinition} from './model-definition';

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
