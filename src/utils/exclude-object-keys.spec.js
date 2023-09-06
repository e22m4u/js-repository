import {expect} from 'chai';
import {format} from 'util';
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
    const message = 'Cannot exclude keys from a non-Object value, %s given.';
    const from = v => () => excludeObjectKeys(v, 'key');
    expect(from('string')).to.throw(format(message, '"string"'));
    expect(from(10)).to.throw(format(message, '10'));
    expect(from(true)).to.throw(format(message, 'true'));
    expect(from(false)).to.throw(format(message, 'false'));
    expect(from([])).to.throw(format(message, 'Array'));
    expect(from(null)).to.throw(format(message, 'null'));
    expect(from(undefined)).to.throw(format(message, 'undefined'));
  });
});
