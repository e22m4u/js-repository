import {expect} from 'chai';
import {selectObjectKeys} from './select-object-keys.js';

describe('selectObjectKeys', function () {
  it('returns a new object with selected fields', function () {
    const input = {foo: 'foo', bar: 'bar', baz: 'baz'};
    const result = selectObjectKeys(input, ['bar', 'baz']);
    expect(result).to.be.eql({bar: 'bar', baz: 'baz'});
  });

  it('does not throw an error if a selected property is not found', function () {
    const input = {foo: 'foo', bar: 'bar', baz: 'baz'};
    const result = selectObjectKeys(input, ['bar', 'qux']);
    expect(result).to.be.eql({bar: 'bar'});
  });

  it('throws an error if a given value is not an Object', function () {
    const throwable = () => selectObjectKeys(10, ['key']);
    expect(throwable).to.throw(
      'Parameter "obj" must be an Object, but 10 was given.',
    );
  });

  it('throws an error if a given keys is not an Array', function () {
    const throwable = () => selectObjectKeys({});
    expect(throwable).to.throw(
      'Parameter "keys" must be an Array, but undefined was given.',
    );
  });

  it('throws an error if a given keys is not an String', function () {
    const throwable = () => selectObjectKeys({}, [10]);
    expect(throwable).to.throw(
      'Element 0 of the parameter "keys" must be a String, but 10 was given.',
    );
  });
});
