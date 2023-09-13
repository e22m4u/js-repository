import {Adapter} from '../adapter.js';
import {Service} from '@e22m4u/service';
import {FieldsClauseTool} from '../../filter/index.js';
import {InvalidArgumentError} from '../../errors/index.js';

/**
 * Fields filtering decorator.
 */
export class FieldsFilteringDecorator extends Service {
  /**
   * Decorate.
   *
   * @param adapter
   */
  decorate(adapter) {
    if (!adapter || !(adapter instanceof Adapter))
      throw new InvalidArgumentError(
        'A first argument of FieldsFilteringDecorator.decorate must be ' +
          'an Adapter instance, but %v given.',
        adapter,
      );

    const tool = adapter.getService(FieldsClauseTool);
    const selectFields = (...args) => tool.filter(...args);

    const create = adapter.create;
    adapter.create = async function (modelName, modelData, filter) {
      let result = await create.call(this, modelName, modelData, filter);
      if (filter && typeof filter === 'object' && filter.fields)
        result = selectFields(result, modelName, filter.fields);
      return result;
    };

    const replaceById = adapter.replaceById;
    adapter.replaceById = async function (modelName, id, modelData, filter) {
      let result = await replaceById.call(
        this,
        modelName,
        id,
        modelData,
        filter,
      );
      if (filter && typeof filter === 'object' && filter.fields)
        result = selectFields(result, modelName, filter.fields);
      return result;
    };

    const patchById = adapter.patchById;
    adapter.patchById = async function (modelName, id, modelData, filter) {
      let result = await patchById.call(this, modelName, id, modelData, filter);
      if (filter && typeof filter === 'object' && filter.fields)
        result = selectFields(result, modelName, filter.fields);
      return result;
    };

    const find = adapter.find;
    adapter.find = async function (modelName, filter) {
      let result = await find.call(this, modelName, filter);
      if (filter && typeof filter === 'object' && filter.fields)
        result = selectFields(result, modelName, filter.fields);
      return result;
    };

    const findById = adapter.findById;
    adapter.findById = async function (modelName, id, filter) {
      let result = await findById.call(this, modelName, id, filter);
      if (filter && typeof filter === 'object' && filter.fields)
        result = selectFields(result, modelName, filter.fields);
      return result;
    };
  }
}
