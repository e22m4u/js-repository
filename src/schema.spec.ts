import {expect} from 'chai';
import {Schema} from './schema.js';
import {model} from './decorators/index.js';
import {Repository} from './repository/index.js';
import {DefinitionRegistry} from './definition/index.js';

describe('Schema', function () {
  describe('defineDatasource', function () {
    it('sets the datasource definition', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      const res =
        schema.getService(DefinitionRegistry).getDatasource('datasource');
      expect(res).to.be.eql({name: 'datasource', adapter: 'memory'});
    });

    it('throws an error if the datasource name already defined', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      const throwable =
        () => schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      expect(throwable).to.throw(
        'The datasource "datasource" is already defined.',
      );
    });
  });

  describe('defineModel', function () {
    it('sets the model definition', function () {
      const schema = new Schema();
      schema.defineModel({name: 'model'});
      const res = schema.getService(DefinitionRegistry).getModel('model');
      expect(res).to.be.eql({name: 'model'});
    });

    it('sets the model definition from a class metadata', function () {
      @model()
      class Target {}
      const schema = new Schema();
      schema.defineModel(Target);
      const res = schema.getService(DefinitionRegistry).getModel('Target');
      expect(res).to.be.eql({name: 'Target'});
    });

    it('throws an error if the model name already defined', function () {
      const schema = new Schema();
      schema.defineModel({name: 'model'});
      const throwable = () => schema.defineModel({name: 'model'});
      expect(throwable).to.throw('The model "model" is already defined.');
    });
  });

  describe('getRepository', function () {
    it('returns the repository by the model name', function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const res = schema.getRepository('model');
      expect(res).to.be.instanceof(Repository);
    });

    it('throws an error if the model is not defined', function () {
      const schema = new Schema();
      const throwable = () => schema.getRepository('model');
      expect(throwable).to.throw('The model "model" is not defined.');
    });
  });
});
