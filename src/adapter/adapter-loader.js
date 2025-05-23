import {Adapter} from './adapter.js';
import {Service} from '@e22m4u/js-service';
import {ADAPTER_CLASS_NAME} from './adapter.js';
import {InvalidArgumentError} from '../errors/index.js';

/**
 * Adapter loader.
 */
export class AdapterLoader extends Service {
  /**
   * Load by name.
   *
   * @param {string} adapterName
   * @param {object|undefined} settings
   * @returns {Promise<Adapter>}
   */
  async loadByName(adapterName, settings = undefined) {
    if (!adapterName || typeof adapterName !== 'string')
      throw new InvalidArgumentError(
        'The adapter name should be a non-empty String, but %v given.',
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
          `@e22m4u/js-repository-${adapterName}-adapter`
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
 * @param {object} module
 * @returns {*}
 */
function findAdapterCtorInModule(module) {
  let adapterCtor;
  if (!module || typeof module !== 'object' || Array.isArray(module)) return;
  for (const ctor of Object.values(module)) {
    if (
      typeof ctor === 'function' &&
      Array.isArray(ctor.kinds) &&
      Adapter.kinds.includes(ADAPTER_CLASS_NAME)
    ) {
      adapterCtor = ctor;
      break;
    }
  }
  return adapterCtor;
}
