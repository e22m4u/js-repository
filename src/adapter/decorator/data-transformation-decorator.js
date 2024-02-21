import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDataTransformer} from '../../definition/index.js';

/**
 * Data transformation decorator.
 */
export class DataTransformationDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'The first argument of DataTransformerDecorator.decorate should be ' +
          'an Adapter instance, but %v given.',
        adapter,
      );
    const transformer = this.getService(ModelDataTransformer);

    const create = adapter.create;
    adapter.create = function (modelName, modelData, filter) {
      modelData = transformer.transform(modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = function (modelName, id, modelData, filter) {
      modelData = transformer.transform(modelName, modelData);
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const replaceOrCreate = adapter.replaceOrCreate;
    adapter.replaceOrCreate = function (modelName, modelData, filter) {
      modelData = transformer.transform(modelName, modelData);
      return replaceOrCreate.call(this, modelName, modelData, filter);
    };

    const patch = adapter.patch;
    adapter.patch = function (modelName, modelData, where) {
      modelData = transformer.transform(modelName, modelData);
      return patch.call(this, modelName, modelData, where);
    };

    const patchById = adapter.patchById;
    adapter.patchById = function (modelName, id, modelData, filter) {
      modelData = transformer.transform(modelName, modelData);
      return patchById.call(this, modelName, id, modelData, filter);
    };
  }
}
