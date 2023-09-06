import {expect} from 'chai';
import {InvalidArgumentError} from './invalid-argument-error.js';

describe('InvalidArgumentError', function () {
  it('inherits from Error class', function () {
    const error = new InvalidArgumentError();
    expect(error).to.be.instanceof(Error);
  });

  it('sets a given message', function () {
    const error = new InvalidArgumentError('This is the Error');
    expect(error.message).to.be.eq('This is the Error');
  });

  it('interpolates a given pattern with variables', function () {
    const error = new InvalidArgumentError(
      '%s, %s, %s, %s, %s, %s, %s, %s, %s and %s',
      'str',
      10,
      true,
      false,
      {},
      [],
      undefined,
      null,
      () => undefined,
      function () {},
    );
    expect(error.message).to.be.eq(
      '"str", 10, true, false, Object, Array, undefined, null, Function and Function',
    );
  });
});
