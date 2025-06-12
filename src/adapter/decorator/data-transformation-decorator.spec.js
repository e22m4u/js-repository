import {expect} from 'chai';
import {chai} from '../../chai.js';
import {Adapter} from '../adapter.js';
import {DatabaseSchema} from '../../database-schema.js';
import {ModelDataTransformer} from '../../definition/index.js';

const MODEL_NAME = 'myModel';
const MODEL_DATA = {kind: 'modelData'};
const TRANSFORMED_DATA = {kind: 'transformedData'};
const WHERE_CLAUSE = {kind: {existed: true}};
const FILTER_CLAUSE = {where: WHERE_CLAUSE};
const DUMMY_ID = 1;

class TestAdapter extends Adapter {
  create(modelName, modelData, filter = undefined) {
    expect(modelName).to.be.eq(MODEL_NAME);
    expect(modelData).to.be.eql(TRANSFORMED_DATA);
    expect(filter).to.be.eql(FILTER_CLAUSE);
    return Promise.resolve(modelData);
  }
  replaceById(modelName, id, modelData, filter = undefined) {
    expect(modelName).to.be.eq(MODEL_NAME);
    expect(id).to.be.eq(DUMMY_ID);
    expect(modelData).to.be.eql(TRANSFORMED_DATA);
    expect(filter).to.be.eql(FILTER_CLAUSE);
    return Promise.resolve(modelData);
  }
  replaceOrCreate(modelName, modelData, filter = undefined) {
    expect(modelName).to.be.eq(MODEL_NAME);
    expect(modelData).to.be.eql(TRANSFORMED_DATA);
    expect(filter).to.be.eql(FILTER_CLAUSE);
    return Promise.resolve(modelData);
  }
  patch(modelName, modelData, where = undefined) {
    expect(modelName).to.be.eq(MODEL_NAME);
    expect(modelData).to.be.eql(TRANSFORMED_DATA);
    expect(where).to.be.eql(WHERE_CLAUSE);
    return Promise.resolve(modelData);
  }
  patchById(modelName, id, modelData, filter = undefined) {
    expect(modelName).to.be.eq(MODEL_NAME);
    expect(id).to.be.eq(DUMMY_ID);
    expect(modelData).to.be.eql(TRANSFORMED_DATA);
    expect(filter).to.be.eql(FILTER_CLAUSE);
    return Promise.resolve(modelData);
  }
}

const dbs = new DatabaseSchema();
dbs.defineModel({name: MODEL_NAME});
const A = dbs.getService(TestAdapter);
const T = dbs.getService(ModelDataTransformer);
const sandbox = chai.spy.sandbox();

describe('DataTransformationDecorator', function () {
  afterEach(function () {
    sandbox.restore();
  });

  describe('overrides the "create" method', function () {
    it('transforms the given data', async function () {
      sandbox.on(T, 'transform', () => TRANSFORMED_DATA);
      const res = await A.create(MODEL_NAME, MODEL_DATA, FILTER_CLAUSE);
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(MODEL_NAME, MODEL_DATA);
    });

    it('resolves the transformation promise', async function () {
      sandbox.on(T, 'transform', () => Promise.resolve(TRANSFORMED_DATA));
      const res = await A.create(MODEL_NAME, MODEL_DATA, FILTER_CLAUSE);
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(MODEL_NAME, MODEL_DATA);
    });
  });

  describe('overrides the "replaceById" method', function () {
    it('transforms the given data', async function () {
      sandbox.on(T, 'transform', () => TRANSFORMED_DATA);
      const res = await A.replaceById(
        MODEL_NAME,
        DUMMY_ID,
        MODEL_DATA,
        FILTER_CLAUSE,
      );
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(MODEL_NAME, MODEL_DATA);
    });

    it('resolves the transformation promise', async function () {
      sandbox.on(T, 'transform', () => Promise.resolve(TRANSFORMED_DATA));
      const res = await A.replaceById(
        MODEL_NAME,
        DUMMY_ID,
        MODEL_DATA,
        FILTER_CLAUSE,
      );
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(MODEL_NAME, MODEL_DATA);
    });
  });

  describe('overrides the "replaceOrCreate" method', function () {
    it('transforms the given data', async function () {
      sandbox.on(T, 'transform', () => TRANSFORMED_DATA);
      const res = await A.replaceOrCreate(
        MODEL_NAME,
        MODEL_DATA,
        FILTER_CLAUSE,
      );
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(MODEL_NAME, MODEL_DATA);
    });

    it('resolves the transformation promise', async function () {
      sandbox.on(T, 'transform', () => Promise.resolve(TRANSFORMED_DATA));
      const res = await A.replaceOrCreate(
        MODEL_NAME,
        MODEL_DATA,
        FILTER_CLAUSE,
      );
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(MODEL_NAME, MODEL_DATA);
    });
  });

  describe('overrides the "patch" method', function () {
    it('transforms the given data', async function () {
      sandbox.on(T, 'transform', () => TRANSFORMED_DATA);
      const res = await A.patch(MODEL_NAME, MODEL_DATA, WHERE_CLAUSE);
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(
        MODEL_NAME,
        MODEL_DATA,
        true,
      );
    });

    it('resolves the transformation promise', async function () {
      sandbox.on(T, 'transform', () => Promise.resolve(TRANSFORMED_DATA));
      const res = await A.patch(MODEL_NAME, MODEL_DATA, WHERE_CLAUSE);
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(
        MODEL_NAME,
        MODEL_DATA,
        true,
      );
    });
  });

  describe('overrides the "patchById" method', function () {
    it('transforms the given data', async function () {
      sandbox.on(T, 'transform', () => TRANSFORMED_DATA);
      const res = await A.patchById(
        MODEL_NAME,
        DUMMY_ID,
        MODEL_DATA,
        FILTER_CLAUSE,
      );
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(
        MODEL_NAME,
        MODEL_DATA,
        true,
      );
    });

    it('resolves the transformation promise', async function () {
      sandbox.on(T, 'transform', () => Promise.resolve(TRANSFORMED_DATA));
      const res = await A.patchById(
        MODEL_NAME,
        DUMMY_ID,
        MODEL_DATA,
        FILTER_CLAUSE,
      );
      expect(res).to.be.eql(TRANSFORMED_DATA);
      expect(T.transform).to.be.called.once;
      expect(T.transform).to.be.called.with.exactly(
        MODEL_NAME,
        MODEL_DATA,
        true,
      );
    });
  });
});
