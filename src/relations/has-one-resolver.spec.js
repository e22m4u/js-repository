import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {DataType} from '../definition/index.js';
import {RelationType} from '../definition/index.js';
import {HasOneResolver} from './has-one-resolver.js';
import {RepositoriesSchema} from '../repository/index.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

describe('HasOneResolver', function () {
  describe('includeTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasOneResolver.includeTo requires ' +
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
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasOneResolver.includeTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of HasOneResolver.includeTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "targetName" of HasOneResolver.includeTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "relationName" of HasOneResolver.includeTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "foreignKey" of HasOneResolver.includeTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of HasOneResolver.includeTo ' +
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
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasOneResolver);
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
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(HasOneResolver);
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
      const S = new RepositoriesSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({});
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
    });

    it('includes if a primary key is not defined in the source model', async function () {
      const S = new RepositoriesSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target = await targetRep.create({parentId: source[DEF_PK]});
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source[DEF_PK],
      });
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          id: target[DEF_PK],
          parentId: source[DEF_PK],
        },
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({parentId: source.myId});
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source.myId,
      });
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId');
      expect(source).to.be.eql({
        myId: source.myId,
        child: {
          [DEF_PK]: target[DEF_PK],
          parentId: source.myId,
        },
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({parentId: source[DEF_PK]});
      expect(target).to.be.eql({
        myId: target.myId,
        parentId: source[DEF_PK],
      });
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId');
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          myId: target.myId,
          parentId: source[DEF_PK],
        },
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId', {
        where: {featured: false},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target1[DEF_PK],
          featured: false,
          parentId: source[DEF_PK],
        },
      });
      await R.includeTo([source], 'source', 'target', 'child', 'parentId', {
        where: {featured: true},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target2[DEF_PK],
          featured: true,
          parentId: source[DEF_PK],
        },
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new RepositoriesSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
        parentId: source[DEF_PK],
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: target.foo,
        bar: target.bar,
        parentId: source[DEF_PK],
      });
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId', {
        fields: [DEF_PK, 'bar'],
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target[DEF_PK],
          bar: target.bar,
        },
      });
    });

    it('uses an include clause of the given scope to resolve target relations', async function () {
      const S = new RepositoriesSchema();
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
          child: {
            type: RelationType.HAS_ONE,
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
          child: {
            type: RelationType.HAS_ONE,
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
      const R = S.getService(HasOneResolver);
      await R.includeTo([a], 'modelA', 'modelB', 'child', 'parentId', {
        include: 'child',
      });
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
        child: {
          id: b.id,
          source: 'modelB',
          parentId: a.id,
          child: {
            id: c.id,
            source: 'modelC',
            parentId: b.id,
          },
        },
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      await R.includeTo([source], 'source', 'target', 'child', 'parentId', {
        where: {and: [{featured: false}]},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target1[DEF_PK],
          featured: false,
          parentId: source[DEF_PK],
        },
      });
      delete source.child;
      await R.includeTo([source], 'source', 'target', 'child', 'parentId', {
        where: {and: [{featured: true}]},
      });
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target2[DEF_PK],
          featured: true,
          parentId: source[DEF_PK],
        },
      });
    });
  });

  describe('includePolymorphicTo', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "targetName" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "relationName" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "foreignKey" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "discriminator" of HasOneResolver.includePolymorphicTo requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of HasOneResolver.includePolymorphicTo ' +
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
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicTo(
        [entity],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if the given target model does not have a datasource', async function () {
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicTo(
        [entity],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have a specified datasource.',
      );
    });

    it('does not throw an error if a relation target is not found', async function () {
      const S = new RepositoriesSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRel = S.getRepository('source');
      const source = await sourceRel.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
    });

    it('does not include an entity with a not matched discriminator value', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
    });

    it('includes if a primary key is not defined in the source model', async function () {
      const S = new RepositoriesSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({[DEF_PK]: source[DEF_PK]});
      const target = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          id: target[DEF_PK],
          parentId: source[DEF_PK],
          parentType: target.parentType,
        },
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        parentId: source.myId,
        parentType: 'source',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source.myId,
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        myId: source.myId,
        child: {
          [DEF_PK]: target[DEF_PK],
          parentId: source.myId,
          parentType: target.parentType,
        },
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        myId: target.myId,
        parentId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          myId: target.myId,
          parentId: source[DEF_PK],
          parentType: target.parentType,
        },
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new RepositoriesSchema();
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
        parentType: target1.parentType,
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
        parentType: target2.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
        {where: {featured: false}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target1[DEF_PK],
          featured: false,
          parentId: source[DEF_PK],
          parentType: target1.parentType,
        },
      });
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
        {where: {featured: true}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target2[DEF_PK],
          featured: true,
          parentId: source[DEF_PK],
          parentType: target2.parentType,
        },
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new RepositoriesSchema();
      S.defineDatasource({name: 'datasource', adapter: 'memory'});
      S.defineModel({name: 'source', datasource: 'datasource'});
      S.defineModel({name: 'target', datasource: 'datasource'});
      const sourceRep = S.getRepository('source');
      const targetRep = S.getRepository('target');
      const source = await sourceRep.create({});
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: target.foo,
        bar: target.bar,
        parentId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
        {fields: [DEF_PK, 'bar']},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target[DEF_PK],
          bar: target.bar,
        },
      });
    });

    it('uses an include clause of the given scope to resolve target relations', async function () {
      const S = new RepositoriesSchema();
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
          child: {
            type: RelationType.HAS_ONE,
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
          child: {
            type: RelationType.HAS_ONE,
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
      const b = await bRep.create({parentId: a.id, parentType: 'modelA'});
      const c = await cRep.create({parentId: b.id, parentType: 'modelB'});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b).to.be.eql({
        id: b.id,
        source: 'modelB',
        parentId: a.id,
        parentType: 'modelA',
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentId: b.id,
        parentType: 'modelB',
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [a],
        'modelA',
        'modelB',
        'child',
        'parentId',
        'parentType',
        {include: 'child'},
      );
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
        child: {
          id: b.id,
          source: 'modelB',
          parentId: a.id,
          parentType: 'modelA',
          child: {
            id: c.id,
            source: 'modelC',
            parentId: b.id,
            parentType: 'modelB',
          },
        },
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new RepositoriesSchema();
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
        parentType: target1.parentType,
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
        parentType: target2.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
        {where: {and: [{featured: false}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target1[DEF_PK],
          featured: false,
          parentId: source[DEF_PK],
          parentType: target1.parentType,
        },
      });
      delete source.child;
      await R.includePolymorphicTo(
        [source],
        'source',
        'target',
        'child',
        'parentId',
        'parentType',
        {where: {and: [{featured: true}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target2[DEF_PK],
          featured: true,
          parentId: source[DEF_PK],
          parentType: target2.parentType,
        },
      });
    });
  });

  describe('includePolymorphicByRelationName', function () {
    it('requires the "entities" parameter to be an array', async function () {
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasOneResolver.includePolymorphicByRelationName requires ' +
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
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "entities" of HasOneResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          v,
        );
      const throwable = v =>
        R.includePolymorphicByRelationName(
          [v],
          'source',
          'target',
          'child',
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "sourceName" of HasOneResolver.includePolymorphicByRelationName requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "targetName" of HasOneResolver.includePolymorphicByRelationName requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "relationName" of HasOneResolver.includePolymorphicByRelationName requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The parameter "targetRelationName" of HasOneResolver.includePolymorphicByRelationName requires ' +
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
      const S = new RepositoriesSchema();
      const R = S.getService(HasOneResolver);
      const error = v =>
        format(
          'The provided parameter "scope" of HasOneResolver.includePolymorphicByRelationName ' +
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
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'child',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" is not defined',
      );
    });

    it('throws an error if the given target model does not have the given relation name', async function () {
      const S = new RepositoriesSchema();
      S.defineModel({name: 'source'});
      S.defineModel({name: 'target'});
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'child',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have relation name "parent".',
      );
    });

    it('throws an error if the target relation is not "belongsTo"', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'child',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The relation "child" of the model "source" is a polymorphic "hasOne" relation, ' +
          'so it requires the target relation "parent" to be a polymorphic "belongsTo", ' +
          'but "referencesMany" type given.',
      );
    });

    it('throws an error if the target relation is not polymorphic', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'child',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The relation "child" of the model "source" is a polymorphic ' +
          '"hasOne" relation, so it requires the target relation "parent" ' +
          'to be a polymorphic too.',
      );
    });

    it('throws an error if the given target model does not have a datasource', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      const entity = {[DEF_PK]: 1};
      const promise = R.includePolymorphicByRelationName(
        [entity],
        'source',
        'target',
        'child',
        'parent',
      );
      await expect(promise).to.be.rejectedWith(
        'The model "target" does not have a specified datasource.',
      );
    });

    it('does not throw an error if a relation target is not found', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
    });

    it('does not include an entity with a not matched discriminator value', async function () {
      const S = new RepositoriesSchema();
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
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
      });
    });

    it('includes if a primary key is not defined in the source model', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          id: target[DEF_PK],
          parentId: source[DEF_PK],
          parentType: target.parentType,
        },
      });
    });

    it('includes if the source model has a custom primary key', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        parentId: source.myId,
        parentType: 'source',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        parentId: source.myId,
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        myId: source.myId,
        child: {
          [DEF_PK]: target[DEF_PK],
          parentId: source.myId,
          parentType: target.parentType,
        },
      });
    });

    it('includes if the target model has a custom primary key', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        myId: target.myId,
        parentId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          myId: target.myId,
          parentId: source[DEF_PK],
          parentType: target.parentType,
        },
      });
    });

    it('includes if the target model has a custom "foreignKey"', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        relationId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        myId: target.myId,
        relationId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          myId: target.myId,
          relationId: source[DEF_PK],
          parentType: target.parentType,
        },
      });
    });

    it('includes if the target model has a custom "discriminator"', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        parentId: source[DEF_PK],
        relationType: 'source',
      });
      expect(target).to.be.eql({
        myId: target.myId,
        parentId: source[DEF_PK],
        relationType: target.relationType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          myId: target.myId,
          parentId: source[DEF_PK],
          relationType: target.relationType,
        },
      });
    });

    it('uses a where clause of the given scope to filter the relation target', async function () {
      const S = new RepositoriesSchema();
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
        parentType: target1.parentType,
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
        parentType: target2.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
        {where: {featured: false}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target1[DEF_PK],
          featured: false,
          parentId: source[DEF_PK],
          parentType: target1.parentType,
        },
      });
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
        {where: {featured: true}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target2[DEF_PK],
          featured: true,
          parentId: source[DEF_PK],
          parentType: target2.parentType,
        },
      });
    });

    it('uses a fields clause of the given scope to filter the relation target', async function () {
      const S = new RepositoriesSchema();
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
      const target = await targetRep.create({
        foo: 'fooVal',
        bar: 'barVal',
        parentId: source[DEF_PK],
        parentType: 'source',
      });
      expect(target).to.be.eql({
        [DEF_PK]: target[DEF_PK],
        foo: target.foo,
        bar: target.bar,
        parentId: source[DEF_PK],
        parentType: target.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
        {fields: [DEF_PK, 'bar']},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target[DEF_PK],
          bar: target.bar,
        },
      });
    });

    it('uses an include clause of the given scope to resolve target relations', async function () {
      const S = new RepositoriesSchema();
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
          child: {
            type: RelationType.HAS_ONE,
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
          child: {
            type: RelationType.HAS_ONE,
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
      const b = await bRep.create({parentId: a.id, parentType: 'modelA'});
      const c = await cRep.create({parentId: b.id, parentType: 'modelB'});
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
      });
      expect(b).to.be.eql({
        id: b.id,
        source: 'modelB',
        parentId: a.id,
        parentType: 'modelA',
      });
      expect(c).to.be.eql({
        id: c.id,
        source: 'modelC',
        parentId: b.id,
        parentType: 'modelB',
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [a],
        'modelA',
        'modelB',
        'child',
        'parent',
        {include: 'child'},
      );
      expect(a).to.be.eql({
        id: a.id,
        source: 'modelA',
        child: {
          id: b.id,
          source: 'modelB',
          parentId: a.id,
          parentType: 'modelA',
          child: {
            id: c.id,
            source: 'modelC',
            parentId: b.id,
            parentType: 'modelB',
          },
        },
      });
    });

    it('does not break the "and" operator of the given "where" clause', async function () {
      const S = new RepositoriesSchema();
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
        parentType: target1.parentType,
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
        parentType: target2.parentType,
      });
      const R = S.getService(HasOneResolver);
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
        {where: {and: [{featured: false}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target1[DEF_PK],
          featured: false,
          parentId: source[DEF_PK],
          parentType: target1.parentType,
        },
      });
      delete source.child;
      await R.includePolymorphicByRelationName(
        [source],
        'source',
        'target',
        'child',
        'parent',
        {where: {and: [{featured: true}]}},
      );
      expect(source).to.be.eql({
        [DEF_PK]: source[DEF_PK],
        child: {
          [DEF_PK]: target2[DEF_PK],
          featured: true,
          parentId: source[DEF_PK],
          parentType: target2.parentType,
        },
      });
    });
  });
});
