import {expect} from 'chai';
import {Schema} from '../schema.js';
import {format} from '@e22m4u/js-format';
import {FieldsClauseTool} from './fields-clause-tool.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

const S = new Schema();
const MODEL_NAME = 'model';
S.defineModel({name: MODEL_NAME});
const T = S.getService(FieldsClauseTool);

describe('FieldsClauseTool', function () {
  describe('filter', function () {
    describe('object', function () {
      describe('single field', function () {
        it('does not throw an error if the given field is not exist', function () {
          const object = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const res = T.filter(object, MODEL_NAME, 'qux');
          expect(res).to.be.eql({});
        });

        it('requires the first argument to be an object', function () {
          const throwable = v => () => T.filter(v, MODEL_NAME, 'bar');
          const error = v =>
            format(
              'The first argument of FieldsClauseTool.filter should be an Object or ' +
                'an Array of Object, but %s given.',
              v,
            );
          expect(throwable('str')).to.throw(error('"str"'));
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable({foo: 'a1', bar: 'a2'})()).to.be.eql({bar: 'a2'});
          expect(throwable({})()).to.be.eql({});
        });

        it('requires the second argument to be a non-empty string', function () {
          const entity = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const throwable = v => () => T.filter(entity, v, 'bar');
          const error = v =>
            format(
              'The second argument of FieldsClauseTool.filter should be ' +
                'a non-empty String, but %s given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable('model')()).to.be.eql({bar: 'a2'});
        });

        it('requires the third argument to be a non-empty string', function () {
          const entity = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const throwable = v => () => T.filter(entity, MODEL_NAME, v);
          const error = v =>
            format(
              'The provided option "fields" should be a non-empty String ' +
                'or an Array of non-empty String, but %s given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable({})).to.throw(error('Object'));
          expect(throwable('bar')()).to.be.eql({bar: 'a2'});
          expect(throwable(undefined)()).to.be.eq(entity);
          expect(throwable(null)()).to.be.eq(entity);
        });

        it('picks field of the given object', function () {
          const value = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = T.filter(value, MODEL_NAME, 'bar');
          expect(result).to.be.eql({bar: 'a2'});
        });

        it('includes the primary key of the given object', function () {
          const value = {[DEF_PK]: 10, foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = T.filter(value, MODEL_NAME, 'bar');
          expect(result).to.be.eql({[DEF_PK]: 10, bar: 'a2'});
        });
      });

      describe('multiple fields', function () {
        it('does not throw an error if multiple fields is not exist', function () {
          const object = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const res = T.filter(object, MODEL_NAME, ['bar', 'qux']);
          expect(res).to.be.eql({bar: 'a2'});
        });

        it('requires the first argument to be an object', function () {
          const throwable = v => () => T.filter(v, MODEL_NAME, ['bar', 'baz']);
          const error = v =>
            format(
              'The first argument of FieldsClauseTool.filter should be an Object or ' +
                'an Array of Object, but %s given.',
              v,
            );
          expect(throwable('str')).to.throw(error('"str"'));
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable({foo: 'a1', bar: 'a2'})()).to.be.eql({bar: 'a2'});
          expect(throwable({})()).to.be.eql({});
        });

        it('requires the second argument to be a non-empty string', function () {
          const entity = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const throwable = v => () => T.filter(entity, v, ['bar', 'baz']);
          const error = v =>
            format(
              'The second argument of FieldsClauseTool.filter should be ' +
                'a non-empty String, but %s given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable('model')()).to.be.eql({bar: 'a2', baz: 'a3'});
        });

        it('requires the third argument to be an array of non-empty strings', function () {
          const entity = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const throwable = v => () => T.filter(entity, MODEL_NAME, v);
          const error = v =>
            format(
              'The provided option "fields" should be a non-empty String ' +
                'or an Array of non-empty String, but %s given.',
              v,
            );
          expect(throwable([''])).to.throw(error('""'));
          expect(throwable([10])).to.throw(error('10'));
          expect(throwable([0])).to.throw(error('0'));
          expect(throwable([true])).to.throw(error('true'));
          expect(throwable([false])).to.throw(error('false'));
          expect(throwable([{}])).to.throw(error('Object'));
          expect(throwable([undefined])).to.throw(error('undefined'));
          expect(throwable([null])).to.throw(error('null'));
          expect(throwable(['bar', 'baz'])()).to.be.eql({bar: 'a2', baz: 'a3'});
          expect(throwable([])()).to.be.eq(entity);
        });

        it('picks fields of the given object', function () {
          const value = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = T.filter(value, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.be.eql({bar: 'a2', baz: 'a3'});
        });

        it('includes the primary key of the given object', function () {
          const value = {[DEF_PK]: 10, foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = T.filter(value, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.be.eql({[DEF_PK]: 10, bar: 'a2', baz: 'a3'});
        });
      });
    });

    describe('array', function () {
      describe('single field', function () {
        it('does not throw an error if the given field is not exist', function () {
          const objects = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const res = T.filter(objects, MODEL_NAME, 'qux');
          expect(res).to.be.eql([{}, {}, {}]);
        });

        it('requires the first argument to be an array of objects', function () {
          const throwable = v => () => T.filter(v, MODEL_NAME, 'bar');
          const error = v =>
            format(
              'The first argument of FieldsClauseTool.filter should be an Object or ' +
                'an Array of Object, but %s given.',
              v,
            );
          expect(throwable(['str'])).to.throw(error('"str"'));
          expect(throwable([''])).to.throw(error('""'));
          expect(throwable([10])).to.throw(error('10'));
          expect(throwable([0])).to.throw(error('0'));
          expect(throwable([true])).to.throw(error('true'));
          expect(throwable([false])).to.throw(error('false'));
          expect(throwable([undefined])).to.throw(error('undefined'));
          expect(throwable([null])).to.throw(error('null'));
          expect(throwable([{foo: 'a1', bar: 'a2'}])()).to.be.eql([
            {bar: 'a2'},
          ]);
          expect(throwable([{}])()).to.be.eql([{}]);
        });

        it('requires the second argument to be a non-empty string', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const throwable = v => () => T.filter(entities, v, 'bar');
          const error = v =>
            format(
              'The second argument of FieldsClauseTool.filter should be ' +
                'a non-empty String, but %s given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable('model')()).to.be.eql([
            {bar: 'a2'},
            {bar: 'b2'},
            {bar: 'c2'},
          ]);
        });

        it('requires the third argument to be a non-empty string', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const throwable = v => () => T.filter(entities, MODEL_NAME, v);
          const error = v =>
            format(
              'The provided option "fields" should be a non-empty String ' +
                'or an Array of non-empty String, but %s given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable({})).to.throw(error('Object'));
          expect(throwable('bar')()).to.be.eql([
            {bar: 'a2'},
            {bar: 'b2'},
            {bar: 'c2'},
          ]);
          expect(throwable(undefined)()).to.be.eq(entities);
          expect(throwable(null)()).to.be.eq(entities);
        });

        it('picks field of the given object', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = T.filter(entities, MODEL_NAME, 'bar');
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({bar: 'a2'});
          expect(result[1]).to.be.eql({bar: 'b2'});
          expect(result[2]).to.be.eql({bar: 'c2'});
        });

        it('includes the primary key of the given object', function () {
          const entities = [
            {[DEF_PK]: 1, foo: 'a1', bar: 'a2', baz: 'a3'},
            {[DEF_PK]: 2, foo: 'b1', bar: 'b2', baz: 'b3'},
            {[DEF_PK]: 3, foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = T.filter(entities, MODEL_NAME, 'bar');
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({[DEF_PK]: 1, bar: 'a2'});
          expect(result[1]).to.be.eql({[DEF_PK]: 2, bar: 'b2'});
          expect(result[2]).to.be.eql({[DEF_PK]: 3, bar: 'c2'});
        });
      });

      describe('multiple fields', function () {
        it('does not throw an error if multiple fields is not exist', function () {
          const object = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const res = T.filter(object, MODEL_NAME, ['bar', 'qux']);
          expect(res[0]).to.be.eql({bar: 'a2'});
          expect(res[1]).to.be.eql({bar: 'b2'});
          expect(res[2]).to.be.eql({bar: 'c2'});
        });

        it('requires the first argument to be an array of objects', function () {
          const throwable = v => () => T.filter(v, MODEL_NAME, ['bar', 'baz']);
          const error = v =>
            format(
              'The first argument of FieldsClauseTool.filter should be an Object or ' +
                'an Array of Object, but %s given.',
              v,
            );
          expect(throwable(['str'])).to.throw(error('"str"'));
          expect(throwable([''])).to.throw(error('""'));
          expect(throwable([10])).to.throw(error('10'));
          expect(throwable([0])).to.throw(error('0'));
          expect(throwable([true])).to.throw(error('true'));
          expect(throwable([false])).to.throw(error('false'));
          expect(throwable([undefined])).to.throw(error('undefined'));
          expect(throwable([null])).to.throw(error('null'));
          expect(throwable([{foo: 'a1', bar: 'a2'}])()).to.be.eql([
            {bar: 'a2'},
          ]);
          expect(throwable([{}])()).to.be.eql([{}]);
        });

        it('requires the second argument to be a non-empty string', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const throwable = v => () => T.filter(entities, v, ['bar', 'baz']);
          const error = v =>
            format(
              'The second argument of FieldsClauseTool.filter should be ' +
                'a non-empty String, but %s given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable('model')()).to.be.eql([
            {bar: 'a2', baz: 'a3'},
            {bar: 'b2', baz: 'b3'},
            {bar: 'c2', baz: 'c3'},
          ]);
        });

        it('requires the third argument to be a non-empty string', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const throwable = v => () => T.filter(entities, MODEL_NAME, v);
          const error = v =>
            format(
              'The provided option "fields" should be a non-empty String ' +
                'or an Array of non-empty String, but %s given.',
              v,
            );
          expect(throwable([''])).to.throw(error('""'));
          expect(throwable([10])).to.throw(error('10'));
          expect(throwable([0])).to.throw(error('0'));
          expect(throwable([true])).to.throw(error('true'));
          expect(throwable([false])).to.throw(error('false'));
          expect(throwable([{}])).to.throw(error('Object'));
          expect(throwable([undefined])).to.throw(error('undefined'));
          expect(throwable([null])).to.throw(error('null'));
          expect(throwable(['bar', 'baz'])()).to.be.eql([
            {bar: 'a2', baz: 'a3'},
            {bar: 'b2', baz: 'b3'},
            {bar: 'c2', baz: 'c3'},
          ]);
        });

        it('picks field of the given object', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = T.filter(entities, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({bar: 'a2', baz: 'a3'});
          expect(result[1]).to.be.eql({bar: 'b2', baz: 'b3'});
          expect(result[2]).to.be.eql({bar: 'c2', baz: 'c3'});
        });

        it('includes the primary key of the given object', function () {
          const entities = [
            {[DEF_PK]: 1, foo: 'a1', bar: 'a2', baz: 'a3'},
            {[DEF_PK]: 2, foo: 'b1', bar: 'b2', baz: 'b3'},
            {[DEF_PK]: 3, foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = T.filter(entities, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({[DEF_PK]: 1, bar: 'a2', baz: 'a3'});
          expect(result[1]).to.be.eql({[DEF_PK]: 2, bar: 'b2', baz: 'b3'});
          expect(result[2]).to.be.eql({[DEF_PK]: 3, bar: 'c2', baz: 'c3'});
        });
      });
    });
  });

  describe('validateFieldsClause', function () {
    describe('single field', function () {
      it('requires the first argument to be a non-empty string', function () {
        const throwable = v => () => FieldsClauseTool.validateFieldsClause(v);
        const error = v =>
          format(
            'The provided option "fields" should be a non-empty String ' +
              'or an Array of non-empty String, but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(0)).to.throw(error('0'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable({})).to.throw(error('Object'));
        throwable('field')();
        throwable(undefined)();
        throwable(null)();
      });
    });

    describe('multiple fields', function () {
      it('requires the first argument to be an array of non-empty strings', function () {
        const throwable = v => () => FieldsClauseTool.validateFieldsClause(v);
        const error = v =>
          format(
            'The provided option "fields" should be a non-empty String ' +
              'or an Array of non-empty String, but %s given.',
            v,
          );
        expect(throwable([''])).to.throw(error('""'));
        expect(throwable([10])).to.throw(error('10'));
        expect(throwable([0])).to.throw(error('0'));
        expect(throwable([true])).to.throw(error('true'));
        expect(throwable([false])).to.throw(error('false'));
        expect(throwable([{}])).to.throw(error('Object'));
        expect(throwable([undefined])).to.throw(error('undefined'));
        expect(throwable([null])).to.throw(error('null'));
        throwable(['field'])();
        throwable([])();
      });
    });
  });

  describe('normalizeFieldsClause', function () {
    describe('single field', function () {
      it('requires the first argument to be a non-empty string', function () {
        const throwable = clause => () =>
          FieldsClauseTool.normalizeFieldsClause(clause);
        const error = v =>
          format(
            'The provided option "fields" should be a non-empty String ' +
              'or an Array of non-empty String, but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(0)).to.throw(error('0'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable({})).to.throw(error('Object'));
        expect(throwable('field')()).to.be.eql(['field']);
        expect(throwable(undefined)()).to.be.undefined;
        expect(throwable(null)()).to.be.undefined;
      });

      it('returns an array of strings', function () {
        const fn = FieldsClauseTool.normalizeFieldsClause;
        expect(fn('foo')).to.be.eql(['foo']);
      });
    });

    describe('multiple fields', function () {
      it('requires the first argument to be an array of non-empty strings', function () {
        const throwable = clause => () =>
          FieldsClauseTool.normalizeFieldsClause(clause);
        const error = v =>
          format(
            'The provided option "fields" should be a non-empty String ' +
              'or an Array of non-empty String, but %s given.',
            v,
          );
        expect(throwable([''])).to.throw(error('""'));
        expect(throwable([10])).to.throw(error('10'));
        expect(throwable([0])).to.throw(error('0'));
        expect(throwable([true])).to.throw(error('true'));
        expect(throwable([false])).to.throw(error('false'));
        expect(throwable([{}])).to.throw(error('Object'));
        expect(throwable([undefined])).to.throw(error('undefined'));
        expect(throwable([null])).to.throw(error('null'));
        expect(throwable(['field'])()).to.be.eql(['field']);
        expect(throwable([])()).to.be.undefined;
      });

      it('returns an array of strings', function () {
        const fn = FieldsClauseTool.normalizeFieldsClause;
        expect(fn(['foo'])).to.be.eql(['foo']);
        expect(fn(['foo', 'bar'])).to.be.eql(['foo', 'bar']);
      });
    });
  });
});
