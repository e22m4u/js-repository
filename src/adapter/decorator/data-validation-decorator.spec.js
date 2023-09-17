import chai from 'chai';
import {expect} from 'chai';
import {Adapter} from '../adapter.js';
import {Schema} from '../../schema.js';
import {ModelDataValidator} from '../../definition/index.js';

const S = new Schema();
S.defineModel({name: 'model'});

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
  patchById(modelName, id, modelData, filter = undefined) {
    return Promise.resolve({});
  }
}

const A = S.getService(TestAdapter);
const V = S.getService(ModelDataValidator);
const sandbox = chai.spy.sandbox();

describe('DataValidationDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method and validates a given data', async function () {
    sandbox.on(V, 'validate');
    const data = {};
    await A.create('model', data);
    expect(V.validate).to.be.called.once;
    expect(V.validate).to.be.called.with.exactly('model', data);
  });

  it('overrides the "replaceById" method and validates a given data', async function () {
    sandbox.on(V, 'validate');
    const data = {};
    await A.replaceById('model', 1, data);
    expect(V.validate).to.be.called.once;
    expect(V.validate).to.be.called.with.exactly('model', data);
  });

  it('overrides the "patchById" method and validates a given data', async function () {
    sandbox.on(V, 'validate');
    const data = {};
    await A.patchById('model', 1, data);
    expect(V.validate).to.be.called.once;
    expect(V.validate).to.be.called.with.exactly('model', data, true);
  });
});
