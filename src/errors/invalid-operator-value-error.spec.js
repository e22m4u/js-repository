import {expect} from 'chai';
import {InvalidOperatorValueError} from './invalid-operator-value-error.js';

describe('InvalidOperatorValueError', function () {
  it('sets specific message', function () {
    const error = new InvalidOperatorValueError('exists', 'a boolean', '');
    const message =
      'Condition of {exists: ...} must have a boolean, but "" was given.';
    expect(error.message).to.be.eq(message);
  });
});
