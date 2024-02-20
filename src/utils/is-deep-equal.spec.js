import {expect} from 'chai';
import {isDeepEqual} from './is-deep-equal.js';

const check = (a, b, expected) => {
  expect(isDeepEqual(a, b)).to.be.eq(expected);
  expect(isDeepEqual(b, a)).to.be.eq(expected);
};

describe('isDeepEqual', function () {
  describe('string', function () {
    it('a non-empty string', function () {
      check('str', 'str', true);
      check('str', '', false);
      check('str', 10, false);
      check('str', 0, false);
      check('str', -10, false);
      check('str', true, false);
      check('str', false, false);
      check('str', undefined, false);
      check('str', null, false);
      check('str', {foo: 'bar'}, false);
      check('str', {}, false);
      check('str', [1, 2, 3], false);
      check('str', [], false);
    });

    it('an empty string', function () {
      check('', 'str', false);
      check('', '', true);
      check('', 10, false);
      check('', 0, false);
      check('', -10, false);
      check('', true, false);
      check('', false, false);
      check('', undefined, false);
      check('', null, false);
      check('', {foo: 'bar'}, false);
      check('', {}, false);
      check('', [1, 2, 3], false);
      check('', [], false);
    });
  });

  describe('number', function () {
    it('a positive number', function () {
      check(10, 'str', false);
      check(10, '', false);
      check(10, 10, true);
      check(10, 0, false);
      check(10, -10, false);
      check(10, true, false);
      check(10, false, false);
      check(10, undefined, false);
      check(10, null, false);
      check(10, {foo: 'bar'}, false);
      check(10, {}, false);
      check(10, [1, 2, 3], false);
      check(10, [], false);
    });

    it('zero', function () {
      check(0, 'str', false);
      check(0, '', false);
      check(0, 10, false);
      check(0, 0, true);
      check(0, -10, false);
      check(0, true, false);
      check(0, false, false);
      check(0, undefined, false);
      check(0, null, false);
      check(0, {foo: 'bar'}, false);
      check(0, {}, false);
      check(0, [1, 2, 3], false);
      check(0, [], false);
    });

    it('a negative number', function () {
      check(-10, 'str', false);
      check(-10, '', false);
      check(-10, 10, false);
      check(-10, 0, false);
      check(-10, -10, true);
      check(-10, true, false);
      check(-10, false, false);
      check(-10, undefined, false);
      check(-10, null, false);
      check(-10, {foo: 'bar'}, false);
      check(-10, {}, false);
      check(-10, [1, 2, 3], false);
      check(-10, [], false);
    });
  });

  describe('boolean', function () {
    it('true', function () {
      check(true, 'str', false);
      check(true, '', false);
      check(true, 10, false);
      check(true, 0, false);
      check(true, -10, false);
      check(true, true, true);
      check(true, false, false);
      check(true, undefined, false);
      check(true, null, false);
      check(true, {foo: 'bar'}, false);
      check(true, {}, false);
      check(true, [1, 2, 3], false);
      check(true, [], false);
    });

    it('false', function () {
      check(false, 'str', false);
      check(false, '', false);
      check(false, 10, false);
      check(false, 0, false);
      check(false, -10, false);
      check(false, true, false);
      check(false, false, true);
      check(false, undefined, false);
      check(false, null, false);
      check(false, {foo: 'bar'}, false);
      check(false, {}, false);
      check(false, [1, 2, 3], false);
      check(false, [], false);
    });
  });

  describe('array', function () {
    it('an array of numbers', function () {
      check([1, 2, 3], 'str', false);
      check([1, 2, 3], '', false);
      check([1, 2, 3], 10, false);
      check([1, 2, 3], 0, false);
      check([1, 2, 3], -10, false);
      check([1, 2, 3], true, false);
      check([1, 2, 3], false, false);
      check([1, 2, 3], undefined, false);
      check([1, 2, 3], null, false);
      check([1, 2, 3], {foo: 'bar'}, false);
      check([1, 2, 3], {}, false);
      check([1, 2, 3], [1, 2, 3], true);
      check([1, 2, 3], [], false);
    });

    it('an empty array', function () {
      check([], 'str', false);
      check([], '', false);
      check([], 10, false);
      check([], 0, false);
      check([], -10, false);
      check([], true, false);
      check([], false, false);
      check([], undefined, false);
      check([], null, false);
      check([], {foo: 'bar'}, false);
      check([], {}, false);
      check([], [1, 2, 3], false);
      check([], [], true);
    });
  });

  describe('object', function () {
    it('string key and string value', function () {
      check({foo: 'bar'}, 'str', false);
      check({foo: 'bar'}, '', false);
      check({foo: 'bar'}, 10, false);
      check({foo: 'bar'}, 0, false);
      check({foo: 'bar'}, -10, false);
      check({foo: 'bar'}, true, false);
      check({foo: 'bar'}, false, false);
      check({foo: 'bar'}, undefined, false);
      check({foo: 'bar'}, null, false);
      check({foo: 'bar'}, {foo: 'bar'}, true);
      check({foo: 'bar'}, {}, false);
      check({foo: 'bar'}, [1, 2, 3], false);
      check({foo: 'bar'}, [], false);
    });

    it('an empty object', function () {
      check({}, 'str', false);
      check({}, '', false);
      check({}, 10, false);
      check({}, 0, false);
      check({}, -10, false);
      check({}, true, false);
      check({}, false, false);
      check({}, undefined, false);
      check({}, null, false);
      check({}, {foo: 'bar'}, false);
      check({}, {}, true);
      check({}, [1, 2, 3], false);
      check({}, [], false);
    });

    it('null', function () {
      check(null, 'str', false);
      check(null, '', false);
      check(null, 10, false);
      check(null, 0, false);
      check(null, -10, false);
      check(null, true, false);
      check(null, false, false);
      check(null, undefined, false);
      check(null, null, true);
      check(null, {foo: 'bar'}, false);
      check(null, {}, false);
      check(null, [1, 2, 3], false);
      check(null, [], false);
    });

    it('circular reference to itself', function () {
      const a = {foo: 'bar'};
      const b = {baz: 'qux'};
      const c = {foo: 'bar'};
      a.itself = a;
      b.itself = b;
      c.itself = c;
      check(a, b, false);
      check(a, c, true);
    });
  });

  it('undefined', function () {
    check(undefined, 'str', false);
    check(undefined, '', false);
    check(undefined, 10, false);
    check(undefined, 0, false);
    check(undefined, -10, false);
    check(undefined, true, false);
    check(undefined, false, false);
    check(undefined, undefined, true);
    check(undefined, null, false);
    check(undefined, {foo: 'bar'}, false);
    check(undefined, {}, false);
    check(undefined, [1, 2, 3], false);
    check(undefined, [], false);
  });
});
