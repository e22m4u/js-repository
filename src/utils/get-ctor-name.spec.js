import {expect} from 'chai';
import {getCtorName} from './get-ctor-name.js';

describe('getCtorName', function () {
  it('returns a constructor name of a given value', function () {
    expect(getCtorName({})).to.be.eq('Object');
    expect(getCtorName(new Date())).to.be.eq('Date');
    expect(getCtorName([])).to.be.eq('Array');
    expect(getCtorName(() => undefined)).to.be.eq('Function');
    expect(getCtorName('string')).to.be.eq('String');
    expect(getCtorName(10)).to.be.eq('Number');
    expect(getCtorName(true)).to.be.eq('Boolean');
    expect(getCtorName(false)).to.be.eq('Boolean');
    expect(getCtorName(null)).to.be.eq('Null');
    expect(getCtorName(undefined)).to.be.eq('Undefined');
  });
});
