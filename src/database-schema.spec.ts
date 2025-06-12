import {expect} from 'chai';
import {Repository} from './repository/index.js';
import {DatabaseSchema} from './database-schema.js';
import {DefinitionRegistry} from './definition/index.js';

describe('Schema', function () {
  describe('defineDatasource', function () {
    it('returns this', function () {
      const dbs = new DatabaseSchema();
      const res = dbs.defineDatasource({
        name: 'datasource',
        adapter: 'memory',
      });
      expect(res).to.be.eq(dbs);
    });

    it('sets the datasource definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      const res =
        dbs.getService(DefinitionRegistry).getDatasource('datasource');
      expect(res).to.be.eql({name: 'datasource', adapter: 'memory'});
    });

    it('throws an error if the datasource name already defined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      const throwable =
        () => dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      expect(throwable).to.throw(
        'The datasource "datasource" is already defined.',
      );
    });
  });

  describe('defineModel', function () {
    it('returns this', function () {
      const dbs = new DatabaseSchema();
      const res = dbs.defineModel({name: 'model'});
      expect(res).to.be.eq(dbs);
    });

    it('sets the model definition', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const res = dbs.getService(DefinitionRegistry).getModel('model');
      expect(res).to.be.eql({name: 'model'});
    });

    it('throws an error if the model name already defined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      const throwable = () => dbs.defineModel({name: 'model'});
      expect(throwable).to.throw('The model "model" is already defined.');
    });
  });

  describe('getRepository', function () {
    it('returns a repository by the model name', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: 'model', datasource: 'datasource'});
      const res = dbs.getRepository('model');
      expect(res).to.be.instanceof(Repository);
    });

    it('throws an error if the model is not defined', function () {
      const dbs = new DatabaseSchema();
      const throwable = () => dbs.getRepository('model');
      expect(throwable).to.throw('The model "model" is not defined.');
    });

    it('uses generic types to define the repository type', function () {
      const dbs = new DatabaseSchema();
      dbs.defineDatasource({name: 'datasource', adapter: 'memory'});
      dbs.defineModel({name: 'model', datasource: 'datasource'});
      interface MyModel {
        myId: number;
      }
      const res1: Repository = dbs.getRepository('model');
      const res2: Repository<MyModel, number, 'myId'> =
        dbs.getRepository<MyModel, number, 'myId'>('model');
      expect(res1).to.be.eq(res2);
    });
  });
});
