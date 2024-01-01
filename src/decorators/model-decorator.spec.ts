import 'reflect-metadata';
import {expect} from 'chai';
import {model} from './model-decorator.js';
import {ModelDefinition} from '../definition/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

describe('@model', function () {
  it('uses the class name as the model name if not provided', function () {
    @model()
    class Target {}
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({
      name: 'Target',
    });
  });

  it('sets the model name', function () {
    @model({name: 'target'})
    class Target {}
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({
      name: 'target',
    });
  });

  describe('the "base" option', function () {
    it('sets a model name', function () {
      @model({base: 'base'})
      class Target {}
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'base',
      });
    });

    it('converts the model class to its name', function () {
      class Base {}
      @model({base: Base})
      class Target {}
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'Base',
      });
    });

    it('resolves the factory value of a string', function () {
      @model({base: () => 'base'})
      class Target {}
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'base',
      });
    });

    it('resolves the factory value of a model class', function () {
      class Base {}
      @model({base: () => Base})
      class Target {}
      const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
      expect(res).to.be.eql({
        name: 'Target',
        base: 'Base',
      });
    });
  });

  it('sets the "tableName" option', function () {
    @model({tableName: 'tableName'})
    class Target {}
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({
      name: 'Target',
      tableName: 'tableName',
    });
  });

  it('sets the "datasource" option', function () {
    @model({datasource: 'datasource'})
    class Target {}
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({
      name: 'Target',
      datasource: 'datasource',
    });
  });

  it('excludes the "properties" option', function () {
    @model({properties: {}} as ModelDefinition)
    class Target {}
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({name: 'Target'});
  });

  it('excludes the "relations" option', function () {
    @model({relations: {}} as ModelDefinition)
    class Target {}
    const res = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, Target);
    expect(res).to.be.eql({name: 'Target'});
  });
});
