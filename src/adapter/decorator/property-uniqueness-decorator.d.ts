import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';

/**
 * Property uniqueness decorator.
 */
export declare class PropertyUniquenessDecorator extends Service {
  /**
   * Decorate.
   *
   * @param adapter
   */
  decorate(adapter: Adapter): void;
}
