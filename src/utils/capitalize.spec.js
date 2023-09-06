import {expect} from 'chai';
import {capitalize} from './capitalize.js';

describe('capitalize', function () {
  it('makes the first letter to upper case', function () {
    expect(capitalize('foo')).to.be.eq('Foo');
    expect(capitalize('foo bar')).to.be.eq('Foo bar');
    expect(capitalize(10)).to.be.eq(10);
    expect(capitalize(true)).to.be.eq(true);
    expect(capitalize(false)).to.be.eq(false);
    expect(capitalize(undefined)).to.be.eq(undefined);
    expect(capitalize(null)).to.be.eq(null);
  });
});
