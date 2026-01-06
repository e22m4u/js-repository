import {expect} from 'chai';
import {DataType} from './data-type.js';
import {format} from '@e22m4u/js-format';
import {DatabaseSchema} from '../../../database-schema.js';
import {RequiredPropertyValidator} from './required-property-validator.js';

describe('RequiredPropertyValidator', function () {
  describe('validate', function () {
    it('should require the parameter "modelName" to be a non-empty String', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({name: 'model'});
      const throwable = v => () => S.validate(v, {});
      const error = s =>
        format(
          'Parameter "modelName" must be a non-empty String, but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('model')();
    });

    it('should require the parameter "modelData" to be an Object', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({name: 'model'});
      const throwable = v => () => S.validate('model', v);
      const error = s =>
        format(
          'Data of the model "model" should be an Object, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
    });

    it('should require the parameter "isPartial" to be an Object', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({name: 'model'});
      const throwable = v => () => S.validate('model', {}, v);
      const error = s =>
        format('Parameter "isPartial" must be a Boolean, but %s was given.', s);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(true)();
      throwable(false)();
      throwable(undefined)();
    });

    it('should not throw an error if no properties in the model definition', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({name: 'model'});
      S.validate('model', {foo: 'bar', baz: undefined});
    });

    it('should not throw an error if the property definition in short form', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({name: 'model', properties: {foo: DataType.STRING}});
      S.validate('model', {foo: 'bar'});
    });

    it('should not throw an error if a required property is defined', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      S.validate('model', {foo: 'bar'});
    });

    it('should throw an error if a required property is undefined', function () {
      const dbs = new DatabaseSchema();
      const S = dbs.getService(RequiredPropertyValidator);
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const throwable = () => S.validate('model', {foo: undefined});
      expect(throwable).to.throw(
        'Property "foo" of the model "model" is required, ' +
          'but undefined was given.',
      );
    });

    describe('embedded model', function () {
      it('should not throw an error if no data is provided for an embedded model', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
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
            },
          },
        });
        S.validate('modelA', {embedded: undefined});
      });

      it('should throw an error if an embedded model is required but not provided', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            embedded: {
              type: DataType.OBJECT,
              model: 'modelB',
              required: true,
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
            },
          },
        });
        const throwable = () => S.validate('modelA', {embedded: undefined});
        expect(throwable).to.throw(
          'Property "embedded" of the model "modelA" is required, ' +
            'but undefined was given.',
        );
      });

      it('should allow a model data to have properties without a specified schema', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
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
            },
          },
        });
        S.validate('modelA', {embedded: {bar: 'baz', qux: undefined}});
      });

      it('should allow omit a model data when its model has a required property', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
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
              required: true,
            },
          },
        });
        S.validate('modelA', {embedded: undefined});
      });

      it('should allow omit an optional property for an embedded model', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
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
            },
          },
        });
        S.validate('modelA', {embedded: {}});
      });

      it('should throw an error if a required property is not provided', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
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
              required: true,
            },
          },
        });
        const throwable = () => S.validate('modelA', {embedded: {}});
        expect(throwable).to.throw(
          'Property "foo" of the model "modelB" is required, ' +
            'but undefined was given.',
        );
      });
    });

    describe('object array', function () {
      it('should allow omit an optional array', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
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
            },
          },
        });
        S.validate('modelA', {});
      });

      it('should allow a required array to be empty', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
              required: true,
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
            },
          },
        });
        S.validate('modelA', {array: []});
      });

      it('should allow omit an optional array even if an item model has a required property', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
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
              required: true,
            },
          },
        });
        S.validate('modelA', {});
      });

      it('should allow an empty array even if an item model has a required property', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
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
              required: true,
            },
          },
        });
        S.validate('modelA', {});
      });

      it('should throw an error when a required array is not provided', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
              required: true,
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
            },
          },
        });
        const throwable = () => S.validate('modelA', {});
        expect(throwable).to.throw(
          'Property "array" of the model "modelA" is required, ' +
            'but undefined was given.',
        );
      });

      it('should allow omit an optional property of the item model', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
              required: true,
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
            },
          },
        });
        S.validate('modelA', {array: [{}]});
      });

      it('should allow an item date to have properties without a specified schema', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
              type: DataType.ARRAY,
              itemType: DataType.OBJECT,
              itemModel: 'modelB',
              required: true,
            },
          },
        });
        dbs.defineModel({
          name: 'modelB',
          properties: {
            foo: {
              type: DataType.STRING,
            },
          },
        });
        S.validate('modelA', {array: [{bar: 'baz', qux: undefined}]});
      });
    });

    describe('isPartial', function () {
      it('should throw an error if a required property is undefined', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        const throwable = () => S.validate('model', {foo: undefined}, true);
        expect(throwable).to.throw(
          'Property "foo" of the model "model" is required, ' +
            'but undefined was given.',
        );
      });

      it('should not validate required but not provided properties', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        S.validate('model', {}, true);
      });

      it('should validate not provided properties of an embedded model', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
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
              required: true,
            },
          },
        });
        const throwable = () => S.validate('modelA', {embedded: {}}, true);
        expect(throwable).to.throw(
          'Property "foo" of the model "modelB" is required, ' +
            'but undefined was given.',
        );
      });

      it('should validate not provided properties of an item model', function () {
        const dbs = new DatabaseSchema();
        const S = dbs.getService(RequiredPropertyValidator);
        dbs.defineModel({
          name: 'modelA',
          properties: {
            array: {
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
              required: true,
            },
          },
        });
        const throwable = () => S.validate('modelA', {array: [{}]}, true);
        expect(throwable).to.throw(
          'Property "foo" of the model "modelB" is required, ' +
            'but undefined was given.',
        );
      });
    });
  });
});
