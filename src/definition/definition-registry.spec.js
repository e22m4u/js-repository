import {expect} from 'chai';
import {chai} from '../chai.js';
import {ModelDefinitionValidator} from './model/index.js';
import {DefinitionRegistry} from './definition-registry.js';
import {DatasourceDefinitionValidator} from '../definition/index.js';

const sandbox = chai.spy.sandbox();

describe('DefinitionRegistry', function () {
  let S;

  beforeEach(function () {
    S = new DefinitionRegistry();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('addDatasource', function () {
    it('adds the given datasource to the registry', function () {
      const datasource = {name: 'datasource', adapter: 'adapter'};
      S.addDatasource(datasource);
      const result = S.getDatasource('datasource');
      expect(result).to.be.eql(datasource);
    });

    it('uses DatasourceDefinitionValidator to validate a given datasource', function () {
      const V = S.getService(DatasourceDefinitionValidator);
      sandbox.on(V, 'validate');
      const datasource = {name: 'datasource', adapter: 'adapter'};
      S.addDatasource(datasource);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly(datasource);
    });

    it('throws an error if a given datasource is already defined', function () {
      const datasource1 = {name: 'datasource', adapter: 'adapter'};
      const datasource2 = {name: 'datasource', adapter: 'adapter'};
      S.addDatasource(datasource1);
      const throwable = () => S.addDatasource(datasource2);
      expect(throwable).to.throw(
        'The datasource "datasource" is already defined.',
      );
    });
  });

  describe('hasDatasource', function () {
    it('should check the datasource registration by its name', function () {
      const datasource = {name: 'datasource', adapter: 'adapter'};
      expect(S.hasDatasource(datasource.name)).to.be.false;
      S.addDatasource(datasource);
      expect(S.hasDatasource(datasource.name)).to.be.true;
    });
  });

  describe('getDatasource', function () {
    it('returns the datasource by its name', function () {
      const datasource = {name: 'datasource', adapter: 'adapter'};
      S.addDatasource(datasource);
      const result = S.getDatasource('datasource');
      expect(result).to.be.eql(datasource);
    });

    it('throws an error if ths datasource is not defined', function () {
      const throwable = () => S.getDatasource('undefined');
      expect(throwable).to.throw('The datasource "undefined" is not defined.');
    });
  });

  describe('addModel', function () {
    it('adds the given model to the registry', function () {
      const model = {name: 'model'};
      S.addModel(model);
      const result = S.getModel('model');
      expect(result).to.be.eql(model);
    });

    it('uses ModelDefinitionValidator to validate a given model', function () {
      const V = S.getService(ModelDefinitionValidator);
      sandbox.on(V, 'validate');
      const model = {name: 'model'};
      S.addModel(model);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with.exactly(model);
    });

    it('throws an error if a given model is already defined', function () {
      const model1 = {name: 'TestModel'};
      const model2 = {name: 'TestModel'};
      S.addModel(model1);
      const throwable = () => S.addModel(model2);
      expect(throwable).to.throw('The model "TestModel" is already defined.');
    });
  });

  describe('hasModel', function () {
    it('should check the model registration by its name', function () {
      const model = {name: 'model'};
      expect(S.hasModel(model.name)).to.be.false;
      S.addModel(model);
      expect(S.hasModel(model.name)).to.be.true;
    });

    it('should ignore naming convention of the model name', function () {
      const model = {name: 'UserProfileDetails'};
      const modelNames = [
        'userProfileDetails',
        'UserProfileDetails',
        'user-profile-details',
        'user_profile_details',
        'USER-PROFILE-DETAILS',
        'USER_PROFILE_DETAILS',
        'USERPROFILEDETAILS',
        'userprofiledetails',
      ];
      modelNames.forEach(v => expect(S.hasModel(v)).to.be.false);
      S.addModel(model);
      modelNames.forEach(v => expect(S.hasModel(v)).to.be.true);
    });

    it('should respect numbers in the model name', function () {
      const model1 = {name: 'UserProfileDetails1'};
      const modelNames1 = [
        'userProfileDetails1',
        'UserProfileDetails1',
        'user-profile-details-1',
        'user_profile_details_1',
        'USER-PROFILE-DETAILS-1',
        'USER_PROFILE_DETAILS_1',
        'USERPROFILEDETAILS1',
        'userprofiledetails1',
      ];
      const modelNames2 = [
        'userProfileDetails2',
        'UserProfileDetails2',
        'user-profile-details-2',
        'user_profile_details_2',
        'USER-PROFILE-DETAILS-2',
        'USER_PROFILE_DETAILS_2',
        'USERPROFILEDETAILS2',
        'userprofiledetails2',
      ];
      S.addModel(model1);
      modelNames1.forEach(v => expect(S.hasModel(v)).to.be.true);
      modelNames2.forEach(v => expect(S.hasModel(v)).to.be.false);
    });
  });

  describe('getModel', function () {
    it('returns the model by its name', function () {
      const model = {name: 'model'};
      S.addModel(model);
      const result = S.getModel('model');
      expect(result).to.be.eql(model);
    });

    it('throws an error if the model is not defined', function () {
      const throwable = () => S.getModel('undefined');
      expect(throwable).to.throw('The model "undefined" is not defined.');
    });

    it('should ignore naming convention of the model name', function () {
      const model = {name: 'userProfileDetails'};
      const modelNames = [
        'userProfileDetails',
        'UserProfileDetails',
        'user-profile-details',
        'user_profile_details',
        'USER-PROFILE-DETAILS',
        'USER_PROFILE_DETAILS',
        'USERPROFILEDETAILS',
        'userprofiledetails',
      ];
      S.addModel(model);
      modelNames.forEach(v => expect(S.getModel(v)).to.be.eq(model));
    });

    it('should respect numbers in the model name', function () {
      const model1 = {name: 'userProfileDetails1'};
      const modelNames1 = [
        'userProfileDetails1',
        'UserProfileDetails1',
        'user-profile-details-1',
        'user_profile_details_1',
        'USER-PROFILE-DETAILS-1',
        'USER_PROFILE_DETAILS_1',
        'USERPROFILEDETAILS1',
        'userprofiledetails1',
      ];
      const modelNames2 = [
        'userProfileDetails2',
        'UserProfileDetails2',
        'user-profile-details-2',
        'user_profile_details_2',
        'USER-PROFILE-DETAILS-2',
        'USER_PROFILE_DETAILS_2',
        'USERPROFILEDETAILS2',
        'userprofiledetails2',
      ];
      S.addModel(model1);
      modelNames1.forEach(v => expect(S.getModel(v)).to.be.eq(model1));
      modelNames2.forEach(v => expect(() => S.getModel(v)).to.throw(Error));
    });
  });
});
