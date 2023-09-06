import {expect} from 'chai';
import {isCtor} from './is-ctor.js';

describe('isConstructor', function () {
  it('returns true if a given value is a constructor', function () {
    expect(isCtor(Date)).to.be.true;
    expect(isCtor(Number)).to.be.true;
    expect(isCtor(String)).to.be.true;
    class MyClass {}
    expect(isCtor(MyClass)).to.be.true;
    function FunctionCtor() {}
    expect(isCtor(FunctionCtor)).to.be.true;
  });

  it('returns false if a given value is not a constructor', function () {
    expect(isCtor(() => undefined)).to.be.false;
    expect(isCtor('string')).to.be.false;
    expect(isCtor(10)).to.be.false;
    expect(isCtor(true)).to.be.false;
    expect(isCtor({})).to.be.false;
    expect(isCtor([])).to.be.false;
    expect(isCtor(undefined)).to.be.false;
    expect(isCtor(null)).to.be.false;
  });
});
