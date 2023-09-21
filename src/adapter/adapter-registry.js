import {Adapter} from './adapter.js';
import {Service} from '@e22m4u/service';
import {AdapterLoader} from './adapter-loader.js';
import {DefinitionRegistry} from '../definition/index.js';

/**
 * Adapter registry.
 */
export class AdapterRegistry extends Service {
  /**
   * Adapters.
   *
   * @type {object}
   */
  _adapters = {};

  /**
   * Get adapter.
   *
   * @param {string} datasourceName
   * @returns {Promise<Adapter>}
   */
  async getAdapter(datasourceName) {
    let adapter = this._adapters[datasourceName];
    if (adapter) return adapter;
    const datasource =
      this.getService(DefinitionRegistry).getDatasource(datasourceName);
    const adapterName = datasource.adapter;
    adapter = await this.getService(AdapterLoader).loadByName(
      adapterName,
      datasource,
    );
    this._adapters[datasourceName] = adapter;
    return adapter;
  }
}
