import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/service';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDataSanitizer} from '../../definition/index.js';

/**
 * Data sanitizing decorator.
 */
export class DataSanitizingDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'A first argument of DataSanitizingDecorator.decorate must be ' +
          'an Adapter instance, but %v given.',
        adapter,
      );

    const sanitizer = adapter.getService(ModelDataSanitizer);
    const sanitize = (...args) => sanitizer.sanitize(...args);

    const create = adapter.create;
    adapter.create = async function (modelName, modelData, filter) {
      modelData = sanitize(modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = async function (modelName, id, modelData, filter) {
      modelData = sanitize(modelName, modelData);
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const patchById = adapter.patchById;
    adapter.patchById = async function (modelName, id, modelData, filter) {
      modelData = sanitize(modelName, modelData);
      return patchById.call(this, modelName, id, modelData, filter);
    };
  }
}
