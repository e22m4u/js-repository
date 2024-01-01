import {Service} from '@e22m4u/js-service';
import {ModelDefinition} from '../definition/index.js';

/**
 * Model decorator utils.
 */
export declare class ModelDecoratorUtils extends Service {
  /**
   * Has model definition in.
   *
   * @param target
   */
  hasModelDefinitionIn(target: unknown): boolean;

  /**
   * Get model definition from.
   *
   * @param target
   */
  getModelDefinitionFrom(target): ModelDefinition;
}
