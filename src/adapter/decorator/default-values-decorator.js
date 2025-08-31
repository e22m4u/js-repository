import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDefinitionUtils} from '../../definition/index.js';

/**
 * Default values decorator.
 */
export class DefaultValuesDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'The first argument of DefaultValuesDecorator.decorate should be ' +
          'an Adapter instance, but %v was given.',
        adapter,
      );

    const utils = adapter.getService(ModelDefinitionUtils);
    const setDefaults = (...args) =>
      utils.setDefaultValuesToEmptyProperties(...args);

    const create = adapter.create;
    adapter.create = function (modelName, modelData, filter) {
      modelData = setDefaults(modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = function (modelName, id, modelData, filter) {
      modelData = setDefaults(modelName, modelData);
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const replaceOrCreate = adapter.replaceOrCreate;
    adapter.replaceOrCreate = function (modelName, modelData, filter) {
      modelData = setDefaults(modelName, modelData);
      return replaceOrCreate.call(this, modelName, modelData, filter);
    };

    const patch = adapter.patch;
    adapter.patch = function (modelName, modelData, where) {
      modelData = setDefaults(modelName, modelData, true);
      return patch.call(this, modelName, modelData, where);
    };

    const patchById = adapter.patchById;
    adapter.patchById = function (modelName, id, modelData, filter) {
      modelData = setDefaults(modelName, modelData, true);
      return patchById.call(this, modelName, id, modelData, filter);
    };

    const find = adapter.find;
    adapter.find = async function (modelName, filter) {
      const modelItems = await find.call(this, modelName, filter);
      return modelItems.map(modelItem => setDefaults(modelName, modelItem));
    };

    const findById = adapter.findById;
    adapter.findById = async function (modelName, id, filter) {
      const retvalData = await findById.call(this, modelName, id, filter);
      return setDefaults(modelName, retvalData);
    };
  }
}
