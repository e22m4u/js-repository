import {expect} from 'chai';
import {format} from 'util';
import {OrderClauseTool} from './order-clause-tool.js';

const S = new OrderClauseTool();

describe('OrderClauseTool', function () {
  describe('sort', function () {
    describe('with number values', function () {
      it('orders by a single field in ascending by default', function () {
        const objects = [{foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}];
        S.sort(objects, 'foo');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq(1);
        expect(objects[1].foo).to.be.eq(2);
        expect(objects[2].foo).to.be.eq(3);
        expect(objects[3].foo).to.be.eq(4);
      });

      it('orders by a single field in descending', function () {
        const objects = [{foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}];
        S.sort(objects, 'foo DESC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq(4);
        expect(objects[1].foo).to.be.eq(3);
        expect(objects[2].foo).to.be.eq(2);
        expect(objects[3].foo).to.be.eq(1);
      });

      it('orders by a single field in ascending', function () {
        const objects = [{foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}];
        S.sort(objects, 'foo ASC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq(1);
        expect(objects[1].foo).to.be.eq(2);
        expect(objects[2].foo).to.be.eq(3);
        expect(objects[3].foo).to.be.eq(4);
      });

      it('orders by multiple fields in ascending by default', function () {
        const objects = [
          {foo: 2, bar: 2},
          {foo: 2, bar: 3},
          {foo: 2, bar: 1},
          {foo: 1, bar: 4},
        ];
        S.sort(objects, ['foo', 'bar']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq(4);
        expect(objects[1].bar).to.be.eq(1);
        expect(objects[2].bar).to.be.eq(2);
        expect(objects[3].bar).to.be.eq(3);
      });

      it('orders by multiple fields in descending', function () {
        const objects = [
          {foo: 2, bar: 2},
          {foo: 2, bar: 3},
          {foo: 2, bar: 1},
          {foo: 1, bar: 4},
        ];
        S.sort(objects, ['foo DESC', 'bar DESC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq(3);
        expect(objects[1].bar).to.be.eq(2);
        expect(objects[2].bar).to.be.eq(1);
        expect(objects[3].bar).to.be.eq(4);
      });

      it('orders by multiple fields in ascending', function () {
        const objects = [
          {foo: 2, bar: 2},
          {foo: 2, bar: 3},
          {foo: 2, bar: 1},
          {foo: 1, bar: 4},
        ];
        S.sort(objects, ['foo ASC', 'bar ASC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq(4);
        expect(objects[1].bar).to.be.eq(1);
        expect(objects[2].bar).to.be.eq(2);
        expect(objects[3].bar).to.be.eq(3);
      });

      it('orders by nested fields in ascending by default', function () {
        const objects = [
          {foo: {bar: 3}},
          {foo: {bar: 4}},
          {foo: {bar: 2}},
          {foo: {bar: 1}},
        ];
        S.sort(objects, 'foo.bar');
        expect(objects).to.have.length(4);
        expect(objects[0].foo.bar).to.be.eq(1);
        expect(objects[1].foo.bar).to.be.eq(2);
        expect(objects[2].foo.bar).to.be.eq(3);
        expect(objects[3].foo.bar).to.be.eq(4);
      });

      it('orders by nested fields in descending', function () {
        const objects = [
          {foo: {bar: 3}},
          {foo: {bar: 4}},
          {foo: {bar: 2}},
          {foo: {bar: 1}},
        ];
        S.sort(objects, 'foo.bar DESC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo.bar).to.be.eq(4);
        expect(objects[1].foo.bar).to.be.eq(3);
        expect(objects[2].foo.bar).to.be.eq(2);
        expect(objects[3].foo.bar).to.be.eq(1);
      });

      it('orders by nested fields in ascending', function () {
        const objects = [
          {foo: {bar: 3}},
          {foo: {bar: 4}},
          {foo: {bar: 2}},
          {foo: {bar: 1}},
        ];
        S.sort(objects, 'foo.bar ASC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo.bar).to.be.eq(1);
        expect(objects[1].foo.bar).to.be.eq(2);
        expect(objects[2].foo.bar).to.be.eq(3);
        expect(objects[3].foo.bar).to.be.eq(4);
      });

      it('orders by multiple fields with nested one', function () {
        const objects = [
          {foo: {bar: 2}, baz: 2},
          {foo: {bar: 2}, baz: 3},
          {foo: {bar: 2}, baz: 4},
          {foo: {bar: 1}, baz: 1},
        ];
        S.sort(objects, ['foo.bar ASC', 'baz DESC']);
        expect(objects).to.have.length(4);
        expect(objects[0].baz).to.be.eq(1);
        expect(objects[1].baz).to.be.eq(4);
        expect(objects[2].baz).to.be.eq(3);
        expect(objects[3].baz).to.be.eq(2);
      });
    });

    describe('with string values', function () {
      it('orders by a single field in ascending by default', function () {
        const objects = [{foo: 'b'}, {foo: 'c'}, {foo: 'a'}, {foo: 'd'}];
        S.sort(objects, 'foo');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq('a');
        expect(objects[1].foo).to.be.eq('b');
        expect(objects[2].foo).to.be.eq('c');
        expect(objects[3].foo).to.be.eq('d');
      });

      it('orders by a single field in descending', function () {
        const objects = [{foo: 'b'}, {foo: 'c'}, {foo: 'a'}, {foo: 'd'}];
        S.sort(objects, 'foo DESC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq('d');
        expect(objects[1].foo).to.be.eq('c');
        expect(objects[2].foo).to.be.eq('b');
        expect(objects[3].foo).to.be.eq('a');
      });

      it('orders by a single field in ascending', function () {
        const objects = [{foo: 'b'}, {foo: 'c'}, {foo: 'a'}, {foo: 'd'}];
        S.sort(objects, 'foo ASC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq('a');
        expect(objects[1].foo).to.be.eq('b');
        expect(objects[2].foo).to.be.eq('c');
        expect(objects[3].foo).to.be.eq('d');
      });

      it('orders by multiple fields in ascending by default', function () {
        const objects = [
          {foo: 'b', bar: 'b'},
          {foo: 'b', bar: 'c'},
          {foo: 'b', bar: 'a'},
          {foo: 'a', bar: 'd'},
        ];
        S.sort(objects, ['foo', 'bar']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('d');
        expect(objects[1].bar).to.be.eq('a');
        expect(objects[2].bar).to.be.eq('b');
        expect(objects[3].bar).to.be.eq('c');
      });

      it('orders by multiple fields in descending', function () {
        const objects = [
          {foo: 'b', bar: 'b'},
          {foo: 'b', bar: 'c'},
          {foo: 'b', bar: 'a'},
          {foo: 'a', bar: 'd'},
        ];
        S.sort(objects, ['foo DESC', 'bar DESC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('c');
        expect(objects[1].bar).to.be.eq('b');
        expect(objects[2].bar).to.be.eq('a');
        expect(objects[3].bar).to.be.eq('d');
      });

      it('orders by multiple fields in ascending', function () {
        const objects = [
          {foo: 'b', bar: 'b'},
          {foo: 'b', bar: 'c'},
          {foo: 'b', bar: 'a'},
          {foo: 'a', bar: 'd'},
        ];
        S.sort(objects, ['foo ASC', 'bar ASC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('d');
        expect(objects[1].bar).to.be.eq('a');
        expect(objects[2].bar).to.be.eq('b');
        expect(objects[3].bar).to.be.eq('c');
      });

      it('orders by nested fields in ascending by default', function () {
        const objects = [
          {foo: {bar: 'c'}},
          {foo: {bar: 'd'}},
          {foo: {bar: 'b'}},
          {foo: {bar: 'a'}},
        ];
        S.sort(objects, 'foo.bar');
        expect(objects).to.have.length(4);
        expect(objects[0].foo.bar).to.be.eq('a');
        expect(objects[1].foo.bar).to.be.eq('b');
        expect(objects[2].foo.bar).to.be.eq('c');
        expect(objects[3].foo.bar).to.be.eq('d');
      });

      it('orders by nested fields in descending', function () {
        const objects = [
          {foo: {bar: 'c'}},
          {foo: {bar: 'd'}},
          {foo: {bar: 'b'}},
          {foo: {bar: 'a'}},
        ];
        S.sort(objects, 'foo.bar DESC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo.bar).to.be.eq('d');
        expect(objects[1].foo.bar).to.be.eq('c');
        expect(objects[2].foo.bar).to.be.eq('b');
        expect(objects[3].foo.bar).to.be.eq('a');
      });

      it('orders by nested fields in ascending', function () {
        const objects = [
          {foo: {bar: 'c'}},
          {foo: {bar: 'd'}},
          {foo: {bar: 'b'}},
          {foo: {bar: 'a'}},
        ];
        S.sort(objects, 'foo.bar ASC');
        expect(objects).to.have.length(4);
        expect(objects[0].foo.bar).to.be.eq('a');
        expect(objects[1].foo.bar).to.be.eq('b');
        expect(objects[2].foo.bar).to.be.eq('c');
        expect(objects[3].foo.bar).to.be.eq('d');
      });

      it('orders by multiple fields with nested one', function () {
        const objects = [
          {foo: {bar: 'b'}, baz: 'b'},
          {foo: {bar: 'b'}, baz: 'c'},
          {foo: {bar: 'b'}, baz: 'd'},
          {foo: {bar: 'a'}, baz: 'a'},
        ];
        S.sort(objects, ['foo.bar ASC', 'baz DESC']);
        expect(objects).to.have.length(4);
        expect(objects[0].baz).to.be.eq('a');
        expect(objects[1].baz).to.be.eq('d');
        expect(objects[2].baz).to.be.eq('c');
        expect(objects[3].baz).to.be.eq('b');
      });
    });

    describe('with number and string values', function () {
      it('orders by number and string values in ascending by default', function () {
        const objects = [
          {foo: 2, bar: 'd'},
          {foo: 2, bar: 'b'},
          {foo: 2, bar: 'a'},
          {foo: 1, bar: 'c'},
        ];
        S.sort(objects, ['foo', 'bar']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('c');
        expect(objects[1].bar).to.be.eq('a');
        expect(objects[2].bar).to.be.eq('b');
        expect(objects[3].bar).to.be.eq('d');
      });

      it('orders by number and string values in descending', function () {
        const objects = [
          {foo: 2, bar: 'd'},
          {foo: 2, bar: 'b'},
          {foo: 2, bar: 'a'},
          {foo: 1, bar: 'c'},
        ];
        S.sort(objects, ['foo DESC', 'bar DESC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('d');
        expect(objects[1].bar).to.be.eq('b');
        expect(objects[2].bar).to.be.eq('a');
        expect(objects[3].bar).to.be.eq('c');
      });

      it('orders by number and string values in ascending', function () {
        const objects = [
          {foo: 2, bar: 'd'},
          {foo: 2, bar: 'b'},
          {foo: 2, bar: 'a'},
          {foo: 1, bar: 'c'},
        ];
        S.sort(objects, ['foo ASC', 'bar ASC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('c');
        expect(objects[1].bar).to.be.eq('a');
        expect(objects[2].bar).to.be.eq('b');
        expect(objects[3].bar).to.be.eq('d');
      });

      it('orders by number and string values in mixed directions', function () {
        const objects = [
          {foo: 2, bar: 'd'},
          {foo: 2, bar: 'b'},
          {foo: 2, bar: 'a'},
          {foo: 1, bar: 'c'},
        ];
        S.sort(objects, ['foo DESC', 'bar ASC']);
        expect(objects).to.have.length(4);
        expect(objects[0].bar).to.be.eq('a');
        expect(objects[1].bar).to.be.eq('b');
        expect(objects[2].bar).to.be.eq('d');
        expect(objects[3].bar).to.be.eq('c');
      });
    });

    it('does not throw an error if a field does not exist', function () {
      const objects = [{foo: 1}, {foo: 2}, {foo: 3}, {foo: 4}];
      S.sort(objects, 'bar');
      expect(objects).to.have.length(4);
      expect(objects[0].foo).to.be.eq(1);
      expect(objects[1].foo).to.be.eq(2);
      expect(objects[2].foo).to.be.eq(3);
      expect(objects[3].foo).to.be.eq(4);
    });

    it('does not throw an error if a nested field does not exist', function () {
      const objects = [
        {foo: 1},
        {foo: 2, bar: undefined},
        {foo: 3, bar: {baz: undefined}},
        {foo: 4, bar: {baz: 1}},
      ];
      S.sort(objects, 'bar.baz');
      expect(objects).to.have.length(4);
      expect(objects[0].foo).to.be.eq(1);
      expect(objects[1].foo).to.be.eq(2);
      expect(objects[2].foo).to.be.eq(3);
      expect(objects[3].foo).to.be.eq(4);
    });

    it('throws an error if a given property is not a string', function () {
      const throwable = () => S.sort([], 10);
      expect(throwable).to.throw(
        'The provided option "order" should be a String ' +
          'or an Array of String, but 10 given.',
      );
    });
  });

  describe('validateOrderClause', function () {
    it('requires a non-empty string or an array of non-empty strings', function () {
      const validate = clause => () =>
        OrderClauseTool.validateOrderClause(clause);
      const error = value =>
        format(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of String, but %s given.',
          value,
        );
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate([''])).to.throw(error('""'));
      expect(validate([10])).to.throw(error('10'));
      expect(validate([true])).to.throw(error('true'));
      expect(validate([false])).to.throw(error('false'));
      expect(validate([undefined])).to.throw(error('undefined'));
      expect(validate([null])).to.throw(error('null'));
      validate('');
      validate(false);
      validate(undefined);
      validate(null);
      validate('foo');
      validate(['foo']);
    });
  });

  describe('normalizeOrderClause', function () {
    it('returns an array of strings', function () {
      const fn = OrderClauseTool.normalizeOrderClause;
      expect(fn('foo')).to.be.eql(['foo']);
      expect(fn(['foo'])).to.be.eql(['foo']);
    });

    it('requires a non-empty string or an array of non-empty strings', function () {
      const fn = clause => () => OrderClauseTool.normalizeOrderClause(clause);
      const error = value =>
        format(
          'The provided option "order" should be a non-empty String ' +
            'or an Array of String, but %s given.',
          value,
        );
      expect(fn(10)).to.throw(error('10'));
      expect(fn(true)).to.throw(error('true'));
      expect(fn({})).to.throw(error('Object'));
      expect(fn([''])).to.throw(error('""'));
      expect(fn([10])).to.throw(error('10'));
      expect(fn([true])).to.throw(error('true'));
      expect(fn([false])).to.throw(error('false'));
      expect(fn([undefined])).to.throw(error('undefined'));
      expect(fn([null])).to.throw(error('null'));
      expect(fn('')()).to.be.undefined;
      expect(fn(false)()).to.be.undefined;
      expect(fn(undefined)()).to.be.undefined;
      expect(fn(null)()).to.be.undefined;
      expect(fn('foo')()).to.be.eql(['foo']);
      expect(fn(['foo'])()).to.be.eql(['foo']);
    });
  });
});
