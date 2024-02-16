import chai from 'chai';
import {expect} from 'chai';
import {DataType} from './data-type.js';
import {format} from '@e22m4u/js-format';
import {PropertyValidatorRegistry} from './property-validator/index.js';
import {PropertyTransformerRegistry} from './property-transformer/index.js';
import {PropertiesDefinitionValidator} from './properties-definition-validator.js';
import {PrimaryKeysDefinitionValidator} from './primary-keys-definition-validator.js';

const S = new PropertiesDefinitionValidator();
const sandbox = chai.spy.sandbox();

S.getService(PropertyValidatorRegistry).addValidator('myValidator', () => true);
S.getService(PropertyTransformerRegistry).addTransformer(
  'myTransformer',
  () => true,
);

describe('PropertiesDefinitionValidator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  describe('validate', function () {
    it('requires a first argument to be a non-empty string', function () {
      const validate = v => () => S.validate(v, {});
      const error = v =>
        format(
          'The first argument of PropertiesDefinitionValidator.validate ' +
            'should be a non-empty String, but %s given.',
          v,
        );
      expect(validate('')).to.throw(error('""'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate('model')();
    });

    it('requires a second argument to be an object', function () {
      const validate = v => () => S.validate('model', v);
      const error = v =>
        format(
          'The provided option "properties" of the model "model" ' +
            'should be an Object, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate({})();
    });

    it('requires a property name as a non-empty string', function () {
      const validate = v => () => S.validate('model', v);
      const error = v =>
        format(
          'The property name of the model "model" should be ' +
            'a non-empty String, but %s given.',
          v,
        );
      expect(validate({['']: {}})).to.throw(error('""'));
      validate({foo: DataType.STRING})();
    });

    it('requires a property definition', function () {
      const validate = v => () => S.validate('model', {foo: v});
      const error = v =>
        format(
          'The property "foo" of the model "model" should have ' +
            'a property definition, but %s given.',
          v,
        );
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate(DataType.STRING)();
      validate({type: DataType.STRING})();
    });

    it('expects a short property definition to be DataType', function () {
      const validate = v => () => S.validate('model', {foo: v});
      const error = v =>
        format(
          'In case of a short property definition, the property "foo" ' +
            'of the model "model" should have one of data types: %l, but %s given.',
          Object.values(DataType),
          v,
        );
      expect(validate('invalid')).to.throw(error('"invalid"'));
      validate(DataType.STRING)();
    });

    it('expects a full property definition to be an object', function () {
      const validate = v => () => S.validate('model', {foo: v});
      const error = v =>
        format(
          'In case of a full property definition, the property "foo" ' +
            'of the model "model" should be an Object, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      validate({type: DataType.STRING})();
    });

    it('requires the option "type" to be a DataType', function () {
      const validate = v => () => S.validate('model', {foo: {type: v}});
      const error = v =>
        format(
          'The property "foo" of the model "model" requires the option "type" ' +
            'to have one of data types: %l, but %s given.',
          Object.values(DataType),
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate(DataType.STRING)();
    });

    it('expects provided the option "itemType" to be a DataType', function () {
      const validate = v => {
        const foo = {type: DataType.ARRAY, itemType: v};
        return () => S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "itemType" of the property "foo" in the model "model" ' +
            'should have one of data types: %l, but %s given.',
          Object.values(DataType),
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      validate(DataType.STRING)();
    });

    it('expects provided the option "model" to be a string', function () {
      const validate = v => {
        const foo = {
          type: DataType.OBJECT,
          model: v,
        };
        return () => S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "model" of the property "foo" in the model "model" ' +
            'should be a String, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      validate('model')();
    });

    it('expects provided the option "primaryKey" to be a boolean', function () {
      const validate = v => {
        const foo = {
          type: DataType.STRING,
          primaryKey: v,
        };
        return () => S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "primaryKey" of the property "foo" in the model "model" ' +
            'should be a Boolean, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      validate(true)();
      validate(false)();
    });

    it('expects provided the option "columnName" to be a string', function () {
      const validate = v => {
        const foo = {
          type: DataType.STRING,
          columnName: v,
        };
        return () => S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "columnName" of the property "foo" in the model "model" ' +
            'should be a String, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      validate('columnName')();
    });

    it('expects provided the option "columnType" to be a string', function () {
      const validate = v => {
        const foo = {
          type: DataType.STRING,
          columnType: v,
        };
        return () => S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "columnType" of the property "foo" in the model "model" ' +
            'should be a String, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      validate('columnType')();
    });

    it('expects provided the option "required" to be a boolean', function () {
      const validate = v => {
        const foo = {
          type: DataType.STRING,
          required: v,
        };
        return () => S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "required" of the property "foo" in the model "model" ' +
            'should be a Boolean, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      validate(true)();
      validate(false)();
    });

    it('expects the required property should not have the option "default" to be provided', function () {
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          required: true,
          default: v,
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
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          primaryKey: true,
          required: v,
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
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          primaryKey: true,
          default: v,
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
      const validate = v => () => {
        const foo = {
          type: v,
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

    it('the option "model" requires the "object" property type', function () {
      const validate = v => () => {
        const foo = {
          type: v,
          model: 'model',
        };
        S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The option "model" is not supported for %s property type, ' +
            'so the property "foo" of the model "model" should not have ' +
            'the option "model" to be provided.',
          v,
        );
      expect(validate(DataType.ANY)).to.throw(error('Any'));
      expect(validate(DataType.STRING)).to.throw(error('String'));
      expect(validate(DataType.NUMBER)).to.throw(error('Number'));
      expect(validate(DataType.BOOLEAN)).to.throw(error('Boolean'));
      validate(DataType.OBJECT)();
    });

    it('the option "model" requires the "object" item type', function () {
      const validate = v => () => {
        const foo = {
          type: DataType.ARRAY,
          itemType: v,
          model: 'model',
        };
        S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The option "model" is not supported for Array property type of %s, ' +
            'so the property "foo" of the model "model" should not have ' +
            'the option "model" to be provided.',
          v,
        );
      expect(validate(DataType.ANY)).to.throw(error('Any'));
      expect(validate(DataType.STRING)).to.throw(error('String'));
      expect(validate(DataType.NUMBER)).to.throw(error('Number'));
      expect(validate(DataType.BOOLEAN)).to.throw(error('Boolean'));
      expect(validate(DataType.ARRAY)).to.throw(error('Array'));
      validate(DataType.OBJECT)();
    });

    it('uses PrimaryKeysDefinitionValidator to validate primary keys', function () {
      const V = S.getService(PrimaryKeysDefinitionValidator);
      sandbox.on(V, 'validate');
      const propDefs = {};
      S.validate('model', propDefs);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly('model', propDefs);
    });

    it('the option "validate" should have a non-empty String, an Array of String or an Object', function () {
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          validate: v,
        };
        S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "validate" of the property "foo" in the model "model" ' +
            'should be a non-empty String, an Array of String or an Object, ' +
            'but %s given.',
          v,
        );
      expect(validate('')).to.throw(error('""'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(0)).to.throw(error('0'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate(() => undefined)).to.throw(error('Function'));
      validate('myValidator')();
      validate(['myValidator'])();
      validate([])();
      validate({myValidator: true})();
      validate({})();
      validate(null)();
      validate(undefined)();
    });

    it('the option "validate" requires only existing validator names', function () {
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          validate: v,
        };
        S.validate('model', {foo});
      };
      const error = v => format('The property validator %s is not found.', v);
      expect(validate('unknown')).to.throw(error('"unknown"'));
      expect(validate({unknown: true})).to.throw(error('"unknown"'));
      expect(validate(['unknown'])).to.throw(error('"unknown"'));
      validate('myValidator')();
      validate(['myValidator'])();
      validate({myValidator: true})();
    });

    it('the option "transform" should have a non-empty String, an Array of String or an Object', function () {
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          transform: v,
        };
        S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The provided option "transform" of the property "foo" in the model "model" ' +
            'should be a non-empty String, an Array of String or an Object, ' +
            'but %s given.',
          v,
        );
      expect(validate('')).to.throw(error('""'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(0)).to.throw(error('0'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate(() => undefined)).to.throw(error('Function'));
      validate('myTransformer')();
      validate(['myTransformer'])();
      validate([])();
      validate({myTransformer: true})();
      validate({})();
      validate(null)();
      validate(undefined)();
    });

    it('the option "transform" requires only existing transformer names', function () {
      const validate = v => () => {
        const foo = {
          type: DataType.ANY,
          transform: v,
        };
        S.validate('model', {foo});
      };
      const error = v => format('The property transformer %s is not found.', v);
      expect(validate('unknown')).to.throw(error('"unknown"'));
      expect(validate({unknown: true})).to.throw(error('"unknown"'));
      expect(validate(['unknown'])).to.throw(error('"unknown"'));
      validate('myTransformer')();
      validate(['myTransformer'])();
      validate({myTransformer: true})();
    });
  });
});
