import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {toTitleCaseTransformer} from './to-title-case-transformer.js';

describe('toTitleCaseTransformer', function () {
  it('returns undefined and null values as is', function () {
    const res1 = toTitleCaseTransformer(undefined, undefined, {});
    const res2 = toTitleCaseTransformer(null, undefined, {});
    expect(res1).to.be.undefined;
    expect(res2).to.be.null;
  });

  it('converts the given string to title case', function () {
    const res1 = toTitleCaseTransformer('TEST', undefined, {});
    const res2 = toTitleCaseTransformer('test', undefined, {});
    expect(res1).to.be.eq('Test');
    expect(res2).to.be.eq('Test');
  });

  it('throws an error if the given value is not a string', function () {
    const throwable = v => () =>
      toTitleCaseTransformer(v, undefined, {
        transformerName: 'toTitleCase',
      });
    const error = v =>
      format(
        'The property transformer "toTitleCase" requires a String value, but %s given.',
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
