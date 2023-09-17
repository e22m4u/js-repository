import chai from 'chai';
import {expect} from 'chai';
import {Adapter} from '../adapter.js';
import {Schema} from '../../schema.js';
import {DataType} from '../../definition/index.js';
import {ModelDefinitionUtils} from '../../definition/index.js';

const S = new Schema();
S.defineModel({
  name: 'model',
  properties: {
    prop: {
      type: DataType.STRING,
      default: 'value',
    },
  },
});

const INPUT_DATA = {};

class TestAdapter extends Adapter {
  // eslint-disable-next-line no-unused-vars
  async create(modelName, modelData, filter = undefined) {
    return modelData;
  }

  // eslint-disable-next-line no-unused-vars
  async replaceById(modelName, id, modelData, filter = undefined) {
    return modelData;
  }

  // eslint-disable-next-line no-unused-vars
  async patchById(modelName, id, modelData, filter = undefined) {
    return modelData;
  }

  // eslint-disable-next-line no-unused-vars
  async find(modelName, filter = undefined) {
    return [INPUT_DATA];
  }

  // eslint-disable-next-line no-unused-vars
  async findById(modelName, id, filter = undefined) {
    return INPUT_DATA;
  }
}

const A = S.getService(TestAdapter);
const U = S.getService(ModelDefinitionUtils);
const sandbox = chai.spy.sandbox();

describe('DefaultValuesDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method method and sets default values to input data', async function () {
    sandbox.on(U, 'setDefaultValuesToEmptyProperties');
    const retval = await A.create('model', INPUT_DATA);
    expect(retval).to.be.eql({prop: 'value'});
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
      'model',
      INPUT_DATA,
    );
  });

  it('overrides the "replaceById" method and sets default values to input data', async function () {
    sandbox.on(U, 'setDefaultValuesToEmptyProperties');
    const retval = await A.replaceById('model', 1, INPUT_DATA);
    expect(retval).to.be.eql({prop: 'value'});
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
      'model',
      INPUT_DATA,
    );
  });

  describe('overrides the "patchById" method and sets default values to input data', function () {
    it('does not set default values to not existing properties of input data', async function () {
      sandbox.on(U, 'setDefaultValuesToEmptyProperties');
      const data = {};
      const retval = await A.patchById('model', 1, data);
      expect(retval).to.be.eql({});
      expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
      expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
        'model',
        data,
        true,
      );
    });

    it('does set default values to input properties of null', async function () {
      sandbox.on(U, 'setDefaultValuesToEmptyProperties');
      const data = {prop: null};
      const retval = await A.patchById('model', 2, data);
      expect(retval).to.be.eql({prop: 'value'});
      expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
      expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
        'model',
        data,
        true,
      );
    });

    it('does set default values to input properties of undefined', async function () {
      sandbox.on(U, 'setDefaultValuesToEmptyProperties');
      const data = {prop: undefined};
      const retval = await A.patchById('model', 3, data);
      expect(retval).to.be.eql({prop: 'value'});
      expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
      expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
        'model',
        data,
        true,
      );
    });
  });

  it('overrides the "find" method and sets default values to output data', async function () {
    sandbox.on(U, 'setDefaultValuesToEmptyProperties');
    const retval = await A.find('model');
    expect(retval).to.be.eql([{prop: 'value'}]);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
      'model',
      INPUT_DATA,
    );
  });

  it('overrides the "findById" method and sets default values to output data', async function () {
    sandbox.on(U, 'setDefaultValuesToEmptyProperties');
    const retval = await A.findById('model', 1);
    expect(retval).to.be.eql({prop: 'value'});
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.with.exactly(
      'model',
      INPUT_DATA,
    );
  });
});
