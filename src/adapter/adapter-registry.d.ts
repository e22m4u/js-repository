import {Adapter} from './adapter';
import {Service} from '@e22m4u/service';

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
