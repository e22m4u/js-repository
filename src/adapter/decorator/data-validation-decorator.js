import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDataValidator} from '../../definition/index.js';

/**
 * Data validation decorator.
 */
export class DataValidationDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'A first argument of DataValidationDecorator.decorate must be ' +
          'an Adapter instance, but %v given.',
        adapter,
      );

    const create = adapter.create;
    adapter.create = function (modelName, modelData, filter) {
      this.getService(ModelDataValidator).validate(modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = function (modelName, id, modelData, filter) {
      this.getService(ModelDataValidator).validate(modelName, modelData);
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const patchById = adapter.patchById;
    adapter.patchById = function (modelName, id, modelData, filter) {
      this.getService(ModelDataValidator).validate(modelName, modelData, true);
      return patchById.call(this, modelName, id, modelData, filter);
    };
  }
}
