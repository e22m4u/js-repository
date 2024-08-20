import {Adapter} from '../adapter.js';
import {cloneDeep} from '../../utils/index.js';
import {capitalize} from '../../utils/index.js';
import {DataType} from '../../definition/index.js';
import {SliceClauseTool} from '../../filter/index.js';
import {WhereClauseTool} from '../../filter/index.js';
import {OrderClauseTool} from '../../filter/index.js';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDefinitionUtils} from '../../definition/index.js';

/**
 * Memory adapter.
 */
export class MemoryAdapter extends Adapter {
  /**
   * Tables.
   *
   * @type {Map<string, Map<number, Record<string, any>>>}
   */
  _tables = new Map();

  /**
   * Last ids.
   *
   * @type {Map<string, number>}
   */
  _lastIds = new Map();

  /**
   * Get table or create.
   *
   * @param {string} modelName
   * @returns {Map<number, object>}
   */
  _getTableOrCreate(modelName) {
    const tableName =
      this.getService(ModelDefinitionUtils).getTableNameByModelName(modelName);
    let table = this._tables.get(tableName);
    if (table) return table;
    table = new Map();
    this._tables.set(tableName, table);
    return table;
  }

  /**
   * Gen next id value.
   *
   * @param {string} modelName
   * @param {string} propName
   * @returns {number}
   */
  _genNextIdValue(modelName, propName) {
    const propType = this.getService(
      ModelDefinitionUtils,
    ).getDataTypeByPropertyName(modelName, propName);
    if (propType !== DataType.ANY && propType !== DataType.NUMBER)
      throw new InvalidArgumentError(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key %v of the model %v is defined as %s. ' +
          'Do provide your own value for the %v property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
        propName,
        modelName,
        capitalize(propType),
        propName,
      );
    const tableName =
      this.getService(ModelDefinitionUtils).getTableNameByModelName(modelName);
    const lastId = this._lastIds.get(tableName) ?? 0;
    const nextId = lastId + 1;
    this._lastIds.set(tableName, nextId);
    const table = this._getTableOrCreate(modelName);
    const existedIds = Array.from(table.keys());
    if (existedIds.includes(nextId))
      return this._genNextIdValue(modelName, propName);
    return nextId;
  }

  /**
   * Create
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line no-unused-vars
  async create(modelName, modelData, filter = undefined) {
    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    let idValue = modelData[pkPropName];
    if (idValue == null || idValue === '' || idValue === 0) {
      idValue = this._genNextIdValue(modelName, pkPropName);
    }

    const table = this._getTableOrCreate(modelName);
    if (table.has(idValue))
      throw new InvalidArgumentError(
        'The value %v of the primary key %v already exists in the model %v.',
        idValue,
        pkPropName,
        modelName,
      );

    modelData = cloneDeep(modelData);
    modelData[pkPropName] = idValue;

    const tableData = this.getService(
      ModelDefinitionUtils,
    ).convertPropertyNamesToColumnNames(modelName, modelData);
    table.set(idValue, tableData);

    return this.getService(
      ModelDefinitionUtils,
    ).convertColumnNamesToPropertyNames(modelName, tableData);
  }

  /**
   * Replace by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line no-unused-vars
  async replaceById(modelName, id, modelData, filter = undefined) {
    const table = this._getTableOrCreate(modelName);
    const isExists = table.has(id);
    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    if (!isExists)
      throw new InvalidArgumentError(
        'The value %v of the primary key %v does not exist in the model %v.',
        id,
        pkPropName,
        modelName,
      );

    modelData = cloneDeep(modelData);
    modelData[pkPropName] = id;

    const tableData = this.getService(
      ModelDefinitionUtils,
    ).convertPropertyNamesToColumnNames(modelName, modelData);
    table.set(id, tableData);

    return this.getService(
      ModelDefinitionUtils,
    ).convertColumnNamesToPropertyNames(modelName, tableData);
  }

  /**
   * Replace or create.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line no-unused-vars
  async replaceOrCreate(modelName, modelData, filter = undefined) {
    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    let idValue = modelData[pkPropName];
    if (idValue == null || idValue === '' || idValue === 0) {
      idValue = this._genNextIdValue(modelName, pkPropName);
    }

    const table = this._getTableOrCreate(modelName);
    modelData = cloneDeep(modelData);
    modelData[pkPropName] = idValue;

    const tableData = this.getService(
      ModelDefinitionUtils,
    ).convertPropertyNamesToColumnNames(modelName, modelData);
    table.set(idValue, tableData);

    return this.getService(
      ModelDefinitionUtils,
    ).convertColumnNamesToPropertyNames(modelName, tableData);
  }

  /**
   * Patch.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {object|undefined} where
   * @returns {Promise<number>}
   */
  async patch(modelName, modelData, where = undefined) {
    const table = this._getTableOrCreate(modelName);
    const tableItems = Array.from(table.values());
    if (!tableItems.length) return 0;
    let modelItems = tableItems.map(tableItem =>
      this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
        modelName,
        tableItem,
      ),
    );

    if (where && typeof where === 'object')
      modelItems = this.getService(WhereClauseTool).filter(modelItems, where);
    const size = modelItems.length;

    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    modelData = cloneDeep(modelData);
    delete modelData[pkPropName];

    modelItems.forEach(existingModelData => {
      const mergedModelData = Object.assign({}, existingModelData, modelData);
      const mergedTableData = this.getService(
        ModelDefinitionUtils,
      ).convertPropertyNamesToColumnNames(modelName, mergedModelData);
      const idValue = existingModelData[pkPropName];
      table.set(idValue, mergedTableData);
    });
    return size;
  }

  /**
   * Patch by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @param {object} modelData
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line no-unused-vars
  async patchById(modelName, id, modelData, filter = undefined) {
    const table = this._getTableOrCreate(modelName);
    const existingTableData = table.get(id);
    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    if (existingTableData == null)
      throw new InvalidArgumentError(
        'The value %v of the primary key %v does not exist in the model %v.',
        id,
        pkPropName,
        modelName,
      );

    modelData = cloneDeep(modelData);
    delete modelData[pkPropName];

    const existingModelData = this.getService(
      ModelDefinitionUtils,
    ).convertColumnNamesToPropertyNames(modelName, existingTableData);
    const mergedModelData = Object.assign({}, existingModelData, modelData);
    const mergedTableData = this.getService(
      ModelDefinitionUtils,
    ).convertPropertyNamesToColumnNames(modelName, mergedModelData);
    table.set(id, mergedTableData);

    return this.getService(
      ModelDefinitionUtils,
    ).convertColumnNamesToPropertyNames(modelName, mergedTableData);
  }

  /**
   * Find.
   *
   * @param {string} modelName
   * @param {object|undefined} filter
   * @returns {Promise<object[]>}
   */
  async find(modelName, filter = undefined) {
    const table = this._getTableOrCreate(modelName);
    const tableItems = Array.from(table.values());
    let modelItems = tableItems.map(tableItem =>
      this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
        modelName,
        tableItem,
      ),
    );

    if (filter && typeof filter === 'object') {
      if (filter.where)
        modelItems = this.getService(WhereClauseTool).filter(
          modelItems,
          filter.where,
        );
      if (filter.skip || filter.limit)
        modelItems = this.getService(SliceClauseTool).slice(
          modelItems,
          filter.skip,
          filter.limit,
        );
      if (filter.order)
        this.getService(OrderClauseTool).sort(modelItems, filter.order);
    }
    return modelItems;
  }

  /**
   * Find by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @param {object|undefined} filter
   * @returns {Promise<object>}
   */
  // eslint-disable-next-line no-unused-vars
  async findById(modelName, id, filter = undefined) {
    const table = this._getTableOrCreate(modelName);
    const tableData = table.get(id);
    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    if (!tableData)
      throw new InvalidArgumentError(
        'The value %v of the primary key %v does not exist in the model %v.',
        id,
        pkPropName,
        modelName,
      );
    return this.getService(
      ModelDefinitionUtils,
    ).convertColumnNamesToPropertyNames(modelName, tableData);
  }

  /**
   * Delete.
   *
   * @param {string} modelName
   * @param {object|undefined} where
   * @returns {Promise<number>}
   */
  async delete(modelName, where = undefined) {
    const table = this._getTableOrCreate(modelName);
    const tableItems = Array.from(table.values());
    if (!tableItems.length) return 0;
    let modelItems = tableItems.map(tableItem =>
      this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
        modelName,
        tableItem,
      ),
    );

    if (where && typeof where === 'object')
      modelItems = this.getService(WhereClauseTool).filter(modelItems, where);
    const size = modelItems.length;

    const idPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    modelItems.forEach(modelData => {
      const idValue = modelData[idPropName];
      table.delete(idValue);
    });
    return size;
  }

  /**
   * Delete by id.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async deleteById(modelName, id) {
    const table = this._getTableOrCreate(modelName);
    const isExists = table.has(id);
    table.delete(id);
    return isExists;
  }

  /**
   * Exists.
   *
   * @param {string} modelName
   * @param {string|number} id
   * @returns {Promise<boolean>}
   */
  async exists(modelName, id) {
    const table = this._getTableOrCreate(modelName);
    return table.has(id);
  }

  /**
   * Count.
   *
   * @param {string} modelName
   * @param {object|undefined} where
   * @returns {Promise<number>}
   */
  async count(modelName, where = undefined) {
    const table = this._getTableOrCreate(modelName);
    const tableItems = Array.from(table.values());
    let modelItems = tableItems.map(tableItem =>
      this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
        modelName,
        tableItem,
      ),
    );

    if (where && typeof where === 'object')
      modelItems = this.getService(WhereClauseTool).filter(modelItems, where);
    return modelItems.length;
  }
}
