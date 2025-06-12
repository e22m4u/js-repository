import {expect} from 'chai';
import {DatabaseSchema} from '../database-schema.js';
import {AdapterRegistry} from './adapter-registry.js';
import {MemoryAdapter} from './builtin/memory-adapter.js';

describe('AdapterRegistry', function () {
  describe('getAdapter', function () {
    it('instantiates a new or returns an existing adapter by a given datasource name', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      const R = dbs.getService(AdapterRegistry);
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
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'unknown'});
      const R = dbs.getService(AdapterRegistry);
      const promise = R.getAdapter('datasource');
      await expect(promise).to.be.rejectedWith(
        'The adapter "unknown" is not found.',
      );
    });
  });
});
