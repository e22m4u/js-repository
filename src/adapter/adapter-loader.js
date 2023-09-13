import {Adapter} from './adapter.js';
import {Service} from '@e22m4u/service';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Adapter loader.
 */
export class AdapterLoader extends Service {
  /**
   * Load by name.
   *
   * @param {string} adapterName
   * @param {object} settings
   * @return {Promise<any>}
   */
  async loadByName(adapterName, settings = undefined) {
    if (!adapterName || typeof adapterName !== 'string')
      throw new InvalidArgumentError(
        'The adapter name must be a non-empty String, but %v given.',
        adapterName,
      );
    let adapterCtor;
    try {
      const module = await import(`./builtin/${adapterName}-adapter.js`);
      adapterCtor = findAdapterCtorInModule(module);
    } catch (e) {
      /**/
    }
    if (!adapterCtor)
      try {
        const module = await import(
          `@e22m4u/repository-${adapterName}-adapter`
        );
        adapterCtor = findAdapterCtorInModule(module);
      } catch (e) {
        /**/
      }
    if (!adapterCtor)
      throw new InvalidArgumentError(
        'The adapter %v is not found.',
        adapterName,
      );
    return new adapterCtor(this.container, settings);
  }
}

/**
 * Find adapter ctor in module.
 *
 * @param module
 * @return {*}
 */
function findAdapterCtorInModule(module) {
  let adapterCtor;
  if (!module || typeof module !== 'object' || Array.isArray(module)) return;
  for (const ctor of Object.values(module)) {
    if (typeof ctor === 'function' && ctor.prototype instanceof Adapter) {
      adapterCtor = ctor;
      break;
    }
  }
  return adapterCtor;
}
