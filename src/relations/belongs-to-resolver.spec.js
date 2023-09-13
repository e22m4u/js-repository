import {expect} from 'chai';
import {Schema} from '../schema.js';
import {format} from '@e22m4u/format';
import {DataType} from '../definition/index.js';
import {RelationType} from '../definition/index.js';
import {BelongsToResolver} from './belongs-to-resolver.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

describe('BelongsToResolver', function () {
  describe('includeTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new Schema();
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "entities" of BelongsToResolver.includeTo requires ' +
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "entities" of BelongsToResolver.includeTo requires ' +
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of BelongsToResolver.includeTo requires ' +
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "targetName" of BelongsToResolver.includeTo requires ' +
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "relationName" of BelongsToResolver.includeTo requires ' +
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The provided parameter "foreignKey" of BelongsToResolver.includeTo ' +
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of BelongsToResolver.includeTo ' +
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
      const R = S.getService(BelongsToResolver);
      const promise = R.includeTo([], 'source', 'target', 'relation');
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if the given target model does not have a datasource', async function () {
      const S = new Schema();
      S.defineModel({name: 'target'});
      const R = S.getService(BelongsToResolver);
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
      const source = await sourceRel.create({parentId: 10});
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: 10,
      });
    });

    it('includes if a primary key is not defined in the target model', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({parentId: target[DEF_PK]});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parent: target,
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
      const target = await targetRep.create({});
      expect(target).to.be.eql({myId: target.myId});
      const source = await sourceRep.create({parentId: target.myId});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target.myId,
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target.myId,
        parent: target,
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
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({parentId: target[DEF_PK]});
      expect(source).to.be.eql({
        myId: source.myId,
        parentId: target[DEF_PK],
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent');
      expect(source).to.be.eql({
        myId: source.myId,
        parentId: target[DEF_PK],
        parent: target,
      });
    });

    it('includes if the property "foreignKey" is specified', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({parentId: target[DEF_PK]});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'relation', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        relation: target,
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: 'fooVal',
        bar: 'barVal',
      });
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent', undefined, {
        where: {foo: 'barVal'},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      await R.includeTo([source], 'source', 'target', 'parent', undefined, {
        where: {foo: 'fooVal'},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parent: target,
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: 'fooVal',
        bar: 'barVal',
      });
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent', undefined, {
        fields: [DEF_PK, 'bar'],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parent: {
          [DEF_PK]: target[DEF_PK],
          bar: target.bar,
        },
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
          parent: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
          },
        },
      });
      const aRep = S.getRepository('modelA');
      const bRep = S.getRepository('modelB');
      const cRep = S.getRepository('modelC');
      const a = await aRep.create({});
      const b = await bRep.create({parentId: a.id});
      const c = await cRep.create({parentId: b.id});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b).to.be.eql({
        id: b.id,
        source: 'modelB',
        parentId: a.id,
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentId: b.id,
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([c], 'modelC', 'modelB', 'parent', undefined, {
        include: 'parent',
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentId: b.id,
        parent: {
          id: b.id,
          source: 'modelB',
          parentId: a.id,
          parent: {
            id: a.id,
            source: 'modelA',
          },
        },
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: 'fooVal',
        bar: 'barVal',
      });
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      const R = S.getService(BelongsToResolver);
      await R.includeTo([source], 'source', 'target', 'parent', undefined, {
        where: {and: [{foo: 'barVal'}]},
        fields: [DEF_PK, 'bar'],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
      });
      await R.includeTo([source], 'source', 'target', 'parent', undefined, {
        where: {and: [{foo: 'fooVal'}]},
        fields: [DEF_PK, 'bar'],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parent: {
          [DEF_PK]: target[DEF_PK],
          bar: target.bar,
        },
      });
    });
  });

  describe('includePolymorphicTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new Schema();
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "entities" of BelongsToResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(v, 'sourceName', 'relationName');
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "entities" of BelongsToResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo([v], 'sourceName', 'relationName');
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of BelongsToResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo([], v, 'sourceName', 'relationName');
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The parameter "relationName" of BelongsToResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v => R.includePolymorphicTo([], 'sourceName', v);
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
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The provided parameter "foreignKey" of BelongsToResolver.includePolymorphicTo ' +
            'should be a String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo([], 'sourceName', 'relationName', v);
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
    });

    it('requires the provided parameter "discriminator" to be a string', async function () {
      const S = new Schema();
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The provided parameter "discriminator" of BelongsToResolver.includePolymorphicTo ' +
            'should be a String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo([], 'sourceName', 'relationName', undefined, v);
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
    });

    it('requires the provided parameter "scope" to be an object', async function () {
      const S = new Schema();
      const R = S.getService(BelongsToResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of BelongsToResolver.includePolymorphicTo ' +
            'should be an Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          'sourceName',
          'relationName',
          undefined,
          undefined,
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
    });

    it('does not throw an error if a target model is not found', async function () {
      const S = new Schema();
      S.defineModel({name: 'source'});
      const R = S.getService(BelongsToResolver);
      const entity = {[DEF_PK]: 1, parentId: 1, parentType: 'target'};
      await R.includePolymorphicTo([entity], 'source', 'parent');
      expect(entity).to.be.eql(entity);
    });

    it('does not throws an error if a target model does not have datasource', async function () {
      const S = new Schema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(BelongsToResolver);
      const entity = {[DEF_PK]: 1, parentId: 1, parentType: 'target'};
      await R.includePolymorphicTo([entity], 'source', 'parent');
      expect(entity).to.be.eql(entity);
    });

    it('does not throw an error if a relation target is not found', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({
        parentId: 10,
        parentType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo([source], 'source', 'parent');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: 10,
        parentType: 'target',
      });
    });

    it('does not throw an error if no discriminator value', async function () {
      const S = new Schema();
      S.defineModel({name: 'source'});
      const R = S.getService(BelongsToResolver);
      const entity = {[DEF_PK]: 1, parentId: 1};
      await R.includePolymorphicTo([entity], 'source', 'parent');
      expect(entity).to.be.eql(entity);
    });

    it('includes if a primary key is not defined in the target model', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo([source], 'source', 'parent');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
        parent: target,
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
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      expect(source).to.be.eql({
        myId: source.myId,
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo([source], 'source', 'parent');
      expect(source).to.be.eql({
        myId: source.myId,
        parentId: target[DEF_PK],
        parentType: 'target',
        parent: target,
      });
    });

    it('includes if the property "foreignKey" is specified', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
        relationType: 'target',
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        relationType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo([source], 'source', 'relation', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        relationType: 'target',
        relation: target,
      });
    });

    it('includes if the property "discriminator" is specified', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({});
      expect(target).to.be.eql({[DEF_PK]: target[DEF_PK]});
      const source = await sourceRep.create({
        relationId: target[DEF_PK],
        parentType: 'target',
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        relationId: target[DEF_PK],
        parentType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'relation',
        undefined,
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        relationId: target[DEF_PK],
        parentType: 'target',
        relation: target,
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: 'fooVal',
        bar: 'barVal',
      });
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'parent',
        undefined,
        undefined,
        {where: {foo: 'barVal'}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      await R.includePolymorphicTo(
        [source],
        'source',
        'parent',
        undefined,
        undefined,
        {where: {foo: 'fooVal'}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
        parent: target,
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new Schema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: 'fooVal',
        bar: 'barVal',
      });
      const source = await sourceRep.create({
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'parent',
        undefined,
        undefined,
        {fields: [DEF_PK, 'bar']},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        parentId: target[DEF_PK],
        parentType: 'target',
        parent: {
          [DEF_PK]: target[DEF_PK],
          bar: target.bar,
        },
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
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const aRep = S.getRepository('modelA');
      const bRep = S.getRepository('modelB');
      const cRep = S.getRepository('modelC');
      const a = await aRep.create({});
      const b = await bRep.create({parentId: a.id});
      const c = await cRep.create({parentId: b.id, parentType: 'modelB'});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b).to.be.eql({
        id: b.id,
        source: 'modelB',
        parentId: a.id,
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentId: b.id,
        parentType: 'modelB',
      });
      const R = S.getService(BelongsToResolver);
      await R.includePolymorphicTo(
        [c],
        'modelC',
        'parent',
        undefined,
        undefined,
        {include: 'parent'},
      );
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentId: b.id,
        parentType: 'modelB',
        parent: {
          id: b.id,
          source: 'modelB',
          parentId: a.id,
          parent: {
            id: a.id,
            source: 'modelA',
          },
        },
      });
    });
  });
});
