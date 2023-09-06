import {format} from 'util';
import {expect} from 'chai';
import {Schema} from '../schema.js';
import {DataType} from '../definition/index.js';
import {RelationType} from '../definition/index.js';
import {ReferencesManyResolver} from './references-many-resolver.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

describe('ReferencesManyResolver', function () {
  describe('includeTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of ReferencesManyResolver.includeTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo(v, 'sourceName', 'targetName', 'relationName');
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires elements of the "entities" parameter to be an Object', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of ReferencesManyResolver.includeTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([v], 'sourceName', 'targetName', 'relationName');
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "sourceName" parameter to be a non-empty string', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of ReferencesManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v => R.includeTo([], v, 'targetName', 'relationName');
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "targetName" parameter to be a non-empty string', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The parameter "targetName" of ReferencesManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v => R.includeTo([], 'sourceName', v, 'relationName');
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "relationName" parameter to be a non-empty string', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The parameter "relationName" of ReferencesManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v => R.includeTo([], 'sourceName', 'targetName', v);
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the provided parameter "foreignKey" to be a string', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The provided parameter "foreignKey" of ReferencesManyResolver.includeTo ' +
            'should be a String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([], 'sourceName', 'targetName', 'relationName', v);
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
    });

    it('requires the provided parameter "scope" to be an object', async function () {
      const S = new Schema();
      const R = S.get(ReferencesManyResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of ReferencesManyResolver.includeTo ' +
            'should be an Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo(
          [],
          'sourceName',
          'targetName',
          'relationName',
          undefined,
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
    });

    it('throws an error if the given target model is not found', async function () {
      const S = new Schema();
      S.defineModel({name: 'source'});
      const R = S.get(ReferencesManyResolver);
      const promise = R.includeTo([], 'source', 'target', 'relation');
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if the given target model does not have a datasource', async function () {
      const S = new Schema();
      S.defineModel({name: 'target'});
      const R = S.get(ReferencesManyResolver);
      const promise = R.includeTo([], 'source', 'target', 'relation');
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have a specified datasource.',
      );
    });

    it('does not throw an error if a relation target is not found', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({parentIds: [10, 20]});
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [10, 20],
        parents: [],
      });
    });

    it('includes if a primary key is not defined in the target model', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({});
      const target2 = await targetRep.create({});
      const target3 = await targetRep.create({});
      expect(target1).to.be.eql({[DEF_PK]: target1[DEF_PK]});
      expect(target2).to.be.eql({[DEF_PK]: target2[DEF_PK]});
      expect(target3).to.be.eql({[DEF_PK]: target3[DEF_PK]});
      const source = await sourceRep.create({
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target1, target2],
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({});
      const target2 = await targetRep.create({});
      const target3 = await targetRep.create({});
      expect(target1).to.be.eql({myId: target1.myId});
      expect(target2).to.be.eql({myId: target2.myId});
      expect(target3).to.be.eql({myId: target3.myId});
      const source = await sourceRep.create({
        parentIds: [target1.myId, target2.myId],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [target1.myId, target2.myId],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target1, target2],
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({
        name: 'source',
        datasource: 'datasource',
        properties: {
          myId: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
        },
      });
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({});
      const target2 = await targetRep.create({});
      const target3 = await targetRep.create({});
      expect(target1).to.be.eql({[DEF_PK]: target1[DEF_PK]});
      expect(target2).to.be.eql({[DEF_PK]: target2[DEF_PK]});
      expect(target3).to.be.eql({[DEF_PK]: target3[DEF_PK]});
      const source = await sourceRep.create({
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      expect(source).to.be.eql({
        myId: source.myId,
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents');
      expect(source).to.be.eql({
        myId: source.myId,
        parentIds: source.parentIds,
        parents: [target1, target2],
      });
    });

    it('includes if the property "foreignKey" is specified', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({});
      const target2 = await targetRep.create({});
      const target3 = await targetRep.create({});
      expect(target1).to.be.eql({[DEF_PK]: target1[DEF_PK]});
      expect(target2).to.be.eql({[DEF_PK]: target2[DEF_PK]});
      expect(target3).to.be.eql({[DEF_PK]: target3[DEF_PK]});
      const source = await sourceRep.create({
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'relations', 'parentIds');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        relations: [target1, target2],
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({featured: false});
      const target2 = await targetRep.create({featured: true});
      const target3 = await targetRep.create({featured: true});
      expect(target1).to.be.eql({[DEF_PK]: target1[DEF_PK], featured: false});
      expect(target2).to.be.eql({[DEF_PK]: target2[DEF_PK], featured: true});
      expect(target3).to.be.eql({[DEF_PK]: target3[DEF_PK], featured: true});
      const source = await sourceRep.create({
        parentIds: [target1[DEF_PK], target2[DEF_PK], target3[DEF_PK]],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [target1[DEF_PK], target2[DEF_PK], target3[DEF_PK]],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents', undefined, {
        where: {featured: false},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target1],
      });
      delete source.parents;
      await R.includeTo([source], 'source', 'target', 'parents', undefined, {
        where: {featured: true},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target2, target3],
      });
    });

    it('uses a slice clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({});
      const target2 = await targetRep.create({});
      const target3 = await targetRep.create({});
      const target4 = await targetRep.create({});
      expect(target1).to.be.eql({[DEF_PK]: target1[DEF_PK]});
      expect(target2).to.be.eql({[DEF_PK]: target2[DEF_PK]});
      expect(target3).to.be.eql({[DEF_PK]: target3[DEF_PK]});
      expect(target4).to.be.eql({[DEF_PK]: target4[DEF_PK]});
      const source = await sourceRep.create({
        parentIds: [
          target1[DEF_PK],
          target2[DEF_PK],
          target3[DEF_PK],
          target4[DEF_PK],
        ],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [
          target1[DEF_PK],
          target2[DEF_PK],
          target3[DEF_PK],
          target4[DEF_PK],
        ],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents', undefined, {
        skip: 1,
        limit: 2,
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target2, target3],
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({
        foo: 'fooVal1',
        bar: 'barVal1',
      });
      const target2 = await targetRep.create({
        foo: 'fooVal2',
        bar: 'barVal2',
      });
      const target3 = await targetRep.create({
        foo: 'fooVal3',
        bar: 'barVal3',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        foo: 'fooVal1',
        bar: 'barVal1',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        foo: 'fooVal2',
        bar: 'barVal2',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        foo: 'fooVal3',
        bar: 'barVal3',
      });
      const source = await sourceRep.create({
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [target1[DEF_PK], target2[DEF_PK]],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents', undefined, {
        fields: [DEF_PK, 'bar'],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [
          {
            [DEF_PK]: target1[DEF_PK],
            bar: target1.bar,
          },
          {
            [DEF_PK]: target2[DEF_PK],
            bar: target2.bar,
          },
        ],
      });
    });

    it('uses an include clause of the given scope to resolve target relations', async function () {
      const S = new Schema();
      S.defineDatasource({
        name: 'datasource',
        adapter: 'memory',
      });
      S.defineModel({
        name: 'modelA',
        datasource: 'datasource',
        properties: {
          id: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          source: {
            type: DataType.STRING,
            default: 'modelA',
          },
        },
      });
      S.defineModel({
        name: 'modelB',
        datasource: 'datasource',
        properties: {
          id: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          source: {
            type: DataType.STRING,
            default: 'modelB',
          },
        },
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            model: 'modelA',
          },
        },
      });
      S.defineModel({
        name: 'modelC',
        datasource: 'datasource',
        properties: {
          id: {
            type: DataType.NUMBER,
            primaryKey: true,
          },
          source: {
            type: DataType.STRING,
            default: 'modelC',
          },
        },
        relations: {
          parents: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
          },
        },
      });
      const aRep = S.getRepository('modelA');
      const bRep = S.getRepository('modelB');
      const cRep = S.getRepository('modelC');
      const a1 = await aRep.create({});
      const a2 = await aRep.create({});
      const b1 = await bRep.create({parentId: a1.id});
      const b2 = await bRep.create({parentId: a2.id});
      const c = await cRep.create({parentIds: [b1.id, b2.id]});
      expect(a1).to.be.eql({
        id: a1.id,
        source: 'modelA',
      });
      expect(a2).to.be.eql({
        id: a2.id,
        source: 'modelA',
      });
      expect(b1).to.be.eql({
        id: b1.id,
        source: 'modelB',
        parentId: a1.id,
      });
      expect(b2).to.be.eql({
        id: b2.id,
        source: 'modelB',
        parentId: a2.id,
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentIds: [b1.id, b2.id],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([c], 'modelC', 'modelB', 'parents', undefined, {
        include: 'parent',
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentIds: [b1.id, b2.id],
        parents: [
          {
            id: b1.id,
            source: 'modelB',
            parentId: a1.id,
            parent: {
              id: a1.id,
              source: 'modelA',
            },
          },
          {
            id: b2.id,
            source: 'modelB',
            parentId: a2.id,
            parent: {
              id: a2.id,
              source: 'modelA',
            },
          },
        ],
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target1 = await targetRep.create({featured: false});
      const target2 = await targetRep.create({featured: true});
      const target3 = await targetRep.create({featured: true});
      expect(target1).to.be.eql({[DEF_PK]: target1[DEF_PK], featured: false});
      expect(target2).to.be.eql({[DEF_PK]: target2[DEF_PK], featured: true});
      expect(target3).to.be.eql({[DEF_PK]: target3[DEF_PK], featured: true});
      const source = await sourceRep.create({
        parentIds: [target1[DEF_PK], target2[DEF_PK], target3[DEF_PK]],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: [target1[DEF_PK], target2[DEF_PK], target3[DEF_PK]],
      });
      const R = S.get(ReferencesManyResolver);
      await R.includeTo([source], 'source', 'target', 'parents', undefined, {
        where: {and: [{featured: false}]},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target1],
      });
      delete source.parents;
      await R.includeTo([source], 'source', 'target', 'parents', undefined, {
        where: {and: [{featured: true}]},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentIds: source.parentIds,
        parents: [target2, target3],
      });
    });
  });
});
