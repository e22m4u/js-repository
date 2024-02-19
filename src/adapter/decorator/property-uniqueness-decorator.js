import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';
import {InvalidArgumentError} from '../../errors/index.js';
import {PropertyUniquenessValidator} from '../../definition/index.js';

/**
 * Property uniqueness decorator.
 */
export class PropertyUniquenessDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'The first argument of PropertyUniquenessDecorator.decorate should be ' +
          'an Adapter instance, but %v given.',
        adapter,
      );
    const validator = this.getService(PropertyUniquenessValidator);

    const create = adapter.create;
    adapter.create = async function (modelName, modelData, filter) {
      const countMethod = adapter.count.bind(adapter, modelName);
      await validator.validate(countMethod, 'create', modelName, modelData);
      return create.call(this, modelName, modelData, filter);
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = async function (modelName, id, modelData, filter) {
      const countMethod = adapter.count.bind(adapter, modelName);
      await validator.validate(
        countMethod,
        'replaceById',
        modelName,
        modelData,
        id,
      );
      return replaceById.call(this, modelName, id, modelData, filter);
    };

    const replaceOrCreate = adapter.replaceOrCreate;
    adapter.replaceOrCreate = async function (modelName, modelData, filter) {
      const countMethod = adapter.count.bind(adapter, modelName);
      await validator.validate(
        countMethod,
        'replaceOrCreate',
        modelName,
        modelData,
      );
      return replaceOrCreate.call(this, modelName, modelData, filter);
    };

    const patch = adapter.patch;
    adapter.patch = async function (modelName, modelData, where) {
      const countMethod = adapter.count.bind(adapter, modelName);
      await validator.validate(countMethod, 'patch', modelName, modelData);
      return patch.call(this, modelName, modelData, where);
    };

    const patchById = adapter.patchById;
    adapter.patchById = async function (modelName, id, modelData, filter) {
      const countMethod = adapter.count.bind(adapter, modelName);
      await validator.validate(
        countMethod,
        'patchById',
        modelName,
        modelData,
        id,
      );
      return patchById.call(this, modelName, id, modelData, filter);
    };
  }
}
