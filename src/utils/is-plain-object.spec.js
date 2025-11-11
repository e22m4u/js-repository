import {expect} from 'chai';
import {isPlainObject} from './is-plain-object.js';

describe('isPlainObject', function () {
  it('returns true if a pure object given', function () {
    expect(isPlainObject({})).to.be.true;
    expect(isPlainObject({key: 'val'})).to.be.true;
    expect(isPlainObject(Object.create(null))).to.be.true;
  });

  it('returns false if a non-pure object given', function () {
    expect(isPlainObject(new Date())).to.be.false;
    expect(isPlainObject([])).to.be.false;
    expect(isPlainObject(() => undefined)).to.be.false;
  });

  it('returns false if a non-object given', function () {
    expect(isPlainObject('string')).to.be.false;
    expect(isPlainObject(10)).to.be.false;
    expect(isPlainObject(true)).to.be.false;
    expect(isPlainObject(false)).to.be.false;
    expect(isPlainObject(null)).to.be.false;
    expect(isPlainObject(undefined)).to.be.false;
  });
});
