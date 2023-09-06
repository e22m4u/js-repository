import {Service} from '../service/index.js';
import {AdapterLoader} from './adapter-loader.js';
import {DefinitionRegistry} from '../definition/index.js';

/**
 * Adapter registry.
 */
export class AdapterRegistry extends Service {
  /**
   * Adapters.
   *
   * @type {{[name: string]: object}}
   */
  _adapters = {};

  /**
   * Get adapter.
   *
   * @param datasourceName
   * @return {Promise<object>}
   */
  async getAdapter(datasourceName) {
    let adapter = this._adapters[datasourceName];
    if (adapter) return adapter;
    const datasource =
      this.get(DefinitionRegistry).getDatasource(datasourceName);
    const adapterName = datasource.adapter;
    adapter = await this.get(AdapterLoader).loadByName(adapterName, datasource);
    this._adapters[datasourceName] = adapter;
    return adapter;
  }
}
