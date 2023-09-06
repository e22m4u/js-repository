import {expect} from 'chai';
import {arrayToString} from './array-to-string.js';

describe('arrayToString', function () {
  it('returns a string representation of a given array', function () {
    const arr = ['str', 10, true, () => undefined];
    const str = '"str", 10, true, Function';
    expect(arrayToString(arr)).to.be.eq(str);
    expect(arrayToString([])).to.be.eq('Array');
  });

  it('returns a string representation of a non-array items', function () {
    expect(arrayToString('str')).to.be.eq('"str"');
    expect(arrayToString(10)).to.be.eq('10');
    expect(arrayToString(true)).to.be.eq('true');
    expect(arrayToString(false)).to.be.eq('false');
    expect(arrayToString({})).to.be.eq('Object');
    expect(arrayToString(null)).to.be.eq('null');
    expect(arrayToString(undefined)).to.be.eq('undefined');
    expect(arrayToString(() => undefined)).to.be.eq('Function');
    expect(arrayToString(function () {})).to.be.eq('Function');
  });

  it('allows to change the "joiner" argument', function () {
    expect(arrayToString([1, 2, 3])).to.be.eq('1, 2, 3');
    expect(arrayToString([1, 2, 3], '-')).to.be.eq('1-2-3');
  });

  it('allows to change the "orEmpty" argument', function () {
    expect(arrayToString([])).to.be.eq('Array');
    expect(arrayToString([], undefined, '-')).to.be.eq('-');
  });
});
