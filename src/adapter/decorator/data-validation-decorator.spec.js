import {expect} from 'chai';
import {chai} from '../../chai.js';
import {Adapter} from '../adapter.js';
import {DatabaseSchema} from '../../database-schema.js';
import {ModelDataValidator} from '../../definition/index.js';

const dbs = new DatabaseSchema();
dbs.defineModel({name: 'model'});

class TestAdapter extends Adapter {
  // eslint-disable-next-line no-unused-vars
  create(modelName, modelData, filter = undefined) {
    return Promise.resolve(modelData);
  }

  // eslint-disable-next-line no-unused-vars
  replaceById(modelName, id, modelData, filter = undefined) {
    return Promise.resolve(modelData);
  }

  // eslint-disable-next-line no-unused-vars
  replaceOrCreate(modelName, modelData, filter = undefined) {
    return Promise.resolve(modelData);
  }

  // eslint-disable-next-line no-unused-vars
  patch(modelName, modelData, where = undefined) {
    return Promise.resolve(modelData);
  }

  // eslint-disable-next-line no-unused-vars
  patchById(modelName, id, modelData, filter = undefined) {
    return Promise.resolve(modelData);
  }
}

const A = dbs.getService(TestAdapter);
const V = dbs.getService(ModelDataValidator);
const sandbox = chai.spy.sandbox();

describe('DataValidationDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(V, 'validate', (modelName, modelData, isPartial = false) => {
      expect(modelName).to.be.eq('model');
      expect(modelData).to.be.eql(data);
      expect(isPartial).to.be.false;
    });
    const res = await A.create('model', data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "replaceById" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(V, 'validate', (modelName, modelData, isPartial = false) => {
      expect(modelName).to.be.eq('model');
      expect(modelData).to.be.eql(data);
      expect(isPartial).to.be.false;
    });
    const res = await A.replaceById('model', 1, data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "replaceOrCreate" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(V, 'validate', (modelName, modelData, isPartial = false) => {
      expect(modelName).to.be.eq('model');
      expect(modelData).to.be.eql(data);
      expect(isPartial).to.be.false;
    });
    const res = await A.replaceOrCreate('model', data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "patch" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(V, 'validate', (modelName, modelData, isPartial = false) => {
      expect(modelName).to.be.eq('model');
      expect(modelData).to.be.eql(data);
      expect(isPartial).to.be.true;
    });
    const res = await A.patch('model', data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "patchById" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(V, 'validate', (modelName, modelData, isPartial = false) => {
      expect(modelName).to.be.eq('model');
      expect(modelData).to.be.eql(data);
      expect(isPartial).to.be.true;
    });
    const res = await A.patchById('model', 1, data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });
});
