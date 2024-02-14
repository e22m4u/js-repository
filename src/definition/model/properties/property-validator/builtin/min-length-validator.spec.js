import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {minLengthValidator} from './min-length-validator.js';

describe('minLengthValidator', function () {
  it('returns true by the false value in options', function () {
    const res = minLengthValidator(undefined, false, {});
    expect(res).to.be.true;
  });

  it('requires the "options" argument to be a number', function () {
    const throwable = v => () =>
      minLengthValidator('test', v, {
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
  });

  describe('a string value', function () {
    it('returns false if the value length is lower than the min length option', function () {
      const res = minLengthValidator('12', 3, {});
      expect(res).to.be.false;
    });

    it('returns true if the value length is equal to the min length option', function () {
      const res = minLengthValidator('123', 3, {});
      expect(res).to.be.true;
    });

    it('returns true if the value length is greater than the min length option', function () {
      const res = minLengthValidator('1234', 3, {});
      expect(res).to.be.true;
    });
  });

  describe('an array value', function () {
    it('returns false if the value length is lower than the min length option', function () {
      const res = minLengthValidator([1, 2], 3, {});
      expect(res).to.be.false;
    });

    it('returns true if the value length is equal to the min length option', function () {
      const res = minLengthValidator([1, 2, 3], 3, {});
      expect(res).to.be.true;
    });

    it('returns true if the value length is greater than the min length option', function () {
      const res = minLengthValidator([1, 2, 3, 4], 3, {});
      expect(res).to.be.true;
    });
  });
});
