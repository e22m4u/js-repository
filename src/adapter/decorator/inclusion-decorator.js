import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/js-service';
import {IncludeClauseTool} from '../../filter/index.js';
import {InvalidArgumentError} from '../../errors/index.js';

/**
 * Inclusion decorator.
 */
export class InclusionDecorator extends Service {
  /**
   * Decorate.
   *
   * @param {Adapter} adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'The first argument of InclusionDecorator.decorate should be ' +
          'an Adapter instance, but %v was given.',
        adapter,
      );

    const tool = adapter.getService(IncludeClauseTool);
    const includeTo = (...args) => tool.includeTo(...args);

    const create = adapter.create;
    adapter.create = async function (modelName, modelData, filter) {
      const retvalData = await create.call(this, modelName, modelData, filter);
      if (filter && typeof filter === 'object' && filter.include)
        await includeTo([retvalData], modelName, filter.include);
      return retvalData;
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = async function (modelName, id, modelData, filter) {
      const retvalData = await replaceById.call(
        this,
        modelName,
        id,
        modelData,
        filter,
      );
      if (filter && typeof filter === 'object' && filter.include)
        await includeTo([retvalData], modelName, filter.include);
      return retvalData;
    };

    const replaceOrCreate = adapter.replaceOrCreate;
    adapter.replaceOrCreate = async function (modelName, modelData, filter) {
      const retvalData = await replaceOrCreate.call(
        this,
        modelName,
        modelData,
        filter,
      );
      if (filter && typeof filter === 'object' && filter.include)
        await includeTo([retvalData], modelName, filter.include);
      return retvalData;
    };

    const patchById = adapter.patchById;
    adapter.patchById = async function (modelName, id, modelData, filter) {
      const retvalData = await patchById.call(
        this,
        modelName,
        id,
        modelData,
        filter,
      );
      if (filter && typeof filter === 'object' && filter.include)
        await includeTo([retvalData], modelName, filter.include);
      return retvalData;
    };

    const find = adapter.find;
    adapter.find = async function (modelName, filter) {
      const modelItems = await find.call(this, modelName, filter);
      if (filter && typeof filter === 'object' && filter.include)
        await includeTo(modelItems, modelName, filter.include);
      return modelItems;
    };

    const findById = adapter.findById;
    adapter.findById = async function (modelName, id, filter) {
      const retvalData = await findById.call(this, modelName, id, filter);
      if (filter && typeof filter === 'object' && filter.include)
        await includeTo([retvalData], modelName, filter.include);
      return retvalData;
    };
  }
}
