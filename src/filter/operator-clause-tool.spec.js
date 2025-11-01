import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {OperatorClauseTool} from './operator-clause-tool.js';
import {InvalidOperatorValueError} from '../errors/index.js';

const S = new OperatorClauseTool();

describe('OperatorClauseTool', function () {
  describe('compare', function () {
    it('returns zero for equal values of the same type', function () {
      const obj = {};
      const arr = [];
      expect(S.compare(0, 0)).to.be.eq(0);
      expect(S.compare('a', 'a')).to.be.eq(0);
      expect(S.compare(true, true)).to.be.eq(0);
      expect(S.compare(obj, obj)).to.be.eq(0);
      expect(S.compare(arr, arr)).to.be.eq(0);
      expect(S.compare(null, null)).to.be.eq(0);
      expect(S.compare(undefined, undefined)).to.be.eq(0);
    });

    it('returns a non-zero number for different numbers', function () {
      expect(S.compare(5, 0)).to.be.eq(5);
      expect(S.compare(0, 5)).to.be.eq(-5);
    });

    it('returns a non-zero number for different booleans', function () {
      expect(S.compare(true, false)).to.be.eq(1);
      expect(S.compare(false, true)).to.be.eq(-1);
    });

    it('returns a non-zero number for different strings', function () {
      expect(S.compare('c', 'a')).to.be.eq(1);
      expect(S.compare('b', 'a')).to.be.eq(1);
      expect(S.compare('a', 'b')).to.be.eq(-1);
      expect(S.compare('a', 'c')).to.be.eq(-1);
    });

    it('compares numbers and numeric strings as numbers', function () {
      expect(S.compare(10, '10')).to.be.eq(0);
      expect(S.compare('10', 10)).to.be.eq(0);
      expect(S.compare(15, '10')).to.be.eq(5);
      expect(S.compare('15', 10)).to.be.eq(5);
      expect(S.compare(5, '10')).to.be.eq(-5);
      expect(S.compare('5', 10)).to.be.eq(-5);
    });

    it('returns NaN when comparing null/undefined with other types', function () {
      expect(S.compare(null, 'string')).to.be.NaN;
      expect(S.compare(null, 10)).to.be.NaN;
      expect(S.compare(null, 0)).to.be.NaN;
      expect(S.compare(null, false)).to.be.NaN;
      expect(S.compare(undefined, 'string')).to.be.NaN;
      expect(S.compare(undefined, 10)).to.be.NaN;
      expect(S.compare(undefined, 0)).to.be.NaN;
      expect(S.compare(undefined, false)).to.be.NaN;
    });

    it('returns 0 for deeply equal objects', function () {
      expect(S.compare({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})).to.be.eq(0);
    });

    it('returns NaN for different objects', function () {
      expect(S.compare({a: 1}, {a: 2})).to.be.NaN;
      expect(S.compare({a: 1}, {b: 1})).to.be.NaN;
    });

    it('returns 0 for deeply equal arrays', function () {
      expect(S.compare([1, {a: 2}], [1, {a: 2}])).to.be.eq(0);
    });

    it('returns NaN for different arrays', function () {
      expect(S.compare([1, 2], [1, 3])).to.be.NaN;
      expect(S.compare([1, 2], [1, 2, 3])).to.be.NaN;
    });

    it('returns NaN for incomparable types', function () {
      // строка (не число) и число
      expect(S.compare('abc', 10)).to.be.NaN;
      expect(S.compare(10, 'abc')).to.be.NaN;
      // строка и булево
      expect(S.compare('true', true)).to.be.NaN;
      expect(S.compare(true, 'true')).to.be.NaN;
      // число и объект
      expect(S.compare(10, {})).to.be.NaN;
      expect(S.compare({}, 10)).to.be.NaN;
      // строка и символ
      expect(S.compare('string', Symbol())).to.be.NaN;
      // объект и массив
      expect(S.compare({}, [])).to.be.NaN;
    });

    describe('with type conversion disabled (noTypeConversion = true)', function () {
      it('returns 0 only for strictly equal primitives', function () {
        expect(S.compare(10, 10, true)).to.be.eq(0);
        expect(S.compare('a', 'a', true)).to.be.eq(0);
        expect(S.compare(true, true, true)).to.be.eq(0);
      });

      it('returns NaN for different types, even if their values are equivalent', function () {
        expect(S.compare(10, '10', true)).to.be.NaN;
        expect(S.compare('10', 10, true)).to.be.NaN;
        expect(S.compare(1, true, true)).to.be.NaN;
        expect(S.compare(true, 1, true)).to.be.NaN;
        expect(S.compare(0, false, true)).to.be.NaN;
      });

      it('returns a non-zero number for different values of the same type', function () {
        expect(S.compare(10, 5, true)).to.be.greaterThan(0);
        expect(S.compare('b', 'a', true)).to.be.greaterThan(0);
        expect(S.compare(true, false, true)).to.be.greaterThan(0);
      });

      it('returns 0 for deeply equal objects and NaN for different ones', function () {
        expect(S.compare({a: 1}, {a: 1}, true)).to.be.eq(0);
        expect(S.compare({a: 1}, {a: 2}, true)).to.be.NaN;
      });

      it('returns 0 for deeply equal arrays and NaN for different ones', function () {
        expect(S.compare([1, 2], [1, 2], true)).to.be.eq(0);
        expect(S.compare([1, 2], [1, 3], true)).to.be.NaN;
      });
    });
  });

  describe('testAll', function () {
    it('should test "eq" and "neq" operators', function () {
      expect(S.testAll({eq: 10}, 10)).to.be.true;
      expect(S.testAll({eq: 10}, 9)).to.be.false;
      expect(S.testAll({neq: 10}, 9)).to.be.true;
      expect(S.testAll({neq: 10}, 10)).to.be.false;
    });

    it('should test "gt", "gte", "lt" and "lte" operators', function () {
      expect(S.testAll({gt: 5}, 6)).to.be.true;
      expect(S.testAll({gte: 5}, 5)).to.be.true;
      expect(S.testAll({lt: 5}, 4)).to.be.true;
      expect(S.testAll({lte: 5}, 5)).to.be.true;
      expect(S.testAll({gt: 5}, 5)).to.be.false;
      expect(S.testAll({gte: 5}, 4)).to.be.false;
      expect(S.testAll({lt: 5}, 5)).to.be.false;
      expect(S.testAll({lte: 5}, 6)).to.be.false;
    });

    it('should test the "inq" operator', function () {
      expect(S.testAll({inq: [1, 2, 3]}, 2)).to.be.true;
      expect(S.testAll({inq: [1, 2, 3]}, 'a')).to.be.false;
    });

    it('should test the "nin" operator', function () {
      expect(S.testAll({nin: [1, 2, 3]}, 'a')).to.be.true;
      expect(S.testAll({nin: [1, 2, 3]}, 2)).to.be.false;
    });

    it('should test the "between" operator', function () {
      expect(S.testAll({between: [-2, 2]}, 0)).to.be.true;
      expect(S.testAll({between: [-2, 2]}, 10)).to.be.false;
    });

    it('should test the "exists" operator', function () {
      expect(S.testAll({exists: true}, 10)).to.be.true;
      expect(S.testAll({exists: false}, undefined)).to.be.true;
      expect(S.testAll({exists: true}, undefined)).to.be.false;
      expect(S.testAll({exists: false}, 10)).to.be.false;
    });

    it('should test the "like" operator', function () {
      expect(S.testAll({like: '%World%'}, 'Hello World!')).to.be.true;
      expect(S.testAll({like: '%world%'}, 'Hello World!')).to.be.false;
    });

    it('should test the "nlike" operator', function () {
      expect(S.testAll({nlike: '%John%'}, 'Hello World!')).to.be.true;
      expect(S.testAll({nlike: '%World%'}, 'Hello World!')).to.be.false;
    });

    it('should test the "ilike" operator', function () {
      expect(S.testAll({ilike: '%WORLD%'}, 'Hello World!')).to.be.true;
      expect(S.testAll({ilike: '%John%'}, 'Hello World!')).to.be.false;
    });

    it('should test the "nilike" operator', function () {
      expect(S.testAll({nilike: '%John%'}, 'Hello World!')).to.be.true;
      expect(S.testAll({nilike: '%world%'}, 'Hello World!')).to.be.false;
    });

    it('should test the "regexp" operator', function () {
      expect(S.testAll({regexp: 'Wo.+'}, 'Hello World!')).to.be.true;
      expect(S.testAll({regexp: 'Fo.+'}, 'Hello World!')).to.be.false;
      expect(S.testAll({regexp: 'wo.+', flags: 'i'}, 'World')).to.be.true;
      expect(S.testAll({regexp: 'fo.+', flags: 'i'}, 'World')).to.be.false;
    });

    it('should allow to combine operators', function () {
      const clause = {gt: 20, lt: 30};
      expect(S.testAll(clause, 10)).to.be.false;
      expect(S.testAll(clause, 25)).to.be.true;
      expect(S.testAll(clause, 40)).to.be.false;
    });

    it('should return undefined for an empty clause or non-operator key', function () {
      expect(S.testAll({}, 'value')).to.be.undefined;
      expect(S.testAll({foo: 'bar'}, 'value')).to.be.undefined;
    });

    it('should throws an error if a first argument is not an object', function () {
      const throwable = () => S.testAll(10);
      expect(throwable).to.throw(
        'The first argument of OperatorUtils.testAll ' +
          'should be an Object, but 10 was given.',
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
        'The first argument of OperatorUtils.testEqNeq ' +
          'should be an Object, but 10 was given.',
      );
    });

    describe('eq', function () {
      it('returns true if a given value is equal to reference', function () {
        expect(S.testEqNeq({eq: 0}, 0)).to.be.true;
        expect(S.testEqNeq({eq: 1}, 1)).to.be.true;
        expect(S.testEqNeq({eq: 'a'}, 'a')).to.be.true;
        expect(S.testEqNeq({eq: true}, true)).to.be.true;
        expect(S.testEqNeq({eq: false}, false)).to.be.true;
        expect(S.testEqNeq({eq: Infinity}, Infinity)).to.be.true;
        expect(S.testEqNeq({eq: null}, null)).to.be.true;
        expect(S.testEqNeq({eq: undefined}, undefined)).to.be.true;
      });

      it('returns false if a given value is not-equal to reference', function () {
        expect(S.testEqNeq({eq: 0}, '0')).to.be.false;
        expect(S.testEqNeq({eq: 0}, false)).to.be.false;
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
        expect(S.testEqNeq({eq: 1}, '0')).to.be.false;
        expect(S.testEqNeq({eq: 1}, false)).to.be.false;
        expect(S.testEqNeq({eq: 1}, '1')).to.be.false;
        expect(S.testEqNeq({eq: 1}, true)).to.be.false;
        expect(S.testEqNeq({eq: 1}, Infinity)).to.be.false;
        expect(S.testEqNeq({eq: 1}, null)).to.be.false;
        expect(S.testEqNeq({eq: 1}, undefined)).to.be.false;
        expect(S.testEqNeq({eq: '1'}, '0')).to.be.false;
        expect(S.testEqNeq({eq: '1'}, true)).to.be.false;
        expect(S.testEqNeq({eq: '1'}, Infinity)).to.be.false;
        expect(S.testEqNeq({eq: '1'}, null)).to.be.false;
        expect(S.testEqNeq({eq: '1'}, undefined)).to.be.false;
        expect(S.testEqNeq({eq: true}, false)).to.be.false;
        expect(S.testEqNeq({eq: true}, null)).to.be.false;
        expect(S.testEqNeq({eq: true}, undefined)).to.be.false;
        expect(S.testEqNeq({eq: false}, true)).to.be.false;
        expect(S.testEqNeq({eq: false}, null)).to.be.false;
        expect(S.testEqNeq({eq: false}, undefined)).to.be.false;
      });

      it('returns true for deeply equal objects and arrays', function () {
        expect(S.testEqNeq({eq: {a: 1, b: {c: 2}}}, {a: 1, b: {c: 2}})).to.be
          .true;
        expect(S.testEqNeq({eq: [1, {a: 2}]}, [1, {a: 2}])).to.be.true;
      });

      it('returns false for different objects and arrays', function () {
        expect(S.testEqNeq({eq: {a: 1}}, {a: 2})).to.be.false;
        expect(S.testEqNeq({eq: {a: 1}}, {b: 1})).to.be.false;
        expect(S.testEqNeq({eq: [1, 2]}, [1, 3])).to.be.false;
        expect(S.testEqNeq({eq: [1, 2]}, [1, 2, 3])).to.be.false;
      });
    });

    describe('neq', function () {
      it('returns false if a given value is equal to reference', function () {
        expect(S.testEqNeq({neq: 0}, 0)).to.be.false;
        expect(S.testEqNeq({neq: 1}, 1)).to.be.false;
        expect(S.testEqNeq({neq: 'a'}, 'a')).to.be.false;
        expect(S.testEqNeq({neq: true}, true)).to.be.false;
        expect(S.testEqNeq({neq: false}, false)).to.be.false;
        expect(S.testEqNeq({neq: Infinity}, Infinity)).to.be.false;
        expect(S.testEqNeq({neq: null}, null)).to.be.false;
        expect(S.testEqNeq({neq: undefined}, undefined)).to.be.false;
      });

      it('returns true if a given value is not-equal to reference', function () {
        expect(S.testEqNeq({neq: 0}, '0')).to.be.true;
        expect(S.testEqNeq({neq: 0}, false)).to.be.true;
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
        expect(S.testEqNeq({neq: 1}, '0')).to.be.true;
        expect(S.testEqNeq({neq: 1}, false)).to.be.true;
        expect(S.testEqNeq({neq: 1}, '1')).to.be.true;
        expect(S.testEqNeq({neq: 1}, true)).to.be.true;
        expect(S.testEqNeq({neq: 1}, Infinity)).to.be.true;
        expect(S.testEqNeq({neq: 1}, null)).to.be.true;
        expect(S.testEqNeq({neq: 1}, undefined)).to.be.true;
        expect(S.testEqNeq({neq: '1'}, '0')).to.be.true;
        expect(S.testEqNeq({neq: '1'}, true)).to.be.true;
        expect(S.testEqNeq({neq: '1'}, Infinity)).to.be.true;
        expect(S.testEqNeq({neq: '1'}, null)).to.be.true;
        expect(S.testEqNeq({neq: '1'}, undefined)).to.be.true;
        expect(S.testEqNeq({neq: true}, false)).to.be.true;
        expect(S.testEqNeq({neq: true}, null)).to.be.true;
        expect(S.testEqNeq({neq: true}, undefined)).to.be.true;
        expect(S.testEqNeq({neq: false}, true)).to.be.true;
        expect(S.testEqNeq({neq: false}, null)).to.be.true;
        expect(S.testEqNeq({neq: false}, undefined)).to.be.true;
      });

      it('returns false for deeply equal objects and arrays', function () {
        expect(S.testEqNeq({neq: {a: 1, b: {c: 2}}}, {a: 1, b: {c: 2}})).to.be
          .false;
        expect(S.testEqNeq({neq: [1, {a: 2}]}, [1, {a: 2}])).to.be.false;
      });

      it('returns true for different objects and arrays', function () {
        expect(S.testEqNeq({neq: {a: 1}}, {a: 2})).to.be.true;
        expect(S.testEqNeq({neq: {a: 1}}, {b: 1})).to.be.true;
        expect(S.testEqNeq({neq: [1, 2]}, [1, 3])).to.be.true;
        expect(S.testEqNeq({neq: [1, 2]}, [1, 2, 3])).to.be.true;
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
        'The first argument of OperatorUtils.testGtLt ' +
          'should be an Object, but 10 was given.',
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
      expect(S.testInq({inq: ['a', 'b']}, 'b')).to.be.true;
    });

    it('returns false if a given value is not in array', function () {
      expect(S.testInq({inq: [1, 2]}, 3)).to.be.false;
      expect(S.testInq({inq: [1, 2]}, '2')).to.be.false;
      expect(S.testInq({inq: [1, 2]}, '3')).to.be.false;
      expect(S.testInq({inq: ['a', 'b']}, 'c')).to.be.false;
      expect(S.testInq({inq: [1, 2]}, true)).to.be.false;
      expect(S.testInq({inq: [1, 2]}, false)).to.be.false;
      expect(S.testInq({inq: [-1, 0]}, true)).to.be.false;
      expect(S.testInq({inq: [-1, 0]}, false)).to.be.false;
    });

    it('returns true if a given object is deeply equal to an element in the array', function () {
      const clause = {inq: [{a: 1}, {b: 2}]};
      expect(S.testInq(clause, {a: 1})).to.be.true;
    });

    it('returns false if a given object is not deeply equal to any element in the array', function () {
      const clause = {inq: [{a: 1}, {b: 2}]};
      expect(S.testInq(clause, {c: 3})).to.be.false;
    });

    it('returns true if a given array is deeply equal to an element in the array', function () {
      // prettier-ignore
      const clause = {inq: [[1, 2], [3, 4]]};
      expect(S.testInq(clause, [1, 2])).to.be.true;
    });

    it('returns false if a given array is not deeply equal to any element in the array', function () {
      // prettier-ignore
      const clause = {inq: [[1, 2], [3, 4]]};
      expect(S.testInq(clause, [5, 6])).to.be.false;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testInq(10);
      expect(throwable).to.throw(
        'The first argument of OperatorUtils.testInq ' +
          'should be an Object, but 10 was given.',
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

      expect(S.testNin({nin: ['a', 'b']}, 'b')).to.be.false;
    });

    it('returns true if a given value is not in array', function () {
      expect(S.testNin({nin: [1, 2]}, 3)).to.be.true;
      expect(S.testNin({nin: [1, 2]}, '2')).to.be.true;
      expect(S.testNin({nin: [1, 2]}, '3')).to.be.true;
      expect(S.testNin({nin: ['a', 'b']}, 'c')).to.be.true;
      expect(S.testNin({nin: [-1, 0]}, true)).to.be.true;
      expect(S.testNin({nin: [-1, 0]}, false)).to.be.true;
      expect(S.testNin({nin: [1, 2]}, true)).to.be.true;
      expect(S.testNin({nin: [1, 2]}, false)).to.be.true;
    });

    it('returns false if a given object is deeply equal to an element in the array', function () {
      const clause = {nin: [{a: 1}, {b: 2}]};
      expect(S.testNin(clause, {a: 1})).to.be.false;
    });

    it('returns true if a given object is not deeply equal to any element in the array', function () {
      const clause = {nin: [{a: 1}, {b: 2}]};
      expect(S.testNin(clause, {c: 3})).to.be.true;
    });

    it('returns false if a given array is deeply equal to an element in the array', function () {
      // prettier-ignore
      const clause = {nin: [[1, 2], [3, 4]]};
      expect(S.testNin(clause, [1, 2])).to.be.false;
    });

    it('returns true if a given array is not deeply equal to any element in the array', function () {
      // prettier-ignore
      const clause = {nin: [[1, 2], [3, 4]]};
      expect(S.testNin(clause, [5, 6])).to.be.true;
    });

    it('throws an error if a first argument is not an object', function () {
      const throwable = () => S.testNin(10);
      expect(throwable).to.throw(
        'The first argument of OperatorUtils.testNin ' +
          'should be an Object, but 10 was given.',
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
        'The first argument of OperatorUtils.testBetween ' +
          'should be an Object, but 10 was given.',
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
        'The first argument of OperatorUtils.testExists ' +
          'should be an Object, but 10 was given.',
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
    it('should return undefined if no operator given', function () {
      const result = S.testLike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('should return false when matching by substring', function () {
      expect(S.testLike({like: 'val'}, 'value')).to.be.false;
      expect(S.testLike({like: 'lue'}, 'value')).to.be.false;
      expect(S.testLike({like: 'alu'}, 'value')).to.be.false;
    });

    it('should return false when the value is a substring', function () {
      expect(S.testLike({like: 'value'}, 'val')).to.be.false;
      expect(S.testLike({like: 'value'}, 'lue')).to.be.false;
      expect(S.testLike({like: 'value'}, 'alu')).to.be.false;
    });

    it('should return true for exact match', function () {
      expect(S.testLike({like: 'value'}, 'value')).to.be.true;
    });

    it('should use case-sensitive matching', function () {
      expect(S.testLike({like: 'VALUE'}, 'VALUE')).to.be.true;
      expect(S.testLike({like: 'VALUE'}, 'value')).to.be.false;
      expect(S.testLike({like: 'value'}, 'VALUE')).to.be.false;
    });

    it('should handle "%" wildcard as zero or more characters', function () {
      expect(S.testLike({like: 'hello wo%'}, 'hello world today')).to.be.true;
      expect(S.testLike({like: '%ld today'}, 'hello world today')).to.be.true;
      expect(S.testLike({like: '%world%'}, 'hello world today')).to.be.true;
      expect(S.testLike({like: '%hello wo%'}, 'hello world today')).to.be.true;
      expect(S.testLike({like: '%ld today%'}, 'hello world today')).to.be.true;
      expect(S.testLike({like: '%wurld%'}, 'hello world today')).to.be.false;
    });

    it('should handle "_" wildcard as any characters', function () {
      expect(S.testLike({like: 'h_ll_'}, 'hello')).to.be.true;
      expect(S.testLike({like: 'hello_world'}, 'hello world')).to.be.true;
      expect(S.testLike({like: 'hello_'}, 'hello')).to.be.false;
      expect(S.testLike({like: '_hello'}, 'hello')).to.be.false;
    });

    it('should throw an error for non-object clause', function () {
      const throwable = v => () => {
        S.testLike(v);
      };
      const error = s =>
        format(
          'The first argument of OperatorUtils.testLike ' +
            'should be an Object, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable({})();
    });

    it('should throw an error for non-string operator value', function () {
      const throwable = v => () => {
        S.testLike({like: v});
      };
      const error = s =>
        format(
          'Condition of {like: ...} should have a String, but %s was given.',
          s,
        );
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({foo: 'bar'})).to.throw(error('Object'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      expect(throwable(new RegExp())).to.throw(error('RegExp (instance)'));
      throwable('str')();
      throwable(null);
      throwable(undefined);
    });
  });

  describe('testNlike', function () {
    it('should return undefined if no operator given', function () {
      const result = S.testNlike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('should return true when matching by substring', function () {
      expect(S.testNlike({nlike: 'val'}, 'value')).to.be.true;
      expect(S.testNlike({nlike: 'lue'}, 'value')).to.be.true;
      expect(S.testNlike({nlike: 'alu'}, 'value')).to.be.true;
    });

    it('should return true when the value is a substring', function () {
      expect(S.testNlike({nlike: 'value'}, 'val')).to.be.true;
      expect(S.testNlike({nlike: 'value'}, 'lue')).to.be.true;
      expect(S.testNlike({nlike: 'value'}, 'alu')).to.be.true;
    });

    it('should return true for exact match', function () {
      expect(S.testNlike({nlike: 'value'}, 'value')).to.be.false;
    });

    it('should use case-sensitive matching', function () {
      expect(S.testNlike({nlike: 'VALUE'}, 'VALUE')).to.be.false;
      expect(S.testNlike({nlike: 'VALUE'}, 'value')).to.be.true;
      expect(S.testNlike({nlike: 'value'}, 'VALUE')).to.be.true;
    });

    it('should handle "%" wildcard as zero or more characters', function () {
      expect(S.testNlike({nlike: 'hello wo%'}, 'hello world today')).to.be
        .false;
      expect(S.testNlike({nlike: '%ld today'}, 'hello world today')).to.be
        .false;
      expect(S.testNlike({nlike: '%world%'}, 'hello world today')).to.be.false;
      expect(S.testNlike({nlike: '%hello wo%'}, 'hello world today')).to.be
        .false;
      expect(S.testNlike({nlike: '%ld today%'}, 'hello world today')).to.be
        .false;
      expect(S.testNlike({nlike: '%wurld%'}, 'hello world today')).to.be.true;
    });

    it('should handle "_" wildcard as any characters', function () {
      expect(S.testNlike({nlike: 'h_ll_'}, 'hello')).to.be.false;
      expect(S.testNlike({nlike: 'hello_world'}, 'hello world')).to.be.false;
      expect(S.testNlike({nlike: 'hello_'}, 'hello')).to.be.true;
      expect(S.testNlike({nlike: '_hello'}, 'hello')).to.be.true;
    });

    it('should throw an error for non-object clause', function () {
      const throwable = v => () => {
        S.testNlike(v);
      };
      const error = s =>
        format(
          'The first argument of OperatorUtils.testNlike ' +
            'should be an Object, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable({})();
    });

    it('should throw an error for non-string operator value', function () {
      const throwable = v => () => {
        S.testNlike({nlike: v});
      };
      const error = s =>
        format(
          'Condition of {nlike: ...} should have a String, but %s was given.',
          s,
        );
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({foo: 'bar'})).to.throw(error('Object'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      expect(throwable(new RegExp())).to.throw(error('RegExp (instance)'));
      throwable('str')();
      throwable(null);
      throwable(undefined);
    });
  });

  describe('testIlike', function () {
    it('should return undefined if no operator given', function () {
      const result = S.testIlike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('should return false when matching by substring', function () {
      expect(S.testIlike({ilike: 'val'}, 'value')).to.be.false;
      expect(S.testIlike({ilike: 'lue'}, 'value')).to.be.false;
      expect(S.testIlike({ilike: 'alu'}, 'value')).to.be.false;
    });

    it('should return false when the value is a substring', function () {
      expect(S.testIlike({ilike: 'value'}, 'val')).to.be.false;
      expect(S.testIlike({ilike: 'value'}, 'lue')).to.be.false;
      expect(S.testIlike({ilike: 'value'}, 'alu')).to.be.false;
    });

    it('should return true for exact match', function () {
      expect(S.testIlike({ilike: 'value'}, 'value')).to.be.true;
    });

    it('should use case-insensitive matching', function () {
      expect(S.testIlike({ilike: 'VALUE'}, 'VALUE')).to.be.true;
      expect(S.testIlike({ilike: 'VALUE'}, 'value')).to.be.true;
      expect(S.testIlike({ilike: 'value'}, 'VALUE')).to.be.true;
    });

    it('should handle "%" wildcard as zero or more characters', function () {
      expect(S.testIlike({ilike: 'hello wo%'}, 'hello world today')).to.be.true;
      expect(S.testIlike({ilike: '%ld today'}, 'hello world today')).to.be.true;
      expect(S.testIlike({ilike: '%world%'}, 'hello world today')).to.be.true;
      expect(S.testIlike({ilike: '%hello wo%'}, 'hello world today')).to.be
        .true;
      expect(S.testIlike({ilike: '%ld today%'}, 'hello world today')).to.be
        .true;
      expect(S.testIlike({ilike: '%wurld%'}, 'hello world today')).to.be.false;
    });

    it('should handle "_" wildcard as any characters', function () {
      expect(S.testIlike({ilike: 'h_ll_'}, 'hello')).to.be.true;
      expect(S.testIlike({ilike: 'hello_world'}, 'hello world')).to.be.true;
      expect(S.testIlike({ilike: 'hello_'}, 'hello')).to.be.false;
      expect(S.testIlike({ilike: '_hello'}, 'hello')).to.be.false;
    });

    it('should throw an error for non-object clause', function () {
      const throwable = v => () => {
        S.testIlike(v);
      };
      const error = s =>
        format(
          'The first argument of OperatorUtils.testIlike ' +
            'should be an Object, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable({})();
    });

    it('should throw an error for non-string operator value', function () {
      const throwable = v => () => {
        S.testIlike({ilike: v});
      };
      const error = s =>
        format(
          'Condition of {ilike: ...} should have a String, but %s was given.',
          s,
        );
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({foo: 'bar'})).to.throw(error('Object'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      expect(throwable(new RegExp())).to.throw(error('RegExp (instance)'));
      throwable('str')();
      throwable(null);
      throwable(undefined);
    });
  });

  describe('testNilike', function () {
    it('should return undefined if no operator given', function () {
      const result = S.testNilike({}, 'value');
      expect(result).to.be.undefined;
    });

    it('should return true when matching by substring', function () {
      expect(S.testNilike({nilike: 'val'}, 'value')).to.be.true;
      expect(S.testNilike({nilike: 'lue'}, 'value')).to.be.true;
      expect(S.testNilike({nilike: 'alu'}, 'value')).to.be.true;
    });

    it('should return true when the value is a substring', function () {
      expect(S.testNilike({nilike: 'value'}, 'val')).to.be.true;
      expect(S.testNilike({nilike: 'value'}, 'lue')).to.be.true;
      expect(S.testNilike({nilike: 'value'}, 'alu')).to.be.true;
    });

    it('should return false for exact match', function () {
      expect(S.testNilike({nilike: 'value'}, 'value')).to.be.false;
    });

    it('should use case-insensitive matching', function () {
      expect(S.testNilike({nilike: 'VALUE'}, 'VALUE')).to.be.false;
      expect(S.testNilike({nilike: 'VALUE'}, 'value')).to.be.false;
      expect(S.testNilike({nilike: 'value'}, 'VALUE')).to.be.false;
    });

    it('should handle "%" wildcard as zero or more characters', function () {
      expect(S.testNilike({nilike: 'hello wo%'}, 'hello world today')).to.be
        .false;
      expect(S.testNilike({nilike: '%ld today'}, 'hello world today')).to.be
        .false;
      expect(S.testNilike({nilike: '%world%'}, 'hello world today')).to.be
        .false;
      expect(S.testNilike({nilike: '%hello wo%'}, 'hello world today')).to.be
        .false;
      expect(S.testNilike({nilike: '%ld today%'}, 'hello world today')).to.be
        .false;
      expect(S.testNilike({nilike: '%wurld%'}, 'hello world today')).to.be.true;
    });

    it('should handle "_" wildcard as any characters', function () {
      expect(S.testNilike({nilike: 'h_ll_'}, 'hello')).to.be.false;
      expect(S.testNilike({nilike: 'hello_world'}, 'hello world')).to.be.false;
      expect(S.testNilike({nilike: 'hello_'}, 'hello')).to.be.true;
      expect(S.testNilike({nilike: '_hello'}, 'hello')).to.be.true;
    });

    it('should throw an error for non-object clause', function () {
      const throwable = v => () => {
        S.testNilike(v);
      };
      const error = s =>
        format(
          'The first argument of OperatorUtils.testNilike ' +
            'should be an Object, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable({})();
    });

    it('should throw an error for non-string operator value', function () {
      const throwable = v => () => {
        S.testNilike({nilike: v});
      };
      const error = s =>
        format(
          'Condition of {nilike: ...} should have a String, but %s was given.',
          s,
        );
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({foo: 'bar'})).to.throw(error('Object'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([1, 2, 3])).to.throw(error('Array'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      expect(throwable(new RegExp())).to.throw(error('RegExp (instance)'));
      throwable('str')();
      throwable(null);
      throwable(undefined);
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
        'The first argument of OperatorUtils.testRegexp ' +
          'should be an Object, but 10 was given.',
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
        format('RegExp flags should be a String, but %s was given.', v);
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
