import {expect} from 'chai';
import {valueToString} from './value-to-string.js';

describe('valueToString', function () {
  it('wraps a string to double quotes', function () {
    expect(valueToString('str')).to.be.eql('"str"');
  });

  it('returns a string representation of a given value', function () {
    expect(valueToString(10)).to.be.eql('10');
    expect(valueToString(true)).to.be.eql('true');
    expect(valueToString(false)).to.be.eql('false');
    expect(valueToString(undefined)).to.be.eql('undefined');
    expect(valueToString(null)).to.be.eql('null');
    expect(valueToString(NaN)).to.be.eql('NaN');
    expect(valueToString({})).to.be.eql('Object');
    expect(valueToString([])).to.be.eql('Array');
    expect(valueToString(new Date())).to.be.eql('Date');
    expect(valueToString(new String('str'))).to.be.eql('str');
    expect(valueToString(() => undefined)).to.be.eql('Function');
    expect(valueToString(function () {})).to.be.eql('Function');
  });
});
