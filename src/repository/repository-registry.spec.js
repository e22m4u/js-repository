import {expect} from 'chai';
import {Repository} from './repository.js';
import {DatabaseSchema} from '../database-schema.js';
import {RepositoryRegistry} from './repository-registry.js';

describe('RepositoryRegistry', function () {
  describe('setRepositoryCtor', function () {
    it('sets a given class as the repository constructor', function () {
      class MyRepository extends Repository {}
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: 'model', datasource: 'datasource'});
      const registry = dbs.getService(RepositoryRegistry);
      registry.setRepositoryCtor(MyRepository);
      const rep = registry.getRepository('model');
      expect(rep).to.be.instanceof(Repository);
      expect(rep).to.be.instanceof(MyRepository);
    });
  });

  describe('getRepository', function () {
    it('uses a given model name to return an existing repository or create the new', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: 'modelA', datasource: 'datasource'});
      dbs.defineModel({name: 'modelB', datasource: 'datasource'});
      const registry = dbs.getService(RepositoryRegistry);
      const repA1 = registry.getRepository('modelA');
      const repA2 = registry.getRepository('modelA');
      const repB1 = registry.getRepository('modelB');
      const repB2 = registry.getRepository('modelB');
      expect(repA1).to.be.eq(repA2);
      expect(repB1).to.be.eq(repB2);
      expect(repA1).to.be.not.eq(repB1);
      expect(repA2).to.be.not.eq(repB2);
    });
  });
});
