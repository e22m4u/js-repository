import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {toLowerCaseTransformer} from './to-lower-case-transformer.js';

describe('toLowerCaseTransformer', function () {
  it('returns undefined and null values as is', function () {
    const res1 = toLowerCaseTransformer(undefined, undefined, {});
    const res2 = toLowerCaseTransformer(null, undefined, {});
    expect(res1).to.be.undefined;
    expect(res2).to.be.null;
  });

  it('converts the given string to lower case', function () {
    const res = toLowerCaseTransformer('TEST', undefined, {});
    expect(res).to.be.eq('test');
  });

  it('throws an error if the given value is not a string', function () {
    const throwable = v => () =>
      toLowerCaseTransformer(v, undefined, {
        transformerName: 'toLowerCase',
      });
    const error = v =>
      format(
        'The property transformer "toLowerCase" requires a String value, but %s given.',
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
