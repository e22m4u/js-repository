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
      const reg = dbs.getService(RepositoryRegistry);
      reg.setRepositoryCtor(MyRepository);
      const rep = reg.getRepository('model');
      expect(rep).to.be.instanceof(Repository);
      expect(rep).to.be.instanceof(MyRepository);
    });
  });

  describe('getRepository', function () {
    it('returns an existing repository by the given name or create new one', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: 'modelA', datasource: 'datasource'});
      dbs.defineModel({name: 'modelB', datasource: 'datasource'});
      const reg = dbs.getService(RepositoryRegistry);
      const repA1 = reg.getRepository('modelA');
      const repA2 = reg.getRepository('modelA');
      const repB1 = reg.getRepository('modelB');
      const repB2 = reg.getRepository('modelB');
      expect(repA1).to.be.eq(repA2);
      expect(repB1).to.be.eq(repB2);
      expect(repA1).to.be.not.eq(repB1);
      expect(repA2).to.be.not.eq(repB2);
    });

    it('should ignore naming convention of the model name', function () {
      const dbs = new DatabaseSchema();
      const modelName = 'userProfileDetails';
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: modelName, datasource: 'datasource'});
      const reg = dbs.getService(RepositoryRegistry);
      const rep = reg.getRepository(modelName);
      const modelNames = [
        'UserProfileDetails',
        'user-profile-details',
        'user_profile_details',
        'USER-PROFILE-DETAILS',
        'USER_PROFILE_DETAILS',
        'USERPROFILEDETAILS',
        'userprofiledetails',
      ];
      modelNames.forEach(v => expect(reg.getRepository(v)).to.be.eq(rep));
    });

    it('should respect numbers in the model name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: 'model1', datasource: 'datasource'});
      dbs.defineModel({name: 'model2', datasource: 'datasource'});
      const reg = dbs.getService(RepositoryRegistry);
      const rep1 = reg.getRepository('model1');
      const rep2 = reg.getRepository('model2');
      expect(rep1).to.be.not.eq(rep2);
    });
  });
});
