import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {SliceClauseTool} from './slice-clause-tool.js';

const S = new SliceClauseTool();

describe('SliceClauseTool', function () {
  describe('filter', function () {
    it('does nothing if no clauses provided', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects);
      expect(result).to.be.eql(objects);
    });

    it('does nothing if a given skip is zero', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 0);
      expect(result).to.be.eql(objects);
    });

    it('uses a given skip to exclude array elements from start', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 2);
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(objects[2]);
    });

    it('returns an empty array if skipping too much', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 10);
      expect(result).to.have.length(0);
    });

    it('does nothing if a given limit is zero', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, undefined, 0);
      expect(result).to.be.eql(objects);
    });

    it('uses a given limit to trim a given array', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, undefined, 2);
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(objects[0]);
      expect(result[1]).to.be.eql(objects[1]);
    });

    it('able to combine a skip and a limit option together', function () {
      const objects = [{id: 1}, {id: 2}, {id: 3}];
      const result = S.slice(objects, 1, 1);
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(objects[1]);
    });

    it('throws an error if a first argument is not an array', function () {
      const throwable = () => S.slice(10);
      expect(throwable).to.throw(
        'A first argument of SliceClauseTool.slice ' +
          'should be an Array, but 10 given.',
      );
    });

    it('throws an error if the given "skip" option is not a number', function () {
      const throwable = () => S.slice([], 'invalid');
      expect(throwable).to.throw(
        'The provided option "skip" should be a Number, but "invalid" given.',
      );
    });

    it('throws an error if the given "limit" option is not a number', function () {
      const throwable = () => S.slice([], undefined, 'invalid');
      expect(throwable).to.throw(
        'The provided option "limit" should be a Number, but "invalid" given.',
      );
    });
  });

  describe('validateSkipClause', function () {
    it('requires a number value or a falsy value', function () {
      const validate = v => () => SliceClauseTool.validateSkipClause(v);
      const error = v =>
        format(
          'The provided option "skip" should be a Number, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      validate('');
      validate(false);
      validate(undefined);
      validate(null);
      validate(10);
      validate(0);
    });
  });

  describe('validateLimitClause', function () {
    it('requires a number value or a falsy value', function () {
      const validate = v => () => SliceClauseTool.validateLimitClause(v);
      const error = v =>
        format(
          'The provided option "limit" should be a Number, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      validate('');
      validate(false);
      validate(undefined);
      validate(null);
      validate(10);
      validate(0);
    });
  });
});
