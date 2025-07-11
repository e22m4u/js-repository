import {expect} from 'chai';
import {chai} from '../../chai.js';
import {Adapter} from '../adapter.js';
import {DatabaseSchema} from '../../database-schema.js';
import {ModelDataSanitizer} from '../../definition/index.js';

const dbs = new DatabaseSchema();
dbs.defineModel({name: 'model'});

class TestAdapter extends Adapter {
  // eslint-disable-next-line no-unused-vars
  create(modelName, modelData, filter = undefined) {
    return Promise.resolve({});
  }

  // eslint-disable-next-line no-unused-vars
  replaceById(modelName, id, modelData, filter = undefined) {
    return Promise.resolve({});
  }

  // eslint-disable-next-line no-unused-vars
  replaceOrCreate(modelName, modelData, filter = undefined) {
    return Promise.resolve({});
  }

  // eslint-disable-next-line no-unused-vars
  patch(modelName, modelData, where = undefined) {
    return Promise.resolve(1);
  }

  // eslint-disable-next-line no-unused-vars
  patchById(modelName, id, modelData, filter = undefined) {
    return Promise.resolve({});
  }
}

const A = dbs.getService(TestAdapter);
const V = dbs.getService(ModelDataSanitizer);
const sandbox = chai.spy.sandbox();

describe('DataSanitizingDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method and sanitizes a given data', async function () {
    sandbox.on(V, 'sanitize');
    const data = {};
    await A.create('model', data);
    expect(V.sanitize).to.be.called.once;
    expect(V.sanitize).to.be.called.with.exactly('model', data);
  });

  it('overrides the "replaceById" method and sanitizes a given data', async function () {
    sandbox.on(V, 'sanitize');
    const data = {};
    await A.replaceById('model', 1, data);
    expect(V.sanitize).to.be.called.once;
    expect(V.sanitize).to.be.called.with.exactly('model', data);
  });

  it('overrides the "replaceOrCreate" method and sanitizes a given data', async function () {
    sandbox.on(V, 'sanitize');
    const data = {};
    await A.replaceOrCreate('model', data);
    expect(V.sanitize).to.be.called.once;
    expect(V.sanitize).to.be.called.with.exactly('model', data);
  });

  it('overrides the "patch" method and sanitizes a given data', async function () {
    sandbox.on(V, 'sanitize');
    const data = {};
    await A.patch('model', data);
    expect(V.sanitize).to.be.called.once;
    expect(V.sanitize).to.be.called.with.exactly('model', data);
  });

  it('overrides the "patchById" method and sanitizes a given data', async function () {
    sandbox.on(V, 'sanitize');
    const data = {};
    await A.patchById('model', 1, data);
    expect(V.sanitize).to.be.called.once;
    expect(V.sanitize).to.be.called.with.exactly('model', data);
  });
});
