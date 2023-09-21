import {Adapter} from './adapter';
import {AnyObject} from '../types';
import {Service} from '@e22m4u/service';

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
