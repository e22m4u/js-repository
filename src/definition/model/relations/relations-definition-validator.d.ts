import {Service} from '@e22m4u/service';
import {RelationDefinitionMap} from '../model-definition';

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
