import {expect} from 'chai';
import {DataType} from './data-type.js';
import {format} from '@e22m4u/util-format';
import {DefaultValuesDefinitionValidator} from './default-values-definition-validator.js';

const S = new DefaultValuesDefinitionValidator();

describe('DefaultValuesDefinitionValidator', function () {
  describe('validate', function () {
    it('requires a first argument to be a non-empty string', function () {
      const validate = v => () => S.validate(v, {});
      const error = v =>
        format(
          'A first argument of DefaultValuesDefinitionValidator.validate ' +
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

    it('does not throw an error if no properties defined', function () {
      S.validate('model', {});
    });

    it('does not throw an error if no default value specified for a required property', function () {
      S.validate('model', {
        foo: {
          type: DataType.STRING,
          required: true,
        },
      });
    });

    it('does not throw an error if a default value matches a property type', function () {
      S.validate('model', {
        foo: {
          type: DataType.BOOLEAN,
          default: false,
        },
      });
    });

    it('does not throw an error if a default value from a factory function matches a property type', function () {
      S.validate('model', {
        foo: {
          type: DataType.BOOLEAN,
          default: () => false,
        },
      });
    });

    it('throws an error if a default value does not match a property type', function () {
      const throwable = () =>
        S.validate('model', {
          foo: {
            type: DataType.STRING,
            default: 10,
          },
        });
      expect(throwable).to.throw(
        'A default value is invalid. The property "foo" of the model ' +
          '"model" must have a String, but Number given.',
      );
    });

    it('throws an error if a default value from a factory function does not match a property type', function () {
      const throwable = () =>
        S.validate('model', {
          foo: {
            type: DataType.STRING,
            default: () => 10,
          },
        });
      expect(throwable).to.throw(
        'A default value is invalid. The property "foo" of the model ' +
          '"model" must have a String, but Number given.',
      );
    });

    it('throws an error if an array element of a default value does not match an item type', function () {
      const throwable = () =>
        S.validate('model', {
          foo: {
            type: DataType.ARRAY,
            itemType: DataType.STRING,
            default: [10],
          },
        });
      expect(throwable).to.throw(
        'A default value is invalid. The array property "foo" of the model "model" ' +
          'must have a String element, but Number given.',
      );
    });

    it('throws an error if an array element from a default value factory does not match an item type', function () {
      const throwable = () =>
        S.validate('model', {
          foo: {
            type: DataType.ARRAY,
            itemType: DataType.STRING,
            default: () => [10],
          },
        });
      expect(throwable).to.throw(
        'A default value is invalid. The array property "foo" of the model "model" ' +
          'must have a String element, but Number given.',
      );
    });
  });
});
