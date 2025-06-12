import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {trimTransformer} from './builtin/index.js';
import {toUpperCaseTransformer} from './builtin/index.js';
import {toLowerCaseTransformer} from './builtin/index.js';
import {toTitleCaseTransformer} from './builtin/index.js';
import {PropertyTransformerRegistry} from './property-transformer-registry.js';

describe('PropertyTransformerRegistry', function () {
  describe('addTransformer', function () {
    it('has builtin transformers', function () {
      const ptr = new PropertyTransformerRegistry();
      expect(ptr['_transformers']).to.be.eql({
        trim: trimTransformer,
        toUpperCase: toUpperCaseTransformer,
        toLowerCase: toLowerCaseTransformer,
        toTitleCase: toTitleCaseTransformer,
      });
    });

    it('adds a given transformer with the name', function () {
      const ptr = new PropertyTransformerRegistry();
      const myTransformer = () => undefined;
      const res = ptr.addTransformer('myTransformer', myTransformer);
      expect(res).to.be.eq(ptr);
      expect(ptr['_transformers']['myTransformer']).to.be.eq(myTransformer);
    });

    it('requires the given name to be a non-empty string', function () {
      const ptr = new PropertyTransformerRegistry();
      const throwable = v => () => ptr.addTransformer(v, () => undefined);
      const error = v =>
        format(
          'A name of the property transformer must ' +
            'be a non-empty String, but %s given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable('str')();
    });

    it('throws an error if the given name already exists', function () {
      const ptr = new PropertyTransformerRegistry();
      ptr.addTransformer('test', () => undefined);
      const throwable = () => ptr.addTransformer('test', () => undefined);
      expect(throwable).to.throw(
        'The property transformer "test" is already defined.',
      );
    });

    it('requires the given transformer to be a function', function () {
      const ptr = new PropertyTransformerRegistry();
      const throwable = v => () => ptr.addTransformer('test', v);
      const error = v =>
        format(
          'The property transformer "test" must be a Function, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      throwable(() => undefined)();
    });
  });

  describe('hasTransformer', function () {
    it('returns false for a not existing name', function () {
      const ptr = new PropertyTransformerRegistry();
      expect(ptr.hasTransformer('str')).to.be.false;
      expect(ptr.hasTransformer('')).to.be.false;
      expect(ptr.hasTransformer(10)).to.be.false;
      expect(ptr.hasTransformer(0)).to.be.false;
      expect(ptr.hasTransformer(true)).to.be.false;
      expect(ptr.hasTransformer(false)).to.be.false;
      expect(ptr.hasTransformer(null)).to.be.false;
      expect(ptr.hasTransformer(undefined)).to.be.false;
      expect(ptr.hasTransformer({})).to.be.false;
      expect(ptr.hasTransformer([])).to.be.false;
      expect(ptr.hasTransformer(() => undefined)).to.be.false;
    });

    it('returns true for an existing name', function () {
      const ptr = new PropertyTransformerRegistry();
      expect(ptr.hasTransformer('test')).to.be.false;
      ptr.addTransformer('test', () => undefined);
      expect(ptr.hasTransformer('test')).to.be.true;
    });
  });

  describe('getTransformer', function () {
    it('returns transformer by its name', function () {
      const ptr = new PropertyTransformerRegistry();
      const myTransformer1 = () => undefined;
      const myTransformer2 = () => undefined;
      ptr.addTransformer('foo', myTransformer1);
      ptr.addTransformer('bar', myTransformer2);
      const res1 = ptr.getTransformer('foo');
      const res2 = ptr.getTransformer('bar');
      expect(res1).to.be.eq(myTransformer1);
      expect(res2).to.be.eq(myTransformer2);
    });

    it('throws an error for a not existed name', function () {
      const ptr = new PropertyTransformerRegistry();
      const throwable = v => () => ptr.getTransformer(v);
      const error = v =>
        format('The property transformer %s is not defined.', v);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
    });
  });
});
