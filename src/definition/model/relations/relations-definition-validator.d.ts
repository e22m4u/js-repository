import {Service} from '@e22m4u/js-service';
import {RelationDefinitionMap} from '../model-definition.js';

/**
 * Relations definition validator.
 */
export declare class RelationsDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param relDefs
   */
  validate(modelName: string, relDefs: RelationDefinitionMap): void;
}
