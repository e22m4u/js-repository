import chai from 'chai';
import {expect} from 'chai';
import {Adapter} from '../adapter.js';
import {Schema} from '../../schema.js';
import {ModelDataTransformer} from '../../definition/index.js';

const S = new Schema();
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
const V = S.getService(ModelDataTransformer);
const sandbox = chai.spy.sandbox();

describe('DataTransformationDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method and transforms a given data', async function () {
    const modelData = {kind: 'modelData'};
    const transformedData = {kind: 'transformedData'};
    sandbox.on(V, 'transform', () => transformedData);
    const res = await A.create('model', modelData);
    expect(res).to.be.eql(transformedData);
    expect(V.transform).to.be.called.once;
    expect(V.transform).to.be.called.with.exactly('model', modelData);
  });

  it('overrides the "replaceById" method and transforms a given data', async function () {
    const modelData = {kind: 'modelData'};
    const transformedData = {kind: 'transformedData'};
    sandbox.on(V, 'transform', () => transformedData);
    const res = await A.replaceById('model', 1, modelData);
    expect(res).to.be.eql(transformedData);
    expect(V.transform).to.be.called.once;
    expect(V.transform).to.be.called.with.exactly('model', modelData);
  });

  it('overrides the "replaceOrCreate" method and transforms a given data', async function () {
    const modelData = {kind: 'modelData'};
    const transformedData = {kind: 'transformedData'};
    sandbox.on(V, 'transform', () => transformedData);
    const res = await A.replaceOrCreate('model', modelData);
    expect(res).to.be.eql(transformedData);
    expect(V.transform).to.be.called.once;
    expect(V.transform).to.be.called.with.exactly('model', modelData);
  });

  it('overrides the "patch" method and transforms a given data', async function () {
    const modelData = {kind: 'modelData'};
    const transformedData = {kind: 'transformedData'};
    sandbox.on(V, 'transform', () => transformedData);
    const res = await A.patch('model', modelData);
    expect(res).to.be.eql(transformedData);
    expect(V.transform).to.be.called.once;
    expect(V.transform).to.be.called.with.exactly('model', modelData);
  });

  it('overrides the "patchById" method and transforms a given data', async function () {
    const modelData = {kind: 'modelData'};
    const transformedData = {kind: 'transformedData'};
    sandbox.on(V, 'transform', () => transformedData);
    const res = await A.patchById('model', 1, modelData);
    expect(res).to.be.eql(transformedData);
    expect(V.transform).to.be.called.once;
    expect(V.transform).to.be.called.with.exactly('model', modelData);
  });
});
