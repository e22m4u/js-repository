import {expect} from 'chai';
import {isPureObject} from './is-pure-object.js';

describe('isPureObject', function () {
  it('returns ture if a pure object given', function () {
    expect(isPureObject({})).to.be.true;
    expect(isPureObject({key: 'val'})).to.be.true;
    expect(isPureObject(Object.create(null))).to.be.true;
  });

  it('returns false if a non-pure object given', function () {
    expect(isPureObject(new Date())).to.be.false;
    expect(isPureObject([])).to.be.false;
    expect(isPureObject(() => undefined)).to.be.false;
  });

  it('returns false if a non-object given', function () {
    expect(isPureObject('string')).to.be.false;
    expect(isPureObject(10)).to.be.false;
    expect(isPureObject(true)).to.be.false;
    expect(isPureObject(false)).to.be.false;
    expect(isPureObject(null)).to.be.false;
    expect(isPureObject(undefined)).to.be.false;
  });
});
