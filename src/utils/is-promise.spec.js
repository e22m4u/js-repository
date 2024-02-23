import {expect} from 'chai';
import {describe} from 'mocha';
import {isPromise} from './is-promise.js';

describe('isPromise', () => {
  it('returns true if the given value has type of PromiseLike', function () {
    expect(isPromise(Promise.resolve())).to.be.true;
    expect(isPromise('string')).to.be.false;
    expect(isPromise('')).to.be.false;
    expect(isPromise(10)).to.be.false;
    expect(isPromise(0)).to.be.false;
    expect(isPromise(true)).to.be.false;
    expect(isPromise(false)).to.be.false;
    expect(isPromise(undefined)).to.be.false;
    expect(isPromise(null)).to.be.false;
    expect(isPromise({foo: 'bar'})).to.be.false;
    expect(isPromise({})).to.be.false;
    expect(isPromise([1, 2, 3])).to.be.false;
    expect(isPromise([])).to.be.false;
    expect(isPromise(NaN)).to.be.false;
    expect(isPromise(() => 10)).to.be.false;
  });
});
