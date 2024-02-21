import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {maxLengthValidator} from './max-length-validator.js';

describe('maxLengthValidator', function () {
  it('returns true if the "options" argument is false', function () {
    const res = maxLengthValidator('test', false, {});
    expect(res).to.be.true;
  });

  it('requires the "value" argument as a String or an Array', function () {
    const throwable = v => () =>
      maxLengthValidator(v, 10, {
        validatorName: 'myValidator',
      });
    const error = v =>
      format(
        'The property validator "myValidator" requires a String ' +
          'or an Array value, but %s given.',
        v,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
    throwable('')();
    throwable([1, 2, 3])();
    throwable([])();
  });

  it('requires the "options" argument to be a number', function () {
    const throwable = v => () =>
      maxLengthValidator('test', v, {
        validatorName: 'myValidator',
      });
    const error = v =>
      format(
        'The validator "myValidator" requires the "options" argument ' +
          'as a Number, but %s given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable(10)();
    throwable(0)();
    throwable(false)();
  });

  describe('a string value', function () {
    it('returns false if the value length is greater than the max length option', function () {
      const res = maxLengthValidator('1234', 3, {});
      expect(res).to.be.false;
    });

    it('returns true if the value length is equal to the max length option', function () {
      const res = maxLengthValidator('123', 3, {});
      expect(res).to.be.true;
    });

    it('returns true if the value length is lower than the max length option', function () {
      const res = maxLengthValidator('12', 3, {});
      expect(res).to.be.true;
    });
  });

  describe('an array value', function () {
    it('returns false if the value length is greater than the max length option', function () {
      const res = maxLengthValidator([1, 2, 3, 4], 3, {});
      expect(res).to.be.false;
    });

    it('returns true if the value length is equal to the max length option', function () {
      const res = maxLengthValidator([1, 2, 3], 3, {});
      expect(res).to.be.true;
    });

    it('returns true if the value length is lower than the max length option', function () {
      const res = maxLengthValidator([1, 2], 3, {});
      expect(res).to.be.true;
    });
  });
});
