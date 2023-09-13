import {expect} from 'chai';
import {Schema} from '../schema.js';
import {Repository} from './repository.js';
import {RepositoryRegistry} from './repository-registry.js';

describe('RepositoryRegistry', function () {
  describe('setRepositoryCtor', function () {
    it('sets a given class as the repository constructor', function () {
      class MyRepository extends Repository {}
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const registry = schema.getService(RepositoryRegistry);
      registry.setRepositoryCtor(MyRepository);
      const rep = registry.getRepository('model');
      expect(rep).to.be.instanceof(Repository);
      expect(rep).to.be.instanceof(MyRepository);
    });
  });

  describe('getRepository', function () {
    it('uses a given model name to return an existing repository or create the new', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'modelA', datasource: 'datasource'});
      schema.defineModel({name: 'modelB', datasource: 'datasource'});
      const registry = schema.getService(RepositoryRegistry);
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
