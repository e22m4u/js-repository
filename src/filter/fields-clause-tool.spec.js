import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DatabaseSchema} from '../database-schema.js';
import {FieldsClauseTool} from './fields-clause-tool.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../definition/index.js';

const dbs = new DatabaseSchema();
const MODEL_NAME = 'model';
dbs.defineModel({name: MODEL_NAME});
const S = dbs.getService(FieldsClauseTool);

describe('FieldsClauseTool', function () {
  describe('filter', function () {
    it('should require the parameter "input" to be an object or an array', function () {
      const throwable = v => () => S.filter(v, MODEL_NAME, 'prop');
      const error = v =>
        format(
          'Parameter "input" must be an Object or an Array, ' +
            'but %s was given.',
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
      throwable({prop: true})();
      throwable({})();
      throwable([{prop: true}])();
      throwable([{}])();
    });

    it('should require elements of the parameter "input" to be an object', function () {
      const throwable = v => () => S.filter([v], MODEL_NAME, 'prop');
      const error = v =>
        format(
          'Element 0 of the parameter "input" must be an Object, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({prop: true})();
      throwable({})();
    });

    it('should require the parameter "modelName" to be a non-empty string', function () {
      const throwable = v => () => S.filter({prop: true}, v, 'prop');
      const error = v =>
        format(
          'Parameter "modelName" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('model')();
    });

    it('should require the parameter "clause" to be a correct value', function () {
      const throwable = v => () => S.filter({prop: true}, MODEL_NAME, v);
      const error = v =>
        format(
          'Option "fields" must be a non-empty String or an Array, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      throwable('prop')();
      throwable(['prop'])();
      throwable(undefined)();
      throwable(null)();
    });

    it('should require elements of the parameter "clause" to be a non-empty string', function () {
      const throwable = v => () => S.filter({prop: true}, MODEL_NAME, [v]);
      const error = v =>
        format(
          'Element 0 of the option "fields" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
    });

    describe('object', function () {
      describe('single field', function () {
        it('should not throw an error if the given field is not exist', function () {
          const object = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const res = S.filter(object, MODEL_NAME, 'qux');
          expect(res).to.be.eql({});
        });

        it('should pick field of the given object', function () {
          const value = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = S.filter(value, MODEL_NAME, 'bar');
          expect(result).to.be.eql({bar: 'a2'});
        });

        it('should include the primary key of the given object', function () {
          const value = {[DEF_PK]: 10, foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = S.filter(value, MODEL_NAME, 'bar');
          expect(result).to.be.eql({[DEF_PK]: 10, bar: 'a2'});
        });
      });

      describe('multiple fields', function () {
        it('should not throw an error if multiple fields is not exist', function () {
          const object = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const res = S.filter(object, MODEL_NAME, ['bar', 'qux']);
          expect(res).to.be.eql({bar: 'a2'});
        });

        it('should pick fields of the given object', function () {
          const value = {foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = S.filter(value, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.be.eql({bar: 'a2', baz: 'a3'});
        });

        it('should include the primary key of the given object', function () {
          const value = {[DEF_PK]: 10, foo: 'a1', bar: 'a2', baz: 'a3'};
          const result = S.filter(value, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.be.eql({[DEF_PK]: 10, bar: 'a2', baz: 'a3'});
        });
      });
    });

    describe('array', function () {
      describe('single field', function () {
        it('should not throw an error if the given field is not exist', function () {
          const objects = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const res = S.filter(objects, MODEL_NAME, 'qux');
          expect(res).to.be.eql([{}, {}, {}]);
        });

        it('should pick field of the given object', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = S.filter(entities, MODEL_NAME, 'bar');
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({bar: 'a2'});
          expect(result[1]).to.be.eql({bar: 'b2'});
          expect(result[2]).to.be.eql({bar: 'c2'});
        });

        it('should include the primary key of the given object', function () {
          const entities = [
            {[DEF_PK]: 1, foo: 'a1', bar: 'a2', baz: 'a3'},
            {[DEF_PK]: 2, foo: 'b1', bar: 'b2', baz: 'b3'},
            {[DEF_PK]: 3, foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = S.filter(entities, MODEL_NAME, 'bar');
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({[DEF_PK]: 1, bar: 'a2'});
          expect(result[1]).to.be.eql({[DEF_PK]: 2, bar: 'b2'});
          expect(result[2]).to.be.eql({[DEF_PK]: 3, bar: 'c2'});
        });
      });

      describe('multiple fields', function () {
        it('should not throw an error if multiple fields is not exist', function () {
          const object = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const res = S.filter(object, MODEL_NAME, ['bar', 'qux']);
          expect(res[0]).to.be.eql({bar: 'a2'});
          expect(res[1]).to.be.eql({bar: 'b2'});
          expect(res[2]).to.be.eql({bar: 'c2'});
        });

        it('should pick field of the given object', function () {
          const entities = [
            {foo: 'a1', bar: 'a2', baz: 'a3'},
            {foo: 'b1', bar: 'b2', baz: 'b3'},
            {foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = S.filter(entities, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({bar: 'a2', baz: 'a3'});
          expect(result[1]).to.be.eql({bar: 'b2', baz: 'b3'});
          expect(result[2]).to.be.eql({bar: 'c2', baz: 'c3'});
        });

        it('should include the primary key of the given object', function () {
          const entities = [
            {[DEF_PK]: 1, foo: 'a1', bar: 'a2', baz: 'a3'},
            {[DEF_PK]: 2, foo: 'b1', bar: 'b2', baz: 'b3'},
            {[DEF_PK]: 3, foo: 'c1', bar: 'c2', baz: 'c3'},
          ];
          const result = S.filter(entities, MODEL_NAME, ['bar', 'baz']);
          expect(result).to.have.lengthOf(3);
          expect(result[0]).to.be.eql({[DEF_PK]: 1, bar: 'a2', baz: 'a3'});
          expect(result[1]).to.be.eql({[DEF_PK]: 2, bar: 'b2', baz: 'b3'});
          expect(result[2]).to.be.eql({[DEF_PK]: 3, bar: 'c2', baz: 'c3'});
        });
      });
    });
  });

  describe('validateFieldsClause', function () {
    it('should require the parameter "clause" to be a correct value', function () {
      const throwable = v => () => FieldsClauseTool.validateFieldsClause(v);
      const error = v =>
        format(
          'Option "fields" must be a non-empty String or an Array, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      throwable('prop')();
      throwable(['prop'])();
      throwable(undefined)();
      throwable(null)();
    });

    it('should require elements of the parameter "clause" to be a non-empty string', function () {
      const throwable = v => () => FieldsClauseTool.validateFieldsClause([v]);
      const error = v =>
        format(
          'Element 0 of the option "fields" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
    });
  });

  describe('normalizeFieldsClause', function () {
    it('should require the parameter "clause" to be a correct value', function () {
      const throwable = v => () => FieldsClauseTool.normalizeFieldsClause(v);
      const error = v =>
        format(
          'Option "fields" must be a non-empty String or an Array, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      throwable('prop')();
      throwable(['prop'])();
      throwable(undefined)();
      throwable(null)();
    });

    it('should require elements of the parameter "clause" to be a non-empty string', function () {
      const throwable = v => () => FieldsClauseTool.normalizeFieldsClause([v]);
      const error = v =>
        format(
          'Element 0 of the option "fields" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
    });

    it('should wrap a string value with an array', function () {
      const res = FieldsClauseTool.normalizeFieldsClause('foo');
      expect(res).to.be.eql(['foo']);
    });

    it('should return a non-empty array as is', function () {
      const res = FieldsClauseTool.normalizeFieldsClause(['foo']);
      expect(res).to.be.eql(['foo']);
    });

    it('should return undefined for an empty array', function () {
      const res = FieldsClauseTool.normalizeFieldsClause([]);
      expect(res).to.be.undefined;
    });
  });
});
