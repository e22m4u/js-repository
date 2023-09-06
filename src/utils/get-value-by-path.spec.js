import {expect} from 'chai';
import {getValueByPath} from './get-value-by-path.js';

const VAL = 'value';

describe('getValueByPath', function () {
  it('returns undefined if no value', function () {
    expect(getValueByPath({}, 'foo')).to.be.undefined;
    expect(getValueByPath({}, 'foo.bar')).to.be.undefined;
    expect(getValueByPath({foo: {}}, 'foo.bar.baz')).to.be.undefined;
  });

  it('returns a value by given path', function () {
    expect(getValueByPath({foo: VAL}, 'foo')).to.be.eq(VAL);
    expect(getValueByPath({foo: {bar: VAL}}, 'foo.bar')).to.be.eq(VAL);
    expect(getValueByPath({foo: {bar: {baz: VAL}}}, 'foo.bar.baz')).to.be.eq(
      VAL,
    );
  });

  it('returns a given fallback if no value', function () {
    expect(getValueByPath({}, 'foo', VAL)).to.be.eq(VAL);
    expect(getValueByPath({}, 'foo.bar', VAL)).to.be.eq(VAL);
    expect(getValueByPath({foo: {}}, 'foo.bar.baz', VAL)).to.be.eq(VAL);
  });

  it('returns a given fallback for null or undefined object', function () {
    expect(getValueByPath(null, 'foo', VAL)).to.be.eq(VAL);
    expect(getValueByPath(undefined, 'foo', VAL)).to.be.eq(VAL);
  });

  it('returns a given fallback for null or undefined key', function () {
    expect(getValueByPath({}, null, VAL)).to.be.eq(VAL);
    expect(getValueByPath({}, undefined, VAL)).to.be.eq(VAL);
  });
});
