import chai from 'chai';
import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {RelationsDefinitionValidator} from './relations/index.js';
import {PropertiesDefinitionValidator} from './properties/index.js';
import {ModelDefinitionValidator} from './model-definition-validator.js';

const S = new ModelDefinitionValidator();
const sandbox = chai.spy.sandbox();

describe('ModelDefinitionValidator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  describe('validate', function () {
    it('requires the given definition to be an object', function () {
      const validate = value => () => S.validate(value);
      const error = value =>
        format(
          'The model definition should be an Object, but %v given.',
          value,
        );
      expect(validate('str')).to.throw(error('str'));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate(false)).to.throw(error(false));
      expect(validate([])).to.throw(error([]));
      expect(validate(undefined)).to.throw(error(undefined));
      expect(validate(null)).to.throw(error(null));
      validate({name: 'model'})();
    });

    it('requires the option "name" as a non-empty string', function () {
      const validate = name => () => S.validate({name});
      const error = value =>
        format(
          'The model definition requires the option "name" ' +
            'as a non-empty String, but %v given.',
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

    it('expects the provided option "datasource" to be a string', function () {
      const validate = datasource => () =>
        S.validate({name: 'model', datasource});
      const error = value =>
        format(
          'The provided option "datasource" of the model "model" ' +
            'should be a String, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate('datasource')();
    });

    it('expects the provided option "base" to be a string', function () {
      const validate = base => () => S.validate({name: 'model', base});
      const error = value =>
        format(
          'The provided option "base" of the model "model" ' +
            'should be a String, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate('base')();
    });

    it('expects the provided option "tableName" to be a string', function () {
      const validate = tableName => () =>
        S.validate({name: 'model', tableName});
      const error = value =>
        format(
          'The provided option "tableName" of the model "model" ' +
            'should be a String, but %v given.',
          value,
        );
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      expect(validate({})).to.throw(error({}));
      validate('tableName')();
    });

    it('expects the provided option "properties" to be an object', function () {
      const validate = properties => () =>
        S.validate({name: 'model', properties});
      const error = value =>
        format(
          'The provided option "properties" of the model "model" ' +
            'should be an Object, but %v given.',
          value,
        );
      expect(validate('str')).to.throw(error('str'));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      validate({})();
    });

    it('expects the provided option "relations" to be an object', function () {
      const validate = relations => () =>
        S.validate({name: 'model', relations});
      const error = value =>
        format(
          'The provided option "relations" of the model "model" ' +
            'should be an Object, but %v given.',
          value,
        );
      expect(validate('str')).to.throw(error('str'));
      expect(validate(10)).to.throw(error(10));
      expect(validate(true)).to.throw(error(true));
      expect(validate([])).to.throw(error([]));
      validate({})();
    });

    it('uses PropertiesDefinitionValidator service to validate model properties', function () {
      const V = S.get(PropertiesDefinitionValidator);
      sandbox.on(V, 'validate');
      const properties = {};
      S.validate({name: 'model', properties});
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly('model', properties);
    });

    it('uses RelationsDefinitionValidator service to validate model relations', function () {
      const V = S.get(RelationsDefinitionValidator);
      sandbox.on(V, 'validate');
      const relations = {};
      S.validate({name: 'model', relations});
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly('model', relations);
    });
  });
});
