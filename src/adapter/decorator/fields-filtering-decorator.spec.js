import chai from 'chai';
import {expect} from 'chai';
import {Adapter} from '../adapter.js';
import {Schema} from '../../schema.js';
import {FieldsClauseTool} from '../../filter/index.js';

const S = new Schema();
const MODEL_NAME = 'model';
S.defineModel({name: MODEL_NAME});

const FILTER = {fields: ['foo', 'bar']};
const MODEL_DATA = {
  foo: 'fooVal',
  bar: 'barVal',
  baz: 'bazVal',
  qux: 'quxVal',
};

const RETVAL_DATA = {
  foo: MODEL_DATA.foo,
  bar: MODEL_DATA.bar,
};

class TestAdapter extends Adapter {
  // eslint-disable-next-line no-unused-vars
  async create(modelName, modelData, filter = undefined) {
    return MODEL_DATA;
  }

  // eslint-disable-next-line no-unused-vars
  async replaceById(modelName, id, modelData, filter = undefined) {
    return MODEL_DATA;
  }

  // eslint-disable-next-line no-unused-vars
  async patchById(modelName, id, modelData, filter = undefined) {
    return MODEL_DATA;
  }

  // eslint-disable-next-line no-unused-vars
  async find(modelName, filter = undefined) {
    return [MODEL_DATA];
  }

  // eslint-disable-next-line no-unused-vars
  async findById(modelName, id, filter = undefined) {
    return MODEL_DATA;
  }
}

const A = S.getService(TestAdapter);
const T = S.getService(FieldsClauseTool);
const sandbox = chai.spy.sandbox();

describe('FieldsFilteringDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method method and filtering output fields', async function () {
    sandbox.on(T, 'filter');
    const retval = await A.create(MODEL_NAME, {}, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.filter).to.be.called.once;
    expect(T.filter).to.be.called.with.exactly(
      MODEL_DATA,
      MODEL_NAME,
      FILTER.fields,
    );
  });

  it('overrides the "replaceById" method and filtering output fields', async function () {
    sandbox.on(T, 'filter');
    const retval = await A.replaceById(MODEL_NAME, 1, {}, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.filter).to.be.called.once;
    expect(T.filter).to.be.called.with.exactly(
      MODEL_DATA,
      MODEL_NAME,
      FILTER.fields,
    );
  });

  it('overrides the "patchById" method and filtering output fields', async function () {
    sandbox.on(T, 'filter');
    const retval = await A.patchById(MODEL_NAME, 1, {}, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.filter).to.be.called.once;
    expect(T.filter).to.be.called.with.exactly(
      MODEL_DATA,
      MODEL_NAME,
      FILTER.fields,
    );
  });

  it('overrides the "find" method and filtering output fields', async function () {
    sandbox.on(T, 'filter', function (entities, modelName, fields) {
      expect(entities).to.be.eql([MODEL_DATA]);
      expect(modelName).to.be.eq(MODEL_NAME);
      expect(fields).to.be.eql(FILTER.fields);
      return [RETVAL_DATA];
    });
    const retval = await A.find(MODEL_NAME, FILTER);
    expect(retval).to.be.eql([RETVAL_DATA]);
    expect(T.filter).to.be.called.once;
  });

  it('overrides the "findById" method and filtering output fields', async function () {
    sandbox.on(T, 'filter');
    const retval = await A.findById(MODEL_NAME, 1, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.filter).to.be.called.once;
    expect(T.filter).to.be.called.with.exactly(
      MODEL_DATA,
      MODEL_NAME,
      FILTER.fields,
    );
  });
});
