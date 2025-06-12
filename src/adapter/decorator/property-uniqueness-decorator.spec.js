import {expect} from 'chai';
import {chai} from '../../chai.js';
import {Adapter} from '../adapter.js';
import {DatabaseSchema} from '../../database-schema.js';
import {PropertyUniquenessValidator} from '../../definition/index.js';

const S = new DatabaseSchema();
S.defineModel({name: 'model'});

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

const A = S.getService(TestAdapter);
const V = S.getService(PropertyUniquenessValidator);
const sandbox = chai.spy.sandbox();

describe('PropertyUniquenessDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(
      V,
      'validate',
      (countMethod, methodName, modelName, modelData, id = undefined) => {
        expect(typeof countMethod).to.be.eq('function');
        expect(methodName).to.be.eq('create');
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(data);
        expect(id).to.be.undefined;
      },
    );
    const res = await A.create('model', data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "replaceById" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(
      V,
      'validate',
      (countMethod, methodName, modelName, modelData, id = undefined) => {
        expect(typeof countMethod).to.be.eq('function');
        expect(methodName).to.be.eq('replaceById');
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(data);
        expect(id).to.be.eq(1);
      },
    );
    const res = await A.replaceById('model', 1, data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "replaceOrCreate" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(
      V,
      'validate',
      (countMethod, methodName, modelName, modelData, id = undefined) => {
        expect(typeof countMethod).to.be.eq('function');
        expect(methodName).to.be.eq('replaceOrCreate');
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(data);
        expect(id).to.be.undefined;
      },
    );
    const res = await A.replaceOrCreate('model', data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "patch" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(
      V,
      'validate',
      (countMethod, methodName, modelName, modelData, id = undefined) => {
        expect(typeof countMethod).to.be.eq('function');
        expect(methodName).to.be.eq('patch');
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(data);
        expect(id).to.be.undefined;
      },
    );
    const res = await A.patch('model', data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });

  it('overrides the "patchById" method and validates a given data', async function () {
    const data = {kind: 'data'};
    sandbox.on(
      V,
      'validate',
      (countMethod, methodName, modelName, modelData, id = undefined) => {
        expect(typeof countMethod).to.be.eq('function');
        expect(methodName).to.be.eq('patchById');
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(data);
        expect(id).to.be.eq(1);
      },
    );
    const res = await A.patchById('model', 1, data);
    expect(res).to.be.eql(data);
    expect(V.validate).to.be.called.once;
  });
});
