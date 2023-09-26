import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {SliceClauseTool} from './slice-clause-tool.js';

const S = new SliceClauseTool();

describe('SliceClauseTool', function () {
  describe('slice', function () {
    it('requires the first argument to be an array', function () {
      const throwable = v => () => S.slice(v);
      const error = v =>
        format(
          'The first argument of SliceClauseTool.slice ' +
            'should be an Array, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable([{foo: 'bar'}])()).to.be.eql([{foo: 'bar'}]);
      expect(throwable([])()).to.be.eql([]);
    });

    it('requires the provided second argument to be a number', function () {
      const items = [{foo: 'bar'}];
      const throwable = v => () => S.slice(items, v);
      const error = v =>
        format(
          'The provided option "skip" should be a Number, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(10)()).to.be.eql([]);
      expect(throwable(0)()).to.be.eql(items);
      expect(throwable(undefined)()).to.be.eql(items);
      expect(throwable(null)()).to.be.eql(items);
    });

    it('requires the provided third argument to be a number', function () {
      const items = [{foo: 'bar'}];
      const throwable = v => () => S.slice(items, undefined, v);
      const error = v =>
        format(
          'The provided option "limit" should be a Number, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(10)()).to.be.eql(items);
      expect(throwable(0)()).to.be.eql(items);
      expect(throwable(undefined)()).to.be.eql(items);
      expect(throwable(null)()).to.be.eql(items);
    });

    it('does nothing if no "skip" and "limit" options provided', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects);
      expect(result).to.be.eql(objects);
    });

    it('does nothing if the given "skip" option is zero', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 0);
      expect(result).to.be.eql(objects);
    });

    it('uses the given "skip" option to exclude array elements from start', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 2);
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(objects[2]);
    });

    it('returns an empty array when "skip" option overflows a size of the given array ', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 10);
      expect(result).to.have.length(0);
    });

    it('does nothing if the given "limit" option is zero', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, undefined, 0);
      expect(result).to.be.eql(objects);
    });

    it('uses the given "limit" option to trim the given array', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, undefined, 2);
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(objects[0]);
      expect(result[1]).to.be.eql(objects[1]);
    });

    it('uses the "skip" and "limit" options to slice the given array', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 1, 1);
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(objects[1]);
    });
  });

  describe('validateSkipClause', function () {
    it('requires a number value', function () {
      const throwable = v => () => SliceClauseTool.validateSkipClause(v);
      const error = v =>
        format(
          'The provided option "skip" should be a Number, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      throwable(10)();
      throwable(0)();
      throwable(undefined)();
      throwable(null)();
    });
  });

  describe('validateLimitClause', function () {
    it('requires a number value or a falsy value', function () {
      const throwable = v => () => SliceClauseTool.validateLimitClause(v);
      const error = v =>
        format(
          'The provided option "limit" should be a Number, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      throwable(10)();
      throwable(0)();
      throwable(undefined)();
      throwable(null)();
    });
  });
});
