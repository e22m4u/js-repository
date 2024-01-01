import 'reflect-metadata';
import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from '../definition/index.js';
import {RelationType} from '../definition/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';
import {ModelDecoratorUtils} from './model-decorator-utils.js';

const S = new ModelDecoratorUtils();

describe('ModelDecoratorUtils', function () {
  describe('hasModelDefinitionIn', function () {
    it('returns true if the given argument has the model metadata', function () {
      class Target {}
      const res1 = S.hasModelDefinitionIn(Target);
      expect(res1).to.be.false;
      Reflect.defineMetadata(
        ModelDecoratorKeys.MODEL_DEF,
        {name: 'Target'},
        Target,
      );
      const res2 = S.hasModelDefinitionIn(Target);
      expect(res2).to.be.true;
      const res3 = S.hasModelDefinitionIn({});
      expect(res3).to.be.false;
    });
  });

  describe('getModelDefinitionFrom', function () {
    it('returns the model definition from the class metadata', function () {
      class Target {}
      Reflect.defineMetadata(
        ModelDecoratorKeys.MODEL_DEF,
        {name: 'Target'},
        Target,
      );
      const modelDef = S.getModelDefinitionFrom(Target);
      expect(modelDef).to.be.eql({name: 'Target'});
    });

    it('requires the first argument to be a ES6 class', function () {
      const throwable = v => () => S.getModelDefinitionFrom(v);
      const error = v =>
        format('The given model must be a ES6 class, but %s given.', v);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
    });

    it('throws an error if no metadata', function () {
      class Target {}
      const throwable = () => S.getModelDefinitionFrom(Target);
      expect(throwable).to.throw(
        'The given class Target does not have the model definition.',
      );
    });

    it('includes "properties" and "relations" options', function () {
      class Target {}
      Reflect.defineMetadata(
        ModelDecoratorKeys.MODEL_DEF,
        {name: 'Target'},
        Target,
      );
      Reflect.defineMetadata(
        ModelDecoratorKeys.PROPERTY_DEFS,
        {prop1: DataType.STRING},
        Target,
      );
      Reflect.defineMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        {prop2: {type: RelationType.HAS_ONE}},
        Target,
      );
      const modelDef = S.getModelDefinitionFrom(Target);
      expect(modelDef).to.be.eql({
        name: 'Target',
        properties: {prop1: DataType.STRING},
        relations: {prop2: {type: RelationType.HAS_ONE}},
      });
    });

    it('requires the properties definition to be an object', function () {
      class Target {}
      Reflect.defineMetadata(
        ModelDecoratorKeys.MODEL_DEF,
        {name: 'Target'},
        Target,
      );
      Reflect.defineMetadata(
        ModelDecoratorKeys.PROPERTY_DEFS,
        'invalid',
        Target,
      );
      const throwable = () => S.getModelDefinitionFrom(Target);
      expect(throwable).to.throw(
        'The properties definition metadata of the model ' +
          'class Target must be an Object, but "invalid" given.',
      );
    });

    it('requires the relations definition to be an object', function () {
      class Target {}
      Reflect.defineMetadata(
        ModelDecoratorKeys.MODEL_DEF,
        {name: 'Target'},
        Target,
      );
      Reflect.defineMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        'invalid',
        Target,
      );
      const throwable = () => S.getModelDefinitionFrom(Target);
      expect(throwable).to.throw(
        'The relations definition metadata of the model ' +
          'class Target must be an Object, but "invalid" given.',
      );
    });
  });
});
