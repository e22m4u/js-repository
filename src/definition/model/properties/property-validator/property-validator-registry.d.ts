import {Service} from '@e22m4u/js-service';
import {PropertyValidator} from './property-validator.js';

/**
 * Property validator registry.
 */
export declare class PropertyValidatorRegistry extends Service {
  /**
   * Add validator.
   *
   * @param name
   * @param validator
   */
  addValidator(name: string, validator: PropertyValidator): this;

  /**
   * Has validator.
   *
   * @param name
   */
  hasValidator(name: string): boolean;

  /**
   * Get validator.
   *
   * @param name
   */
  getValidator(name: string): PropertyValidator;
}
