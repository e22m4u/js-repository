import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {toUpperCaseTransformer} from './to-upper-case-transformer.js';

describe('toUpperCaseTransformer', function () {
  it('returns undefined and null values as is', function () {
    const res1 = toUpperCaseTransformer(undefined, undefined, {});
    const res2 = toUpperCaseTransformer(null, undefined, {});
    expect(res1).to.be.undefined;
    expect(res2).to.be.null;
  });

  it('converts the given string to upper case', function () {
    const res = toUpperCaseTransformer('test', undefined, {});
    expect(res).to.be.eq('TEST');
  });

  it('throws an error if the given value is not a string', function () {
    const throwable = v => () =>
      toUpperCaseTransformer(v, undefined, {
        transformerName: 'toUpperCase',
      });
    const error = v =>
      format(
        'The property transformer "toUpperCase" requires a String value, but %s was given.',
        v,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    throwable('str')();
    throwable('')();
    throwable(undefined)();
    throwable(null)();
  });
});
