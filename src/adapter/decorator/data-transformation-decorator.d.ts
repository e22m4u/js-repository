import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';

/**
 * Data transformation decorator.
 */
export declare class DataTransformationDecorator extends Service {
  /**
   * Decorate.
   *
   * @param adapter
   */
  decorate(adapter: Adapter): void;
}
