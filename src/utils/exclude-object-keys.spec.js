import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {excludeObjectKeys} from './exclude-object-keys.js';

describe('excludeObjectKeys', function () {
  it('returns a given object without a specified key', function () {
    const input = {
      foo: 'string',
      bar: 10,
      baz: true,
      qux: [1, 2, 3],
    };
    const result = excludeObjectKeys(input, 'bar');
    expect(result).to.be.not.eq(input);
    expect(result).to.be.eql({
      foo: 'string',
      baz: true,
      qux: [1, 2, 3],
    });
  });

  it('returns a given object without a specified keys', function () {
    const input = {
      foo: 'string',
      bar: 10,
      baz: true,
      qux: [1, 2, 3],
    };
    const result = excludeObjectKeys(input, ['bar', 'qux']);
    expect(result).to.be.not.eq(input);
    expect(result).to.be.eql({
      foo: 'string',
      baz: true,
    });
  });

  it('throws an error for a non-object values', function () {
    const throwable = v => () => excludeObjectKeys(v, 'key');
    const error = v =>
      format('Cannot exclude keys from a non-Object value, %v given.', v);
    expect(throwable('string')).to.throw(error('string'));
    expect(throwable(10)).to.throw(error(10));
    expect(throwable(true)).to.throw(error(true));
    expect(throwable(false)).to.throw(error(false));
    expect(throwable([])).to.throw(error([]));
    expect(throwable(null)).to.throw(error(null));
    expect(throwable(undefined)).to.throw(error(undefined));
  });
});
