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

  it('sets a given datasource to the state', function () {
    const datasource = {name: 'datasource', adapter: 'adapter'};
    S.addDatasource(datasource);
    const result = S.getDatasource('datasource');
    expect(result).to.be.eql(datasource);
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

  it('throws an error when getting a not defined datasource', function () {
    const throwable = () => S.getDatasource('undefined');
    expect(throwable).to.throw('The datasource "undefined" is not defined.');
  });

  it('uses DatasourceDefinitionValidator to validate a given datasource', function () {
    const V = S.getService(DatasourceDefinitionValidator);
    sandbox.on(V, 'validate');
    const datasource = {name: 'datasource', adapter: 'adapter'};
    S.addDatasource(datasource);
    expect(V.validate).to.have.been.called.once;
    expect(V.validate).to.have.been.called.with.exactly(datasource);
  });

  it('sets a given model to the state', function () {
    const model = {name: 'model'};
    S.addModel(model);
    const result = S.getModel('model');
    expect(result).to.be.eql(model);
  });

  it('throws an error if a given model is already defined', function () {
    const model1 = {name: 'model'};
    const model2 = {name: 'model'};
    S.addModel(model1);
    const throwable = () => S.addModel(model2);
    expect(throwable).to.throw('The model "model" is already defined.');
  });

  it('throws an error when getting a not defined model', function () {
    const throwable = () => S.getModel('undefined');
    expect(throwable).to.throw('The model "undefined" is not defined.');
  });

  it('uses ModelDefinitionValidator to validate a given model', function () {
    const V = S.getService(ModelDefinitionValidator);
    sandbox.on(V, 'validate');
    const model = {name: 'model'};
    S.addModel(model);
    expect(V.validate).to.have.been.called.once;
    expect(V.validate).to.have.been.called.with.exactly(model);
  });
});
