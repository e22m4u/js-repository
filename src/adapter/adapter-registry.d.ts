import {Adapter} from './adapter.js';
import {Service} from '@e22m4u/js-service';

/**
 * Adapter registry.
 */
export declare class AdapterRegistry extends Service {
  /**
   * Get adapter.
   *
   * @param datasourceName
   */
  getAdapter(datasourceName: string): Promise<Adapter>;
}
