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
        'The first argument of DataValidationDecorator.decorate should be ' +
          'an Adapter instance, but %v was given.',
        adapter,
      );
    const validator = this.getService(ModelDataValidator);

    const create = adapter.create;
    adapter.create = function (modelName, modelData, filter) {
      validator.validate(modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = function (modelName, id, modelData, filter) {
      validator.validate(modelName, modelData);
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const replaceOrCreate = adapter.replaceOrCreate;
    adapter.replaceOrCreate = function (modelName, modelData, filter) {
      validator.validate(modelName, modelData);
      return replaceOrCreate.call(this, modelName, modelData, filter);
    };

    const patch = adapter.patch;
    adapter.patch = function (modelName, modelData, where) {
      validator.validate(modelName, modelData, true);
      return patch.call(this, modelName, modelData, where);
    };

    const patchById = adapter.patchById;
    adapter.patchById = function (modelName, id, modelData, filter) {
      validator.validate(modelName, modelData, true);
      return patchById.call(this, modelName, id, modelData, filter);
    };
  }
}
