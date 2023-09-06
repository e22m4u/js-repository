import {expect} from 'chai';
import {AdapterRegistry} from './adapter-registry.js';
import {MemoryAdapter} from './builtin/memory-adapter.js';
import {Schema} from '../schema.js';

describe('AdapterRegistry', function () {
  describe('getAdapter', function () {
    it('instantiates a new or returns an existing adapter by a given datasource name', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      const R = S.get(AdapterRegistry);
      const adapter = await R.getAdapter('datasource');
      expect(adapter).to.be.instanceof(MemoryAdapter);
      const sameAdapter = await R.getAdapter('datasource');
      expect(sameAdapter).to.be.eq(adapter);
    });

    it('throws an error if a datasource is not exists', async function () {
      const R = new AdapterRegistry();
      const promise = R.getAdapter('unknown');
      await expect(promise).to.be.rejectedWith(
        'The datasource "unknown" is not defined.',
      );
    });

    it('throws an error if an adapter is not exists', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'unknown'});
      const R = S.get(AdapterRegistry);
      const promise = R.getAdapter('datasource');
      await expect(promise).to.be.rejectedWith(
        'The adapter "unknown" is not found.',
      );
    });
  });
});
