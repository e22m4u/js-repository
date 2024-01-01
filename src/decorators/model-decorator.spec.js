import 'reflect-metadata';
import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {model} from './model-decorator.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

describe('@model', function () {
  it('requires the first argument to be an object', function () {
    class Target {}
    const throwable = v => () => model(v)(Target);
    const error = v =>
      format(
        'The provided argument of the @model decorator ' +
          'must be the model definition object, but %s given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable({})();
    throwable(undefined)();
    throwable(null)();
  });

  it('uses the class name as the model name if not provided', function () {
    class Target {}
    model()(Target);
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({name: 'Target'});
  });

  it('sets the model name', function () {
    class Target {}
    model({name: 'name'})(Target);
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({name: 'name'});
  });

  describe('the "base" option', function () {
    it('sets a model name', function () {
      class Target {}
      model({base: 'base'})(Target);
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'base',
      });
    });

    it('converts the model class to its name', function () {
      class Base {}
      class Target {}
      model({base: Base})(Target);
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'Base',
      });
    });

    it('resolves the factory value of a string', function () {
      class Target {}
      model({base: () => 'base'})(Target);
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'base',
      });
    });

    it('resolves the factory value of a model class', function () {
      class Base {}
      class Target {}
      model({base: () => Base})(Target);
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'Base',
      });
    });
  });

  it('sets the "tableName" option', function () {
    class Target {}
    model({tableName: 'tableName'})(Target);
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({
      name: 'Target',
      tableName: 'tableName',
    });
  });

  it('sets the "datasource" option', function () {
    class Target {}
    model({datasource: 'datasource'})(Target);
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({
      name: 'Target',
      datasource: 'datasource',
    });
  });

  it('excludes the "properties" option', function () {
    class Target {}
    model({properties: {}})(Target);
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({name: 'Target'});
  });

  it('excludes the "relations" option', function () {
    class Target {}
    model({relations: {}})(Target);
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({name: 'Target'});
  });

  describe('decorator target', function () {
    const error = 'The @model decorator is only supported for a class.';
    const throwable =
      (...args) =>
      () =>
        model()(...args);

    it('does not throw an error if the target is a constructor', function () {
      class Target {}
      throwable(Target)();
    });

    it('throws an error if the target is an instance', function () {
      class Target {}
      expect(throwable(Target.prototype)).to.throw(error);
    });

    it('throws an error if the target is a static method', function () {
      class Target {
        static method() {}
      }
      const desc = Object.getOwnPropertyDescriptor(Target, 'method');
      expect(throwable(Target, 'method', desc)).to.throw(error);
    });

    it('throws an error if the target is an instance method', function () {
      class Target {
        method() {}
      }
      const desc = Object.getOwnPropertyDescriptor(Target.prototype, 'method');
      expect(throwable(Target.prototype, 'method', desc)).to.throw(error);
    });

    it('throws an error if the target is a static property', function () {
      class Target {
        static prop;
      }
      expect(throwable(Target, 'prop')).to.throw(error);
    });

    it('throws an error if the target is an instance property', function () {
      class Target {
        prop;
      }
      expect(throwable(Target.prototype, 'prop')).to.throw(error);
    });

    it('throws an error if the target is a constructor parameter', function () {
      class Target {}
      expect(throwable(Target, undefined, 0)).to.throw(error);
    });

    it('throws an error if the target is a static method parameter', function () {
      class Target {
        static method() {}
      }
      expect(throwable(Target, 'method', 0)).to.throw(error);
    });

    it('throws an error if the target is an instance method parameter', function () {
      class Target {
        method() {}
      }
      expect(throwable(Target.prototype, 'method', 0)).to.throw(error);
    });
  });
});
