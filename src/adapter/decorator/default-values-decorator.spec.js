import {expect} from 'chai';
import {chai} from '../../chai.js';
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
const INPUT_DATA_WITH_DEFAULTS = {prop: 'value'};

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
  async replaceOrCreate(modelName, modelData, filter = undefined) {
    return modelData;
  }

  // eslint-disable-next-line no-unused-vars
  patch(modelName, modelData, where = undefined) {
    return Promise.resolve(modelData);
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
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.false;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.create('model', INPUT_DATA);
    expect(res).to.be.eql(INPUT_DATA_WITH_DEFAULTS);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });

  it('overrides the "replaceById" method and sets default values to input data', async function () {
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.false;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.replaceById('model', 1, INPUT_DATA);
    expect(res).to.be.eql(INPUT_DATA_WITH_DEFAULTS);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });

  it('overrides the "replaceOrCreate" method and sets default values to input data', async function () {
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.false;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.replaceOrCreate('model', INPUT_DATA);
    expect(res).to.be.eql(INPUT_DATA_WITH_DEFAULTS);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });

  it('overrides the "patch" method and sets default values to input data', async function () {
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.true;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.patch('model', INPUT_DATA);
    expect(res).to.be.eql(INPUT_DATA_WITH_DEFAULTS);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });

  it('overrides the "patchById" method and sets default values to input data', async function () {
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.true;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.patchById('model', 1, INPUT_DATA);
    expect(res).to.be.eql(INPUT_DATA_WITH_DEFAULTS);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });

  it('overrides the "find" method and sets default values to output data', async function () {
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.false;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.find('model');
    expect(res).to.be.eql([INPUT_DATA_WITH_DEFAULTS]);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });

  it('overrides the "findById" method and sets default values to output data', async function () {
    sandbox.on(
      U,
      'setDefaultValuesToEmptyProperties',
      (modelName, modelData, onlyProvidedProperties = false) => {
        expect(modelName).to.be.eq('model');
        expect(modelData).to.be.eql(INPUT_DATA);
        expect(onlyProvidedProperties).to.be.false;
        return INPUT_DATA_WITH_DEFAULTS;
      },
    );
    const res = await A.findById('model', 1);
    expect(res).to.be.eql(INPUT_DATA_WITH_DEFAULTS);
    expect(U.setDefaultValuesToEmptyProperties).to.be.called.once;
  });
});
