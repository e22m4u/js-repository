import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from '../definition/index.js';
import {RelationType} from '../definition/index.js';
import {DatabaseSchema} from '../database-schema.js';
import {HasManyResolver} from './has-many-resolver.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

describe('HasManyResolver', function () {
  describe('includeTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasManyResolver.includeTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo(
          v,
          'sourceName',
          'targetName',
          'relationName',
          'foreignKey',
        );
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
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasManyResolver.includeTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([v], 'source', 'target', 'relationName', 'foreignKey');
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of HasManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([], v, 'targetName', 'relationName', 'foreignKey');
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "targetName" of HasManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([], 'sourceName', v, 'relationName', 'foreignKey');
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "relationName" of HasManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([], 'sourceName', 'targetName', v, 'foreignKey');
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "foreignKey" parameter to be a non-empty string', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "foreignKey" of HasManyResolver.includeTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo([], 'sourceName', 'targetName', 'relationName', v);
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the provided parameter "scope" to be an object', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of HasManyResolver.includeTo ' +
            'should be an Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includeTo(
          [],
          'sourceName',
          'targetName',
          'relationName',
          'foreignKey',
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
    });

    it('throws an error if a target model is not found', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasManyResolver);
      const promise = R.includeTo(
        [],
        'source',
        'target',
        'relationName',
        'foreignKey',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if a target model does not have datasource', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(HasManyResolver);
      const promise = R.includeTo(
        [],
        'source',
        'target',
        'relationName',
        'foreignKey',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have a specified datasource.',
      );
    });

    it('does not throw an error if a relation target is not exist', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({});
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [],
      });
    });

    it('includes if a primary key is not defined in the source model', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({parentId: source[DEF_PK]});
      const target2 = await targetRep.create({parentId: source[DEF_PK]});
      const target3 = await targetRep.create({parentId: -1});
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        parentId: source[DEF_PK],
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        parentId: source[DEF_PK],
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        parentId: -1,
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            id: target1[DEF_PK],
            parentId: source[DEF_PK],
          },
          {
            id: target2[DEF_PK],
            parentId: source[DEF_PK],
          },
        ],
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new DatabaseSchema();
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
      const source = await sourceRep.create({});
      expect(source).to.be.eql({myId: source.myId});
      const target1 = await targetRep.create({parentId: source.myId});
      const target2 = await targetRep.create({parentId: source.myId});
      const target3 = await targetRep.create({parentId: -1});
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        parentId: source.myId,
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        parentId: source.myId,
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        parentId: -1,
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId');
      expect(source).to.be.eql({
        myId: source.myId,
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            parentId: source.myId,
          },
          {
            [DEF_PK]: target2[DEF_PK],
            parentId: source.myId,
          },
        ],
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new DatabaseSchema();
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
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({parentId: source[DEF_PK]});
      const target2 = await targetRep.create({parentId: source[DEF_PK]});
      const target3 = await targetRep.create({parentId: -1});
      expect(target1).to.be.eql({
        myId: target1.myId,
        parentId: source[DEF_PK],
      });
      expect(target2).to.be.eql({
        myId: target2.myId,
        parentId: source[DEF_PK],
      });
      expect(target3).to.be.eql({
        myId: target3.myId,
        parentId: -1,
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            myId: target1.myId,
            parentId: source[DEF_PK],
          },
          {
            myId: target2.myId,
            parentId: source[DEF_PK],
          },
        ],
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        featured: false,
        parentId: source[DEF_PK],
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        featured: false,
        parentId: source[DEF_PK],
      });
      const target2 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
      });
      const target3 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId', {
        where: {featured: false},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            featured: false,
            parentId: source[DEF_PK],
          },
        ],
      });
      await R.includeTo([source], 'source', 'target', 'children', 'parentId', {
        where: {featured: true},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target2[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
          },
          {
            [DEF_PK]: target3[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
          },
        ],
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target1 = await targetRep.create({
        foo: 'fooVal1',
        bar: 'barVal1',
        parentId: source[DEF_PK],
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        foo: 'fooVal1',
        bar: 'barVal1',
        parentId: source[DEF_PK],
      });
      const target2 = await targetRep.create({
        foo: 'fooVal2',
        bar: 'barVal2',
        parentId: source[DEF_PK],
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        foo: 'fooVal2',
        bar: 'barVal2',
        parentId: source[DEF_PK],
      });
      const target3 = await targetRep.create({
        foo: 'fooVal3',
        bar: 'barVal3',
        parentId: -1,
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        foo: 'fooVal3',
        bar: 'barVal3',
        parentId: -1,
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId', {
        fields: [DEF_PK, 'bar'],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
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
      const S = new DatabaseSchema();
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
        relations: {
          children: {
            type: RelationType.HAS_MANY,
            model: 'modelB',
            foreignKey: 'parentId',
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
          children: {
            type: RelationType.HAS_MANY,
            model: 'modelC',
            foreignKey: 'parentId',
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
      });
      const aRep = S.getRepository('modelA');
      const bRep = S.getRepository('modelB');
      const cRep = S.getRepository('modelC');
      const a = await aRep.create({});
      const b1 = await bRep.create({parentId: a.id});
      const b2 = await bRep.create({parentId: a.id});
      const b3 = await bRep.create({parentId: -1});
      const c1 = await cRep.create({parentId: b1.id});
      const c2 = await cRep.create({parentId: b1.id});
      const c3 = await cRep.create({parentId: b2.id});
      const c4 = await cRep.create({parentId: b2.id});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b1).to.be.eql({
        id: b1.id,
        source: 'modelB',
        parentId: a.id,
      });
      expect(b2).to.be.eql({
        id: b2.id,
        source: 'modelB',
        parentId: a.id,
      });
      expect(b3).to.be.eql({
        id: b3.id,
        source: 'modelB',
        parentId: -1,
      });
      expect(c1).to.be.eql({
        id: c1.id,
        source: 'modelC',
        parentId: b1.id,
      });
      expect(c2).to.be.eql({
        id: c2.id,
        source: 'modelC',
        parentId: b1.id,
      });
      expect(c3).to.be.eql({
        id: c3.id,
        source: 'modelC',
        parentId: b2.id,
      });
      expect(c4).to.be.eql({
        id: c4.id,
        source: 'modelC',
        parentId: b2.id,
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([a], 'modelA', 'modelB', 'children', 'parentId', {
        include: 'children',
      });
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
        children: [
          {
            id: b1.id,
            source: 'modelB',
            parentId: a.id,
            children: [
              {
                id: c1.id,
                source: 'modelC',
                parentId: b1.id,
              },
              {
                id: c2.id,
                source: 'modelC',
                parentId: b1.id,
              },
            ],
          },
          {
            id: b2.id,
            source: 'modelB',
            parentId: a.id,
            children: [
              {
                id: c3.id,
                source: 'modelC',
                parentId: b2.id,
              },
              {
                id: c4.id,
                source: 'modelC',
                parentId: b2.id,
              },
            ],
          },
        ],
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target1 = await targetRep.create({
        featured: false,
        parentId: source[DEF_PK],
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        featured: false,
        parentId: source[DEF_PK],
      });
      const target2 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
      });
      const target3 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
      });
      const R = S.getService(HasManyResolver);
      await R.includeTo([source], 'source', 'target', 'children', 'parentId', {
        where: {and: [{featured: false}]},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            featured: false,
            parentId: source[DEF_PK],
          },
        ],
      });
      delete source.children;
      await R.includeTo([source], 'source', 'target', 'children', 'parentId', {
        where: {and: [{featured: true}]},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target2[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
          },
          {
            [DEF_PK]: target3[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
          },
        ],
      });
    });
  });

  describe('includePolymorphicTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasManyResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          v,
          'sourceName',
          'targetName',
          'relationName',
          'foreignKey',
          'discriminator',
        );
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
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasManyResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [v],
          'source',
          'target',
          'relationName',
          'foreignKey',
          'discriminator',
        );
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of HasManyResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          v,
          'targetName',
          'relationName',
          'foreignKey',
          'discriminator',
        );
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "targetName" of HasManyResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          'sourceName',
          v,
          'relationName',
          'foreignKey',
          'discriminator',
        );
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "relationName" of HasManyResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          'sourceName',
          'targetName',
          v,
          'foreignKey',
          'discriminator',
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "foreignKey" parameter to be a non-empty string', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "foreignKey" of HasManyResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          'sourceName',
          'targetName',
          'relationName',
          v,
          'discriminator',
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "discriminator" parameter to be a non-empty string', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "discriminator" of HasManyResolver.includePolymorphicTo requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          'sourceName',
          'targetName',
          'relationName',
          'foreignKey',
          v,
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the provided parameter "scope" to be an object', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of HasManyResolver.includePolymorphicTo ' +
            'should be an Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicTo(
          [],
          'sourceName',
          'targetName',
          'relationName',
          'foreignKey',
          'discriminator',
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
    });

    it('throws an error if the given target model is not found', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicTo(
        [entity],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if the given target model does not have a datasource', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicTo(
        [entity],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have a specified datasource.',
      );
    });

    it('does not throw an error if a relation target is not found', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [],
      });
    });

    it('does not include an entity with a not matched discriminator value', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const targetRel = S.getRepository('target');
      const source = await sourceRel.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target = await targetRel.create({
        parentId: source[DEF_PK],
        parentType: 'unknown',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source[DEF_PK],
        parentType: 'unknown',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [],
      });
    });

    it('includes if a primary key is not defined in the source model', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            id: target1[DEF_PK],
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
          {
            id: target2[DEF_PK],
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new DatabaseSchema();
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
      const source = await sourceRep.create({});
      expect(source).to.be.eql({myId: source.myId});
      const target1 = await targetRep.create({
        parentId: source.myId,
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        parentId: source.myId,
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source.myId,
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        parentId: source.myId,
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        myId: source.myId,
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            parentId: source.myId,
            parentType: target1.parentType,
          },
          {
            [DEF_PK]: target2[DEF_PK],
            parentId: source.myId,
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new DatabaseSchema();
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
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        myId: target1.myId,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        myId: target2.myId,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        myId: target3.myId,
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            myId: target1.myId,
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
          {
            myId: target2.myId,
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
        {where: {featured: false}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            featured: false,
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
        ],
      });
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
        {where: {featured: true}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target2[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
          {
            [DEF_PK]: target3[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target3.parentType,
          },
        ],
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target1 = await targetRep.create({
        foo: 'fooVal1',
        bar: 'barVal1',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        foo: 'fooVal1',
        bar: 'barVal1',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        foo: 'fooVal2',
        bar: 'barVal2',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        foo: 'fooVal2',
        bar: 'barVal2',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        foo: 'fooVal3',
        bar: 'barVal3',
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        foo: 'fooVal3',
        bar: 'barVal3',
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
        {fields: [DEF_PK, 'bar']},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
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
      const S = new DatabaseSchema();
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
        relations: {
          children: {
            type: RelationType.HAS_MANY,
            model: 'modelB',
            polymorphic: true,
            foreignKey: 'parentId',
            discriminator: 'parentType',
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
          children: {
            type: RelationType.HAS_MANY,
            model: 'modelC',
            polymorphic: true,
            foreignKey: 'parentId',
            discriminator: 'parentType',
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
      });
      const aRep = S.getRepository('modelA');
      const bRep = S.getRepository('modelB');
      const cRep = S.getRepository('modelC');
      const a = await aRep.create({});
      const b1 = await bRep.create({parentId: a.id, parentType: 'modelA'});
      const b2 = await bRep.create({parentId: a.id, parentType: 'modelA'});
      const c1 = await cRep.create({parentId: b1.id, parentType: 'modelB'});
      const c2 = await cRep.create({parentId: b1.id, parentType: 'modelB'});
      const c3 = await cRep.create({parentId: b2.id, parentType: 'modelB'});
      const c4 = await cRep.create({parentId: b2.id, parentType: 'modelB'});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b1).to.be.eql({
        id: b1.id,
        source: 'modelB',
        parentId: a.id,
        parentType: 'modelA',
      });
      expect(b2).to.be.eql({
        id: b2.id,
        source: 'modelB',
        parentId: a.id,
        parentType: 'modelA',
      });
      expect(c1).to.be.eql({
        id: c1.id,
        source: 'modelC',
        parentId: b1.id,
        parentType: 'modelB',
      });
      expect(c2).to.be.eql({
        id: c2.id,
        source: 'modelC',
        parentId: b1.id,
        parentType: 'modelB',
      });
      expect(c3).to.be.eql({
        id: c3.id,
        source: 'modelC',
        parentId: b2.id,
        parentType: 'modelB',
      });
      expect(c4).to.be.eql({
        id: c4.id,
        source: 'modelC',
        parentId: b2.id,
        parentType: 'modelB',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [a],
        'modelA',
        'modelB',
        'children',
        'parentId',
        'parentType',
        {include: 'children'},
      );
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
        children: [
          {
            id: b1.id,
            source: 'modelB',
            parentId: a.id,
            parentType: 'modelA',
            children: [
              {
                id: c1.id,
                source: 'modelC',
                parentId: b1.id,
                parentType: 'modelB',
              },
              {
                id: c2.id,
                source: 'modelC',
                parentId: b1.id,
                parentType: 'modelB',
              },
            ],
          },
          {
            id: b2.id,
            source: 'modelB',
            parentId: a.id,
            parentType: 'modelA',
            children: [
              {
                id: c3.id,
                source: 'modelC',
                parentId: b2.id,
                parentType: 'modelB',
              },
              {
                id: c4.id,
                source: 'modelC',
                parentId: b2.id,
                parentType: 'modelB',
              },
            ],
          },
        ],
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target1 = await targetRep.create({
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
        {where: {and: [{featured: false}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            featured: false,
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
        ],
      });
      delete source.children;
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'children',
        'parentId',
        'parentType',
        {where: {and: [{featured: true}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target2[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
          {
            [DEF_PK]: target3[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target3.parentType,
          },
        ],
      });
    });
  });

  describe('includePolymorphicByRelationName', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasManyResolver.includePolymorphicByRelationName requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          v,
          'sourceName',
          'targetName',
          'relationName',
          'targetRelationName',
        );
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
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({
        name: 'target',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasManyResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [v],
          'source',
          'target',
          'children',
          'parent',
        );
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of HasManyResolver.includePolymorphicByRelationName requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [],
          v,
          'targetName',
          'relationName',
          'targetRelationName',
        );
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "targetName" of HasManyResolver.includePolymorphicByRelationName requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [],
          'sourceName',
          v,
          'relationName',
          'targetRelationName',
        );
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
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "relationName" of HasManyResolver.includePolymorphicByRelationName requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [],
          'sourceName',
          'targetName',
          v,
          'targetRelationName',
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the "targetRelationName" parameter to be a non-empty string', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The parameter "targetRelationName" of HasManyResolver.includePolymorphicByRelationName requires ' +
            'a non-empty String, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [],
          'sourceName',
          'targetName',
          'relationName',
          v,
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
    });

    it('requires the provided parameter "scope" to be an object', async function () {
      const S = new DatabaseSchema();
      const R = S.getService(HasManyResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of HasManyResolver.includePolymorphicByRelationName ' +
            'should be an Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [],
          'sourceName',
          'targetName',
          'relationName',
          'targetRelationName',
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
    });

    it('throws an error if the given target model is not found', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'children',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if the given target model does not have the given relation name', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'children',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have relation name "parent".',
      );
    });

    it('throws an error if the target relation is not "belongsTo"', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({
        name: 'target',
        relations: {
          parent: {
            type: RelationType.REFERENCES_MANY,
            model: 'source',
          },
        },
      });
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'children',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The relation "children" of the model "source" is a polymorphic "hasMany" relation, ' +
          'so it requires the target relation "parent" to be a polymorphic "belongsTo", ' +
          'but "referencesMany" type given.',
      );
    });

    it('throws an error if the target relation is not polymorphic', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({
        name: 'target',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            model: 'source',
          },
        },
      });
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'children',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The relation "children" of the model "source" is a polymorphic ' +
          '"hasMany" relation, so it requires the target relation "parent" ' +
          'to be a polymorphic too.',
      );
    });

    it('throws an error if the given target model does not have a datasource', async function () {
      const S = new DatabaseSchema();
      S.defineModel({name: 'source'});
      S.defineModel({
        name: 'target',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const R = S.getService(HasManyResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'children',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have a specified datasource.',
      );
    });

    it('does not throw an error if a relation target is not found', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [],
      });
    });

    it('does not include an entity with a not matched discriminator value', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRel = S.getRepository('source');
      const targetRel = S.getRepository('target');
      const source = await sourceRel.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target = await targetRel.create({
        parentId: source[DEF_PK],
        parentType: 'unknown',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source[DEF_PK],
        parentType: 'unknown',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [],
      });
    });

    it('includes if a primary key is not defined in the source model', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            id: target1[DEF_PK],
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
          {
            id: target2[DEF_PK],
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new DatabaseSchema();
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
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({myId: source.myId});
      const target1 = await targetRep.create({
        parentId: source.myId,
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        parentId: source.myId,
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source.myId,
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        parentId: source.myId,
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        myId: source.myId,
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            parentId: source.myId,
            parentType: target1.parentType,
          },
          {
            [DEF_PK]: target2[DEF_PK],
            parentId: source.myId,
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new DatabaseSchema();
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
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        myId: target1.myId,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        myId: target2.myId,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        myId: target3.myId,
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            myId: target1.myId,
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
          {
            myId: target2.myId,
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('includes if the target model has a custom "foreignKey"', async function () {
      const S = new DatabaseSchema();
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
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
            foreignKey: 'relationId',
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        relationId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        myId: target1.myId,
        relationId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        relationId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        myId: target2.myId,
        relationId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        relationId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        myId: target3.myId,
        relationId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            myId: target1.myId,
            relationId: source[DEF_PK],
            parentType: target1.parentType,
          },
          {
            myId: target2.myId,
            relationId: source[DEF_PK],
            parentType: target2.parentType,
          },
        ],
      });
    });

    it('includes if the target model has a custom "discriminator"', async function () {
      const S = new DatabaseSchema();
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
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
            discriminator: 'relationType',
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        parentId: source[DEF_PK],
        relationType: 'source',
      });
      expect(target1).to.be.eql({
        myId: target1.myId,
        parentId: source[DEF_PK],
        relationType: 'source',
      });
      const target2 = await targetRep.create({
        parentId: source[DEF_PK],
        relationType: 'source',
      });
      expect(target2).to.be.eql({
        myId: target2.myId,
        parentId: source[DEF_PK],
        relationType: 'source',
      });
      const target3 = await targetRep.create({
        parentId: -1,
        relationType: 'source',
      });
      expect(target3).to.be.eql({
        myId: target3.myId,
        parentId: -1,
        relationType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            myId: target1.myId,
            parentId: source[DEF_PK],
            relationType: target1.relationType,
          },
          {
            myId: target2.myId,
            parentId: source[DEF_PK],
            relationType: target2.relationType,
          },
        ],
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target1 = await targetRep.create({
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
        {where: {featured: false}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            featured: false,
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
        ],
      });
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
        {where: {featured: true}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target2[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
          {
            [DEF_PK]: target3[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target3.parentType,
          },
        ],
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target1 = await targetRep.create({
        foo: 'fooVal1',
        bar: 'barVal1',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        foo: 'fooVal1',
        bar: 'barVal1',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        foo: 'fooVal2',
        bar: 'barVal2',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        foo: 'fooVal2',
        bar: 'barVal2',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        foo: 'fooVal3',
        bar: 'barVal3',
        parentId: -1,
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        foo: 'fooVal3',
        bar: 'barVal3',
        parentId: -1,
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
        {fields: [DEF_PK, 'bar']},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
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
      const S = new DatabaseSchema();
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
        relations: {
          children: {
            type: RelationType.HAS_MANY,
            model: 'modelB',
            polymorphic: 'parent',
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
            polymorphic: true,
          },
          children: {
            type: RelationType.HAS_MANY,
            model: 'modelC',
            polymorphic: 'parent',
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
      const b1 = await bRep.create({parentId: a.id, parentType: 'modelA'});
      const b2 = await bRep.create({parentId: a.id, parentType: 'modelA'});
      const c1 = await cRep.create({parentId: b1.id, parentType: 'modelB'});
      const c2 = await cRep.create({parentId: b1.id, parentType: 'modelB'});
      const c3 = await cRep.create({parentId: b2.id, parentType: 'modelB'});
      const c4 = await cRep.create({parentId: b2.id, parentType: 'modelB'});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b1).to.be.eql({
        id: b1.id,
        source: 'modelB',
        parentId: a.id,
        parentType: 'modelA',
      });
      expect(b2).to.be.eql({
        id: b2.id,
        source: 'modelB',
        parentId: a.id,
        parentType: 'modelA',
      });
      expect(c1).to.be.eql({
        id: c1.id,
        source: 'modelC',
        parentId: b1.id,
        parentType: 'modelB',
      });
      expect(c2).to.be.eql({
        id: c2.id,
        source: 'modelC',
        parentId: b1.id,
        parentType: 'modelB',
      });
      expect(c3).to.be.eql({
        id: c3.id,
        source: 'modelC',
        parentId: b2.id,
        parentType: 'modelB',
      });
      expect(c4).to.be.eql({
        id: c4.id,
        source: 'modelC',
        parentId: b2.id,
        parentType: 'modelB',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [a],
        'modelA',
        'modelB',
        'children',
        'parent',
        {include: 'children'},
      );
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
        children: [
          {
            id: b1.id,
            source: 'modelB',
            parentId: a.id,
            parentType: 'modelA',
            children: [
              {
                id: c1.id,
                source: 'modelC',
                parentId: b1.id,
                parentType: 'modelB',
              },
              {
                id: c2.id,
                source: 'modelC',
                parentId: b1.id,
                parentType: 'modelB',
              },
            ],
          },
          {
            id: b2.id,
            source: 'modelB',
            parentId: a.id,
            parentType: 'modelA',
            children: [
              {
                id: c3.id,
                source: 'modelC',
                parentId: b2.id,
                parentType: 'modelB',
              },
              {
                id: c4.id,
                source: 'modelC',
                parentId: b2.id,
                parentType: 'modelB',
              },
            ],
          },
        ],
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new DatabaseSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({
        name: 'target',
        datasource: 'datasource',
        relations: {
          parent: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target1 = await targetRep.create({
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target1).to.be.eql({
        [DEF_PK]: target1[DEF_PK],
        featured: false,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target2 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target2).to.be.eql({
        [DEF_PK]: target2[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const target3 = await targetRep.create({
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target3).to.be.eql({
        [DEF_PK]: target3[DEF_PK],
        featured: true,
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      const R = S.getService(HasManyResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
        {where: {and: [{featured: false}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target1[DEF_PK],
            featured: false,
            parentId: source[DEF_PK],
            parentType: target1.parentType,
          },
        ],
      });
      delete source.children;
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'children',
        'parent',
        {where: {and: [{featured: true}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        children: [
          {
            [DEF_PK]: target2[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target2.parentType,
          },
          {
            [DEF_PK]: target3[DEF_PK],
            featured: true,
            parentId: source[DEF_PK],
            parentType: target3.parentType,
          },
        ],
      });
    });
  });
});
