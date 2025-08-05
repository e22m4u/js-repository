import {expect} from 'chai';
import {chai} from '../../chai.js';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {RelationType} from './relations/index.js';
import {DatabaseSchema} from '../../database-schema.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDefinitionUtils} from './model-definition-utils.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from './model-definition-utils.js';

const sandbox = chai.spy.sandbox();

describe('ModelDefinitionUtils', function () {
  afterEach(function () {
    sandbox.restore();
  });

  describe('getPrimaryKeyAsPropertyName', function () {
    it('returns a default property name if no primary key defined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsPropertyName('model');
      expect(result).to.be.eq(DEF_PK);
    });

    it('throws an error if a property name of a default primary key already in use as a regular property', function () {
      const dbs = new DatabaseSchema();
      const mdu = dbs.getService(ModelDefinitionUtils);
      sandbox.on(
        mdu,
        'getPropertiesDefinitionInBaseModelHierarchy',
        function (modelName) {
          expect(modelName).to.be.eq('model');
          return {[DEF_PK]: DataType.NUMBER};
        },
      );
      const throwable = () => mdu.getPrimaryKeyAsPropertyName('model');
      expect(throwable).to.throw(
        format(
          'The property name %v of the model "model" is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEF_PK,
        ),
      );
    });

    it('returns a property name if a primary key has a custom name and a default primary key is used as a regular property', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          [DEF_PK]: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsPropertyName('model');
      expect(result).to.be.eql('myId');
    });

    it('returns a property name of a primary key', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          bar: {
            type: DataType.NUMBER,
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsPropertyName('model');
      expect(result).to.be.eq('foo');
    });

    it('uses a base model hierarchy to get a property name of a primary key', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            primaryKey: true,
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsPropertyName('modelB');
      expect(result).to.be.eq('foo');
    });
  });

  describe('getPrimaryKeyAsColumnName', function () {
    it('returns a property name of a primary key if a column name is not specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          bar: {
            type: DataType.NUMBER,
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsColumnName('model');
      expect(result).to.be.eq('foo');
    });

    it('returns a column name of a primary key if specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
            columnName: 'fooColumn',
          },
          bar: {
            type: DataType.NUMBER,
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsColumnName('model');
      expect(result).to.be.eq('fooColumn');
    });

    it('returns a default property name if a primary key is not defined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsColumnName('model');
      expect(result).to.be.eq(DEF_PK);
    });

    it('throws an error if a property name of a default primary key already in use as a regular property', function () {
      const dbs = new DatabaseSchema();
      const mdu = dbs.getService(ModelDefinitionUtils);
      sandbox.on(
        mdu,
        'getPropertiesDefinitionInBaseModelHierarchy',
        function (modelName) {
          expect(modelName).to.be.eq('model');
          return {[DEF_PK]: DataType.NUMBER};
        },
      );
      const throwable = () => mdu.getPrimaryKeyAsColumnName('model');
      expect(throwable).to.throw(
        format(
          'The property name %v of the model "model" is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEF_PK,
        ),
      );
    });

    it('returns a property name of a custom primary key when a default primary key is used as a regular property', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          [DEF_PK]: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsColumnName('model');
      expect(result).to.be.eql('myId');
    });

    it('uses a base model hierarchy to get a column name of a primary key', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            primaryKey: true,
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPrimaryKeyAsPropertyName('modelB');
      expect(result).to.be.eq('foo');
    });
  });

  describe('getTableNameByModelName', function () {
    it('returns a model name if no table name specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getTableNameByModelName('model');
      expect(result).to.be.eq('model');
    });

    it('returns a table name from a model definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        tableName: 'table',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getTableNameByModelName('model');
      expect(result).to.be.eq('table');
    });
  });

  describe('getColumnNameByPropertyName', function () {
    it('returns a property name if a column name is not defined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getColumnNameByPropertyName('model', 'foo');
      expect(result).to.be.eq('foo');
    });

    it('returns a specified column name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'bar',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getColumnNameByPropertyName('model', 'foo');
      expect(result).to.be.eq('bar');
    });

    it('throws an error if a given property name does not exist', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getColumnNameByPropertyName('model', 'foo');
      expect(throwable).to.throw(InvalidArgumentError);
    });

    it('uses a base model hierarchy to get a specified column name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooColumn',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getColumnNameByPropertyName('modelB', 'foo');
      expect(result).to.be.eq('fooColumn');
    });
  });

  describe('getDefaultPropertyValue', function () {
    it('returns undefined if no default value specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDefaultPropertyValue('model', 'foo');
      expect(result).to.be.undefined;
    });

    it('returns a default value from a property definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'default',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDefaultPropertyValue('model', 'foo');
      expect(result).to.be.eq('default');
    });

    it('returns a value from a factory function', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: () => 'default',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDefaultPropertyValue('model', 'foo');
      expect(result).to.be.eq('default');
    });

    it('throws an error if a given property name does not exist', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getDefaultPropertyValue('model', 'foo');
      expect(throwable).to.throw(InvalidArgumentError);
    });

    it('uses a base model hierarchy to get a specified default value', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'default',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDefaultPropertyValue('modelB', 'foo');
      expect(result).to.be.eq('default');
    });
  });

  describe('setDefaultValuesToEmptyProperties', function () {
    it('does nothing if no property definitions', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {foo: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('does nothing if no "default" option in property definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          baz: DataType.STRING,
          qux: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {foo: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('sets a default value if a property does not exist', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('sets a default value if a property is undefined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {foo: undefined});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('sets a default value if a property is null', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {foo: null});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('sets a default value if a property has an empty value', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'placeholder',
          },
        },
      });
      dbs
        .getService(EmptyValuesService)
        .setEmptyValuesOf(DataType.STRING, ['empty']);
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {foo: 'empty'});
      expect(result).to.be.eql({foo: 'placeholder'});
    });

    it('sets a value from a factory function', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            default: () => 'string',
          },
          bar: {
            type: DataType.NUMBER,
            default: () => 10,
          },
          baz: {
            type: DataType.STRING,
            default: () => null,
          },
          qux: {
            type: DataType.STRING,
            default: () => undefined,
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('model', {});
      expect(result).to.be.eql({
        foo: 'string',
        bar: 10,
        baz: null,
        qux: undefined,
      });
    });

    it('uses a base model hierarchy to set a default values', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'string',
          },
          bar: {
            type: DataType.NUMBER,
            default: 10,
          },
          baz: {
            type: DataType.STRING,
            default: null,
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .setDefaultValuesToEmptyProperties('modelB', {});
      expect(result).to.be.eql({
        foo: 'string',
        bar: 10,
        baz: null,
      });
    });

    describe('an option "onlyProvidedProperties" is true', function () {
      it('does not set a default value if a property does not exist', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              default: 'string',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .setDefaultValuesToEmptyProperties('model', {}, true);
        expect(result).to.be.eql({});
      });

      it('sets a default value if a property is undefined', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              default: 'string',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .setDefaultValuesToEmptyProperties('model', {foo: undefined}, true);
        expect(result).to.be.eql({foo: 'string'});
      });

      it('sets a default value if a property is null', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              default: 'string',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .setDefaultValuesToEmptyProperties('model', {foo: null}, true);
        expect(result).to.be.eql({foo: 'string'});
      });
    });
  });

  describe('convertPropertyNamesToColumnNames', function () {
    it('does nothing if no property definitions', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertPropertyNamesToColumnNames('model', {foo: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('does nothing if no column name specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertPropertyNamesToColumnNames('model', {foo: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('replaces property names by column names', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooColumn',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barColumn',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertPropertyNamesToColumnNames('model', {foo: 'string'});
      expect(result).to.be.eql({fooColumn: 'string'});
    });

    it('uses a base model hierarchy to replace property names by column names', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooColumn',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barColumn',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertPropertyNamesToColumnNames('modelB', {foo: 'string'});
      expect(result).to.be.eql({fooColumn: 'string'});
    });

    describe('embedded object with model', function () {
      it('does nothing if no property definitions', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertPropertyNamesToColumnNames('modelA', {
            embedded: {foo: 'string'},
          });
        expect(result).to.be.eql({embedded: {foo: 'string'}});
      });

      it('does nothing if no column name specified', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: DataType.STRING,
            bar: DataType.NUMBER,
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertPropertyNamesToColumnNames('modelA', {
            embedded: {foo: 'string', bar: 10},
          });
        expect(result).to.be.eql({embedded: {foo: 'string', bar: 10}});
      });

      it('replaces property names by column names', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
              columnName: 'fooColumn',
            },
            bar: {
              type: DataType.NUMBER,
              columnName: 'barColumn',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertPropertyNamesToColumnNames('modelA', {
            embedded: {foo: 'string', bar: 10},
          });
        expect(result).to.be.eql({
          embedded: {fooColumn: 'string', barColumn: 10},
        });
      });
    });

    describe('embedded array with items model', function () {
      it('does nothing if no property definitions', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertPropertyNamesToColumnNames('modelA', {
            embedded: [{foo: 'val'}, {bar: 10}],
          });
        expect(result).to.be.eql({embedded: [{foo: 'val'}, {bar: 10}]});
      });

      it('does nothing if no column name specified', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: DataType.STRING,
            bar: DataType.NUMBER,
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertPropertyNamesToColumnNames('modelA', {
            embedded: [
              {foo: 'val1', bar: 10},
              {foo: 'val2', bar: 20},
            ],
          });
        expect(result).to.be.eql({
          embedded: [
            {foo: 'val1', bar: 10},
            {foo: 'val2', bar: 20},
          ],
        });
      });

      it('replaces property names by column names', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
              columnName: 'fooColumn',
            },
            bar: {
              type: DataType.NUMBER,
              columnName: 'barColumn',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertPropertyNamesToColumnNames('modelA', {
            embedded: [
              {foo: 'val1', bar: 10},
              {foo: 'val2', bar: 20},
            ],
          });
        expect(result).to.be.eql({
          embedded: [
            {fooColumn: 'val1', barColumn: 10},
            {fooColumn: 'val2', barColumn: 20},
          ],
        });
      });
    });
  });

  describe('convertColumnNamesToPropertyNames', function () {
    it('does nothing if no property definitions', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertColumnNamesToPropertyNames('model', {foo: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('does nothing if no column name specified', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertColumnNamesToPropertyNames('model', {foo: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('replaces column names by property names', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooColumn',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barColumn',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertColumnNamesToPropertyNames('model', {fooColumn: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    it('uses a base model hierarchy to replace column names by property names', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
            columnName: 'fooColumn',
          },
          bar: {
            type: DataType.NUMBER,
            columnName: 'barColumn',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .convertColumnNamesToPropertyNames('modelA', {fooColumn: 'string'});
      expect(result).to.be.eql({foo: 'string'});
    });

    describe('embedded object with model', function () {
      it('does nothing if no property definitions', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertColumnNamesToPropertyNames('modelA', {
            embedded: {foo: 'string'},
          });
        expect(result).to.be.eql({embedded: {foo: 'string'}});
      });

      it('does nothing if no column name specified', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: DataType.STRING,
            bar: DataType.NUMBER,
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertColumnNamesToPropertyNames('modelA', {
            embedded: {foo: 'string', bar: 10},
          });
        expect(result).to.be.eql({embedded: {foo: 'string', bar: 10}});
      });

      it('replaces property names by column names', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
              columnName: 'fooColumn',
            },
            bar: {
              type: DataType.NUMBER,
              columnName: 'barColumn',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertColumnNamesToPropertyNames('modelA', {
            embedded: {fooColumn: 'string', barColumn: 10},
          });
        expect(result).to.be.eql({embedded: {foo: 'string', bar: 10}});
      });
    });

    describe('embedded array with items model', function () {
      it('does nothing if no property definitions', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertColumnNamesToPropertyNames('modelA', {
            embedded: [{foo: 'val'}, {bar: 10}],
          });
        expect(result).to.be.eql({embedded: [{foo: 'val'}, {bar: 10}]});
      });

      it('does nothing if no column name specified', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: DataType.STRING,
            bar: DataType.NUMBER,
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertColumnNamesToPropertyNames('modelA', {
            embedded: [
              {foo: 'val1', bar: 10},
              {foo: 'val2', bar: 20},
            ],
          });
        expect(result).to.be.eql({
          embedded: [
            {foo: 'val1', bar: 10},
            {foo: 'val2', bar: 20},
          ],
        });
      });

      it('replaces property names by column names', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
              columnName: 'fooColumn',
            },
            bar: {
              type: DataType.NUMBER,
              columnName: 'barColumn',
            },
          },
        });
        const result = dbs
          .getService(ModelDefinitionUtils)
          .convertColumnNamesToPropertyNames('modelA', {
            embedded: [
              {fooColumn: 'val1', barColumn: 10},
              {fooColumn: 'val2', barColumn: 20},
            ],
          });
        expect(result).to.be.eql({
          embedded: [
            {foo: 'val1', bar: 10},
            {foo: 'val2', bar: 20},
          ],
        });
      });
    });
  });

  describe('getDataTypeByPropertyName', function () {
    it('returns a property type of a short property definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDataTypeByPropertyName('model', 'foo');
      expect(result).to.be.eq(DataType.STRING);
    });

    it('returns a property type of a full property definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDataTypeByPropertyName('model', 'foo');
      expect(result).to.be.eq(DataType.STRING);
    });

    it('throws an error if a property name does not exist', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getDataTypeByPropertyName('model', 'property');
      expect(throwable).to.throw(InvalidArgumentError);
    });

    it('uses a base model hierarchy to get a type from a short property definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDataTypeByPropertyName('modelB', 'foo');
      expect(result).to.be.eq(DataType.STRING);
    });

    it('uses a base model hierarchy to get a type from a full property definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: {
            type: DataType.STRING,
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getDataTypeByPropertyName('modelB', 'foo');
      expect(result).to.be.eq(DataType.STRING);
    });
  });

  describe('getDataTypeFromPropertyDefinition', function () {
    it('requires the given argument "propDef" must be an Object or DataType', function () {
      const dbs = new DatabaseSchema();
      const mdu = dbs.getService(ModelDefinitionUtils);
      const throwable = v => () => mdu.getDataTypeFromPropertyDefinition(v);
      const error = v =>
        format(
          'The argument "propDef" of the ModelDefinitionUtils.getDataTypeFromPropertyDefinition ' +
            'should be an Object or the DataType enum, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(DataType.ANY)();
      throwable({type: DataType.ANY})();
    });

    it('requires the given Object to have the "type" property with the DataType enum', function () {
      const dbs = new DatabaseSchema();
      const mdu = dbs.getService(ModelDefinitionUtils);
      const throwable = v => () =>
        mdu.getDataTypeFromPropertyDefinition({type: v});
      const error = v =>
        format(
          'The given Object to the ModelDefinitionUtils.getDataTypeFromPropertyDefinition ' +
            'should have the "type" property with one of values: %l, but %s given.',
          Object.values(DataType),
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(DataType.ANY)();
    });

    it('returns the DataType from the given DataType enum', function () {
      const dbs = new DatabaseSchema();
      const mdu = dbs.getService(ModelDefinitionUtils);
      const res = mdu.getDataTypeFromPropertyDefinition(DataType.STRING);
      expect(res).to.be.eq(DataType.STRING);
    });

    it('returns the DataType from the given PropertyDefinition', function () {
      const dbs = new DatabaseSchema();
      const mdu = dbs.getService(ModelDefinitionUtils);
      const res = mdu.getDataTypeFromPropertyDefinition({
        type: DataType.STRING,
      });
      expect(res).to.be.eq(DataType.STRING);
    });
  });

  describe('getOwnPropertiesDefinitionWithoutPrimaryKeys', function () {
    it('returns an empty object if a model does not have properties', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnPropertiesDefinitionWithoutPrimaryKeys('model');
      expect(result).to.be.eql({});
    });

    it('returns a properties definition without primary keys', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnPropertiesDefinitionWithoutPrimaryKeys('model');
      expect(result).to.be.eql({
        foo: DataType.STRING,
        bar: DataType.STRING,
      });
    });

    it('returns its own properties definition even it has a base model properties', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        properties: {
          id: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          foo: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnPropertiesDefinitionWithoutPrimaryKeys('modelB');
      expect(result).to.be.eql({
        foo: DataType.NUMBER,
      });
    });
  });

  describe('getOwnPropertiesDefinitionOfPrimaryKeys', function () {
    it('returns an empty object if a model does not have properties', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnPropertiesDefinitionOfPrimaryKeys('model');
      expect(result).to.be.eql({});
    });

    it('returns a properties definition of primary keys', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnPropertiesDefinitionOfPrimaryKeys('model');
      expect(result).to.be.eql({
        id: {
          type: DataType.STRING,
          primaryKey: true,
        },
      });
    });

    it('returns its own properties definition even it has a base model properties', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        properties: {
          id: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          foo: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnPropertiesDefinitionOfPrimaryKeys('modelB');
      expect(result).to.be.eql({
        id: {
          type: DataType.NUMBER,
          primaryKey: true,
        },
      });
    });
  });

  describe('getPropertiesDefinitionInBaseModelHierarchy', function () {
    it('returns an empty object if a model does not have properties', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy('model');
      expect(result).to.be.eql({});
    });

    it('returns a properties definition of a model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy('model');
      expect(result).to.be.eql({
        id: {
          type: DataType.STRING,
          primaryKey: true,
        },
        foo: DataType.STRING,
        bar: DataType.NUMBER,
      });
    });

    it('returns a properties definition of an extended model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        properties: {
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy('modelB');
      expect(result).to.be.eql({
        foo: DataType.STRING,
        bar: DataType.NUMBER,
      });
    });

    it('uses child properties in priority over a base model properties', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
          bar: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        properties: {
          id: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          foo: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy('modelB');
      expect(result).to.be.eql({
        id: {
          type: DataType.NUMBER,
          primaryKey: true,
        },
        foo: DataType.NUMBER,
        bar: DataType.STRING,
      });
    });

    it('uses primary keys from a model closest to child model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          id1: {
            type: DataType.STRING,
            primaryKey: true,
          },
          foo: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        properties: {
          id2: {
            type: DataType.STRING,
            primaryKey: true,
          },
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy('modelB');
      expect(result).to.be.eql({
        id2: {
          type: DataType.STRING,
          primaryKey: true,
        },
        foo: DataType.STRING,
        bar: DataType.NUMBER,
      });
    });

    it('throws an error for a circular reference', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        base: 'model',
      });
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getPropertiesDefinitionInBaseModelHierarchy('model');
      expect(throwable).to.throw(
        'The model "model" has a circular inheritance.',
      );
    });

    it('places a primary key definition at the start of the result', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
          bar: DataType.NUMBER,
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy('model');
      expect(Object.keys(result)).to.be.eql(['id', 'foo', 'bar']);
    });
  });

  describe('getOwnRelationsDefinition', function () {
    it('returns an empty object if a model does not have relations', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnRelationsDefinition('model');
      expect(result).to.be.eql({});
    });

    it('returns a relations definition by a given model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        relations: {
          foo: {
            type: RelationType.BELONGS_TO,
            model: 'model',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnRelationsDefinition('model');
      expect(result).to.be.eql({
        foo: {
          type: RelationType.BELONGS_TO,
          model: 'model',
        },
      });
    });

    it('returns its own relations definition even it has a base model relations', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          foo: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        relations: {
          bar: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getOwnRelationsDefinition('modelB');
      expect(result).to.be.eql({
        bar: {
          type: RelationType.BELONGS_TO,
          model: 'modelB',
        },
      });
    });
  });

  describe('getRelationsDefinitionInBaseModelHierarchy', function () {
    it('returns an empty object if a model does not have relations', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationsDefinitionInBaseModelHierarchy('model');
      expect(result).to.be.eql({});
    });

    it('returns a relations definition of a model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        relations: {
          foo: {
            type: RelationType.BELONGS_TO,
            model: 'model',
          },
          bar: {
            type: RelationType.BELONGS_TO,
            model: 'model',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationsDefinitionInBaseModelHierarchy('model');
      expect(result).to.be.eql({
        foo: {
          type: RelationType.BELONGS_TO,
          model: 'model',
        },
        bar: {
          type: RelationType.BELONGS_TO,
          model: 'model',
        },
      });
    });

    it('returns a relations definition of an extended model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          foo: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        relations: {
          bar: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationsDefinitionInBaseModelHierarchy('modelB');
      expect(result).to.be.eql({
        foo: {
          type: RelationType.BELONGS_TO,
          model: 'modelA',
        },
        bar: {
          type: RelationType.BELONGS_TO,
          model: 'modelB',
        },
      });
    });

    it('uses child relations in priority over a base model relations', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          foo: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
          bar: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        relations: {
          foo: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationsDefinitionInBaseModelHierarchy('modelB');
      expect(result).to.be.eql({
        foo: {
          type: RelationType.REFERENCES_MANY,
          model: 'modelB',
        },
        bar: {
          type: RelationType.BELONGS_TO,
          model: 'modelA',
        },
      });
    });

    it('throws an error for a circular reference', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        base: 'model',
      });
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getRelationsDefinitionInBaseModelHierarchy('model');
      expect(throwable).to.throw(
        'The model "model" has a circular inheritance.',
      );
    });
  });

  describe('getRelationDefinitionByName', function () {
    it('throws an error if a given model is not found', function () {
      const dbs = new DatabaseSchema();
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getRelationDefinitionByName('model', 'myRelation');
      expect(throwable).to.throw('The model "model" is not defined.');
    });

    it('throws an error if a given relation is not found', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
      });
      const throwable = () =>
        dbs
          .getService(ModelDefinitionUtils)
          .getRelationDefinitionByName('model', 'myRelation');
      expect(throwable).to.throw(
        'The model "model" does not have relation name "myRelation".',
      );
    });

    it('returns a relation definition by a given name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        relations: {
          myRelation: {
            type: RelationType.BELONGS_TO,
            model: 'model',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationDefinitionByName('model', 'myRelation');
      expect(result).to.be.eql({
        type: RelationType.BELONGS_TO,
        model: 'model',
      });
    });

    it('uses a child relations in priority over a base model relations', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          myRelation: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
        relations: {
          myRelation: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelA',
          },
        },
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationDefinitionByName('modelB', 'myRelation');
      expect(result).to.be.eql({
        type: RelationType.REFERENCES_MANY,
        model: 'modelA',
      });
    });

    it('returns a base model relation if a given relation name is not found in a child model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          myRelation: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const result = dbs
        .getService(ModelDefinitionUtils)
        .getRelationDefinitionByName('modelB', 'myRelation');
      expect(result).to.be.eql({
        type: RelationType.BELONGS_TO,
        model: 'modelA',
      });
    });
  });

  describe('excludeObjectKeysByRelationNames', function () {
    it('excludes object keys by relation names', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        relations: {
          baz: {
            type: RelationType.BELONGS_TO,
            model: 'model',
          },
          qux: {
            type: RelationType.BELONGS_TO,
            model: 'model',
          },
        },
      });
      const input = {
        foo: 'fooVal',
        bar: {val: 'barVal'},
        baz: 'bazVal',
        qux: {val: 'quxVal'},
      };
      const result = dbs
        .getService(ModelDefinitionUtils)
        .excludeObjectKeysByRelationNames('model', input);
      expect(result).to.be.eql({foo: 'fooVal', bar: {val: 'barVal'}});
      expect(result).to.be.not.eq(input);
    });

    it('requires a given object as an object', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const throwable = v => () =>
        dbs
          .getService(ModelDefinitionUtils)
          .excludeObjectKeysByRelationNames('model', v);
      const error = v =>
        format(
          'The second argument of ModelDefinitionUtils.excludeObjectKeysByRelationNames ' +
            'should be an Object, but %s given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
      throwable({foo: 'bar'})();
    });
  });

  describe('getModelNameOfPropertyValueIfDefined', function () {
    it('returns undefined if a given property does not exist in the model', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const mdu = dbs.getService(ModelDefinitionUtils);
      const res = mdu.getModelNameOfPropertyValueIfDefined('model', 'foo');
      expect(res).to.be.undefined;
    });

    describe('short property definition', function () {
      it('requires parameter "modelName" to be a non-empty String', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: DataType.OBJECT,
          },
        });
        const mdu = dbs.getService(ModelDefinitionUtils);
        const throwable = v => () =>
          mdu.getModelNameOfPropertyValueIfDefined(v, 'foo');
        const error = v =>
          format(
            'Parameter "modelName" of ' +
              'ModelDefinitionUtils.getModelNameOfPropertyValueIfDefined ' +
              'requires a non-empty String, but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(undefined)).to.throw(error('undefined'));
        expect(throwable(null)).to.throw(error('null'));
        throwable('model')();
      });

      it('requires parameter "propertyName" to be a non-empty String', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: DataType.OBJECT,
          },
        });
        const mdu = dbs.getService(ModelDefinitionUtils);
        const throwable = v => () =>
          mdu.getModelNameOfPropertyValueIfDefined('model', v);
        const error = v =>
          format(
            'Parameter "propertyName" of ' +
              'ModelDefinitionUtils.getModelNameOfPropertyValueIfDefined ' +
              'requires a non-empty String, but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(undefined)).to.throw(error('undefined'));
        expect(throwable(null)).to.throw(error('null'));
        throwable('foo')();
      });

      it('returns undefined if the property definition is DataType', function () {
        const fn = v => {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: v,
            },
          });
          const mdu = dbs.getService(ModelDefinitionUtils);
          return mdu.getModelNameOfPropertyValueIfDefined('model', 'foo');
        };
        expect(fn(DataType.ANY)).to.be.undefined;
        expect(fn(DataType.STRING)).to.be.undefined;
        expect(fn(DataType.NUMBER)).to.be.undefined;
        expect(fn(DataType.BOOLEAN)).to.be.undefined;
        expect(fn(DataType.ARRAY)).to.be.undefined;
        expect(fn(DataType.OBJECT)).to.be.undefined;
      });
    });

    describe('full property definition', function () {
      it('requires parameter "modelName" to be a non-empty String', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.OBJECT,
            },
          },
        });
        const mdu = dbs.getService(ModelDefinitionUtils);
        const throwable = v => () =>
          mdu.getModelNameOfPropertyValueIfDefined(v, 'foo');
        const error = v =>
          format(
            'Parameter "modelName" of ' +
              'ModelDefinitionUtils.getModelNameOfPropertyValueIfDefined ' +
              'requires a non-empty String, but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(undefined)).to.throw(error('undefined'));
        expect(throwable(null)).to.throw(error('null'));
        throwable('model')();
      });

      it('requires parameter "propertyName" to be a non-empty String', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.OBJECT,
            },
          },
        });
        const mdu = dbs.getService(ModelDefinitionUtils);
        const throwable = v => () =>
          mdu.getModelNameOfPropertyValueIfDefined('model', v);
        const error = v =>
          format(
            'Parameter "propertyName" of ' +
              'ModelDefinitionUtils.getModelNameOfPropertyValueIfDefined ' +
              'requires a non-empty String, but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(undefined)).to.throw(error('undefined'));
        expect(throwable(null)).to.throw(error('null'));
        throwable('foo')();
      });

      it('return undefined if no model name specified', function () {
        const fn = v => {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: v,
              },
            },
          });
          const mdu = dbs.getService(ModelDefinitionUtils);
          return mdu.getModelNameOfPropertyValueIfDefined('model', 'foo');
        };
        expect(fn(DataType.ANY)).to.be.undefined;
        expect(fn(DataType.STRING)).to.be.undefined;
        expect(fn(DataType.NUMBER)).to.be.undefined;
        expect(fn(DataType.BOOLEAN)).to.be.undefined;
        expect(fn(DataType.ARRAY)).to.be.undefined;
        expect(fn(DataType.OBJECT)).to.be.undefined;
      });

      it('return undefined if no model name specified in case of Array property', function () {
        const fn = v => {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ARRAY,
                itemType: v,
              },
            },
          });
          const mdu = dbs.getService(ModelDefinitionUtils);
          return mdu.getModelNameOfPropertyValueIfDefined('model', 'foo');
        };
        expect(fn(DataType.ANY)).to.be.undefined;
        expect(fn(DataType.STRING)).to.be.undefined;
        expect(fn(DataType.NUMBER)).to.be.undefined;
        expect(fn(DataType.BOOLEAN)).to.be.undefined;
        expect(fn(DataType.ARRAY)).to.be.undefined;
        expect(fn(DataType.OBJECT)).to.be.undefined;
      });

      it('returns a model name from the option "model" in case of Object property', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.OBJECT,
              model: 'myModel',
            },
          },
        });
        const mdu = dbs.getService(ModelDefinitionUtils);
        const res = mdu.getModelNameOfPropertyValueIfDefined('model', 'foo');
        expect(res).to.be.eq('myModel');
      });

      it('returns a model name from the option "itemModel" in case of Array property', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'myModel',
            },
          },
        });
        const mdu = dbs.getService(ModelDefinitionUtils);
        const res = mdu.getModelNameOfPropertyValueIfDefined('model', 'foo');
        expect(res).to.be.eq('myModel');
      });
    });
  });
});
