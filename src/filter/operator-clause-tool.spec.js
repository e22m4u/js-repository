import {format} from 'util';
import {expect} from 'chai';
import {OperatorClauseTool} from './operator-clause-tool.js';
import {InvalidOperatorValueError} from '../errors/index.js';

const S = new OperatorClauseTool();

describe('OperatorClauseTool', function () {
  describe('compare', function () {
    it('returns a negative number if a second value is greatest', function () {
      expect(S.compare(0, 5)).to.be.eq(-5);
      expect(S.compare(0, '5')).to.be.eq(-5);
      expect(S.compare(0, true)).to.be.eq(-1);
      expect(S.compare('0', 5)).to.be.eq(-5);
      expect(S.compare('a', 'b')).to.be.eq(-1);
    });

    it('returns a positive number if a second value is lowest', function () {
      expect(S.compare(5, 0)).to.be.eq(5);
      expect(S.compare(5, '0')).to.be.eq(5);
      expect(S.compare(5, false)).to.be.eq(5);
      expect(S.compare(5, true)).to.be.eq(4);
      expect(S.compare('5', 0)).to.be.eq(5);
      expect(S.compare('b', 'a')).to.be.eq(1);
    });

    it('returns zero if given values are equal', function () {
      const obj = {};
      expect(S.compare(0, 0)).to.be.eq(0);
      expect(S.compare(0, '0')).to.be.eq(0);
      expect(S.compare('0', 0)).to.be.eq(0);
      expect(S.compare('a', 'a')).to.be.eq(0);
      expect(S.compare(obj, obj)).to.be.eq(0);
      expect(S.compare(null, null)).to.be.eq(0);
      expect(S.compare(undefined, undefined)).to.be.eq(0);
    });

    it('returns NaN if we do not know how to compare', function () {
      expect(isNaN(S.compare(null, 'string'))).to.be.true;
      expect(isNaN(S.compare(null, 10))).to.be.true;
      expect(isNaN(S.compare([], 0))).to.be.true;
      expect(isNaN(S.compare([], []))).to.be.true;
      expect(isNaN(S.compare({}, {}))).to.be.true;
      expect(isNaN(S.compare(10, {}))).to.be.true;
      expect(isNaN(S.compare('string', Symbol()))).to.be.true;
    });
  });

  describe('testAll', function () {
    it('tests "eq" and "neq" operators', function () {
      expect(S.testAll({eq: 10}, 10)).to.be.true;
      expect(S.testAll({eq: 10}, 9)).to.be.false;
      expect(S.testAll({neq: 10}, 9)).to.be.true;
      expect(S.testAll({neq: 10}, 10)).to.be.false;
    });

    it('tests "gt", "gte", "lt" and "lte" operators', function () {
      expect(S.testAll({gt: 5}, 6)).to.be.true;
      expect(S.testAll({gte: 5}, 5)).to.be.true;
      expect(S.testAll({lt: 5}, 4)).to.be.true;
      expect(S.testAll({lte: 5}, 5)).to.be.true;
      expect(S.testAll({gt: 5}, 5)).to.be.false;
      expect(S.testAll({gte: 5}, 4)).to.be.false;
      expect(S.testAll({lt: 5}, 5)).to.be.false;
      expect(S.testAll({lte: 5}, 6)).to.be.false;
    });

    it('tests a "inq" operator', function () {
      expect(S.testAll({inq: [1, 2, 3]}, 2)).to.be.true;
      expect(S.testAll({inq: [1, 2, 3]}, 'a')).to.be.false;
    });

    it('tests a "nin" operator', function () {
      expect(S.testAll({nin: [1, 2, 3]}, 'a')).to.be.true;
      expect(S.testAll({nin: [1, 2, 3]}, 2)).to.be.false;
    });

    it('tests a "between" operator', function () {
      expect(S.testAll({between: [-2, 2]}, 0)).to.be.true;
      expect(S.testAll({between: [-2, 2]}, 10)).to.be.false;
    });

    it('tests an "exists" operator', function () {
      expect(S.testAll({exists: true}, 10)).to.be.true;
      expect(S.testAll({exists: false}, undefined)).to.be.true;
      expect(S.testAll({exists: true}, undefined)).to.be.false;
      expect(S.testAll({exists: false}, 10)).to.be.false;
    });

    it('tests a "like" operator', function () {
      expect(S.testAll({like: 'World'}, 'Hello World!')).to.be.true;
      expect(S.testAll({like: 'world'}, 'Hello World!')).to.be.false;
    });

    it('tests a "nlike" operator', function () {
      expect(S.testAll({nlike: 'John'}, 'Hello World!')).to.be.true;
      expect(S.testAll({nlike: 'World'}, 'Hello World!')).to.be.false;
    });

    it('tests a "ilike" operator', function () {
      expect(S.testAll({ilike: 'WORLD'}, 'Hello World!')).to.be.true;
      expect(S.testAll({ilike: 'John'}, 'Hello World!')).to.be.false;
    });

    it('tests a "nilike" operator', function () {
      expect(S.testAll({nilike: 'John'}, 'Hello World!')).to.be.true;
      expect(S.testAll({nilike: 'world'}, 'Hello World!')).to.be.false;
    });

    it('tests a "regexp" operator', function () {
      expect(S.testAll({regexp: 'Wo.+'}, 'Hello World!')).to.be.true;
      expect(S.testAll({regexp: 'Fo.+'}, 'Hello World!')).to.be.false;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testAll(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testAll ' +
          'should be an Object, but 10 given.',
      );
    });
  });

  describe('testEqNeq', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testEqNeq({}, 'value');
      expect(result).to.be.undefined;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testEqNeq(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testEqNeq ' +
          'should be an Object, but 10 given.',
      );
    });

    describe('eq', function () {
      it('returns true if a given value is equal to reference', function () {
        expect(S.testEqNeq({eq: 0}, 0)).to.be.true;
        expect(S.testEqNeq({eq: 0}, '0')).to.be.true;
        expect(S.testEqNeq({eq: 0}, false)).to.be.true;
        expect(S.testEqNeq({eq: 1}, true)).to.be.true;
        expect(S.testEqNeq({eq: 'a'}, 'a')).to.be.true;
        expect(S.testEqNeq({eq: true}, true)).to.be.true;
        expect(S.testEqNeq({eq: false}, false)).to.be.true;
        expect(S.testEqNeq({eq: Infinity}, Infinity)).to.be.true;
        expect(S.testEqNeq({eq: null}, null)).to.be.true;
        expect(S.testEqNeq({eq: undefined}, undefined)).to.be.true;
      });

      it('returns false if a given value is not-equal to reference', function () {
        expect(S.testEqNeq({eq: 0}, 1)).to.be.false;
        expect(S.testEqNeq({eq: 0}, '1')).to.be.false;
        expect(S.testEqNeq({eq: 0}, true)).to.be.false;
        expect(S.testEqNeq({eq: 0}, Infinity)).to.be.false;
        expect(S.testEqNeq({eq: 0}, null)).to.be.false;
        expect(S.testEqNeq({eq: 0}, undefined)).to.be.false;
        expect(S.testEqNeq({eq: '0'}, '1')).to.be.false;
        expect(S.testEqNeq({eq: '0'}, true)).to.be.false;
        expect(S.testEqNeq({eq: '0'}, Infinity)).to.be.false;
        expect(S.testEqNeq({eq: '0'}, null)).to.be.false;
        expect(S.testEqNeq({eq: '0'}, undefined)).to.be.false;
        expect(S.testEqNeq({eq: true}, false)).to.be.false;
        expect(S.testEqNeq({eq: true}, null)).to.be.false;
        expect(S.testEqNeq({eq: true}, undefined)).to.be.false;
        expect(S.testEqNeq({eq: false}, true)).to.be.false;
        expect(S.testEqNeq({eq: false}, null)).to.be.false;
        expect(S.testEqNeq({eq: false}, undefined)).to.be.false;
      });
    });

    describe('neq', function () {
      it('returns false if a given value is strictly equal to reference', function () {
        expect(S.testEqNeq({neq: 0}, 0)).to.be.false;
        expect(S.testEqNeq({neq: 0}, '0')).to.be.false;
        expect(S.testEqNeq({neq: 0}, false)).to.be.false;
        expect(S.testEqNeq({neq: 1}, true)).to.be.false;
        expect(S.testEqNeq({neq: 'a'}, 'a')).to.be.false;
        expect(S.testEqNeq({neq: true}, true)).to.be.false;
        expect(S.testEqNeq({neq: false}, false)).to.be.false;
        expect(S.testEqNeq({neq: Infinity}, Infinity)).to.be.false;
        expect(S.testEqNeq({neq: null}, null)).to.be.false;
        expect(S.testEqNeq({neq: undefined}, undefined)).to.be.false;
      });

      it('returns true if a given value is strictly not-equal to reference', function () {
        expect(S.testEqNeq({neq: 0}, 1)).to.be.true;
        expect(S.testEqNeq({neq: 0}, '1')).to.be.true;
        expect(S.testEqNeq({neq: 0}, true)).to.be.true;
        expect(S.testEqNeq({neq: 0}, Infinity)).to.be.true;
        expect(S.testEqNeq({neq: 0}, null)).to.be.true;
        expect(S.testEqNeq({neq: 0}, undefined)).to.be.true;
        expect(S.testEqNeq({neq: '0'}, '1')).to.be.true;
        expect(S.testEqNeq({neq: '0'}, true)).to.be.true;
        expect(S.testEqNeq({neq: '0'}, Infinity)).to.be.true;
        expect(S.testEqNeq({neq: '0'}, null)).to.be.true;
        expect(S.testEqNeq({neq: '0'}, undefined)).to.be.true;
        expect(S.testEqNeq({neq: true}, false)).to.be.true;
        expect(S.testEqNeq({neq: true}, null)).to.be.true;
        expect(S.testEqNeq({neq: true}, undefined)).to.be.true;
        expect(S.testEqNeq({neq: false}, true)).to.be.true;
        expect(S.testEqNeq({neq: false}, null)).to.be.true;
        expect(S.testEqNeq({neq: false}, undefined)).to.be.true;
      });
    });
  });

  describe('testGtLt', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testGtLt({}, 'value');
      expect(result).to.be.undefined;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testGtLt(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testGtLt ' +
          'should be an Object, but 10 given.',
      );
    });

    describe('gt', function () {
      it('returns true if a given value is greater than reference', function () {
        expect(S.testGtLt({gt: 0}, 5)).to.be.true;
        expect(S.testGtLt({gt: 0}, '5')).to.be.true;
        expect(S.testGtLt({gt: 0}, Infinity)).to.be.true;
        expect(S.testGtLt({gt: 0}, true)).to.be.true;
        expect(S.testGtLt({gt: -1}, false)).to.be.true;
        expect(S.testGtLt({gt: 'a'}, 'b')).to.be.true;
      });

      it('returns false if a given value is equal to reference', function () {
        expect(S.testGtLt({gt: 0}, 0)).to.be.false;
        expect(S.testGtLt({gt: 0}, '0')).to.be.false;
        expect(S.testGtLt({gt: 0}, false)).to.be.false;
        expect(S.testGtLt({gt: 1}, true)).to.be.false;
        expect(S.testGtLt({gt: 'a'}, 'a')).to.be.false;
      });

      it('returns false if a given value is lower than reference', function () {
        expect(S.testGtLt({gt: 2}, 0)).to.be.false;
        expect(S.testGtLt({gt: 2}, '0')).to.be.false;
        expect(S.testGtLt({gt: 2}, true)).to.be.false;
        expect(S.testGtLt({gt: 2}, false)).to.be.false;
        expect(S.testGtLt({gt: 'b'}, 'a')).to.be.false;
      });

      it('returns false if we do not know how to compare', function () {
        expect(S.testGtLt({gt: 1}, [])).to.be.false;
        expect(S.testGtLt({gt: 1}, {})).to.be.false;
        expect(S.testGtLt({gt: 1}, null)).to.be.false;
        expect(S.testGtLt({gt: 1}, undefined)).to.be.false;
        expect(S.testGtLt({gt: 1}, NaN)).to.be.false;
        expect(S.testGtLt({gt: 1}, Symbol())).to.be.false;
      });
    });

    describe('gte', function () {
      it('returns true if a given value is greater than reference', function () {
        expect(S.testGtLt({gte: 0}, 5)).to.be.true;
        expect(S.testGtLt({gte: 0}, '5')).to.be.true;
        expect(S.testGtLt({gte: 0}, Infinity)).to.be.true;
        expect(S.testGtLt({gte: 0}, true)).to.be.true;
        expect(S.testGtLt({gte: -1}, false)).to.be.true;
        expect(S.testGtLt({gte: 'a'}, 'b')).to.be.true;
      });

      it('returns true if a given value is equal to reference', function () {
        expect(S.testGtLt({gte: 0}, 0)).to.be.true;
        expect(S.testGtLt({gte: 0}, '0')).to.be.true;
        expect(S.testGtLt({gte: 0}, false)).to.be.true;
        expect(S.testGtLt({gte: 1}, true)).to.be.true;
        expect(S.testGtLt({gte: 'a'}, 'a')).to.be.true;
      });

      it('returns false if a given value is lower than reference', function () {
        expect(S.testGtLt({gte: 2}, 0)).to.be.false;
        expect(S.testGtLt({gte: 2}, '0')).to.be.false;
        expect(S.testGtLt({gte: 2}, true)).to.be.false;
        expect(S.testGtLt({gte: 2}, false)).to.be.false;
        expect(S.testGtLt({gte: 'b'}, 'a')).to.be.false;
      });

      it('returns false if we do not know how to compare', function () {
        expect(S.testGtLt({gte: 1}, [])).to.be.false;
        expect(S.testGtLt({gte: 1}, {})).to.be.false;
        expect(S.testGtLt({gte: 1}, null)).to.be.false;
        expect(S.testGtLt({gte: 1}, undefined)).to.be.false;
        expect(S.testGtLt({gte: 1}, NaN)).to.be.false;
        expect(S.testGtLt({gte: 1}, Symbol())).to.be.false;
      });
    });

    describe('lt', function () {
      it('returns false if a given value is greater than reference', function () {
        expect(S.testGtLt({lt: 0}, 5)).to.be.false;
        expect(S.testGtLt({lt: 0}, '5')).to.be.false;
        expect(S.testGtLt({lt: 0}, Infinity)).to.be.false;
        expect(S.testGtLt({lt: 0}, true)).to.be.false;
        expect(S.testGtLt({lt: -1}, false)).to.be.false;
        expect(S.testGtLt({lt: 'a'}, 'b')).to.be.false;
      });

      it('returns false if a given value is equal to reference', function () {
        expect(S.testGtLt({lt: 0}, 0)).to.be.false;
        expect(S.testGtLt({lt: 0}, '0')).to.be.false;
        expect(S.testGtLt({lt: 0}, false)).to.be.false;
        expect(S.testGtLt({lt: 1}, true)).to.be.false;
        expect(S.testGtLt({lt: 'a'}, 'a')).to.be.false;
      });

      it('returns true if a given value is lower than reference', function () {
        expect(S.testGtLt({lt: 2}, 0)).to.be.true;
        expect(S.testGtLt({lt: 2}, '0')).to.be.true;
        expect(S.testGtLt({lt: 2}, true)).to.be.true;
        expect(S.testGtLt({lt: 2}, false)).to.be.true;
        expect(S.testGtLt({lt: 'b'}, 'a')).to.be.true;
      });

      it('returns false if we do not know how to compare', function () {
        expect(S.testGtLt({lt: 1}, [])).to.be.false;
        expect(S.testGtLt({lt: 1}, {})).to.be.false;
        expect(S.testGtLt({lt: 1}, null)).to.be.false;
        expect(S.testGtLt({lt: 1}, undefined)).to.be.false;
        expect(S.testGtLt({lt: 1}, NaN)).to.be.false;
        expect(S.testGtLt({lt: 1}, Symbol())).to.be.false;
      });
    });

    describe('lte', function () {
      it('returns false if a given value is greater than reference', function () {
        expect(S.testGtLt({lte: 0}, 5)).to.be.false;
        expect(S.testGtLt({lte: 0}, '5')).to.be.false;
        expect(S.testGtLt({lte: 0}, Infinity)).to.be.false;
        expect(S.testGtLt({lte: 0}, true)).to.be.false;
        expect(S.testGtLt({lte: -1}, false)).to.be.false;
        expect(S.testGtLt({lte: 'a'}, 'b')).to.be.false;
      });

      it('returns true if a given value is equal to reference', function () {
        expect(S.testGtLt({lte: 0}, 0)).to.be.true;
        expect(S.testGtLt({lte: 0}, '0')).to.be.true;
        expect(S.testGtLt({lte: 0}, false)).to.be.true;
        expect(S.testGtLt({lte: 1}, true)).to.be.true;
        expect(S.testGtLt({lte: 'a'}, 'a')).to.be.true;
      });

      it('returns true if a given value is lower than reference', function () {
        expect(S.testGtLt({lte: 2}, 0)).to.be.true;
        expect(S.testGtLt({lte: 2}, '0')).to.be.true;
        expect(S.testGtLt({lte: 2}, true)).to.be.true;
        expect(S.testGtLt({lte: 2}, false)).to.be.true;
        expect(S.testGtLt({lte: 'b'}, 'a')).to.be.true;
      });

      it('returns false if we do not know how to compare', function () {
        expect(S.testGtLt({lte: 1}, [])).to.be.false;
        expect(S.testGtLt({lte: 1}, {})).to.be.false;
        expect(S.testGtLt({lte: 1}, null)).to.be.false;
        expect(S.testGtLt({lte: 1}, undefined)).to.be.false;
        expect(S.testGtLt({lte: 1}, NaN)).to.be.false;
        expect(S.testGtLt({lte: 1}, Symbol())).to.be.false;
      });
    });
  });

  describe('testInq', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testInq({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns true if a given value has in array', function () {
      expect(S.testInq({inq: [1, 2]}, 2)).to.be.true;
      expect(S.testInq({inq: [1, 2]}, '2')).to.be.true;
      expect(S.testInq({inq: ['a', 'b']}, 'b')).to.be.true;
      expect(S.testInq({inq: [1, 2]}, true)).to.be.true;
      expect(S.testInq({inq: [-1, 0]}, false)).to.be.true;
    });

    it('returns false if a given value is not in array', function () {
      expect(S.testInq({inq: [1, 2]}, 3)).to.be.false;
      expect(S.testInq({inq: [1, 2]}, '3')).to.be.false;
      expect(S.testInq({inq: ['a', 'b']}, 'c')).to.be.false;
      expect(S.testInq({inq: [-1, 0]}, true)).to.be.false;
      expect(S.testInq({inq: [1, 2]}, false)).to.be.false;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testInq(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testInq ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const inq = 10;
      const throwable = () => S.testInq({inq}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a string', function () {
      const inq = '10';
      const throwable = () => S.testInq({inq}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const inq = {};
      const throwable = () => S.testInq({inq}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const inq = null;
      const throwable = () => S.testInq({inq}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testNin', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testNin({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns false if a given value has in array', function () {
      expect(S.testNin({nin: [1, 2]}, 2)).to.be.false;
      expect(S.testNin({nin: [1, 2]}, '2')).to.be.false;
      expect(S.testNin({nin: ['a', 'b']}, 'b')).to.be.false;
      expect(S.testNin({nin: [1, 2]}, true)).to.be.false;
      expect(S.testNin({nin: [-1, 0]}, false)).to.be.false;
    });

    it('returns true if a given value is not in array', function () {
      expect(S.testNin({nin: [1, 2]}, 3)).to.be.true;
      expect(S.testNin({nin: [1, 2]}, '3')).to.be.true;
      expect(S.testNin({nin: ['a', 'b']}, 'c')).to.be.true;
      expect(S.testNin({nin: [-1, 0]}, true)).to.be.true;
      expect(S.testNin({nin: [1, 2]}, false)).to.be.true;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testNin(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testNin ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const nin = 10;
      const throwable = () => S.testNin({nin}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a string', function () {
      const nin = '10';
      const throwable = () => S.testNin({nin}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const nin = {};
      const throwable = () => S.testNin({nin}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const nin = null;
      const throwable = () => S.testNin({nin}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testBetween', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testBetween({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns true if a given value exists in a range', function () {
      expect(S.testBetween({between: [-2, 2]}, -2)).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, 0)).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, 2)).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, '-2')).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, '0')).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, '2')).to.be.true;
      expect(S.testBetween({between: ['b', 'd']}, 'b')).to.be.true;
      expect(S.testBetween({between: ['b', 'd']}, 'c')).to.be.true;
      expect(S.testBetween({between: ['b', 'd']}, 'd')).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, true)).to.be.true;
      expect(S.testBetween({between: [-2, 2]}, false)).to.be.true;
    });

    it('returns false if a given value not exists in a range', function () {
      expect(S.testBetween({between: [-2, 2]}, -5)).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, 5)).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, '-5')).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, '5')).to.be.false;
      expect(S.testBetween({between: ['b', 'd']}, 'a')).to.be.false;
      expect(S.testBetween({between: ['b', 'd']}, 'e')).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, null)).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, undefined)).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, NaN)).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, Infinity)).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, Symbol())).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, [])).to.be.false;
      expect(S.testBetween({between: [-2, 2]}, {})).to.be.false;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testBetween(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testBetween ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if a given range is not valid', function () {
      const setOf1 = [10];
      const setOf2 = [10, 20];
      const setOf3 = [10, 20, 30];
      const throwable1 = () => S.testBetween({between: setOf1}, 10);
      const throwable2 = () => S.testBetween({between: setOf2}, 10);
      const throwable3 = () => S.testBetween({between: setOf3}, 10);
      expect(throwable1).to.throw(InvalidOperatorValueError);
      expect(throwable2).to.not.throw(InvalidOperatorValueError);
      expect(throwable3).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a number', function () {
      const between = 10;
      const throwable = () => S.testBetween({between}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a string', function () {
      const between = '10';
      const throwable = () => S.testBetween({between}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a boolean', function () {
      const between = true;
      const throwable = () => S.testBetween({between}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const between = {};
      const throwable = () => S.testBetween({between}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const between = null;
      const throwable = () => S.testBetween({between}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testExists', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testExists({}, 'value');
      expect(result).to.be.undefined;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testExists(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testExists ' +
          'should be an Object, but 10 given.',
      );
    });

    describe('exists', function () {
      it('returns true for non-undefined values', function () {
        expect(S.testExists({exists: true}, 0)).to.be.true;
        expect(S.testExists({exists: true}, '')).to.be.true;
        expect(S.testExists({exists: true}, null)).to.be.true;
        expect(S.testExists({exists: true}, NaN)).to.be.true;
        expect(S.testExists({exists: true}, Infinity)).to.be.true;
        expect(S.testExists({exists: true}, Symbol())).to.be.true;
        expect(S.testExists({exists: true}, true)).to.be.true;
        expect(S.testExists({exists: true}, false)).to.be.true;
        expect(S.testExists({exists: true}, [])).to.be.true;
        expect(S.testExists({exists: true}, {})).to.be.true;
      });

      it('returns false for undefined value', function () {
        expect(S.testExists({exists: true}, undefined)).to.be.false;
      });
    });

    describe('not exists', function () {
      it('returns false for non-undefined values', function () {
        expect(S.testExists({exists: false}, 0)).to.be.false;
        expect(S.testExists({exists: false}, '')).to.be.false;
        expect(S.testExists({exists: false}, null)).to.be.false;
        expect(S.testExists({exists: false}, NaN)).to.be.false;
        expect(S.testExists({exists: false}, Infinity)).to.be.false;
        expect(S.testExists({exists: false}, Symbol())).to.be.false;
        expect(S.testExists({exists: false}, true)).to.be.false;
        expect(S.testExists({exists: false}, false)).to.be.false;
        expect(S.testExists({exists: false}, [])).to.be.false;
        expect(S.testExists({exists: false}, {})).to.be.false;
      });

      it('returns true for undefined value', function () {
        expect(S.testExists({exists: false}, undefined)).to.be.true;
      });
    });

    it('throws an error if an operator value is a number', function () {
      const exists = 10;
      const throwable = () => S.testExists({exists}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a string', function () {
      const exists = '10';
      const throwable = () => S.testExists({exists}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const exists = {};
      const throwable = () => S.testExists({exists}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const exists = null;
      const throwable = () => S.testExists({exists}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testLike', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testLike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns true if a given value matches a substring', function () {
      expect(S.testLike({like: 'val'}, 'value')).to.be.true;
      expect(S.testLike({like: 'lue'}, 'value')).to.be.true;
      expect(S.testLike({like: 'value'}, 'value')).to.be.true;
    });

    it('returns false if a given value not matches a substring', function () {
      expect(S.testLike({like: 'value'}, 'val')).to.be.false;
      expect(S.testLike({like: 'value'}, 'lue')).to.be.false;
      expect(S.testLike({like: 'value'}, 'foo')).to.be.false;
    });

    it('uses case-sensitive matching for a substring', function () {
      expect(S.testLike({like: 'Val'}, 'value')).to.be.false;
      expect(S.testLike({like: 'Val'}, 'Value')).to.be.true;
      expect(S.testLike({like: 'val'}, 'Value')).to.be.false;
    });

    it('returns true if a given value matches a string expression', function () {
      expect(S.testLike({like: 'val.+'}, 'value')).to.be.true;
    });

    it('returns false if a given value not matches a string expression', function () {
      expect(S.testLike({like: 'foo.+'}, 'value')).to.be.false;
    });

    it('uses case-sensitive matching for a string expression', function () {
      expect(S.testLike({like: 'Val.+'}, 'value')).to.be.false;
      expect(S.testLike({like: 'Val.+'}, 'Value')).to.be.true;
      expect(S.testLike({like: 'val.+'}, 'Value')).to.be.false;
    });

    it('returns true if a given value matches a RegExp', function () {
      expect(S.testLike({like: new RegExp(/val.+/)}, 'value')).to.be.true;
    });

    it('returns false if a given value matches a RegExp', function () {
      expect(S.testLike({like: new RegExp(/foo.+/)}, 'value')).to.be.false;
    });

    it('uses case-sensitive matching for a RegExp', function () {
      expect(S.testLike({like: new RegExp(/Val.+/)}, 'value')).to.be.false;
      expect(S.testLike({like: new RegExp(/Val.+/)}, 'Value')).to.be.true;
      expect(S.testLike({like: new RegExp(/val.+/)}, 'Value')).to.be.false;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testLike(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testLike ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const like = 10;
      const throwable = () => S.testLike({like}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const like = {};
      const throwable = () => S.testLike({like}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const like = null;
      const throwable = () => S.testLike({like}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testNlike', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testNlike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns false if a given value matches a substring', function () {
      expect(S.testNlike({nlike: 'val'}, 'value')).to.be.false;
      expect(S.testNlike({nlike: 'lue'}, 'value')).to.be.false;
      expect(S.testNlike({nlike: 'value'}, 'value')).to.be.false;
    });

    it('returns true if a given value not matches a substring', function () {
      expect(S.testNlike({nlike: 'value'}, 'val')).to.be.true;
      expect(S.testNlike({nlike: 'value'}, 'lue')).to.be.true;
      expect(S.testNlike({nlike: 'value'}, 'foo')).to.be.true;
    });

    it('uses case-sensitive matching for a substring', function () {
      expect(S.testNlike({nlike: 'Val'}, 'value')).to.be.true;
      expect(S.testNlike({nlike: 'Val'}, 'Value')).to.be.false;
      expect(S.testNlike({nlike: 'val'}, 'Value')).to.be.true;
    });

    it('returns false if a given value matches a string expression', function () {
      expect(S.testNlike({nlike: 'val.+'}, 'value')).to.be.false;
    });

    it('returns true if a given value not matches a string expression', function () {
      expect(S.testNlike({nlike: 'foo.+'}, 'value')).to.be.true;
    });

    it('uses case-sensitive matching for a string expression', function () {
      expect(S.testNlike({nlike: 'Val.+'}, 'value')).to.be.true;
      expect(S.testNlike({nlike: 'Val.+'}, 'Value')).to.be.false;
      expect(S.testNlike({nlike: 'val.+'}, 'Value')).to.be.true;
    });

    it('returns false if a given value matches a RegExp', function () {
      expect(S.testNlike({nlike: new RegExp(/val.+/)}, 'value')).to.be.false;
    });

    it('returns true if a given value matches a RegExp', function () {
      expect(S.testNlike({nlike: new RegExp(/foo.+/)}, 'value')).to.be.true;
    });

    it('uses case-sensitive matching for a RegExp', function () {
      expect(S.testNlike({nlike: new RegExp(/Val.+/)}, 'value')).to.be.true;
      expect(S.testNlike({nlike: new RegExp(/Val.+/)}, 'Value')).to.be.false;
      expect(S.testNlike({nlike: new RegExp(/val.+/)}, 'Value')).to.be.true;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testNlike(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testNlike ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const nlike = 10;
      const throwable = () => S.testNlike({nlike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const nlike = {};
      const throwable = () => S.testNlike({nlike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const nlike = null;
      const throwable = () => S.testNlike({nlike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testIlike', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testIlike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns true if a given value matches a substring', function () {
      expect(S.testIlike({ilike: 'val'}, 'value')).to.be.true;
      expect(S.testIlike({ilike: 'lue'}, 'value')).to.be.true;
      expect(S.testIlike({ilike: 'value'}, 'value')).to.be.true;
    });

    it('returns false if a given value not matches a substring', function () {
      expect(S.testIlike({ilike: 'value'}, 'val')).to.be.false;
      expect(S.testIlike({ilike: 'value'}, 'lue')).to.be.false;
      expect(S.testIlike({ilike: 'value'}, 'foo')).to.be.false;
    });

    it('uses case-insensitive matching for a substring', function () {
      expect(S.testIlike({ilike: 'Val'}, 'value')).to.be.true;
      expect(S.testIlike({ilike: 'Val'}, 'Value')).to.be.true;
      expect(S.testIlike({ilike: 'val'}, 'Value')).to.be.true;
    });

    it('returns true if a given value matches a string expression', function () {
      expect(S.testIlike({ilike: 'val.+'}, 'value')).to.be.true;
    });

    it('returns false if a given value not matches a string expression', function () {
      expect(S.testIlike({ilike: 'foo.+'}, 'value')).to.be.false;
    });

    it('uses case-insensitive matching for a string expression', function () {
      expect(S.testIlike({ilike: 'Val.+'}, 'value')).to.be.true;
      expect(S.testIlike({ilike: 'Val.+'}, 'Value')).to.be.true;
      expect(S.testIlike({ilike: 'val.+'}, 'Value')).to.be.true;
    });

    it('returns true if a given value matches a RegExp', function () {
      expect(S.testIlike({ilike: new RegExp(/val.+/)}, 'value')).to.be.true;
    });

    it('returns false if a given value matches a RegExp', function () {
      expect(S.testIlike({ilike: new RegExp(/foo.+/)}, 'value')).to.be.false;
    });

    it('uses case-insensitive matching for a RegExp', function () {
      expect(S.testIlike({ilike: new RegExp(/Val.+/)}, 'value')).to.be.true;
      expect(S.testIlike({ilike: new RegExp(/Val.+/)}, 'Value')).to.be.true;
      expect(S.testIlike({ilike: new RegExp(/val.+/)}, 'Value')).to.be.true;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testIlike(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testIlike ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const ilike = 10;
      const throwable = () => S.testIlike({ilike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const ilike = {};
      const throwable = () => S.testIlike({ilike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const ilike = null;
      const throwable = () => S.testIlike({ilike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testNilike', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testNilike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns false if a given value matches a substring', function () {
      expect(S.testNilike({nilike: 'val'}, 'value')).to.be.false;
      expect(S.testNilike({nilike: 'lue'}, 'value')).to.be.false;
      expect(S.testNilike({nilike: 'value'}, 'value')).to.be.false;
    });

    it('returns true if a given value not matches a substring', function () {
      expect(S.testNilike({nilike: 'value'}, 'val')).to.be.true;
      expect(S.testNilike({nilike: 'value'}, 'lue')).to.be.true;
      expect(S.testNilike({nilike: 'value'}, 'foo')).to.be.true;
    });

    it('uses case-insensitive matching for a substring', function () {
      expect(S.testNilike({nilike: 'Val'}, 'value')).to.be.false;
      expect(S.testNilike({nilike: 'Val'}, 'Value')).to.be.false;
      expect(S.testNilike({nilike: 'val'}, 'Value')).to.be.false;
    });

    it('returns false if a given value matches a string expression', function () {
      expect(S.testNilike({nilike: 'val.+'}, 'value')).to.be.false;
    });

    it('returns true if a given value not matches a string expression', function () {
      expect(S.testNilike({nilike: 'foo.+'}, 'value')).to.be.true;
    });

    it('uses case-insensitive matching for a string expression', function () {
      expect(S.testNilike({nilike: 'Val.+'}, 'value')).to.be.false;
      expect(S.testNilike({nilike: 'Val.+'}, 'Value')).to.be.false;
      expect(S.testNilike({nilike: 'val.+'}, 'Value')).to.be.false;
    });

    it('returns false if a given value matches a RegExp', function () {
      expect(S.testNilike({nilike: new RegExp(/val.+/)}, 'value')).to.be.false;
    });

    it('returns true if a given value matches a RegExp', function () {
      expect(S.testNilike({nilike: new RegExp(/foo.+/)}, 'value')).to.be.true;
    });

    it('uses case-insensitive matching for a RegExp', function () {
      expect(S.testNilike({nilike: new RegExp(/Val.+/)}, 'value')).to.be.false;
      expect(S.testNilike({nilike: new RegExp(/Val.+/)}, 'Value')).to.be.false;
      expect(S.testNilike({nilike: new RegExp(/val.+/)}, 'Value')).to.be.false;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testNilike(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testNilike ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const nilike = 10;
      const throwable = () => S.testNilike({nilike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const nilike = {};
      const throwable = () => S.testNilike({nilike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const nilike = null;
      const throwable = () => S.testNilike({nilike}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });
  });

  describe('testRegexp', function () {
    it('returns undefined if no operator given', function () {
      const result = S.testRegexp({}, 'value');
      expect(result).to.be.undefined;
    });

    it('returns true if a given value matches a substring', function () {
      expect(S.testRegexp({regexp: 'val'}, 'value')).to.be.true;
      expect(S.testRegexp({regexp: 'lue'}, 'value')).to.be.true;
      expect(S.testRegexp({regexp: 'value'}, 'value')).to.be.true;
    });

    it('returns false if a given value not matches a substring', function () {
      expect(S.testRegexp({regexp: 'value'}, 'val')).to.be.false;
      expect(S.testRegexp({regexp: 'value'}, 'lue')).to.be.false;
      expect(S.testRegexp({regexp: 'value'}, 'foo')).to.be.false;
    });

    it('uses case-sensitive matching for a substring', function () {
      expect(S.testRegexp({regexp: 'Val'}, 'value')).to.be.false;
      expect(S.testRegexp({regexp: 'Val'}, 'Value')).to.be.true;
      expect(S.testRegexp({regexp: 'val'}, 'Value')).to.be.false;
    });

    it('returns true if a given value matches a string expression', function () {
      expect(S.testRegexp({regexp: 'val.+'}, 'value')).to.be.true;
    });

    it('returns false if a given value not matches a string expression', function () {
      expect(S.testRegexp({regexp: 'foo.+'}, 'value')).to.be.false;
    });

    it('uses case-sensitive matching for a string expression', function () {
      expect(S.testRegexp({regexp: 'Val.+'}, 'value')).to.be.false;
      expect(S.testRegexp({regexp: 'Val.+'}, 'Value')).to.be.true;
      expect(S.testRegexp({regexp: 'val.+'}, 'Value')).to.be.false;
    });

    it('returns true if a given value matches a RegExp', function () {
      expect(S.testRegexp({regexp: /val.+/}, 'value')).to.be.true;
    });

    it('returns false if a given value matches a RegExp', function () {
      expect(S.testRegexp({regexp: /foo.+/}, 'value')).to.be.false;
    });

    it('uses case-sensitive matching for a RegExp', function () {
      expect(S.testRegexp({regexp: /Val.+/}, 'value')).to.be.false;
      expect(S.testRegexp({regexp: /Val.+/}, 'Value')).to.be.true;
      expect(S.testRegexp({regexp: /val.+/}, 'Value')).to.be.false;
    });

    it('returns false if a given value is not a string', function () {
      expect(S.testRegexp({regexp: /val.+/}, 10)).to.be.false;
      expect(S.testRegexp({regexp: /val.+/}, '')).to.be.false;
    });

    it('uses the "flags" option', function () {
      expect(S.testRegexp({regexp: /Val.+/}, 'value')).to.be.false;
      expect(S.testRegexp({regexp: 'Val.+'}, 'value')).to.be.false;
      expect(S.testRegexp({regexp: /Val.+/, flags: 'i'}, 'value')).to.be.true;
      expect(S.testRegexp({regexp: 'Val.+', flags: 'i'}, 'value')).to.be.true;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testRegexp(10);
      expect(throwable).to.throw(
        'A first argument of OperatorUtils.testRegexp ' +
          'should be an Object, but 10 given.',
      );
    });

    it('throws an error if an operator value is a number', function () {
      const regexp = 10;
      const throwable = () => S.testRegexp({regexp}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is an object', function () {
      const regexp = {};
      const throwable = () => S.testRegexp({regexp}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if an operator value is a null', function () {
      const regexp = null;
      const throwable = () => S.testRegexp({regexp}, 10);
      expect(throwable).to.throw(InvalidOperatorValueError);
    });

    it('throws an error if a "flags" value is not a string', function () {
      const throwable = v => () =>
        S.testRegexp({regexp: 'Val.+', flags: v}, 'val');
      const error = v =>
        format('RegExp flags must be a String, but %s given.', v);
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      throwable('')();
      throwable(0)();
      throwable(false)();
      throwable(undefined)();
      throwable(null)();
    });
  });
});
