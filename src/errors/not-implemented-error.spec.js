import {expect} from 'chai';
import {format} from '@e22m4u/util-format';
import {NotImplementedError} from './not-implemented-error.js';

describe('NotImplementedError', function () {
  it('inherits from Error class', function () {
    const error = new NotImplementedError();
    expect(error).to.be.instanceof(Error);
  });

  it('sets a given message', function () {
    const error = new NotImplementedError('This is the Error');
    expect(error.message).to.be.eq('This is the Error');
  });

  it('interpolates a given pattern with variables', function () {
    const throwable = v => () => {
      throw new NotImplementedError('%v', v);
    };
    const error = v => format('%s', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error(0));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
  });
});
