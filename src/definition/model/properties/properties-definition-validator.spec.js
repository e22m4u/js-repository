import chai from 'chai';
import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {DataType} from './data-type.js';
import {PropertiesDefinitionValidator} from './properties-definition-validator.js';
import {PrimaryKeysDefinitionValidator} from './primary-keys-definition-validator.js';
import {DefaultValuesDefinitionValidator} from './default-values-definition-validator.js';

const S = new PropertiesDefinitionValidator();
const sandbox = chai.spy.sandbox();

describe('PropertiesDefinitionValidator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  describe('validate', function () {
    it('requires a first argument to be a non-empty string', function () {
      const validate = value => () => S.validate(value, {});
      const error = value =>
        format(
          'A first argument of PropertiesDefinitionValidator.validate ' +
            'should be a non-empty String, but %v given.',
          value,
        );
      expect(validate('')).to.throw(error(''));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate(false)).to.throw(error(false));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      expect(validate(undefined)).to.throw(error(undefined));
      expect(validate(null)).to.throw(error(null));
      validate('model')();
    });

    it('requires a second argument to be an object', function () {
      const validate = value => () => S.validate('model', value);
      const error = value =>
        format(
          'The provided option "properties" of the model "model" ' +
            'should be an Object, but %v given.',
          value,
        );
      expect(validate('str')).to.throw(error('str'));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate(false)).to.throw(error(false));
      expect(validate([])).to.throw(error([]));
      expect(validate(undefined)).to.throw(error(undefined));
      expect(validate(null)).to.throw(error(null));
      validate({})();
    });

    it('requires a property name as a non-empty string', function () {
      const validate = properties => () => S.validate('model', properties);
      const error = value =>
        format(
          'The property name of the model "model" should be ' +
            'a non-empty String, but %v given.',
          value,
        );
      expect(validate({['']: {}})).to.throw(error(''));
      validate({foo: DataType.STRING})();
    });

    it('requires a property definition', function () {
      const validate = foo => () => S.validate('model', {foo});
      const error = value =>
        format(
          'The property "foo" of the model "model" should have ' +
            'a property definition, but %v given.',
          value,
        );
      expect(validate(undefined)).to.throw(error(undefined));
      expect(validate(null)).to.throw(error(null));
      validate(DataType.STRING)();
      validate({type: DataType.STRING})();
    });

    it('expects a short property definition to be DataType', function () {
      const validate = foo => () => S.validate('model', {foo});
      const error = value =>
        format(
          'In case of a short property definition, the property "foo" ' +
            'of the model "model" should have one of data types: %l, but %v given.',
          Object.values(DataType),
          value,
        );
      expect(validate('invalid')).to.throw(error('invalid'));
      validate(DataType.STRING)();
    });

    it('expects a full property definition to be an object', function () {
      const validate = foo => () => S.validate('model', {foo});
      const error = value =>
        format(
          'In case of a full property definition, the property "foo" ' +
            'of the model "model" should be an Object, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      validate({type: DataType.STRING})();
    });

    it('requires the option "type" to be a DataType', function () {
      const validate = type => () => S.validate('model', {foo: {type}});
      const error = value =>
        format(
          'The property "foo" of the model "model" requires the option "type" ' +
            'to have one of data types: %l, but %v given.',
          Object.values(DataType),
          value,
        );
      expect(validate('str')).to.throw(error('str'));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate(false)).to.throw(error(false));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      expect(validate(undefined)).to.throw(error(undefined));
      expect(validate(null)).to.throw(error(null));
      validate(DataType.STRING)();
    });

    it('expects provided the option "itemType" to be a DataType', function () {
      const validate = itemType => {
        const foo = {type: DataType.ARRAY, itemType};
        return () => S.validate('model', {foo});
      };
      const error = value =>
        format(
          'The provided option "itemType" of the property "foo" in the model "model" ' +
            'should have one of data types: %l, but %v given.',
          Object.values(DataType),
          value,
        );
      expect(validate('str')).to.throw(error('str'));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate(DataType.STRING)();
    });

    it('expects provided the option "model" to be a string', function () {
      const validate = model => {
        const foo = {
          type: DataType.OBJECT,
          model,
        };
        return () => S.validate('model', {foo});
      };
      const error = value =>
        format(
          'The provided option "model" of the property "foo" in the model "model" ' +
            'should be a String, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate('model')();
    });

    it('expects provided the option "primaryKey" to be a boolean', function () {
      const validate = primaryKey => {
        const foo = {
          type: DataType.STRING,
          primaryKey,
        };
        return () => S.validate('model', {foo});
      };
      const error = value =>
        format(
          'The provided option "primaryKey" of the property "foo" in the model "model" ' +
            'should be a Boolean, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate(true)();
      validate(false)();
    });

    it('expects provided the option "columnName" to be a string', function () {
      const validate = columnName => {
        const foo = {
          type: DataType.STRING,
          columnName,
        };
        return () => S.validate('model', {foo});
      };
      const error = value =>
        format(
          'The provided option "columnName" of the property "foo" in the model "model" ' +
            'should be a String, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate('columnName')();
    });

    it('expects provided the option "columnType" to be a string', function () {
      const validate = columnType => {
        const foo = {
          type: DataType.STRING,
          columnType,
        };
        return () => S.validate('model', {foo});
      };
      const error = value =>
        format(
          'The provided option "columnType" of the property "foo" in the model "model" ' +
            'should be a String, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate('columnType')();
    });

    it('expects provided the option "required" to be a boolean', function () {
      const validate = required => {
        const foo = {
          type: DataType.STRING,
          required,
        };
        return () => S.validate('model', {foo});
      };
      const error = value =>
        format(
          'The provided option "required" of the property "foo" in the model "model" ' +
            'should be a Boolean, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate(true)();
      validate(false)();
    });

    it('expects the required property should not have the option "default" to be provided', function () {
      const validate = value => () => {
        const foo = {
          type: DataType.ANY,
          required: true,
          default: value,
        };
        S.validate('model', {foo});
      };
      const error = format(
        'The property "foo" of the model "model" is a required property, ' +
          'so it should not have the option "default" to be provided.',
      );
      expect(validate('str')).to.throw(error);
      expect(validate(10)).to.throw(error);
      expect(validate(true)).to.throw(error);
      expect(validate(false)).to.throw(error);
      expect(validate([])).to.throw(error);
      expect(validate({})).to.throw(error);
      expect(validate(null)).to.throw(error);
      validate(undefined);
    });

    it('expects the primary key should not have the option "required" to be true', function () {
      const validate = required => () => {
        const foo = {
          type: DataType.ANY,
          primaryKey: true,
          required,
        };
        S.validate('model', {foo});
      };
      const error = format(
        'The property "foo" of the model "model" is a primary key, ' +
          'so it should not have the option "required" to be provided.',
      );
      expect(validate(true)).to.throw(error);
      validate(false);
      validate(undefined);
    });

    it('expects the primary key should not have the option "default" to be provided', function () {
      const validate = value => () => {
        const foo = {
          type: DataType.ANY,
          primaryKey: true,
          default: value,
        };
        S.validate('model', {foo});
      };
      const error = format(
        'The property "foo" of the model "model" is a primary key, ' +
          'so it should not have the option "default" to be provided.',
      );
      expect(validate('str')).to.throw(error);
      expect(validate(10)).to.throw(error);
      expect(validate(true)).to.throw(error);
      expect(validate(false)).to.throw(error);
      expect(validate([])).to.throw(error);
      expect(validate({})).to.throw(error);
      expect(validate(null)).to.throw(error);
      validate(undefined);
    });

    it('expects a non-array property should not have the option "itemType" to be provided', function () {
      const validate = type => () => {
        const foo = {
          type,
          itemType: DataType.STRING,
        };
        S.validate('model', {foo});
      };
      const error =
        'The property "foo" of the model "model" has the non-array type, ' +
        'so it should not have the option "itemType" to be provided.';
      expect(validate(DataType.ANY)).to.throw(error);
      expect(validate(DataType.STRING)).to.throw(error);
      expect(validate(DataType.NUMBER)).to.throw(error);
      expect(validate(DataType.BOOLEAN)).to.throw(error);
      expect(validate(DataType.OBJECT)).to.throw(error);
      validate(DataType.ARRAY);
    });

    it('expects a non-object property should not have the option "model" to be provided', function () {
      const validate = type => () => {
        const foo = {
          type,
          model: 'model',
        };
        S.validate('model', {foo});
      };
      const error =
        'The property "foo" of the model "model" has the non-object type, ' +
        'so it should not have the option "model" to be provided.';
      expect(validate(DataType.ANY)).to.throw(error);
      expect(validate(DataType.STRING)).to.throw(error);
      expect(validate(DataType.NUMBER)).to.throw(error);
      expect(validate(DataType.BOOLEAN)).to.throw(error);
      expect(validate(DataType.ARRAY)).to.throw(error);
      validate(DataType.OBJECT);
    });

    it('uses PrimaryKeysDefinitionValidator to validate primary keys', function () {
      const V = S.get(PrimaryKeysDefinitionValidator);
      sandbox.on(V, 'validate');
      const propDefs = {};
      S.validate('model', propDefs);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly('model', propDefs);
    });

    it('uses DefaultValuesDefinitionValidator to validate default values', function () {
      const V = S.get(DefaultValuesDefinitionValidator);
      sandbox.on(V, 'validate');
      const propDefs = {};
      S.validate('model', propDefs);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly('model', propDefs);
    });
  });
});
