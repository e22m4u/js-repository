import {Service} from '@e22m4u/js-service';
import {PropertyTransformer} from './property-transformer.js';

/**
 * Property transformer registry.
 */
export declare class PropertyTransformerRegistry extends Service {
  /**
   * Add transformer.
   *
   * @param name
   * @param transformer
   */
  addTransformer(name: string, transformer: PropertyTransformer): this;

  /**
   * Has transformer.
   *
   * @param name
   */
  hasTransformer(name: string): boolean;

  /**
   * Get transformer.
   *
   * @param name
   */
  getTransformer(name: string): PropertyTransformer;
}
