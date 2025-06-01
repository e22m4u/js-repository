import {expect} from 'chai';
import {transformPromise} from './transform-promise.js';

describe('transformPromise', function () {
  it('transforms the given value', function () {
    const value = 'my-value';
    const transformer = v => v.toUpperCase();
    const result = transformPromise(value, transformer);
    expect(result).to.be.eq('MY-VALUE');
  });

  it('transforms the given promise', async function () {
    const promise = Promise.resolve('my-value');
    const transformer = v => v.toUpperCase();
    const result = await transformPromise(promise, transformer);
    await promise;
    expect(result).to.be.eq('MY-VALUE');
  });
});
