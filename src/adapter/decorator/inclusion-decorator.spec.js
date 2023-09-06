import chai from 'chai';
import {expect} from 'chai';
import {Adapter} from '../adapter.js';
import {Schema} from '../../schema.js';
import {IncludeClauseTool} from '../../filter/index.js';

const S = new Schema();
S.defineModel({name: 'model'});
const FILTER = {include: 'parent'};

const MODEL_DATA = {
  foo: 'fooVal',
  bar: 'barVal',
};

const RETVAL_DATA = {
  foo: MODEL_DATA.foo,
  bar: MODEL_DATA.bar,
  baz: 'bazVal',
};

class TestAdapter extends Adapter {
  // eslint-disable-next-line no-unused-vars
  async create(modelName, modelData, filter = undefined) {
    return Object.assign({}, MODEL_DATA);
  }

  // eslint-disable-next-line no-unused-vars
  async replaceById(modelName, id, modelData, filter = undefined) {
    return Object.assign({}, MODEL_DATA);
  }

  // eslint-disable-next-line no-unused-vars
  async patchById(modelName, id, modelData, filter = undefined) {
    return Object.assign({}, MODEL_DATA);
  }

  // eslint-disable-next-line no-unused-vars
  async find(modelName, filter = undefined) {
    return [Object.assign({}, MODEL_DATA)];
  }

  // eslint-disable-next-line no-unused-vars
  async findById(modelName, id, filter = undefined) {
    return Object.assign({}, MODEL_DATA);
  }
}

const A = S.get(TestAdapter);
const T = S.get(IncludeClauseTool);
const sandbox = chai.spy.sandbox();

describe('InclusionDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  it('overrides the "create" method method and applies clause inclusion', async function () {
    sandbox.on(T, 'includeTo', function (entities, modelName, clause) {
      expect(entities).to.be.eql([MODEL_DATA]);
      expect(modelName).to.be.eql('model');
      expect(clause).to.be.eql(FILTER.include);
      Object.assign(entities[0], RETVAL_DATA);
    });
    const retval = await A.create('model', {}, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.includeTo).to.be.called.once;
  });

  it('overrides the "replaceById" method and applies clause inclusion', async function () {
    sandbox.on(T, 'includeTo', function (entities, modelName, clause) {
      expect(entities).to.be.eql([MODEL_DATA]);
      expect(modelName).to.be.eql('model');
      expect(clause).to.be.eql(FILTER.include);
      Object.assign(entities[0], RETVAL_DATA);
    });
    const retval = await A.replaceById('model', 1, {}, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.includeTo).to.be.called.once;
  });

  it('overrides the "patchById" method and applies clause inclusion', async function () {
    sandbox.on(T, 'includeTo', function (entities, modelName, clause) {
      expect(entities).to.be.eql([MODEL_DATA]);
      expect(modelName).to.be.eql('model');
      expect(clause).to.be.eql(FILTER.include);
      Object.assign(entities[0], RETVAL_DATA);
    });
    const retval = await A.patchById('model', 1, {}, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.includeTo).to.be.called.once;
  });

  it('overrides the "find" method and applies clause inclusion', async function () {
    sandbox.on(T, 'includeTo', function (entities, modelName, clause) {
      expect(entities).to.be.eql([MODEL_DATA]);
      expect(modelName).to.be.eql('model');
      expect(clause).to.be.eql(FILTER.include);
      Object.assign(entities[0], RETVAL_DATA);
    });
    const retval = await A.find('model', FILTER);
    expect(retval).to.be.eql([RETVAL_DATA]);
    expect(T.includeTo).to.be.called.once;
  });

  it('overrides the "findById" method and applies clause inclusion', async function () {
    sandbox.on(T, 'includeTo', function (entities, modelName, clause) {
      expect(entities).to.be.eql([MODEL_DATA]);
      expect(modelName).to.be.eql('model');
      expect(clause).to.be.eql(FILTER.include);
      Object.assign(entities[0], RETVAL_DATA);
    });
    const retval = await A.findById('model', 1, FILTER);
    expect(retval).to.be.eql(RETVAL_DATA);
    expect(T.includeTo).to.be.called.once;
  });
});
