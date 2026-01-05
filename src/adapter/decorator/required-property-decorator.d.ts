import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';

/**
 * Required property decorator.
 */
export declare class RequiredPropertyDecorator extends Service {
  /**
   * Decorate.
   *
   * @param adapter
   */
  decorate(adapter: Adapter): void;
}
