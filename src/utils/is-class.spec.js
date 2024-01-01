import {expect} from 'chai';
import {isClass} from './is-class.js';

describe('isClass', function () {
  it('returns true if a given value is a class', function () {
    class MyClass {}
    expect(isClass(MyClass)).to.be.true;
  });

  it('returns false if a given value is not a class', function () {
    expect(isClass(Date)).to.be.false;
    expect(isClass(Number)).to.be.false;
    expect(isClass(String)).to.be.false;
    expect(isClass(function myFunction() {})).to.be.false;
    expect(isClass(function () {})).to.be.false;
    expect(isClass(() => undefined)).to.be.false;
    expect(isClass('string')).to.be.false;
    expect(isClass(10)).to.be.false;
    expect(isClass(true)).to.be.false;
    expect(isClass({})).to.be.false;
    expect(isClass([])).to.be.false;
    expect(isClass(undefined)).to.be.false;
    expect(isClass(null)).to.be.false;
  });
});
