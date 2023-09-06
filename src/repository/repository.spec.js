import {expect} from 'chai';
import {Schema} from '../schema.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

describe('Repository', function () {
  describe('create', function () {
    it('creates a new item from the given data', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const data = {foo: 'bar'};
      const rep = schema.getRepository('model');
      const result = await rep.create(data);
      expect(result).to.be.eql({[DEF_PK]: result[DEF_PK], ...data});
    });
  });

  describe('replaceById', function () {
    it('replaces an item by the given id', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.replaceById(created[DEF_PK], {baz: 'qux'});
      expect(result).to.be.eql({[DEF_PK]: created[DEF_PK], baz: 'qux'});
    });
  });

  describe('patchById', function () {
    it('patches an item by the given id', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.patchById(created[DEF_PK], {baz: 'qux'});
      expect(result).to.be.eql({
        [DEF_PK]: created[DEF_PK],
        foo: 'bar',
        baz: 'qux',
      });
    });
  });

  describe('find', function () {
    it('returns all items', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created1 = await rep.create({foo: 'bar'});
      const created2 = await rep.create({baz: 'qux'});
      const result = await rep.find();
      expect(result).to.be.eql([created1, created2]);
    });

    it('returns found items by the "where" clause', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      const created = await rep.create({baz: 'qux'});
      const result = await rep.find({where: {baz: 'qux'}});
      expect(result).to.be.eql([created]);
    });
  });

  describe('findOne', function () {
    it('returns a first item', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      await rep.create({baz: 'qux'});
      const result = await rep.findOne();
      expect(result).to.be.eql(created);
    });

    it('returns a found item by the "where" clause', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      const created = await rep.create({baz: 'qux'});
      const result = await rep.findOne({where: {baz: 'qux'}});
      expect(result).to.be.eql(created);
    });
  });

  describe('findById', function () {
    it('returns an item by the given id', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.findById(created[DEF_PK]);
      expect(result).to.be.eql(created);
    });
  });

  describe('delete', function () {
    it('removes all items', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.create({baz: 'qux'});
      const result = await rep.delete();
      expect(result).to.be.eq(2);
    });

    it('removes found items by the "where" clause', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.create({foo: 'bar'});
      await rep.create({baz: 'qux'});
      const result = await rep.delete({foo: 'bar'});
      expect(result).to.be.eql(2);
    });
  });

  describe('deleteById', function () {
    it('removes an item by the given id', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.deleteById(created[DEF_PK]);
      expect(result).to.be.true;
    });
  });

  describe('exists', function () {
    it('returns true if the given id exists', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      const created = await rep.create({foo: 'bar'});
      const result = await rep.exists(created[DEF_PK]);
      expect(result).to.be.true;
    });
  });

  describe('count', function () {
    it('counts all items', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.create({baz: 'qux'});
      const result = await rep.count();
      expect(result).to.be.eq(2);
    });

    it('counts found items by the "where" clause', async function () {
      const schema = new Schema();
      schema.defineDatasource({name: 'datasource', adapter: 'memory'});
      schema.defineModel({name: 'model', datasource: 'datasource'});
      const rep = schema.getRepository('model');
      await rep.create({foo: 'bar'});
      await rep.create({foo: 'bar'});
      await rep.create({baz: 'qux'});
      const result = await rep.count({foo: 'bar'});
      expect(result).to.be.eq(2);
    });
  });
});
