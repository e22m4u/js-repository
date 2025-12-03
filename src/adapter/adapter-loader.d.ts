import {Adapter} from './adapter.js';
import {AnyObject} from '../types.js';
import {Service} from '@e22m4u/js-service';

/**
 * Adapter loader.
 */
export declare class AdapterLoader extends Service {
  /**
   * Load by name.
   *
   * @param adapterName
   * @param settings
   */
  loadByName(adapterName: string, settings?: AnyObject): Promise<Adapter>;
}
