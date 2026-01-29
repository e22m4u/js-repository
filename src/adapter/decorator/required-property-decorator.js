import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../../errors/index.js';
import {RequiredPropertyValidator} from '../../definition/index.js';

/**
 * Required property decorator.
 */
export class RequiredPropertyDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter)) {
      throw new InvalidArgumentError(
        'The first argument of RequiredPropertyDecorator.decorate should be ' +
          'an Adapter instance, but %v was given.',
        adapter,
      );
    }
    const validator = this.getService(RequiredPropertyValidator);

    const create = adapter.create;
    adapter.create = async function (modelName, modelData, filter) {
      validator.validate(modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = async function (modelName, id, modelData, filter) {
      validator.validate(modelName, modelData);
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const replaceOrCreate = adapter.replaceOrCreate;
    adapter.replaceOrCreate = async function (modelName, modelData, filter) {
      validator.validate(modelName, modelData);
      return replaceOrCreate.call(this, modelName, modelData, filter);
    };

    const patch = adapter.patch;
    adapter.patch = async function (modelName, modelData, where) {
      validator.validate(modelName, modelData, true);
      return patch.call(this, modelName, modelData, where);
    };

    const patchById = adapter.patchById;
    adapter.patchById = async function (modelName, id, modelData, filter) {
      validator.validate(modelName, modelData, true);
      return patchById.call(this, modelName, id, modelData, filter);
    };
  }
}
