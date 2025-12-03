import {Service} from '@e22m4u/js-service';
import {Adapter} from '../adapter.js';

/**
 * Inclusion decorator.
 */
export declare class InclusionDecorator extends Service {
  /**
   * Decorate.
   *
   * @param adapter
   */
  decorate(adapter: Adapter): void;
}
