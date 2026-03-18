import {expect} from 'chai';
import {createSpy} from '@e22m4u/js-spy';
import {ModelDefinitionValidator} from './model/index.js';
import {DefinitionRegistry} from './definition-registry.js';
import {DatasourceDefinitionValidator} from '../definition/index.js';

describe('DefinitionRegistry', function () {
  describe('addDatasource', function () {
    it('should add the given datasource to the registry', function () {
      const datasource = {name: 'datasource', adapter: 'adapter'};
      const S = new DefinitionRegistry();
      S.addDatasource(datasource);
      const result = S.getDatasource('datasource');
      expect(result).to.be.eql(datasource);
    });

    it('should use DatasourceDefinitionValidator to validate the given datasource', function () {
      const S = new DefinitionRegistry();
      const V = S.getService(DatasourceDefinitionValidator);
      createSpy(V, 'validate');
      const datasource = {name: 'datasource', adapter: 'adapter'};
      S.addDatasource(datasource);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with(datasource);
    });

    it('should throw an error when the given datasource is already defined', function () {
      const datasource1 = {name: 'datasource', adapter: 'adapter'};
      const datasource2 = {name: 'datasource', adapter: 'adapter'};
      const S = new DefinitionRegistry();
      S.addDatasource(datasource1);
      const throwable = () => S.addDatasource(datasource2);
      expect(throwable).to.throw('Datasource "datasource" is already defined.');
    });
  });

  describe('hasDatasource', function () {
    it('should return true when the datasource name is registered', function () {
      const datasource = {name: 'datasource', adapter: 'adapter'};
      const S = new DefinitionRegistry();
      expect(S.hasDatasource(datasource.name)).to.be.false;
      S.addDatasource(datasource);
      expect(S.hasDatasource(datasource.name)).to.be.true;
    });
  });

  describe('getDatasource', function () {
    it('should return the registered datasource for its name', function () {
      const datasource = {name: 'datasource', adapter: 'adapter'};
      const S = new DefinitionRegistry();
      S.addDatasource(datasource);
      const result = S.getDatasource('datasource');
      expect(result).to.be.eql(datasource);
    });

    it('should throw an error when the datasource name is not registered', function () {
      const S = new DefinitionRegistry();
      const throwable = () => S.getDatasource('undefined');
      expect(throwable).to.throw('Datasource "undefined" is not defined.');
    });
  });

  describe('getDatasourceNames', function () {
    it('should return an array of datasource names in the definition order', function () {
      const datasource1 = {name: 'datasource1', adapter: 'adapter'};
      const datasource2 = {name: 'datasource2', adapter: 'adapter'};
      const datasource3 = {name: 'datasource3', adapter: 'adapter'};
      const S = new DefinitionRegistry();
      expect(S.getDatasourceNames()).to.be.eql([]);
      S.addDatasource(datasource1);
      S.addDatasource(datasource2);
      S.addDatasource(datasource3);
      expect(S.getDatasourceNames()).to.be.eql([
        datasource1.name,
        datasource2.name,
        datasource3.name,
      ]);
    });
  });

  describe('addModel', function () {
    it('should add the given model to the registry', function () {
      const model = {name: 'model'};
      const S = new DefinitionRegistry();
      S.addModel(model);
      const result = S.getModel('model');
      expect(result).to.be.eql(model);
    });

    it('should use ModelDefinitionValidator to validate the given model', function () {
      const S = new DefinitionRegistry();
      const V = S.getService(ModelDefinitionValidator);
      createSpy(V, 'validate');
      const model = {name: 'model'};
      S.addModel(model);
      expect(V.validate).to.have.been.called.once;
      expect(V.validate).to.have.been.called.with(model);
    });

    it('should throw an error when the model name is already registered', function () {
      const model1 = {name: 'TestModel'};
      const model2 = {name: 'TestModel'};
      const S = new DefinitionRegistry();
      S.addModel(model1);
      const throwable = () => S.addModel(model2);
      expect(throwable).to.throw('Model "TestModel" is already defined.');
    });
  });

  describe('hasModel', function () {
    it('should return true when the model name is registered', function () {
      const model = {name: 'model'};
      const S = new DefinitionRegistry();
      expect(S.hasModel(model.name)).to.be.false;
      S.addModel(model);
      expect(S.hasModel(model.name)).to.be.true;
    });
  });

  describe('getModel', function () {
    it('should return the model definition for the model name', function () {
      const model = {name: 'model'};
      const S = new DefinitionRegistry();
      S.addModel(model);
      const result = S.getModel('model');
      expect(result).to.be.eql(model);
    });

    it('should throw an error when the model name is not registered', function () {
      const S = new DefinitionRegistry();
      const throwable = () => S.getModel('undefined');
      expect(throwable).to.throw('Model "undefined" is not defined.');
    });
  });

  describe('getModelNames', function () {
    it('should return an array of model names in the definition order', function () {
      const model1 = {name: 'model1'};
      const model2 = {name: 'model2'};
      const model3 = {name: 'model3'};
      const S = new DefinitionRegistry();
      expect(S.getModelNames()).to.be.eql([]);
      S.addModel(model1);
      S.addModel(model2);
      S.addModel(model3);
      expect(S.getModelNames()).to.be.eql([
        model1.name,
        model2.name,
        model3.name,
      ]);
    });
  });
});
