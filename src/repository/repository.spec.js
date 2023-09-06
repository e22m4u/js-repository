import {expect} from 'chai';
import {Schema} from '../schema.js';
import {RepositoryMethod} from './repository.js';
import {RepositoryEvent} from './repository-observer.js';
import {RepositoryObserver} from './repository-observer.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

describe('Repository', function () {
  describe('create', function () {
    it('emits the "beforeCreate" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const data = {foo: 'bar'};
      const filter = {};
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.CREATE,
        eventName: RepositoryEvent.BEFORE_CREATE,
        data,
        filter,
      };
      const rootHandler = ctx => {
        expect(ctx).to.be.eql(context);
        rootHandlerExecuted = true;
      };
      const modelHandler = ctx => {
        expect(ctx).to.be.eql(context);
        modelHandlerExecuted = true;
      };
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_CREATE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_CREATE, modelHandler);
      const rep = schema.getRepository('model');
      await rep.create(data, filter);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterCreate" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const data = {foo: 'bar'};
      const filter = {};
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.CREATE,
        eventName: RepositoryEvent.AFTER_CREATE,
        data,
        filter,
      };
      let rootHandlerResult;
      let modelHandlerResult;
      const rootHandler = ctx => {
        expect(ctx).to.containSubset(context);
        rootHandlerResult = ctx.result;
        rootHandlerExecuted = true;
      };
      const modelHandler = ctx => {
        expect(ctx).to.containSubset(context);
        modelHandlerResult = ctx.result;
        modelHandlerExecuted = true;
      };
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_CREATE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_CREATE, modelHandler);
      const rep = schema.getRepository('model');
      const result = await rep.create(data, filter);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });
  });

  describe('replaceById', function () {
    it('emits the "beforeUpdate" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const data = {foo: 'bar'};
      const filter = {};
      const rootHandler = ctx => {
        expect(ctx).to.be.eql(context);
        rootHandlerExecuted = true;
      };
      const modelHandler = ctx => {
        expect(ctx).to.be.eql(context);
        modelHandlerExecuted = true;
      };
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_UPDATE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_UPDATE, modelHandler);
      const rep = schema.getRepository('model');
      const createdItem = await rep.create(data);
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.REPLACE_BY_ID,
        eventName: RepositoryEvent.BEFORE_UPDATE,
        id: createdItem[DEF_PK],
        data,
        filter,
      };
      await rep.replaceById(context.id, data, filter);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });
  });
});
