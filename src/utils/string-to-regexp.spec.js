import {expect} from 'chai';
import {stringToRegexp} from './string-to-regexp.js';

describe('stringToRegexp', function () {
  it('should return RegExp from a given string', function () {
    expect(stringToRegexp('value').test('value')).to.be.true;
    expect(stringToRegexp('val.+').test('value')).to.be.true;
    expect(stringToRegexp('val*').test('value')).to.be.true;
  });

  it('should uses case-sensitive mode by default', function () {
    expect(stringToRegexp('value').test('VALUE')).to.be.false;
    expect(stringToRegexp('val.+').test('VALUE')).to.be.false;
    expect(stringToRegexp('%alu%').test('VALUE')).to.be.false;
    expect(stringToRegexp('val*').test('VALUE')).to.be.false;
  });

  it('should uses given flags in a new RegExp', function () {
    expect(stringToRegexp('value', 'i').test('VALUE')).to.be.true;
    expect(stringToRegexp('val.+', 'i').test('VALUE')).to.be.true;
    expect(stringToRegexp('val*', 'i').test('VALUE')).to.be.true;
  });

  it('should return RegExp from a given RegExp', function () {
    const regExp = new RegExp('value');
    expect(stringToRegexp(regExp).test('value')).to.be.true;
  });

  it('should overrides flags of a given RegExp', function () {
    const regExp = new RegExp('value');
    expect(stringToRegexp(regExp, 'i').test('VALUE')).to.be.true;
  });

  it('should not replace "%" and "_" symbols as SQL-like wildcard', function () {
    const res = stringToRegexp('%alu_');
    expect(res).to.be.eql(/%alu_/);
  });
});
