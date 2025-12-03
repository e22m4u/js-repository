import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {MemoryAdapter} from './memory-adapter.js';
import {DataType} from '../../definition/index.js';
import {DatabaseSchema} from '../../database-schema.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../../definition/index.js';

describe('MemoryAdapter', function () {
  describe('_getTableOrCreate', function () {
    it('returns an existing table or creates a new', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const A = dbs.getService(MemoryAdapter);
      const table = A._getTableOrCreate('model');
      expect(table).to.be.instanceof(Map);
      const sameTable = A._getTableOrCreate('model');
      expect(table).to.be.eq(sameTable);
    });

    it('uses a model name to find a table, even a table name is specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        tableName: 'myTable',
      });
      const A = dbs.getService(MemoryAdapter);
      const table = A._getTableOrCreate('myModel');
      expect(table).to.be.instanceof(Map);
      const sameTable = A._getTableOrCreate('myModel');
      expect(table).to.be.eq(sameTable);
    });

    it('stores a table by specified table name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        tableName: 'myTable',
      });
      const A = dbs.getService(MemoryAdapter);
      const table = A._getTableOrCreate('myModel');
      expect(table).to.be.instanceof(Map);
      const sameTable = A._tables.get('myTable');
      expect(table).to.be.eq(sameTable);
    });
  });

  describe('_genNextIdValue', function () {
    it('returns an unique number identifier', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const A = dbs.getService(MemoryAdapter);
      const id1 = A._genNextIdValue('model', DEF_PK);
      const id2 = A._genNextIdValue('model', DEF_PK);
      const id3 = A._genNextIdValue('model', DEF_PK);
      expect(id1).to.be.eq(1);
      expect(id2).to.be.eq(2);
      expect(id3).to.be.eq(3);
    });

    it('increments from the the last known identifier', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const A = dbs.getService(MemoryAdapter);
      A._lastIds.set('model', 10);
      const id1 = A._genNextIdValue('model', DEF_PK);
      const id2 = A._genNextIdValue('model', DEF_PK);
      const id3 = A._genNextIdValue('model', DEF_PK);
      expect(id1).to.be.eq(11);
      expect(id2).to.be.eq(12);
      expect(id3).to.be.eq(13);
    });
  });

  describe('_updateLastIdValueIfNeeded', function () {
    it('does nothing when the given identifier is lower or equal', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const A = dbs.getService(MemoryAdapter);
      A._lastIds.set('model', 10);
      A._updateLastIdValueIfNeeded('model', 9);
      A._updateLastIdValueIfNeeded('model', 10);
      const res = A._lastIds.get('model');
      expect(res).to.be.eq(10);
    });

    it('updates the last known identifier if the given identifier is greater', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const A = dbs.getService(MemoryAdapter);
      A._lastIds.set('model', 10);
      A._updateLastIdValueIfNeeded('model', 15);
      const res = A._lastIds.get('model');
      expect(res).to.be.eq(15);
    });

    it('correctly resolves table name from model name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'MyModel', tableName: 'custom_table_name'});
      const A = dbs.getService(MemoryAdapter);
      A._lastIds.set('custom_table_name', 10);
      A._updateLastIdValueIfNeeded('MyModel', 20);
      const res = A._lastIds.get('custom_table_name');
      expect(res).to.be.eq(20);
      expect(A._lastIds.has('MyModel')).to.be.false;
    });
  });

  describe('create', function () {
    it('skips existing values when generating a new identifier for a default primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result1 = await adapter.create('model', {});
      const result2 = await adapter.create('model', {});
      const result3 = await adapter.create('model', {[DEF_PK]: 3});
      const result4 = await adapter.create('model', {});
      expect(result1).to.be.eql({[DEF_PK]: 1});
      expect(result2).to.be.eql({[DEF_PK]: 2});
      expect(result3).to.be.eql({[DEF_PK]: 3});
      expect(result4).to.be.eql({[DEF_PK]: 4});
    });

    it('skips existing values when generating a new identifier for a specified primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result1 = await adapter.create('model', {});
      const result2 = await adapter.create('model', {});
      const result3 = await adapter.create('model', {myId: 3});
      const result4 = await adapter.create('model', {});
      expect(result1).to.be.eql({myId: 1});
      expect(result2).to.be.eql({myId: 2});
      expect(result3).to.be.eql({myId: 3});
      expect(result4).to.be.eql({myId: 4});
    });

    it('generates a new identifier when a value of a primary key has not provided', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10};
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is undefined', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: undefined,
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is null', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: null,
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is an empty string', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: '',
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(idValue).to.be.not.eq('');
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is zero', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: 0,
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(idValue).to.be.not.eq(0);
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier for a primary key of a "number" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result1 = await adapter.create('model', {});
      const result2 = await adapter.create('model', {});
      const result3 = await adapter.create('model', {});
      expect(result1).to.be.eql({myId: 1});
      expect(result2).to.be.eql({myId: 2});
      expect(result3).to.be.eql({myId: 3});
    });

    it('generates a new identifier for a primary key of an "any" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.ANY,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result1 = await adapter.create('model', {});
      const result2 = await adapter.create('model', {});
      const result3 = await adapter.create('model', {});
      expect(result1).to.be.eql({myId: 1});
      expect(result2).to.be.eql({myId: 2});
      expect(result3).to.be.eql({myId: 3});
    });

    it('throws an error when generating a new value for a primary key of a "string" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.STRING,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.create('model', {foo: 'string', bar: 10});
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as String. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('throws an error when generating a new value for a primary key of a "boolean" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.BOOLEAN,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.create('model', {foo: 'string', bar: 10});
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as Boolean. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('throws an error when generating a new value for a primary key of an "array" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.ARRAY,
            itemType: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.create('model', {});
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as Array. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('throws an error when generating a new value for a primary key of an "object" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.OBJECT,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.create('model', {});
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as Object. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('allows to specify an identifier value for a new item', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const idValue = 5;
      const input = {foo: 'string', bar: 10};
      const created = await adapter.create('model', {
        [DEF_PK]: idValue,
        ...input,
      });
      expect(created).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('throws an error if a given identifier value already exists', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {foo: 'string'});
      const promise = adapter.create('model', created);
      await expect(promise).to.be.rejectedWith(
        format(
          'The value 1 of the primary key %v already exists in the model "model".',
          DEF_PK,
        ),
      );
    });

    it('sets default values if they are not provided for a new item', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 10,
          },
          bar: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 10, bar: 'string'};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets default values for properties provided with an undefined value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {foo: undefined});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets default values for properties provided with a null value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {foo: null});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'bar',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      expect(created).to.be.eql({foo: created.foo});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(created.foo);
      expect(tableData).to.be.eql({bar: created.foo});
    });

    it('uses a specified column name for a regular property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'bar',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {foo: 10});
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({[DEF_PK]: idValue, foo: 10});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, bar: 10});
    });

    it('uses a specified column name for a regular property with a default value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'bar',
            default: 10,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({[DEF_PK]: idValue, foo: 10});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, bar: 10});
    });

    it('uses a short form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10};
      const filter = {fields: 'foo'};
      const result = await adapter.create('model', input, filter);
      expect(result).to.be.eql({[DEF_PK]: result[DEF_PK], foo: input.foo});
    });

    it('uses a full form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
          baz: DataType.BOOLEAN,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const filter = {fields: ['foo', 'bar']};
      const result = await adapter.create('model', input, filter);
      expect(result).to.be.eql({
        [DEF_PK]: result[DEF_PK],
        foo: input.foo,
        bar: input.bar,
      });
    });

    it('a fields clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const filter = {fields: ['foo', 'bar']};
      const result = await adapter.create('model', input, filter);
      expect(result).to.be.eql({
        [DEF_PK]: result[DEF_PK],
        foo: input.foo,
        bar: input.bar,
      });
    });
  });

  describe('replaceById', function () {
    it('removes properties when replacing an item by a given identifier', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 1, bar: 2};
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({[DEF_PK]: idValue, ...input});
      const replaced = await adapter.replaceById('model', idValue, {foo: 2});
      expect(replaced).to.be.eql({[DEF_PK]: idValue, foo: 2});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, foo: 2});
    });

    it('ignores identifier value in a given data in case of a default primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const createdModelData = await adapter.create('model', {[DEF_PK]: 10});
      expect(createdModelData).to.be.eql({[DEF_PK]: 10});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(10);
      expect(createdTableData).to.be.eql({[DEF_PK]: 10});
      const replacedModelData = await adapter.replaceById('model', 10, {
        [DEF_PK]: 20,
      });
      expect(replacedModelData).to.be.eql({[DEF_PK]: 10});
      const replacedTableData = table.get(10);
      expect(replacedTableData).to.be.eql({[DEF_PK]: 10});
    });

    it('ignores identifier value in a given data in case of a specified primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const createdModelData = await adapter.create('model', {myId: 10});
      expect(createdModelData).to.be.eql({myId: 10});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(10);
      expect(createdTableData).to.be.eql({myId: 10});
      const replacedModelData = await adapter.replaceById('model', 10, {
        myId: 20,
      });
      expect(replacedModelData).to.be.eql({myId: 10});
      const replacedTableData = table.get(10);
      expect(replacedTableData).to.be.eql({myId: 10});
    });

    it('sets a default values for removed properties when replacing an item', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const replacing = {foo: 2};
      const replaced = await adapter.replaceById('model', idValue, replacing);
      expect(replaced).to.be.eql({
        [DEF_PK]: idValue,
        ...defaults,
        ...replacing,
      });
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({
        [DEF_PK]: idValue,
        ...defaults,
        ...replacing,
      });
    });

    it('sets a default values for replaced properties with an undefined value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const replaced = await adapter.replaceById('model', idValue, {
        foo: undefined,
      });
      expect(replaced).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets a default values for replaced properties with a null value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const replaced = await adapter.replaceById('model', idValue, {
        foo: null,
      });
      expect(replaced).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('throws an error if a given identifier does not exist', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.replaceById('model', 1, {foo: 2});
      await expect(promise).to.be.rejectedWith(
        format(
          'The value 1 of the primary key %v does not exist in the model "model".',
          DEF_PK,
        ),
      );
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'qux',
          },
          bar: DataType.NUMBER,
          baz: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {bar: 1, baz: 2};
      const createdModelData = await adapter.create('model', input);
      expect(createdModelData).to.be.eql({
        foo: createdModelData.foo,
        ...input,
      });
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(createdModelData.foo);
      expect(createdTableData).to.be.eql({
        qux: createdModelData.foo,
        ...input,
      });
      const replacing = {bar: 2};
      const replacedModelData = await adapter.replaceById(
        'model',
        createdModelData.foo,
        replacing,
      );
      expect(replacedModelData).to.be.eql({
        foo: createdModelData.foo,
        ...replacing,
      });
      const replacedTableData = table.get(createdModelData.foo);
      expect(replacedTableData).to.be.eql({
        qux: createdModelData.foo,
        ...replacing,
      });
    });

    it('uses a specified column name for a regular property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'baz',
          },
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 1, bar: 2};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: input.foo,
        bar: input.bar,
      });
      const replacing = {foo: 2};
      const replacedModelData = await adapter.replaceById(
        'model',
        idValue,
        replacing,
      );
      expect(replacedModelData).to.be.eql({[DEF_PK]: idValue, ...replacing});
      const replacedTableData = table.get(idValue);
      expect(replacedTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: replacing.foo,
      });
    });

    it('uses a specified column name for a regular property with a default value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'baz',
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const createdModelData = await adapter.create('model', {});
      const idValue = createdModelData[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: defaults.foo,
        bar: defaults.bar,
      });
      const replacing = {foo: 2};
      const replacedModelData = await adapter.replaceById(
        'model',
        idValue,
        replacing,
      );
      expect(replacedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: replacing.foo,
        bar: defaults.bar,
      });
      const replacedTableData = table.get(idValue);
      expect(replacedTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: replacing.foo,
        bar: defaults.bar,
      });
    });

    it('allows to specify a short form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...input});
      const replacedModelData = await adapter.replaceById(
        'model',
        idValue,
        input,
        {fields: 'foo'},
      );
      expect(replacedModelData).to.be.eql({[DEF_PK]: idValue, foo: input.foo});
      const replacedTableData = table.get(idValue);
      expect(replacedTableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('allows to specify a full form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
          baz: DataType.BOOLEAN,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...input});
      const replacedModelData = await adapter.replaceById(
        'model',
        idValue,
        input,
        {fields: ['foo', 'bar']},
      );
      expect(replacedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: input.bar,
      });
      const replacedTableData = table.get(idValue);
      expect(replacedTableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('a fields clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({
        [DEF_PK]: idValue,
        fooCol: input.foo,
        barCol: input.bar,
        bazCol: input.baz,
      });
      const replacedModelData = await adapter.replaceById(
        'model',
        idValue,
        input,
        {fields: ['foo', 'bar']},
      );
      expect(replacedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: input.bar,
      });
      const replacedTableData = table.get(idValue);
      expect(replacedTableData).to.be.eql({
        [DEF_PK]: idValue,
        fooCol: input.foo,
        barCol: input.bar,
        bazCol: input.baz,
      });
    });
  });

  describe('replaceOrCreate', function () {
    it('generates a new identifier when a value of a primary key has not provided', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10};
      const created = await adapter.replaceOrCreate('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is undefined', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: undefined,
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.replaceOrCreate('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is null', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: null,
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.replaceOrCreate('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is an empty string', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: '',
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.replaceOrCreate('model', input);
      const idValue = created[DEF_PK];
      expect(idValue).to.be.not.eq('');
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier when a value of a primary key is zero', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {
        [DEF_PK]: 0,
        foo: 'string',
        bar: 10,
      };
      const created = await adapter.replaceOrCreate('model', input);
      const idValue = created[DEF_PK];
      expect(idValue).to.be.not.eq(0);
      expect(created).to.be.eql({...input, [DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...input, [DEF_PK]: idValue});
    });

    it('generates a new identifier for a primary key of a "number" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result1 = await adapter.replaceOrCreate('model', {});
      const result2 = await adapter.replaceOrCreate('model', {});
      const result3 = await adapter.replaceOrCreate('model', {});
      expect(result1).to.be.eql({myId: 1});
      expect(result2).to.be.eql({myId: 2});
      expect(result3).to.be.eql({myId: 3});
    });

    it('generates a new identifier for a primary key of an "any" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.ANY,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result1 = await adapter.replaceOrCreate('model', {});
      const result2 = await adapter.replaceOrCreate('model', {});
      const result3 = await adapter.replaceOrCreate('model', {});
      expect(result1).to.be.eql({myId: 1});
      expect(result2).to.be.eql({myId: 2});
      expect(result3).to.be.eql({myId: 3});
    });

    it('throws an error when generating a new value for a primary key of a "string" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.STRING,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.replaceOrCreate('model', {
        foo: 'string',
        bar: 10,
      });
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as String. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('throws an error when generating a new value for a primary key of a "boolean" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.BOOLEAN,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.replaceOrCreate('model', {
        foo: 'string',
        bar: 10,
      });
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as Boolean. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('throws an error when generating a new value for a primary key of an "array" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.ARRAY,
            itemType: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.replaceOrCreate('model', {});
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as Array. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('throws an error when generating a new value for a primary key of an "object" type', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.OBJECT,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.replaceOrCreate('model', {});
      await expect(promise).to.be.rejectedWith(
        'The memory adapter able to generate only Number identifiers, ' +
          'but the primary key "myId" of the model "model" is defined as Object. ' +
          'Do provide your own value for the "myId" property, or change the type ' +
          'in the primary key definition to a Number that will be ' +
          'generated automatically.',
      );
    });

    it('allows to specify an identifier value for a new item', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const idValue = 5;
      const input = {foo: 'string', bar: 10};
      const created = await adapter.replaceOrCreate('model', {
        [DEF_PK]: idValue,
        ...input,
      });
      expect(created).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('sets default values if they are not provided for a new item', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 10,
          },
          bar: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.replaceOrCreate('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 10, bar: 'string'};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets default values for properties provided with an undefined value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.replaceOrCreate('model', {foo: undefined});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets default values for properties provided with a null value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.replaceOrCreate('model', {foo: null});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'bar',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.replaceOrCreate('model', {});
      expect(created).to.be.eql({foo: created.foo});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(created.foo);
      expect(tableData).to.be.eql({bar: created.foo});
    });

    it('uses a specified column name for a regular property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'bar',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.replaceOrCreate('model', {foo: 10});
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({[DEF_PK]: idValue, foo: 10});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, bar: 10});
    });

    it('uses a specified column name for a regular property with a default value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'bar',
            default: 10,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.replaceOrCreate('model', {});
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({[DEF_PK]: idValue, foo: 10});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, bar: 10});
    });

    it('uses a short form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10};
      const filter = {fields: 'foo'};
      const result = await adapter.replaceOrCreate('model', input, filter);
      expect(result).to.be.eql({[DEF_PK]: result[DEF_PK], foo: input.foo});
    });

    it('uses a full form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
          baz: DataType.BOOLEAN,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const filter = {fields: ['foo', 'bar']};
      const result = await adapter.replaceOrCreate('model', input, filter);
      expect(result).to.be.eql({
        [DEF_PK]: result[DEF_PK],
        foo: input.foo,
        bar: input.bar,
      });
    });

    it('a fields clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const filter = {fields: ['foo', 'bar']};
      const result = await adapter.replaceOrCreate('model', input, filter);
      expect(result).to.be.eql({
        [DEF_PK]: result[DEF_PK],
        foo: input.foo,
        bar: input.bar,
      });
    });

    it('removes properties when replacing an item by a given identifier', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 1, bar: 2};
      const created = await adapter.create('model', input);
      const idValue = created[DEF_PK];
      expect(created).to.be.eql({[DEF_PK]: idValue, ...input});
      const replacement = {[DEF_PK]: idValue, foo: 2};
      const replaced = await adapter.replaceOrCreate('model', replacement);
      expect(replaced).to.be.eql(replacement);
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql(replacement);
    });

    it('sets a default values for removed properties when replacing an item', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const replacement = {[DEF_PK]: idValue, foo: 2};
      const replaced = await adapter.replaceOrCreate('model', replacement);
      expect(replaced).to.be.eql({...defaults, ...replacement});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({...defaults, ...replacement});
    });

    it('sets a default values for replaced properties with an undefined value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const replaced = await adapter.replaceOrCreate('model', {
        [DEF_PK]: idValue,
        foo: undefined,
      });
      expect(replaced).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets a default values for replaced properties with a null value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(created).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const replaced = await adapter.replaceOrCreate('model', {
        [DEF_PK]: idValue,
        foo: null,
      });
      expect(replaced).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });
  });

  describe('patch', function () {
    it('updates only provided properties for all items and returns their number', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {foo: 'd1'});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'd1', bar: 'a2'},
        {[DEF_PK]: id2, foo: 'd1', bar: 'b2'},
        {[DEF_PK]: id3, foo: 'd1', bar: 'c2'},
      ]);
    });

    it('does not throw an error if a partial data does not have required property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {foo: 'd1'});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'd1', bar: 'a2'},
        {[DEF_PK]: id2, foo: 'd1', bar: 'b2'},
        {[DEF_PK]: id3, foo: 'd1', bar: 'c2'},
      ]);
    });

    it('ignores identifier value in a given data in case of a default primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {[DEF_PK]: 100, foo: 'd1'});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'd1', bar: 'a2'},
        {[DEF_PK]: id2, foo: 'd1', bar: 'b2'},
        {[DEF_PK]: id3, foo: 'd1', bar: 'c2'},
      ]);
    });

    it('ignores identifier value in a given data in case of a specified primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1.myId;
      const id2 = created2.myId;
      const id3 = created3.myId;
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {myId: id1, ...input1},
        {myId: id2, ...input2},
        {myId: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {myId: 100, foo: 'd1'});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {myId: id1, foo: 'd1', bar: 'a2'},
        {myId: id2, foo: 'd1', bar: 'b2'},
        {myId: id3, foo: 'd1', bar: 'c2'},
      ]);
    });

    it('sets a default values for patched properties with an undefined value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'fooVal',
          },
          bar: {
            type: DataType.STRING,
            default: 'barVal',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {foo: undefined});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'fooVal', bar: 'a2'},
        {[DEF_PK]: id2, foo: 'fooVal', bar: 'b2'},
        {[DEF_PK]: id3, foo: 'fooVal', bar: 'c2'},
      ]);
    });

    it('sets a default values for patched properties with a null value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'fooVal',
          },
          bar: {
            type: DataType.STRING,
            default: 'barVal',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {foo: null});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'fooVal', bar: 'a2'},
        {[DEF_PK]: id2, foo: 'fooVal', bar: 'b2'},
        {[DEF_PK]: id3, foo: 'fooVal', bar: 'c2'},
      ]);
    });

    it('uses a specified column name for a regular property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.STRING,
            columnName: 'barCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, fooCol: 'a1', barCol: 'a2'},
        {[DEF_PK]: id2, fooCol: 'b1', barCol: 'b2'},
        {[DEF_PK]: id3, fooCol: 'c1', barCol: 'c2'},
      ]);
      const result = await adapter.patch('model', {foo: 'd1'});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, fooCol: 'd1', barCol: 'a2'},
        {[DEF_PK]: id2, fooCol: 'd1', barCol: 'b2'},
        {[DEF_PK]: id3, fooCol: 'd1', barCol: 'c2'},
      ]);
    });

    it('uses a specified column name for a regular property with a default value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
            default: 'fooVal',
          },
          bar: {
            type: DataType.STRING,
            columnName: 'barCol',
            default: 'barVal',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, fooCol: 'a1', barCol: 'a2'},
        {[DEF_PK]: id2, fooCol: 'b1', barCol: 'b2'},
        {[DEF_PK]: id3, fooCol: 'c1', barCol: 'c2'},
      ]);
      const result = await adapter.patch('model', {foo: undefined});
      expect(result).to.be.eq(3);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, fooCol: 'fooVal', barCol: 'a2'},
        {[DEF_PK]: id2, fooCol: 'fooVal', barCol: 'b2'},
        {[DEF_PK]: id3, fooCol: 'fooVal', barCol: 'c2'},
      ]);
    });

    it('returns zero if nothing matched by the "where" clause', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a1', bar: 'a2'};
      const input2 = {foo: 'b1', bar: 'b2'};
      const input3 = {foo: 'c1', bar: 'c2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {foo: 'test'}, {baz: 'd3'});
      expect(result).to.be.eq(0);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'a1', bar: 'a2'},
        {[DEF_PK]: id2, foo: 'b1', bar: 'b2'},
        {[DEF_PK]: id3, foo: 'c1', bar: 'c2'},
      ]);
    });

    it('uses the "where" clause to patch specific items', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a', bar: '1'};
      const input2 = {foo: 'b', bar: '2'};
      const input3 = {foo: 'c', bar: '2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, ...input1},
        {[DEF_PK]: id2, ...input2},
        {[DEF_PK]: id3, ...input3},
      ]);
      const result = await adapter.patch('model', {foo: 'd'}, {bar: '2'});
      expect(result).to.be.eq(2);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, foo: 'a', bar: '1'},
        {[DEF_PK]: id2, foo: 'd', bar: '2'},
        {[DEF_PK]: id3, foo: 'd', bar: '2'},
      ]);
    });

    it('the "where" clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.STRING,
            columnName: 'barCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 'a', bar: '1'};
      const input2 = {foo: 'b', bar: '2'};
      const input3 = {foo: 'c', bar: '2'};
      const created1 = await adapter.create('model', input1);
      const created2 = await adapter.create('model', input2);
      const created3 = await adapter.create('model', input3);
      const id1 = created1[DEF_PK];
      const id2 = created2[DEF_PK];
      const id3 = created3[DEF_PK];
      const table = adapter._getTableOrCreate('model');
      const createdItems = Array.from(table.values());
      expect(createdItems).to.be.eql([
        {[DEF_PK]: id1, fooCol: 'a', barCol: '1'},
        {[DEF_PK]: id2, fooCol: 'b', barCol: '2'},
        {[DEF_PK]: id3, fooCol: 'c', barCol: '2'},
      ]);
      const result = await adapter.patch('model', {foo: 'd'}, {bar: '2'});
      expect(result).to.be.eq(2);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: id1, fooCol: 'a', barCol: '1'},
        {[DEF_PK]: id2, fooCol: 'd', barCol: '2'},
        {[DEF_PK]: id3, fooCol: 'd', barCol: '2'},
      ]);
    });

    it('the "where" clause uses a persisted data instead of default values in case of undefined', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: {
            type: DataType.STRING,
            default: 'barVal',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {[DEF_PK]: 1, foo: 'a', bar: undefined};
      const input2 = {[DEF_PK]: 2, foo: 'b', bar: undefined};
      const input3 = {[DEF_PK]: 3, foo: 'c', bar: 10};
      const input4 = {[DEF_PK]: 4, foo: 'd', bar: null};
      const table = adapter._getTableOrCreate('model');
      table.set(input1[DEF_PK], input1);
      table.set(input2[DEF_PK], input2);
      table.set(input3[DEF_PK], input3);
      table.set(input4[DEF_PK], input4);
      const result = await adapter.patch('model', {foo: 'e'}, {bar: undefined});
      expect(result).to.be.eq(2);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: 1, foo: 'e', bar: undefined},
        {[DEF_PK]: 2, foo: 'e', bar: undefined},
        {[DEF_PK]: 3, foo: 'c', bar: 10},
        {[DEF_PK]: 4, foo: 'd', bar: null},
      ]);
    });

    it('the "where" clause uses a persisted data instead of default values in case of null', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: {
            type: DataType.STRING,
            default: 'barVal',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {[DEF_PK]: 1, foo: 'a', bar: undefined};
      const input2 = {[DEF_PK]: 2, foo: 'b', bar: undefined};
      const input3 = {[DEF_PK]: 3, foo: 'c', bar: 10};
      const input4 = {[DEF_PK]: 4, foo: 'd', bar: null};
      const table = adapter._getTableOrCreate('model');
      table.set(input1[DEF_PK], input1);
      table.set(input2[DEF_PK], input2);
      table.set(input3[DEF_PK], input3);
      table.set(input4[DEF_PK], input4);
      const result = await adapter.patch('model', {foo: 'e'}, {bar: null});
      expect(result).to.be.eq(1);
      const patchedItems = Array.from(table.values());
      expect(patchedItems).to.be.eql([
        {[DEF_PK]: 1, foo: 'a', bar: undefined},
        {[DEF_PK]: 2, foo: 'b', bar: undefined},
        {[DEF_PK]: 3, foo: 'c', bar: 10},
        {[DEF_PK]: 4, foo: 'e', bar: null},
      ]);
    });
  });

  describe('patchById', function () {
    it('updates only provided properties by a given identifier', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 1, bar: 2};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...input});
      const patch = {foo: 20};
      const patchedModelData = await adapter.patchById('model', idValue, patch);
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: patch.foo,
        bar: input.bar,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({
        [DEF_PK]: idValue,
        foo: patch.foo,
        bar: input.bar,
      });
    });

    it('does not throw an error if a partial data does not have required property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            required: true,
          },
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 1, bar: 2};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...input});
      const patch = {bar: 20};
      const patchedModelData = await adapter.patchById('model', idValue, patch);
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: patch.bar,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: patch.bar,
      });
    });

    it('ignores identifier value in a given data in case of a default primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const idValue = 10;
      const createdModelData = await adapter.create('model', {
        [DEF_PK]: idValue,
      });
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue});
      const patchedModelData = await adapter.patchById('model', idValue, {
        [DEF_PK]: 20,
      });
      expect(patchedModelData).to.be.eql({[DEF_PK]: idValue});
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({[DEF_PK]: idValue});
    });

    it('ignores identifier value in a given data in case of a specified primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const idValue = 10;
      const createdModelData = await adapter.create('model', {myId: idValue});
      expect(createdModelData).to.be.eql({myId: idValue});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({myId: idValue});
      const patchedModelData = await adapter.patchById('model', idValue, {
        myId: 20,
      });
      expect(patchedModelData).to.be.eql({myId: idValue});
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({myId: idValue});
    });

    it('sets a default values for patched properties with an undefined value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const createdModelData = await adapter.create('model', {});
      const idValue = createdModelData[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const patchedModelData = await adapter.patchById('model', idValue, {
        foo: undefined,
      });
      expect(patchedModelData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('sets a default values for patched properties with a null value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const createdModelData = await adapter.create('model', {});
      const idValue = createdModelData[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const patchedModelData = await adapter.patchById('model', idValue, {
        foo: null,
      });
      expect(patchedModelData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('throws an error if a given identifier does not exist', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.patchById('model', 1, {foo: 2});
      await expect(promise).to.be.rejectedWith(
        format(
          'The value 1 of the primary key %v does not exist in the model "model".',
          DEF_PK,
        ),
      );
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'qux',
          },
          bar: DataType.NUMBER,
          baz: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {bar: 1, baz: 2};
      const createdModelData = await adapter.create('model', input);
      expect(createdModelData).to.be.eql({foo: createdModelData.foo, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(createdModelData.foo);
      expect(createdTableData).to.be.eql({qux: createdModelData.foo, ...input});
      const patching = {bar: 2};
      const patchedModelData = await adapter.patchById(
        'model',
        createdModelData.foo,
        patching,
      );
      expect(patchedModelData).to.be.eql({
        foo: createdModelData.foo,
        bar: patching.bar,
        baz: input.baz,
      });
      const patchedTableData = table.get(createdModelData.foo);
      expect(patchedTableData).to.be.eql({
        qux: createdModelData.foo,
        bar: patching.bar,
        baz: input.baz,
      });
    });

    it('uses a specified column name for a regular property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'baz',
          },
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 1, bar: 2};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: input.foo,
        bar: input.bar,
      });
      const patching = {foo: 2};
      const patchedModelData = await adapter.patchById(
        'model',
        idValue,
        patching,
      );
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: patching.foo,
        bar: input.bar,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: patching.foo,
        bar: input.bar,
      });
    });

    it('uses a specified column name for a regular property with a default value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'baz',
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const createdModelData = await adapter.create('model', {});
      const idValue = createdModelData[DEF_PK];
      const defaults = {foo: 1, bar: 2};
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...defaults});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: defaults.foo,
        bar: defaults.bar,
      });
      const patching = {foo: 2};
      const patchedModelData = await adapter.patchById(
        'model',
        idValue,
        patching,
      );
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: patching.foo,
        bar: defaults.bar,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({
        [DEF_PK]: idValue,
        baz: patching.foo,
        bar: defaults.bar,
      });
    });

    it('allows to specify a short form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...input});
      const patchedModelData = await adapter.patchById(
        'model',
        idValue,
        input,
        {fields: 'foo'},
      );
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('allows to specify a full form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
          baz: DataType.BOOLEAN,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({[DEF_PK]: idValue, ...input});
      const patchedModelData = await adapter.patchById(
        'model',
        idValue,
        input,
        {fields: ['foo', 'bar']},
      );
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: input.bar,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('a fields clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      const createdModelData = await adapter.create('model', input);
      const idValue = createdModelData[DEF_PK];
      expect(createdModelData).to.be.eql({[DEF_PK]: idValue, ...input});
      const table = adapter._getTableOrCreate('model');
      const createdTableData = table.get(idValue);
      expect(createdTableData).to.be.eql({
        [DEF_PK]: idValue,
        fooCol: input.foo,
        barCol: input.bar,
        bazCol: input.baz,
      });
      const patchedModelData = await adapter.patchById(
        'model',
        idValue,
        input,
        {fields: ['foo', 'bar']},
      );
      expect(patchedModelData).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: input.bar,
      });
      const patchedTableData = table.get(idValue);
      expect(patchedTableData).to.be.eql({
        [DEF_PK]: idValue,
        fooCol: input.foo,
        barCol: input.bar,
        bazCol: input.baz,
      });
    });
  });

  describe('find', function () {
    it('returns an empty array if a table does not have an items', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result = await adapter.find('model');
      expect(result).to.be.instanceof(Array);
      expect(result).to.be.empty;
    });

    it('returns an array of table items', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      const result = await adapter.find('model');
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({[DEF_PK]: 1});
      expect(result[1]).to.be.eql({[DEF_PK]: 2});
      expect(result[2]).to.be.eql({[DEF_PK]: 3});
    });

    it('uses default values for non-existent properties', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1});
      table.set(2, {[DEF_PK]: 2});
      table.set(3, {[DEF_PK]: 3});
      const result = await adapter.find('model');
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({[DEF_PK]: 1, foo: 'string'});
      expect(result[1]).to.be.eql({[DEF_PK]: 2, foo: 'string'});
      expect(result[2]).to.be.eql({[DEF_PK]: 3, foo: 'string'});
      const tableItems = Array.from(table.values());
      expect(tableItems).to.have.lengthOf(3);
      expect(tableItems[0]).to.be.eql({[DEF_PK]: 1});
      expect(tableItems[1]).to.be.eql({[DEF_PK]: 2});
      expect(tableItems[2]).to.be.eql({[DEF_PK]: 3});
    });

    it('uses default values for properties of an undefined', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1, foo: undefined});
      table.set(2, {[DEF_PK]: 2, foo: undefined});
      table.set(3, {[DEF_PK]: 3, foo: undefined});
      const result = await adapter.find('model');
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({[DEF_PK]: 1, foo: 'string'});
      expect(result[1]).to.be.eql({[DEF_PK]: 2, foo: 'string'});
      expect(result[2]).to.be.eql({[DEF_PK]: 3, foo: 'string'});
      const tableItems = Array.from(table.values());
      expect(tableItems).to.have.lengthOf(3);
      expect(tableItems[0]).to.be.eql({[DEF_PK]: 1, foo: undefined});
      expect(tableItems[1]).to.be.eql({[DEF_PK]: 2, foo: undefined});
      expect(tableItems[2]).to.be.eql({[DEF_PK]: 3, foo: undefined});
    });

    it('uses default values for properties of a null', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1, foo: null});
      table.set(2, {[DEF_PK]: 2, foo: null});
      table.set(3, {[DEF_PK]: 3, foo: null});
      const result = await adapter.find('model');
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({[DEF_PK]: 1, foo: 'string'});
      expect(result[1]).to.be.eql({[DEF_PK]: 2, foo: 'string'});
      expect(result[2]).to.be.eql({[DEF_PK]: 3, foo: 'string'});
      const tableItems = Array.from(table.values());
      expect(tableItems).to.have.lengthOf(3);
      expect(tableItems[0]).to.be.eql({[DEF_PK]: 1, foo: null});
      expect(tableItems[1]).to.be.eql({[DEF_PK]: 2, foo: null});
      expect(tableItems[2]).to.be.eql({[DEF_PK]: 3, foo: null});
    });

    it('allows to specify a short form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string1', bar: 10};
      await adapter.create('model', input);
      await adapter.create('model', input);
      await adapter.create('model', input);
      const result = await adapter.find('model', {fields: 'foo'});
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({[DEF_PK]: 1, foo: input.foo});
      expect(result[1]).to.be.eql({[DEF_PK]: 2, foo: input.foo});
      expect(result[2]).to.be.eql({[DEF_PK]: 3, foo: input.foo});
      const table = adapter._getTableOrCreate('model');
      const tableItems = Array.from(table.values());
      expect(tableItems).to.have.lengthOf(3);
      expect(tableItems[0]).to.be.eql({[DEF_PK]: 1, ...input});
      expect(tableItems[1]).to.be.eql({[DEF_PK]: 2, ...input});
      expect(tableItems[2]).to.be.eql({[DEF_PK]: 3, ...input});
    });

    it('allows to specify a full form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
          baz: DataType.BOOLEAN,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string1', bar: 10, baz: true};
      await adapter.create('model', input);
      await adapter.create('model', input);
      await adapter.create('model', input);
      const result = await adapter.find('model', {fields: ['foo', 'bar']});
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({
        [DEF_PK]: 1,
        foo: input.foo,
        bar: input.bar,
      });
      expect(result[1]).to.be.eql({
        [DEF_PK]: 2,
        foo: input.foo,
        bar: input.bar,
      });
      expect(result[2]).to.be.eql({
        [DEF_PK]: 3,
        foo: input.foo,
        bar: input.bar,
      });
      const table = adapter._getTableOrCreate('model');
      const tableItems = Array.from(table.values());
      expect(tableItems).to.have.lengthOf(3);
      expect(tableItems[0]).to.be.eql({[DEF_PK]: 1, ...input});
      expect(tableItems[1]).to.be.eql({[DEF_PK]: 2, ...input});
      expect(tableItems[2]).to.be.eql({[DEF_PK]: 3, ...input});
    });

    it('a fields clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {foo: 'string', bar: 10, baz: true};
      await adapter.create('model', input);
      await adapter.create('model', input);
      await adapter.create('model', input);
      const result = await adapter.find('model', {fields: ['foo', 'bar']});
      expect(result).to.be.instanceof(Array);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.be.eql({
        [DEF_PK]: 1,
        foo: input.foo,
        bar: input.bar,
      });
      expect(result[1]).to.be.eql({
        [DEF_PK]: 2,
        foo: input.foo,
        bar: input.bar,
      });
      expect(result[2]).to.be.eql({
        [DEF_PK]: 3,
        foo: input.foo,
        bar: input.bar,
      });
      const table = adapter._getTableOrCreate('model');
      const tableItems = Array.from(table.values());
      const tableInput = {fooCol: 'string', barCol: 10, bazCol: true};
      expect(tableItems).to.have.lengthOf(3);
      expect(tableItems[0]).to.be.eql({[DEF_PK]: 1, ...tableInput});
      expect(tableItems[1]).to.be.eql({[DEF_PK]: 2, ...tableInput});
      expect(tableItems[2]).to.be.eql({[DEF_PK]: 3, ...tableInput});
    });

    it('allows to specify a short form of an order clause to sort a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {foo: 20});
      await adapter.create('model', {foo: 10});
      await adapter.create('model', {foo: 15});
      const result1 = await adapter.find('model', {order: 'foo'});
      const result2 = await adapter.find('model', {order: 'foo ASC'});
      const result3 = await adapter.find('model', {order: 'foo DESC'});
      expect(result1).to.have.lengthOf(3);
      expect(result1[0]).to.be.eql({[DEF_PK]: 2, foo: 10});
      expect(result1[1]).to.be.eql({[DEF_PK]: 3, foo: 15});
      expect(result1[2]).to.be.eql({[DEF_PK]: 1, foo: 20});
      expect(result2).to.have.lengthOf(3);
      expect(result2[0]).to.be.eql({[DEF_PK]: 2, foo: 10});
      expect(result2[1]).to.be.eql({[DEF_PK]: 3, foo: 15});
      expect(result2[2]).to.be.eql({[DEF_PK]: 1, foo: 20});
      expect(result3).to.have.lengthOf(3);
      expect(result3[0]).to.be.eql({[DEF_PK]: 1, foo: 20});
      expect(result3[1]).to.be.eql({[DEF_PK]: 3, foo: 15});
      expect(result3[2]).to.be.eql({[DEF_PK]: 2, foo: 10});
    });

    it('allows to specify a full form of an order clause to sort a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {foo: 2, bar: 20});
      await adapter.create('model', {foo: 2, bar: 10});
      await adapter.create('model', {foo: 1, bar: 15});
      const filter1 = {order: ['foo', 'bar']};
      const filter2 = {order: ['foo ASC', 'bar ASC']};
      const filter3 = {order: ['foo DESC', 'bar DESC']};
      const filter4 = {order: ['foo', 'bar DESC']};
      const result1 = await adapter.find('model', filter1);
      const result2 = await adapter.find('model', filter2);
      const result3 = await adapter.find('model', filter3);
      const result4 = await adapter.find('model', filter4);
      expect(result1).to.have.lengthOf(3);
      expect(result1[0]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result1[1]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
      expect(result1[2]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result2).to.have.lengthOf(3);
      expect(result2[0]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result2[1]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
      expect(result2[2]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result3).to.have.lengthOf(3);
      expect(result3[0]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result3[1]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
      expect(result3[2]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result4).to.have.lengthOf(3);
      expect(result4[0]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result4[1]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result4[2]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
    });

    it('an order clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const tableInput1 = {fooCol: 2, barCol: 20};
      const tableInput2 = {fooCol: 2, barCol: 10};
      const tableInput3 = {fooCol: 1, barCol: 15};
      table.set(1, {[DEF_PK]: 1, ...tableInput1});
      table.set(2, {[DEF_PK]: 2, ...tableInput2});
      table.set(3, {[DEF_PK]: 3, ...tableInput3});
      const filter1 = {order: ['foo', 'bar']};
      const filter2 = {order: ['foo ASC', 'bar ASC']};
      const filter3 = {order: ['foo DESC', 'bar DESC']};
      const filter4 = {order: ['foo', 'bar DESC']};
      const result1 = await adapter.find('model', filter1);
      const result2 = await adapter.find('model', filter2);
      const result3 = await adapter.find('model', filter3);
      const result4 = await adapter.find('model', filter4);
      expect(result1).to.have.lengthOf(3);
      expect(result1[0]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result1[1]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
      expect(result1[2]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result2).to.have.lengthOf(3);
      expect(result2[0]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result2[1]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
      expect(result2[2]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result3).to.have.lengthOf(3);
      expect(result3[0]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result3[1]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
      expect(result3[2]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result4).to.have.lengthOf(3);
      expect(result4[0]).to.be.eql({[DEF_PK]: 3, foo: 1, bar: 15});
      expect(result4[1]).to.be.eql({[DEF_PK]: 1, foo: 2, bar: 20});
      expect(result4[2]).to.be.eql({[DEF_PK]: 2, foo: 2, bar: 10});
    });

    it('allows to specify the "where" clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
          bar: DataType.BOOLEAN,
          baz: DataType.STRING,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input1 = {foo: 20, bar: true, baz: 'abc'};
      const input2 = {foo: 10, bar: true, baz: 'abc'};
      const input3 = {foo: 15, bar: false, baz: 'abe'};
      await adapter.create('model', input1);
      await adapter.create('model', input2);
      await adapter.create('model', input3);
      const filter1 = {where: {foo: 10}};
      const filter2 = {where: {foo: {gte: 15}, baz: {like: '%bc'}}};
      const filter3 = {where: {bar: true}};
      const result1 = await adapter.find('model', filter1);
      const result2 = await adapter.find('model', filter2);
      const result3 = await adapter.find('model', filter3);
      expect(result1).to.have.lengthOf(1);
      expect(result1[0]).to.be.eql({[DEF_PK]: 2, ...input2});
      expect(result2).to.have.lengthOf(1);
      expect(result2[0]).to.be.eql({[DEF_PK]: 1, ...input1});
      expect(result3).to.have.lengthOf(2);
      expect(result3[0]).to.be.eql({[DEF_PK]: 1, ...input1});
      expect(result3[1]).to.be.eql({[DEF_PK]: 2, ...input2});
    });

    it('the "where" clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const tableInput1 = {fooCol: 20, barCol: true, bazCol: 'abc'};
      const tableInput2 = {fooCol: 10, barCol: true, bazCol: 'abc'};
      const tableInput3 = {fooCol: 15, barCol: false, bazCol: 'abe'};
      table.set(1, {[DEF_PK]: 1, ...tableInput1});
      table.set(2, {[DEF_PK]: 2, ...tableInput2});
      table.set(3, {[DEF_PK]: 3, ...tableInput3});
      const input1 = {
        foo: tableInput1.fooCol,
        bar: tableInput1.barCol,
        baz: tableInput1.bazCol,
      };
      const input2 = {
        foo: tableInput2.fooCol,
        bar: tableInput2.barCol,
        baz: tableInput2.bazCol,
      };
      const filter1 = {where: {foo: 10}};
      const filter2 = {where: {foo: {gte: 15}, baz: {like: '%bc'}}};
      const filter3 = {where: {bar: true}};
      const result1 = await adapter.find('model', filter1);
      const result2 = await adapter.find('model', filter2);
      const result3 = await adapter.find('model', filter3);
      expect(result1).to.have.lengthOf(1);
      expect(result1[0]).to.be.eql({[DEF_PK]: 2, ...input2});
      expect(result2).to.have.lengthOf(1);
      expect(result2[0]).to.be.eql({[DEF_PK]: 1, ...input1});
      expect(result3).to.have.lengthOf(2);
      expect(result3[0]).to.be.eql({[DEF_PK]: 1, ...input1});
      expect(result3[1]).to.be.eql({[DEF_PK]: 2, ...input2});
    });

    it('the "where" clause uses a persisted data instead of default values', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'hello',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1, foo: undefined});
      table.set(2, {[DEF_PK]: 2, foo: undefined});
      table.set(3, {[DEF_PK]: 3, foo: 10});
      const result1 = await adapter.find('model', {where: {foo: undefined}});
      const result2 = await adapter.find('model', {where: {foo: 10}});
      const result3 = await adapter.find('model', {where: {foo: 'hello'}});
      expect(table.size).to.be.eq(3);
      expect(result1).to.have.lengthOf(2);
      expect(result1[0]).to.be.eql({[DEF_PK]: 1, foo: 'hello'});
      expect(result1[1]).to.be.eql({[DEF_PK]: 2, foo: 'hello'});
      expect(result2).to.have.lengthOf(1);
      expect(result2[0]).to.be.eql({[DEF_PK]: 3, foo: 10});
      expect(result3).to.be.empty;
    });

    it('allows to specify a limit clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      const result1 = await adapter.find('model', {limit: 0});
      const result2 = await adapter.find('model', {limit: 1});
      const result3 = await adapter.find('model', {limit: 2});
      expect(result1).to.have.lengthOf(3);
      expect(result1[0]).to.be.eql({[DEF_PK]: 1});
      expect(result1[1]).to.be.eql({[DEF_PK]: 2});
      expect(result1[2]).to.be.eql({[DEF_PK]: 3});
      expect(result2).to.have.lengthOf(1);
      expect(result2[0]).to.be.eql({[DEF_PK]: 1});
      expect(result3).to.have.lengthOf(2);
      expect(result3[0]).to.be.eql({[DEF_PK]: 1});
      expect(result3[1]).to.be.eql({[DEF_PK]: 2});
    });

    it('allows to specify a skip clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      const result1 = await adapter.find('model', {skip: 0});
      const result2 = await adapter.find('model', {skip: 1});
      const result3 = await adapter.find('model', {skip: 2});
      expect(result1).to.have.lengthOf(3);
      expect(result1[0]).to.be.eql({[DEF_PK]: 1});
      expect(result1[1]).to.be.eql({[DEF_PK]: 2});
      expect(result1[2]).to.be.eql({[DEF_PK]: 3});
      expect(result2).to.have.lengthOf(2);
      expect(result1[1]).to.be.eql({[DEF_PK]: 2});
      expect(result1[2]).to.be.eql({[DEF_PK]: 3});
      expect(result3).to.have.lengthOf(1);
      expect(result1[2]).to.be.eql({[DEF_PK]: 3});
    });
  });

  describe('findById', function () {
    it('throws an error if a given identifier does not exist', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const promise = adapter.findById('model', 1);
      await expect(promise).to.be.rejectedWith(
        format(
          'The value 1 of the primary key %v does not exist in the model "model".',
          DEF_PK,
        ),
      );
    });

    it('uses default values for non-existent properties', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      table.set(idValue, {[DEF_PK]: idValue});
      const result = await adapter.findById('model', idValue);
      expect(result).to.be.eql({[DEF_PK]: idValue, foo: 'string'});
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue});
    });

    it('uses default values for properties of an undefined', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      const input = {foo: undefined};
      table.set(idValue, {[DEF_PK]: idValue, ...input});
      const result = await adapter.findById('model', idValue);
      expect(result).to.be.eql({[DEF_PK]: idValue, foo: 'string'});
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('uses default values for properties of a null', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      const input = {foo: null};
      table.set(idValue, {[DEF_PK]: idValue, ...input});
      const result = await adapter.findById('model', idValue);
      expect(result).to.be.eql({[DEF_PK]: idValue, foo: 'string'});
      const tableData = table.get(idValue);
      expect(tableData).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'qux',
          },
          bar: DataType.NUMBER,
          baz: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const input = {bar: 1, baz: 2};
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      table.set(idValue, {qux: idValue, ...input});
      const result = await adapter.findById('model', idValue);
      expect(result).to.be.eql({foo: idValue, ...input});
    });

    it('uses a specified column name for a regular property', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'baz',
          },
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      const input = {foo: 1, bar: 2};
      table.set(idValue, {
        [DEF_PK]: idValue,
        baz: input.foo,
        bar: input.bar,
      });
      const result = await adapter.findById('model', idValue);
      expect(result).to.be.eql({[DEF_PK]: idValue, ...input});
    });

    it('uses a specified column name for a regular property with a default value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'baz',
            default: 1,
          },
          bar: {
            type: DataType.NUMBER,
            default: 2,
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      table.set(idValue, {[DEF_PK]: idValue});
      const defaults = {foo: 1, bar: 2};
      const result = await adapter.findById('model', idValue);
      expect(result).to.be.eql({[DEF_PK]: idValue, ...defaults});
    });

    it('allows to specify a short form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const input = {foo: 'string', bar: 10};
      const idValue = 1;
      table.set(idValue, {[DEF_PK]: idValue, ...input});
      const result = await adapter.findById('model', idValue, {fields: 'foo'});
      expect(result).to.be.eql({[DEF_PK]: idValue, foo: input.foo});
    });

    it('allows to specify a full form of a fields clause to filter a return value', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
          baz: DataType.BOOLEAN,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const input = {foo: 'string', bar: 10, baz: true};
      const idValue = 1;
      table.set(idValue, {[DEF_PK]: idValue, ...input});
      const filter = {fields: ['foo', 'bar']};
      const result = await adapter.findById('model', idValue, filter);
      expect(result).to.be.eql({
        [DEF_PK]: idValue,
        foo: input.foo,
        bar: input.bar,
      });
    });

    it('a fields clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooCol',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barCol',
          },
          baz: {
            type: DataType.BOOLEAN,
            columnName: 'bazCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const tableInput = {fooCol: 'string', barCol: 10, bazCol: true};
      const idValue = 1;
      table.set(idValue, {
        [DEF_PK]: idValue,
        ...tableInput,
      });
      const filter = {fields: ['foo', 'bar']};
      const result = await adapter.findById('model', idValue, filter);
      expect(result).to.be.eql({
        [DEF_PK]: idValue,
        foo: tableInput.fooCol,
        bar: tableInput.barCol,
      });
    });
  });

  describe('delete', function () {
    it('removes all table items and returns their number', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1});
      table.set(2, {[DEF_PK]: 2});
      table.set(3, {[DEF_PK]: 3});
      const result = await adapter.delete('model');
      expect(result).to.be.eq(3);
      const tableSize = Array.from(table.values()).length;
      expect(tableSize).to.be.eq(0);
    });

    it('returns zero if nothing to remove', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result = await adapter.delete('model');
      expect(result).to.be.eq(0);
    });

    it('uses a given where clause to remove specific items', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {foo: 20});
      await adapter.create('model', {foo: 10});
      await adapter.create('model', {foo: 15});
      const result = await adapter.delete('model', {foo: {gte: 15}});
      expect(result).to.be.eq(2);
      const table = adapter._getTableOrCreate('model');
      const tableSize = Array.from(table.values()).length;
      expect(tableSize).to.be.eq(1);
      expect(table.get(2)).to.be.eql({[DEF_PK]: 2, foo: 10});
    });

    it('the "where" clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'fooCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1, fooCol: 20});
      table.set(2, {[DEF_PK]: 2, fooCol: 10});
      table.set(3, {[DEF_PK]: 3, fooCol: 15});
      const result = await adapter.delete('model', {foo: {gte: 15}});
      expect(result).to.be.eq(2);
      expect(table.size).to.be.eq(1);
      expect(table.get(2)).to.be.eql({[DEF_PK]: 2, fooCol: 10});
    });

    it('the "where" clause uses a persisted data instead of default values', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'hello',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const input1 = {[DEF_PK]: 1, foo: undefined};
      const input2 = {[DEF_PK]: 2, foo: undefined};
      const input3 = {[DEF_PK]: 3, foo: 10};
      const input4 = {[DEF_PK]: 4, foo: true};
      table.set(1, input1);
      table.set(2, input2);
      table.set(3, input3);
      table.set(4, input4);
      const result1 = await adapter.delete('model', {foo: undefined});
      expect(result1).to.be.eq(2);
      expect(table.size).to.be.eq(2);
      expect(table.get(3)).to.be.eql(input3);
      expect(table.get(4)).to.be.eql(input4);
      const result2 = await adapter.delete('model', {foo: 'hello'});
      expect(result2).to.be.eq(0);
      expect(table.size).to.be.eq(2);
      expect(table.get(3)).to.be.eql(input3);
      expect(table.get(4)).to.be.eql(input4);
      const result3 = await adapter.delete('model', {foo: 10});
      expect(result3).to.be.eq(1);
      expect(table.size).to.be.eq(1);
      expect(table.get(4)).to.be.eql(input4);
    });
  });

  describe('deleteById', function () {
    it('returns false if a given identifier is not exist', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result = await adapter.deleteById('model', 1);
      expect(result).to.be.false;
    });

    it('returns true if an item has removed by a given identifier', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const created = await adapter.create('model', {});
      const idValue = created[DEF_PK];
      const result = await adapter.deleteById('model', idValue);
      expect(result).to.be.true;
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'qux',
          },
          bar: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      table.set(idValue, {qux: idValue, bar: 10});
      const result = await adapter.deleteById('model', idValue);
      expect(result).to.be.true;
      const tableSize = Array.from(table.values()).length;
      expect(tableSize).to.be.eq(0);
    });
  });

  describe('exists', function () {
    it('returns false if a given identifier is not exist', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result = await adapter.exists('model', 1);
      expect(result).to.be.false;
    });

    it('returns true if a given identifier is exist', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {});
      const result = await adapter.exists('model', 1);
      expect(result).to.be.true;
    });

    it('uses a specified column name for a primary key', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'qux',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      const idValue = 1;
      table.set(idValue, {qux: idValue});
      const result = await adapter.exists('model', idValue);
      expect(result).to.be.true;
    });
  });

  describe('count', function () {
    it('returns zero if nothing to count', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const result = await adapter.count('model');
      expect(result).to.be.eq(0);
    });

    it('returns zero if a given where clause does not met', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {foo: 20});
      await adapter.create('model', {foo: 10});
      await adapter.create('model', {foo: 15});
      const result = await adapter.count('model', {foo: {gte: 150}});
      expect(result).to.be.eq(0);
      const table = adapter._getTableOrCreate('model');
      const tableSize = Array.from(table.values()).length;
      expect(tableSize).to.be.eq(3);
      expect(table.get(1)).to.be.eql({[DEF_PK]: 1, foo: 20});
      expect(table.get(2)).to.be.eql({[DEF_PK]: 2, foo: 10});
      expect(table.get(3)).to.be.eql({[DEF_PK]: 3, foo: 15});
    });

    it('returns a number of table items', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      await adapter.create('model', {});
      const result = await adapter.count('model');
      expect(result).to.be.eq(3);
    });

    it('uses a given where clause to count specific items', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: DataType.NUMBER,
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      await adapter.create('model', {foo: 20});
      await adapter.create('model', {foo: 10});
      await adapter.create('model', {foo: 15});
      const result = await adapter.count('model', {foo: {gte: 15}});
      expect(result).to.be.eq(2);
      const table = adapter._getTableOrCreate('model');
      const tableSize = Array.from(table.values()).length;
      expect(tableSize).to.be.eq(3);
      expect(table.get(1)).to.be.eql({[DEF_PK]: 1, foo: 20});
      expect(table.get(2)).to.be.eql({[DEF_PK]: 2, foo: 10});
      expect(table.get(3)).to.be.eql({[DEF_PK]: 3, foo: 15});
    });

    it('the "where" clause uses property names instead of column names', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.NUMBER,
            columnName: 'fooCol',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1, fooCol: 20});
      table.set(2, {[DEF_PK]: 2, fooCol: 10});
      table.set(3, {[DEF_PK]: 3, fooCol: 15});
      const result = await adapter.count('model', {foo: {gte: 15}});
      expect(result).to.be.eq(2);
      const tableSize = Array.from(table.values()).length;
      expect(tableSize).to.be.eq(3);
      expect(table.get(1)).to.be.eql({[DEF_PK]: 1, fooCol: 20});
      expect(table.get(2)).to.be.eql({[DEF_PK]: 2, fooCol: 10});
      expect(table.get(3)).to.be.eql({[DEF_PK]: 3, fooCol: 15});
    });

    it('the "where" clause uses a persisted data instead of default values', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({
        name: 'memory',
        adapter: 'memory',
      });
      dbs.defineModel({
        name: 'model',
        datasource: 'memory',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'hello',
          },
        },
      });
      const adapter = new MemoryAdapter(dbs.container, {});
      const table = adapter._getTableOrCreate('model');
      table.set(1, {[DEF_PK]: 1, foo: undefined});
      table.set(2, {[DEF_PK]: 2, foo: undefined});
      table.set(3, {[DEF_PK]: 3, foo: 10});
      const result1 = await adapter.count('model', {foo: undefined});
      const result2 = await adapter.count('model', {foo: 10});
      const result3 = await adapter.count('model', {foo: 'hello'});
      expect(result1).to.be.eq(2);
      expect(result2).to.be.eq(1);
      expect(result3).to.be.eq(0);
    });
  });
});
