import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {WhereClauseTool} from './where-clause-tool.js';

const S = new WhereClauseTool();

const OBJECTS = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    age: 21,
    hobbies: ['bicycle', 'yoga'],
    nickname: 'Spear',
    birthdate: '2002-04-14',
  },
  {
    id: 2,
    name: 'Mary',
    surname: 'Smith',
    age: 21,
    hobbies: ['yoga', 'meditation'],
    nickname: 'Flower',
    birthdate: '2002-01-12',
  },
  {
    id: 3,
    name: 'James',
    surname: 'Smith',
    age: 21,
    hobbies: [],
    nickname: null,
    birthdate: '2002-03-01',
  },
  {
    id: 4,
    name: 'Oliver',
    surname: 'Smith',
    age: 32,
    hobbies: ['bicycle'],
    birthdate: '1991-06-24',
  },
];

describe('WhereClauseTool', function () {
  describe('filter', function () {
    it('requires the first argument to be an array of objects', function () {
      const throwable = v => () => S.filter(v, {});
      const error = v =>
        format(
          'The first argument of WhereClauseTool.filter should be ' +
            'an Array of Object, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable([{foo: 'bar'}])()).to.be.eql([{foo: 'bar'}]);
      expect(throwable([])()).to.be.eql([]);
    });

    it('requires the second argument to be an object', function () {
      const input = [{foo: 'a1'}, {foo: 'a2'}, {foo: 'a3'}];
      const throwable = v => () => S.filter(input, v);
      const error = v =>
        format(
          'The provided option "where" should be an Object, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})()).to.be.eql(input);
      expect(throwable(undefined)()).to.be.eql(input);
      expect(throwable(null)()).to.be.eql(input);
    });

    it('returns the same array if no given condition', function () {
      const result = S.filter(OBJECTS);
      expect(result).to.be.eql(OBJECTS);
    });

    it('returns a filtered array by matched properties', function () {
      const result = S.filter(OBJECTS, {surname: 'Smith', age: 21});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
    });

    it('the and operator requires each given condition to be met', function () {
      const result = S.filter(OBJECTS, {
        and: [{name: 'James'}, {age: 21}],
      });
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[2]);
    });

    it('the or operator requires one of a given condition to be met', function () {
      const result = S.filter(OBJECTS, {
        or: [{name: 'James'}, {age: 21}],
      });
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
      expect(result[2]).to.be.eql(OBJECTS[2]);
    });

    it('uses property value to match an array value', function () {
      const result = S.filter(OBJECTS, {hobbies: 'yoga'});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
    });

    it('uses given RegExp to match a property value', function () {
      const result = S.filter(OBJECTS, {surname: /^Sm.+/});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
      expect(result[2]).to.be.eql(OBJECTS[3]);
    });

    it('uses given RegExp to match an array value', function () {
      const result = S.filter(OBJECTS, {hobbies: /^\w+cycle/});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[3]);
    });

    it('skips not supported values for RegExp', function () {
      const result = S.filter(OBJECTS, {id: /test/});
      expect(result).to.be.empty;
    });

    it('uses an "eq" operator to match equality', function () {
      const result = S.filter(OBJECTS, {name: {eq: 'John'}});
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[0]);
    });

    it('uses a "neq" operator to match non-equality', function () {
      const result = S.filter(OBJECTS, {name: {neq: 'John'}});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
      expect(result[2]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "neq" operator to match an empty array', function () {
      const result = S.filter(OBJECTS, {hobbies: {neq: 'bicycle'}});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
    });

    it('uses a "gt" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {gt: 2}});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[2]);
      expect(result[1]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "gte" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {gte: 2}});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
      expect(result[2]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "lt" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {lt: 3}});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
    });

    it('uses a "lte" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {lte: 3}});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
      expect(result[2]).to.be.eql(OBJECTS[2]);
    });

    it('uses a "inq" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {inq: [2, 3]}});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
    });

    it('uses a "nin" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {nin: [2, 3]}});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "between" operator to compare values', function () {
      const result = S.filter(OBJECTS, {id: {between: [2, 3]}});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[1]);
      expect(result[1]).to.be.eql(OBJECTS[2]);
    });

    it('uses an "exists" operator to check existence', function () {
      const result = S.filter(OBJECTS, {nickname: {exists: true}});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
      expect(result[2]).to.be.eql(OBJECTS[2]);
    });

    it('uses an "exists" operator to check non-existence', function () {
      const result = S.filter(OBJECTS, {nickname: {exists: false}});
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "like" operator to match by a substring', function () {
      const result = S.filter(OBJECTS, {name: {like: 'liv'}});
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "nlike" operator to exclude by a substring', function () {
      const result = S.filter(OBJECTS, {name: {nlike: 'liv'}});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
      expect(result[2]).to.be.eql(OBJECTS[2]);
    });

    it('uses a "ilike" operator to case-insensitively matching by a substring', function () {
      const result = S.filter(OBJECTS, {name: {ilike: 'LIV'}});
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[3]);
    });

    it('uses a "nilike" operator to exclude case-insensitively by a substring', function () {
      const result = S.filter(OBJECTS, {name: {nilike: 'LIV'}});
      expect(result).to.have.length(3);
      expect(result[0]).to.be.eql(OBJECTS[0]);
      expect(result[1]).to.be.eql(OBJECTS[1]);
      expect(result[2]).to.be.eql(OBJECTS[2]);
    });

    it('uses a "regexp" operator to compare values', function () {
      const result = S.filter(OBJECTS, {name: {regexp: '^Jam.*'}});
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[2]);
    });

    it('uses a null to match an undefined and null value', function () {
      const result = S.filter(OBJECTS, {nickname: null});
      expect(result).to.have.length(2);
      expect(result[0]).to.be.eql(OBJECTS[2]);
      expect(result[1]).to.be.eql(OBJECTS[3]);
    });

    it('uses a given function to filter values', function () {
      const result = S.filter(OBJECTS, v => v.nickname === 'Flower');
      expect(result).to.have.length(1);
      expect(result[0]).to.be.eql(OBJECTS[1]);
    });
  });

  describe('validateWhereClause', function () {
    it('requires an object value or a falsy value', function () {
      const validate = v => () => WhereClauseTool.validateWhereClause(v);
      const error = v =>
        format(
          'The provided option "where" should be an Object, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate([])).to.throw(error('Array'));
      validate('')();
      validate(false)();
      validate(undefined)();
      validate(null)();
      validate({})();
    });
  });
});
