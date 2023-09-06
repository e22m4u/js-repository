import {expect} from 'chai';
import {format} from 'util';
import {DataType} from './data-type.js';
import {PrimaryKeysDefinitionValidator} from './primary-keys-definition-validator.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../model-definition-utils.js';

const S = new PrimaryKeysDefinitionValidator();

describe('PrimaryKeysDefinitionValidator', function () {
  describe('validate', function () {
    it('does not throw an error if no primary keys provided in case of a short property definition', function () {
      S.validate('model', {
        foo: DataType.STRING,
        bar: DataType.NUMBER,
      });
    });

    it('does not throw an error if no primary keys provided in case of a full property definition', function () {
      S.validate('model', {
        foo: {
          type: DataType.STRING,
          default: 'string',
        },
        bar: {
          type: DataType.NUMBER,
          default: 10,
        },
      });
    });

    it('throws an error if a model definition has a multiple primary keys', function () {
      const throwable = () =>
        S.validate('model', {
          foo: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          bar: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        });
      expect(throwable).to.throw(
        'The model definition "model" should not have ' +
          'multiple primary keys, but 2 keys given.',
      );
    });

    it('throws an error if a default primary key is already in use as a regular property in case of a short property definition', function () {
      const throwable = () =>
        S.validate('model', {
          [DEF_PK]: DataType.NUMBER,
        });
      expect(throwable).to.throw(
        format(
          'The property name "%s" of the model "model" is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEF_PK,
        ),
      );
    });

    it('throws an error if a default primary key is already in use as a regular property in case of a full property definition', function () {
      const throwable = () =>
        S.validate('model', {
          [DEF_PK]: {
            type: DataType.NUMBER,
          },
        });
      expect(throwable).to.throw(
        format(
          'The property name "%s" of the model "model" is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEF_PK,
        ),
      );
    });

    it('throws an error if a default primary key is already in use as a regular property with a default value', function () {
      const throwable = () =>
        S.validate('model', {
          [DEF_PK]: {
            type: DataType.NUMBER,
            default: 10,
          },
        });
      expect(throwable).to.throw(
        format(
          'The property name "%s" of the model "model" is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEF_PK,
        ),
      );
    });

    it('throws an error if a default primary key defined explicitly and it has a default value', function () {
      const throwable = () =>
        S.validate('model', {
          [DEF_PK]: {
            type: DataType.NUMBER,
            primaryKey: true,
            default: 10,
          },
        });
      expect(throwable).to.throw(
        format(
          'Do not specify a default value for the ' +
            'primary key "%s" of the model "model".',
          DEF_PK,
        ),
      );
    });

    it('does not throw an error if a default primary key is defined explicitly', function () {
      S.validate('model', {
        [DEF_PK]: {
          type: DataType.NUMBER,
          primaryKey: true,
        },
      });
    });

    it('does not throw an error if a primary key has a custom name', function () {
      S.validate('model', {
        myId: {
          type: DataType.NUMBER,
          primaryKey: true,
        },
      });
    });

    it('does not throw an error if a primary key has a custom name and a default primary key is used as a regular property', function () {
      S.validate('model', {
        myId: {
          type: DataType.NUMBER,
          primaryKey: true,
        },
        [DEF_PK]: DataType.STRING,
      });
    });
  });
});
