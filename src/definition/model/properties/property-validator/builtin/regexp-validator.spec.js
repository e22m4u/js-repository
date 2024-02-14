import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {regexpValidator} from './regexp-validator.js';

describe('regexpValidator', function () {
  it('returns true if the "options" argument is false', function () {
    const res = regexpValidator(undefined, false, {});
    expect(res).to.be.true;
  });

  it('requires the "value" argument to be a string', function () {
    const throwable = v => () =>
      regexpValidator(v, '.*', {
        validatorName: 'myValidator',
      });
    const error = v =>
      format(
        'The property validator "myValidator" requires ' +
          'a String value, but %s given.',
        v,
      );
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
    throwable('')();
  });

  it('requires the "options" argument to be a string or RegExp', function () {
    const throwable = v => () =>
      regexpValidator('test', v, {
        validatorName: 'myValidator',
      });
    const error = v =>
      format(
        'The validator "myValidator" requires the "options" argument ' +
          'as a String or RegExp, but %s given.',
        v,
      );
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
    throwable('')();
    throwable(false)();
    throwable(new RegExp(''))();
  });

  describe('the given regexp as a String', function () {
    it('returns false if the given regexp is not matched', function () {
      const res1 = regexpValidator('foo', 'bar', {});
      const res2 = regexpValidator('foo', '^\\d+', {});
      const res3 = regexpValidator('foo', '^baz$', {});
      expect(res1).to.be.false;
      expect(res2).to.be.false;
      expect(res3).to.be.false;
    });

    it('returns true if the given regexp is matched', function () {
      const res1 = regexpValidator('foo', '^fo', {});
      const res2 = regexpValidator('foo', '^foo$', {});
      const res3 = regexpValidator('foo', '^\\w+$', {});
      expect(res1).to.be.true;
      expect(res2).to.be.true;
      expect(res3).to.be.true;
    });
  });

  describe('the given regexp as an instance of RegExp', function () {
    it('returns false if the given regexp is not matched', function () {
      const res1 = regexpValidator('foo', /bar/, {});
      const res2 = regexpValidator('foo', /^\d+/, {});
      const res3 = regexpValidator('foo', /^bar$/, {});
      expect(res1).to.be.false;
      expect(res2).to.be.false;
      expect(res3).to.be.false;
    });

    it('returns true if the given regexp is matched', function () {
      const res1 = regexpValidator('foo', /^fo/, {});
      const res2 = regexpValidator('foo', /^foo$/, {});
      const res3 = regexpValidator('foo', /^\w+$/, {});
      expect(res1).to.be.true;
      expect(res2).to.be.true;
      expect(res3).to.be.true;
    });
  });
});
