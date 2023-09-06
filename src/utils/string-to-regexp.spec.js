import {expect} from 'chai';
import {stringToRegexp} from './string-to-regexp.js';

describe('stringToRegexp', function () {
  it('returns RegExp from a given string', function () {
    expect(stringToRegexp('value').test('value')).to.be.true;
    expect(stringToRegexp('val.+').test('value')).to.be.true;
    expect(stringToRegexp('%alu%').test('value')).to.be.true;
    expect(stringToRegexp('val*').test('value')).to.be.true;
  });

  it('uses case-sensitive mode by default', function () {
    expect(stringToRegexp('value').test('VALUE')).to.be.false;
    expect(stringToRegexp('val.+').test('VALUE')).to.be.false;
    expect(stringToRegexp('%alu%').test('VALUE')).to.be.false;
    expect(stringToRegexp('val*').test('VALUE')).to.be.false;
  });

  it('uses given flags in a new RegExp', function () {
    expect(stringToRegexp('value', 'i').test('VALUE')).to.be.true;
    expect(stringToRegexp('val.+', 'i').test('VALUE')).to.be.true;
    expect(stringToRegexp('%alu%', 'i').test('VALUE')).to.be.true;
    expect(stringToRegexp('val*', 'i').test('VALUE')).to.be.true;
  });

  it('returns RegExp from a given RegExp', function () {
    const regExp = new RegExp('value');
    expect(stringToRegexp(regExp).test('value')).to.be.true;
  });

  it('overrides flags of a given RegExp', function () {
    const regExp = new RegExp('value');
    expect(stringToRegexp(regExp, 'i').test('VALUE')).to.be.true;
  });
});
