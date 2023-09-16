import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {RepositoriesSchema} from '../schema/index.js';
import {FieldsClauseTool} from './fields-clause-tool.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

const S = new RepositoriesSchema();
const MODEL_NAME = 'model';
S.defineModel({name: MODEL_NAME});
const T = S.getService(FieldsClauseTool);

describe('FieldsClauseTool', function () {
  describe('filter', function () {
    it('returns an object with selected fields', function () {
      const value = {foo: 'fooVal', bar: 'barVal', baz: 'bazVal'};
      const fields = ['bar', 'baz'];
      const result = T.filter(value, MODEL_NAME, fields);
      expect(result).to.be.eql({bar: 'barVal', baz: 'bazVal'});
    });

    it('returns an array with selected fields', function () {
      const value = [
        {foo: 'fooVal', bar: 'barVal', baz: 'bazVal'},
        {foo: 'fooVal', bar: 'barVal', baz: 'bazVal'},
        {foo: 'fooVal', bar: 'barVal', baz: 'bazVal'},
      ];
      const fields = ['bar', 'baz'];
      const result = T.filter(value, MODEL_NAME, fields);
      expect(result[0]).to.be.eql({bar: 'barVal', baz: 'bazVal'});
      expect(result[1]).to.be.eql({bar: 'barVal', baz: 'bazVal'});
      expect(result[2]).to.be.eql({bar: 'barVal', baz: 'bazVal'});
    });

    it('includes a primary key', function () {
      const value = {[DEF_PK]: 10, foo: 'fooVal', bar: 'barVal', baz: 'bazVal'};
      const fields = ['bar', 'baz'];
      const result = T.filter(value, MODEL_NAME, fields);
      expect(result).to.be.eql({[DEF_PK]: 10, bar: 'barVal', baz: 'bazVal'});
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => T.filter(10, MODEL_NAME, ['bar']);
      expect(throwable).to.throw(
        'A first argument of FieldClauseTool.filter should be an Object or ' +
          'an Array of Object, but 10 given.',
      );
    });

    it('throws an error if elements of a first argument is not an object', function () {
      const throwable = () => T.filter([10], MODEL_NAME, ['bar']);
      expect(throwable).to.throw(
        'A first argument of FieldClauseTool.filter should be an Object or ' +
          'an Array of Object, but 10 given.',
      );
    });

    it('throws an error if a second argument is not a string', function () {
      const throwable = () => T.filter({}, MODEL_NAME, 10);
      expect(throwable).to.throw(
        'The provided option "fields" should be a String ' +
          'or an Array of String, but 10 given.',
      );
    });

    it('throws an error if elements of a second argument is not a string', function () {
      const throwable = () => T.filter({}, MODEL_NAME, [10]);
      expect(throwable).to.throw(
        'The provided option "fields" should be a String ' +
          'or an Array of String, but 10 given.',
      );
    });
  });

  describe('validateFieldsClause', function () {
    it('requires a non-empty string or an array of non-empty strings', function () {
      const validate = v => () => FieldsClauseTool.validateFieldsClause(v);
      const error = v =>
        format(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of String, but %s given.',
          v,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate([''])).to.throw(error('""'));
      expect(validate([10])).to.throw(error('10'));
      expect(validate([true])).to.throw(error('true'));
      expect(validate([false])).to.throw(error('false'));
      expect(validate([undefined])).to.throw(error('undefined'));
      expect(validate([null])).to.throw(error('null'));
      validate('');
      validate(false);
      validate(undefined);
      validate(null);
      validate('foo');
      validate(['foo']);
    });
  });

  describe('normalizeFieldsClause', function () {
    it('returns an array of strings', function () {
      const fn = FieldsClauseTool.normalizeFieldsClause;
      expect(fn('foo')).to.be.eql(['foo']);
      expect(fn(['foo'])).to.be.eql(['foo']);
    });

    it('requires a non-empty string or an array of non-empty strings', function () {
      const fn = clause => () => FieldsClauseTool.normalizeFieldsClause(clause);
      const error = v =>
        format(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of String, but %s given.',
          v,
        );
      expect(fn(10)).to.throw(error('10'));
      expect(fn(true)).to.throw(error('true'));
      expect(fn({})).to.throw(error('Object'));
      expect(fn([''])).to.throw(error('""'));
      expect(fn([10])).to.throw(error('10'));
      expect(fn([true])).to.throw(error('true'));
      expect(fn([false])).to.throw(error('false'));
      expect(fn([undefined])).to.throw(error('undefined'));
      expect(fn([null])).to.throw(error('null'));
      expect(fn('')()).to.be.undefined;
      expect(fn(false)()).to.be.undefined;
      expect(fn(undefined)()).to.be.undefined;
      expect(fn(null)()).to.be.undefined;
      expect(fn('foo')()).to.be.eql(['foo']);
      expect(fn(['foo'])()).to.be.eql(['foo']);
    });
  });
});
