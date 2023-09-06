import {expect} from 'chai';
import {format} from 'util';
import {Schema} from '../schema.js';
import {RepositoryEvent} from './repository-observer.js';
import {RepositoryObserver} from './repository-observer.js';

const MODEL_NAME = 'model';
const EVENT_NAME = RepositoryEvent.AFTER_CREATE;
const METHOD_NAME = 'methodName';
const HANDLER_FN = () => undefined;

describe('RepositoryObserver', function () {
  describe('observe', function () {
    describe('2 arguments', function () {
      it('adds an event handler of the root scope', function () {
        const schema = new Schema();
        schema.defineDatasource({name: 'datasource', adapter: 'memory'});
        schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
        const observer = schema.get(RepositoryObserver);
        observer.observe(EVENT_NAME, HANDLER_FN);
        const eventsMap = observer._handlersMap.get(null);
        const listeners = eventsMap.get(EVENT_NAME);
        expect(listeners).to.have.lengthOf(1);
        expect(listeners).to.include(HANDLER_FN);
      });

      it('requires the "eventName" argument to be RepositoryEvent', function () {
        const schema = new Schema();
        const observer = schema.get(RepositoryObserver);
        const throwable = v => () => observer.observe(v, HANDLER_FN);
        const error = v =>
          format(
            'The parameter "eventName" of RepositoryObserver.observe ' +
              'must be a non-empty String, but %s given.',
            v,
          );
        expect(throwable()).to.throw(error('undefined'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(null)).to.throw(error('null'));
        Object.values(RepositoryEvent).forEach(e => throwable(e)());
      });

      it('requires the "handler" argument to be a function', function () {
        const schema = new Schema();
        const observer = schema.get(RepositoryObserver);
        const throwable = v => () => observer.observe(EVENT_NAME, v);
        const error = v =>
          format(
            'The parameter "handler" of RepositoryObserver.observe ' +
              'must be a Function, but %s given.',
            v,
          );
        expect(throwable()).to.throw(error('undefined'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable('str')).to.throw(error('"str"'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(null)).to.throw(error('null'));
        throwable(HANDLER_FN)();
      });
    });

    describe('3 arguments', function () {
      it('adds an event handler of a model scope', function () {
        const schema = new Schema();
        schema.defineDatasource({name: 'datasource', adapter: 'memory'});
        schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
        const observer = schema.get(RepositoryObserver);
        observer.observe(MODEL_NAME, EVENT_NAME, HANDLER_FN);
        const eventsMap = observer._handlersMap.get(MODEL_NAME);
        const listeners = eventsMap.get(EVENT_NAME);
        expect(listeners).to.have.lengthOf(1);
        expect(listeners).to.include(HANDLER_FN);
      });

      it('requires the "modelName" argument to be a non-empty string', function () {
        const schema = new Schema();
        schema.defineDatasource({name: 'datasource', adapter: 'memory'});
        schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
        const observer = schema.get(RepositoryObserver);
        const throwable = v => () =>
          observer.observe(v, EVENT_NAME, HANDLER_FN);
        const error = v =>
          format(
            'The parameter "modelName" of RepositoryObserver.observe ' +
              'must be a non-empty String, but %s given.',
            v,
          );
        expect(throwable()).to.throw(error('undefined'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(null)).to.throw(error('null'));
        throwable(MODEL_NAME)();
      });

      it('requires the "modelName" argument to be a defined model', function () {
        const schema = new Schema();
        const observer = schema.get(RepositoryObserver);
        const throwable = () =>
          observer.observe('unknown', EVENT_NAME, HANDLER_FN);
        expect(throwable).to.throw(
          'Cannot observe repository of a not defined model "unknown".',
        );
        schema.defineDatasource({name: 'datasource', adapter: 'memory'});
        schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
        observer.observe(MODEL_NAME, EVENT_NAME, HANDLER_FN);
      });

      it('requires the "eventName" argument to be RepositoryEvent', function () {
        const schema = new Schema();
        schema.defineDatasource({name: 'datasource', adapter: 'memory'});
        schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
        const observer = schema.get(RepositoryObserver);
        const throwable = v => () =>
          observer.observe(MODEL_NAME, v, HANDLER_FN);
        const error = v =>
          format(
            'The parameter "eventName" of RepositoryObserver.observe ' +
              'must be a non-empty String, but %s given.',
            v,
          );
        expect(throwable()).to.throw(error('undefined'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(null)).to.throw(error('null'));
        Object.values(RepositoryEvent).forEach(e => throwable(e)());
      });

      it('requires the "handler" argument to be a function', function () {
        const schema = new Schema();
        schema.defineDatasource({name: 'datasource', adapter: 'memory'});
        schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
        const observer = schema.get(RepositoryObserver);
        const throwable = v => () =>
          observer.observe(MODEL_NAME, EVENT_NAME, v);
        const error = v =>
          format(
            'The parameter "handler" of RepositoryObserver.observe ' +
              'must be a Function, but %s given.',
            v,
          );
        expect(throwable()).to.throw(error('undefined'));
        expect(throwable('')).to.throw(error('""'));
        expect(throwable('str')).to.throw(error('"str"'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable(null)).to.throw(error('null'));
        throwable(HANDLER_FN)();
      });
    });
  });

  describe('_getHandlers', function () {
    it('returns an empty array if no handlers', function () {
      const schema = new Schema();
      const observer = schema.get(RepositoryObserver);
      const result = observer._getHandlers(MODEL_NAME, EVENT_NAME);
      expect(result).to.have.lengthOf(0);
    });

    it('returns model handlers that includes root handlers', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'modelA', datasource: 'datasource'});
      schema.defineModel({name: 'modelB', datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const handler1 = () => undefined;
      const handler2 = () => undefined;
      const handler3 = () => undefined;
      const handler4 = () => undefined;
      const handler5 = () => undefined;
      const handler6 = () => undefined;
      const handler7 = () => undefined;
      const event1 = 'event1';
      const event2 = 'event2';
      observer.observe(event1, handler1);
      observer.observe(event1, handler2);
      observer.observe(event2, handler3);
      observer.observe('modelA', event1, handler4);
      observer.observe('modelA', event1, handler5);
      observer.observe('modelA', event2, handler6);
      observer.observe('modelB', event1, handler7);
      const result = observer._getHandlers('modelA', event1);
      expect(result).to.be.eql([handler1, handler2, handler4, handler5]);
    });

    it('requires the "modelName" argument to be a non-empty string', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const throwable = v => () => observer._getHandlers(v, EVENT_NAME);
      const error = v =>
        format(
          'The parameter "modelName" of RepositoryObserver._getHandlers ' +
            'must be a non-empty String, but %s given.',
          v,
        );
      expect(throwable()).to.throw(error('undefined'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(MODEL_NAME)();
    });

    it('requires the "eventName" argument to be a non-empty string', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const throwable = v => () => observer._getHandlers(MODEL_NAME, v);
      const error = v =>
        format(
          'The parameter "eventName" of RepositoryObserver._getHandlers ' +
            'must be a non-empty String, but %s given.',
          v,
        );
      expect(throwable()).to.throw(error('undefined'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('eventName')();
    });
  });

  describe('emit', function () {
    it('requires the "modelName" argument to be a non-empty string', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const throwable = v => () =>
        observer.emit(v, EVENT_NAME, METHOD_NAME, {});
      const error = v =>
        format(
          'The parameter "modelName" of RepositoryObserver.emit ' +
            'must be a non-empty String, but %s given.',
          v,
        );
      expect(throwable()).to.throw(error('undefined'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(MODEL_NAME)();
    });

    it('requires the "eventName" argument to be a non-empty string', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const throwable = v => () =>
        observer.emit(MODEL_NAME, v, METHOD_NAME, {});
      const error = v =>
        format(
          'The parameter "eventName" of RepositoryObserver.emit ' +
            'must be a non-empty String, but %s given.',
          v,
        );
      expect(throwable()).to.throw(error('undefined'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('eventName')();
    });

    it('requires the "methodName" argument to be a non-empty string', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const throwable = v => () => observer.emit(MODEL_NAME, EVENT_NAME, v, {});
      const error = v =>
        format(
          'The parameter "methodName" of RepositoryObserver.emit ' +
            'must be a non-empty String, but %s given.',
          v,
        );
      expect(throwable()).to.throw(error('undefined'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(METHOD_NAME)();
    });

    it('requires the "context" argument to be a non-empty string', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const throwable = v => () =>
        observer.emit(MODEL_NAME, EVENT_NAME, METHOD_NAME, v);
      const error = v =>
        format(
          'The parameter "context" of RepositoryObserver.emit ' +
            'must be an Object, but %s given.',
          v,
        );
      expect(throwable()).to.throw(error('undefined'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
    });

    it('returns a promise for synchronous handlers', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      schema.defineModel({name: 'modelB', datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const order = [];
      const handler1 = () => order.push(handler1);
      const handler2 = () => order.push(handler2);
      const handler3 = () => order.push(handler3);
      const handler4 = () => order.push(handler4);
      const throwable = () => {
        throw new Error();
      };
      observer.observe(EVENT_NAME, handler1);
      observer.observe(EVENT_NAME, handler2);
      observer.observe('event2', throwable);
      observer.observe(MODEL_NAME, EVENT_NAME, handler3);
      observer.observe(MODEL_NAME, EVENT_NAME, handler4);
      observer.observe(MODEL_NAME, 'event2', throwable);
      observer.observe('modelB', EVENT_NAME, throwable);
      const promise = observer.emit(MODEL_NAME, EVENT_NAME, METHOD_NAME, {});
      expect(promise).to.be.instanceof(Promise);
      await promise;
      expect(order).to.be.eql([handler1, handler2, handler3, handler4]);
    });

    it('returns a promise of asynchronous handlers', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      schema.defineModel({name: 'modelB', datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const order = [];
      const handler0ms = () => {
        order.push(handler0ms);
        return Promise.resolve();
      };
      const handler5ms = () => {
        return new Promise(res => {
          setTimeout(() => {
            order.push(handler5ms);
            res();
          }, 5);
        });
      };
      const syncHandler = () => order.push(syncHandler);
      const handler3ms = () => {
        return new Promise(res => {
          setTimeout(() => {
            order.push(handler3ms);
            res();
          }, 3);
        });
      };
      const throwable = () => {
        throw new Error();
      };
      observer.observe(EVENT_NAME, handler0ms);
      observer.observe(EVENT_NAME, handler5ms);
      observer.observe('event2', throwable);
      observer.observe(MODEL_NAME, EVENT_NAME, syncHandler);
      observer.observe(MODEL_NAME, EVENT_NAME, handler3ms);
      observer.observe(MODEL_NAME, 'event2', throwable);
      observer.observe('modelB', EVENT_NAME, throwable);
      const promise = observer.emit(MODEL_NAME, EVENT_NAME, METHOD_NAME, {});
      expect(promise).to.be.instanceof(Promise);
      await promise;
      expect(order).to.have.lengthOf(4);
      expect(order).to.include(handler0ms);
      expect(order).to.include(handler5ms);
      expect(order).to.include(syncHandler);
      expect(order).to.include(handler3ms);
    });

    it('executes handlers with the context object', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: MODEL_NAME, datasource: 'datasource'});
      const observer = schema.get(RepositoryObserver);
      const inputContext = {customProp: 'customProp'};
      const context = {
        modelName: MODEL_NAME,
        eventName: EVENT_NAME,
        methodName: METHOD_NAME,
        ...inputContext,
      };
      let counter = 0;
      const handler1 = ctx => {
        expect(ctx).to.be.eql(context);
        counter++;
      };
      const handler2 = ctx => {
        return new Promise(res => {
          setTimeout(() => {
            expect(ctx).to.be.eql(context);
            counter++;
            res();
          }, 3);
        });
      };
      observer.observe(EVENT_NAME, handler1);
      observer.observe(MODEL_NAME, EVENT_NAME, handler2);
      await observer.emit(MODEL_NAME, EVENT_NAME, METHOD_NAME, inputContext);
      expect(counter).to.be.eq(2);
    });
  });
});
