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
      const result = await rep.create(data, filter);
      expect(result).to.containSubset(data);
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
      expect(result).to.containSubset(data);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeCreate" and "afterCreate" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_CREATE, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_CREATE, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_CREATE, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_CREATE, handler4);
      const rep = schema.getRepository('model');
      await rep.create({});
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
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
      const created = await rep.create(data);
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.REPLACE_BY_ID,
        eventName: RepositoryEvent.BEFORE_UPDATE,
        id: created[DEF_PK],
        data,
        filter,
      };
      const result = await rep.replaceById(context.id, data, filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterUpdate" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const data = {foo: 'bar'};
      const filter = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.REPLACE_BY_ID,
        eventName: RepositoryEvent.AFTER_UPDATE,
        data,
        filter,
      };
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
        .observe(RepositoryEvent.AFTER_UPDATE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_UPDATE, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create(data);
      context.id = created[DEF_PK];
      const result = await rep.replaceById(context.id, data, filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeUpdate" and "afterUpdate" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_UPDATE, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_UPDATE, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_UPDATE, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_UPDATE, handler4);
      const rep = schema.getRepository('model');
      const data = {foo: 'bar'};
      const created = await rep.create(data);
      await rep.replaceById(created[DEF_PK], data);
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('patchById', function () {
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
      const created = await rep.create(data);
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.PATCH_BY_ID,
        eventName: RepositoryEvent.BEFORE_UPDATE,
        id: created[DEF_PK],
        data,
        filter,
      };
      const result = await rep.patchById(context.id, data, filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterUpdate" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const data = {foo: 'bar'};
      const filter = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.PATCH_BY_ID,
        eventName: RepositoryEvent.AFTER_UPDATE,
        data,
        filter,
      };
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
        .observe(RepositoryEvent.AFTER_UPDATE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_UPDATE, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create(data);
      context.id = created[DEF_PK];
      const result = await rep.patchById(context.id, data, filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeUpdate" and "afterUpdate" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_UPDATE, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_UPDATE, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_UPDATE, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_UPDATE, handler4);
      const rep = schema.getRepository('model');
      const data = {foo: 'bar'};
      const created = await rep.create(data);
      await rep.patchById(created[DEF_PK], data);
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('find', function () {
    it('emits the "beforeRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
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
        .observe(RepositoryEvent.BEFORE_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.FIND,
        eventName: RepositoryEvent.BEFORE_READ,
        filter,
      };
      const result = await rep.find(filter);
      expect(result).to.be.eql([created]);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const filter = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.FIND,
        eventName: RepositoryEvent.AFTER_READ,
        filter,
      };
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
        .observe(RepositoryEvent.AFTER_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.find(filter);
      expect(result).to.be.eql([created]);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeRead" and "afterRead" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_READ, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_READ, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, handler4);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.find();
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('findOne', function () {
    it('emits the "beforeRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
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
        .observe(RepositoryEvent.BEFORE_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.FIND_ONE,
        eventName: RepositoryEvent.BEFORE_READ,
        filter,
      };
      const result = await rep.findOne(filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const filter = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.FIND_ONE,
        eventName: RepositoryEvent.AFTER_READ,
        filter,
      };
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
        .observe(RepositoryEvent.AFTER_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.findOne(filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeRead" and "afterRead" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_READ, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_READ, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, handler4);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.findOne();
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('findById', function () {
    it('emits the "beforeRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
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
        .observe(RepositoryEvent.BEFORE_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.FIND_BY_ID,
        eventName: RepositoryEvent.BEFORE_READ,
        id: created[DEF_PK],
        filter,
      };
      const result = await rep.findById(context[DEF_PK], filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const filter = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.FIND_BY_ID,
        eventName: RepositoryEvent.AFTER_READ,
        filter,
      };
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
        .observe(RepositoryEvent.AFTER_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      context.id = created[DEF_PK];
      const result = await rep.findById(context.id, filter);
      expect(result).to.be.eql(created);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeRead" and "afterRead" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_READ, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_READ, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, handler4);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      await rep.findById(created[DEF_PK]);
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('delete', function () {
    it('emits the "beforeDelete" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const where = {};
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
        .observe(RepositoryEvent.BEFORE_DELETE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_DELETE, modelHandler);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.DELETE,
        eventName: RepositoryEvent.BEFORE_DELETE,
        where,
      };
      const result = await rep.delete(where);
      expect(result).to.be.eq(1);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const where = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.DELETE,
        eventName: RepositoryEvent.AFTER_DELETE,
        where,
      };
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
        .observe(RepositoryEvent.AFTER_DELETE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_DELETE, modelHandler);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      const result = await rep.delete(where);
      expect(result).to.be.eq(1);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeDelete" and "afterDelete" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_DELETE, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_DELETE, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_DELETE, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_DELETE, handler4);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.delete();
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('deleteById', function () {
    it('emits the "beforeDelete" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
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
        .observe(RepositoryEvent.BEFORE_DELETE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_DELETE, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.DELETE_BY_ID,
        eventName: RepositoryEvent.BEFORE_DELETE,
        id: created[DEF_PK],
      };
      const result = await rep.deleteById(context.id);
      expect(result).to.be.true;
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterUpdate" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.DELETE_BY_ID,
        eventName: RepositoryEvent.AFTER_DELETE,
      };
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
        .observe(RepositoryEvent.AFTER_DELETE, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_DELETE, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      context.id = created[DEF_PK];
      const result = await rep.deleteById(context.id);
      expect(result).to.be.true;
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeDelete" and "afterDelete" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_DELETE, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_DELETE, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_DELETE, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_DELETE, handler4);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      await rep.deleteById(created[DEF_PK]);
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('exists', function () {
    it('emits the "beforeRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
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
        .observe(RepositoryEvent.BEFORE_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.EXISTS,
        eventName: RepositoryEvent.BEFORE_READ,
        id: created[DEF_PK],
      };
      const result = await rep.exists(context.id);
      expect(result).to.be.true;
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.EXISTS,
        eventName: RepositoryEvent.AFTER_READ,
      };
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
        .observe(RepositoryEvent.AFTER_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, modelHandler);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      context.id = created[DEF_PK];
      const result = await rep.exists(context.id);
      expect(result).to.be.true;
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeRead" and "afterRead" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_READ, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_READ, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, handler4);
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      await rep.exists(created[DEF_PK]);
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });

  describe('count', function () {
    it('emits the "beforeRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const where = {};
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
        .observe(RepositoryEvent.BEFORE_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, modelHandler);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.COUNT,
        eventName: RepositoryEvent.BEFORE_READ,
        where,
      };
      const result = await rep.count(where);
      expect(result).to.be.eq(1);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
    });

    it('emits the "afterRead" event with specific context', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      let rootHandlerExecuted = false;
      let modelHandlerExecuted = false;
      const where = {};
      let rootHandlerResult;
      let modelHandlerResult;
      const context = {
        modelName: 'model',
        methodName: RepositoryMethod.COUNT,
        eventName: RepositoryEvent.AFTER_READ,
        where,
      };
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
        .observe(RepositoryEvent.AFTER_READ, rootHandler);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, modelHandler);
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      const result = await rep.count(where);
      expect(result).to.be.eq(1);
      expect(rootHandlerExecuted).to.be.true;
      expect(modelHandlerExecuted).to.be.true;
      expect(result).to.be.eq(rootHandlerResult);
      expect(result).to.be.eq(modelHandlerResult);
    });

    it('emits "beforeRead" and "afterRead" in order', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.BEFORE_READ, handler1);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.BEFORE_READ, handler2);
      schema
        .get(RepositoryObserver)
        .observe(RepositoryEvent.AFTER_READ, handler3);
      schema
        .get(RepositoryObserver)
        .observe('model', RepositoryEvent.AFTER_READ, handler4);
      const rep = schema.getRepository('model');
      await rep.count();
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });
  });
});
