import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';

/**
 * Data sanitizing decorator.
 */
export declare class DataSanitizingDecorator extends Service {
  /**
   * Decorate.
   *
   * @param adapter
   */
  decorate(adapter: Adapter): void;
}
