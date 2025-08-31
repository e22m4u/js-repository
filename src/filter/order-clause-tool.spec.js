import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {OrderClauseTool} from './order-clause-tool.js';

const S = new OrderClauseTool();

describe('OrderClauseTool', function () {
  describe('sort', function () {
    describe('single field', function () {
      it('does not throw an error if the given field is not exist', function () {
        const objects = [{foo: 1}, {foo: 2}, {foo: 3}, {foo: 4}];
        S.sort(objects, 'bar');
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq(1);
        expect(objects[1].foo).to.be.eq(2);
        expect(objects[2].foo).to.be.eq(3);
        expect(objects[3].foo).to.be.eq(4);
      });

      describe('with number values', function () {
        it('orders in ascending by default', function () {
          const objects = [{foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}];
          S.sort(objects, 'foo');
          expect(objects).to.have.length(4);
          expect(objects[0].foo).to.be.eq(1);
          expect(objects[1].foo).to.be.eq(2);
          expect(objects[2].foo).to.be.eq(3);
          expect(objects[3].foo).to.be.eq(4);
        });

        it('orders in descending', function () {
          const objects = [{foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}];
          S.sort(objects, 'foo DESC');
          expect(objects).to.have.length(4);
          expect(objects[0].foo).to.be.eq(4);
          expect(objects[1].foo).to.be.eq(3);
          expect(objects[2].foo).to.be.eq(2);
          expect(objects[3].foo).to.be.eq(1);
        });

        it('orders in ascending', function () {
          const objects = [{foo: 2}, {foo: 3}, {foo: 1}, {foo: 4}];
          S.sort(objects, 'foo ASC');
          expect(objects).to.have.length(4);
          expect(objects[0].foo).to.be.eq(1);
          expect(objects[1].foo).to.be.eq(2);
          expect(objects[2].foo).to.be.eq(3);
          expect(objects[3].foo).to.be.eq(4);
        });
      });

      describe('with string values', function () {
        it('orders in ascending by default', function () {
          const objects = [{foo: 'b'}, {foo: 'c'}, {foo: 'a'}, {foo: 'd'}];
          S.sort(objects, 'foo');
          expect(objects).to.have.length(4);
          expect(objects[0].foo).to.be.eq('a');
          expect(objects[1].foo).to.be.eq('b');
          expect(objects[2].foo).to.be.eq('c');
          expect(objects[3].foo).to.be.eq('d');
        });

        it('orders in descending', function () {
          const objects = [{foo: 'b'}, {foo: 'c'}, {foo: 'a'}, {foo: 'd'}];
          S.sort(objects, 'foo DESC');
          expect(objects).to.have.length(4);
          expect(objects[0].foo).to.be.eq('d');
          expect(objects[1].foo).to.be.eq('c');
          expect(objects[2].foo).to.be.eq('b');
          expect(objects[3].foo).to.be.eq('a');
        });

        it('orders in ascending', function () {
          const objects = [{foo: 'b'}, {foo: 'c'}, {foo: 'a'}, {foo: 'd'}];
          S.sort(objects, 'foo ASC');
          expect(objects).to.have.length(4);
          expect(objects[0].foo).to.be.eq('a');
          expect(objects[1].foo).to.be.eq('b');
          expect(objects[2].foo).to.be.eq('c');
          expect(objects[3].foo).to.be.eq('d');
        });
      });
    });

    describe('multiple fields', function () {
      it('does not throw an error if multiple fields are not exist', function () {
        const objects = [{foo: 1}, {foo: 2}, {foo: 3}, {foo: 4}];
        S.sort(objects, ['bar', 'baz']);
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq(1);
        expect(objects[1].foo).to.be.eq(2);
        expect(objects[2].foo).to.be.eq(3);
        expect(objects[3].foo).to.be.eq(4);
      });

      describe('with number values', function () {
        it('orders in ascending by default', function () {
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

        it('orders in descending', function () {
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

        it('orders in ascending', function () {
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

        it('orders with mixed directions', function () {
          const objects = [
            {foo: 2, bar: 2},
            {foo: 2, bar: 4},
            {foo: 2, bar: 1},
            {foo: 1, bar: 3},
          ];
          S.sort(objects, ['foo DESC', 'bar ASC']);
          expect(objects).to.have.length(4);
          expect(objects[0].bar).to.be.eq(1);
          expect(objects[1].bar).to.be.eq(2);
          expect(objects[2].bar).to.be.eq(4);
          expect(objects[3].bar).to.be.eq(3);
        });
      });

      describe('with string values', function () {
        it('orders in ascending by default', function () {
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

        it('orders in descending', function () {
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

        it('orders in ascending', function () {
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

        it('orders with mixed directions', function () {
          const objects = [
            {foo: 'b', bar: 'b'},
            {foo: 'b', bar: 'd'},
            {foo: 'b', bar: 'a'},
            {foo: 'a', bar: 'c'},
          ];
          S.sort(objects, ['foo DESC', 'bar ASC']);
          expect(objects).to.have.length(4);
          expect(objects[0].bar).to.be.eq('a');
          expect(objects[1].bar).to.be.eq('b');
          expect(objects[2].bar).to.be.eq('d');
          expect(objects[3].bar).to.be.eq('c');
        });
      });

      describe('with number and string values', function () {
        it('orders in ascending by default', function () {
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

        it('orders in descending', function () {
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

        it('orders in ascending', function () {
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

        it('orders in mixed directions', function () {
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
    });

    describe('nested single field', function () {
      it('does not throw an error if the nested field is not exist', function () {
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

      describe('with number values', function () {
        it('orders in ascending by default', function () {
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

        it('orders in descending', function () {
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

        it('orders in ascending', function () {
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
      });

      describe('with string values', function () {
        it('orders in ascending by default', function () {
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

        it('orders in descending', function () {
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

        it('orders in ascending', function () {
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
      });
    });

    describe('nested multiple fields', function () {
      it('does not throw an error if nested multiple fields are not exist', function () {
        const objects = [
          {foo: 1},
          {foo: 2, bar: undefined},
          {foo: 3, bar: {baz: undefined}},
          {foo: 4, bar: {baz: 1}},
        ];
        S.sort(objects, ['bar.baz', 'qux']);
        expect(objects).to.have.length(4);
        expect(objects[0].foo).to.be.eq(1);
        expect(objects[1].foo).to.be.eq(2);
        expect(objects[2].foo).to.be.eq(3);
        expect(objects[3].foo).to.be.eq(4);
      });

      describe('with number values', function () {
        it('orders in ascending by default', function () {
          const objects = [
            {foo: {bar: 2}, baz: 2},
            {foo: {bar: 2}, baz: 1},
            {foo: {bar: 2}, baz: 4},
            {foo: {bar: 1}, baz: 3},
          ];
          S.sort(objects, ['foo.bar', 'baz']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(3);
          expect(objects[1].baz).to.be.eq(1);
          expect(objects[2].baz).to.be.eq(2);
          expect(objects[3].baz).to.be.eq(4);
        });

        it('orders in descending', function () {
          const objects = [
            {foo: {bar: 2}, baz: 2},
            {foo: {bar: 2}, baz: 1},
            {foo: {bar: 2}, baz: 4},
            {foo: {bar: 1}, baz: 3},
          ];
          S.sort(objects, ['foo.bar DESC', 'baz DESC']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(4);
          expect(objects[1].baz).to.be.eq(2);
          expect(objects[2].baz).to.be.eq(1);
          expect(objects[3].baz).to.be.eq(3);
        });

        it('orders in ascending', function () {
          const objects = [
            {foo: {bar: 2}, baz: 2},
            {foo: {bar: 2}, baz: 1},
            {foo: {bar: 2}, baz: 4},
            {foo: {bar: 1}, baz: 3},
          ];
          S.sort(objects, ['foo.bar ASC', 'baz ASC']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(3);
          expect(objects[1].baz).to.be.eq(1);
          expect(objects[2].baz).to.be.eq(2);
          expect(objects[3].baz).to.be.eq(4);
        });

        it('orders with mixed directions', function () {
          const objects = [
            {foo: {bar: 2}, baz: 2},
            {foo: {bar: 2}, baz: 1},
            {foo: {bar: 2}, baz: 4},
            {foo: {bar: 1}, baz: 3},
          ];
          S.sort(objects, ['foo.bar DESC', 'baz']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(1);
          expect(objects[1].baz).to.be.eq(2);
          expect(objects[2].baz).to.be.eq(4);
          expect(objects[3].baz).to.be.eq(3);
        });
      });

      describe('with string values', function () {
        it('orders in ascending by default', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 'b'},
            {foo: {bar: 'b'}, baz: 'a'},
            {foo: {bar: 'b'}, baz: 'd'},
            {foo: {bar: 'a'}, baz: 'c'},
          ];
          S.sort(objects, ['foo.bar', 'baz']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq('c');
          expect(objects[1].baz).to.be.eq('a');
          expect(objects[2].baz).to.be.eq('b');
          expect(objects[3].baz).to.be.eq('d');
        });

        it('orders in descending', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 'b'},
            {foo: {bar: 'b'}, baz: 'a'},
            {foo: {bar: 'b'}, baz: 'd'},
            {foo: {bar: 'a'}, baz: 'c'},
          ];
          S.sort(objects, ['foo.bar DESC', 'baz DESC']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq('d');
          expect(objects[1].baz).to.be.eq('b');
          expect(objects[2].baz).to.be.eq('a');
          expect(objects[3].baz).to.be.eq('c');
        });

        it('orders in ascending', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 'b'},
            {foo: {bar: 'b'}, baz: 'a'},
            {foo: {bar: 'b'}, baz: 'd'},
            {foo: {bar: 'a'}, baz: 'c'},
          ];
          S.sort(objects, ['foo.bar ASC', 'baz ASC']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq('c');
          expect(objects[1].baz).to.be.eq('a');
          expect(objects[2].baz).to.be.eq('b');
          expect(objects[3].baz).to.be.eq('d');
        });

        it('orders with mixed directions', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 'b'},
            {foo: {bar: 'b'}, baz: 'a'},
            {foo: {bar: 'b'}, baz: 'd'},
            {foo: {bar: 'a'}, baz: 'c'},
          ];
          S.sort(objects, ['foo.bar DESC', 'baz']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq('a');
          expect(objects[1].baz).to.be.eq('b');
          expect(objects[2].baz).to.be.eq('d');
          expect(objects[3].baz).to.be.eq('c');
        });
      });

      describe('with number and string values', function () {
        it('orders in ascending by default', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 2},
            {foo: {bar: 'b'}, baz: 1},
            {foo: {bar: 'b'}, baz: 4},
            {foo: {bar: 'a'}, baz: 3},
          ];
          S.sort(objects, ['foo.bar', 'baz']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(3);
          expect(objects[1].baz).to.be.eq(1);
          expect(objects[2].baz).to.be.eq(2);
          expect(objects[3].baz).to.be.eq(4);
        });

        it('orders in descending', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 2},
            {foo: {bar: 'b'}, baz: 1},
            {foo: {bar: 'b'}, baz: 4},
            {foo: {bar: 'a'}, baz: 3},
          ];
          S.sort(objects, ['foo.bar DESC', 'baz DESC']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(4);
          expect(objects[1].baz).to.be.eq(2);
          expect(objects[2].baz).to.be.eq(1);
          expect(objects[3].baz).to.be.eq(3);
        });

        it('orders in ascending', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 2},
            {foo: {bar: 'b'}, baz: 1},
            {foo: {bar: 'b'}, baz: 4},
            {foo: {bar: 'a'}, baz: 3},
          ];
          S.sort(objects, ['foo.bar ASC', 'baz ASC']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(3);
          expect(objects[1].baz).to.be.eq(1);
          expect(objects[2].baz).to.be.eq(2);
          expect(objects[3].baz).to.be.eq(4);
        });

        it('orders with mixed directions', function () {
          const objects = [
            {foo: {bar: 'b'}, baz: 2},
            {foo: {bar: 'b'}, baz: 1},
            {foo: {bar: 'b'}, baz: 4},
            {foo: {bar: 'a'}, baz: 3},
          ];
          S.sort(objects, ['foo.bar DESC', 'baz']);
          expect(objects).to.have.length(4);
          expect(objects[0].baz).to.be.eq(1);
          expect(objects[1].baz).to.be.eq(2);
          expect(objects[2].baz).to.be.eq(4);
          expect(objects[3].baz).to.be.eq(3);
        });
      });
    });
  });

  describe('validateOrderClause', function () {
    describe('single field', function () {
      it('requires the first argument as a non-empty string', function () {
        const throwable = v => () => OrderClauseTool.validateOrderClause(v);
        const error = v =>
          format(
            'The provided option "order" should be a non-empty String ' +
              'or an Array of non-empty String, but %s was given.',
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
      it('requires the first argument as a non-empty string', function () {
        const throwable = v => () => OrderClauseTool.validateOrderClause(v);
        const error = v =>
          format(
            'The provided option "order" should be a non-empty String ' +
              'or an Array of non-empty String, but %s was given.',
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

  describe('normalizeOrderClause', function () {
    describe('single field', function () {
      it('requires the first argument as a non-empty string', function () {
        const throwable = v => () => OrderClauseTool.normalizeOrderClause(v);
        const error = v =>
          format(
            'The provided option "order" should be a non-empty String ' +
              'or an Array of non-empty String, but %s was given.',
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

      it('returns an array of string', function () {
        const fn = OrderClauseTool.normalizeOrderClause;
        expect(fn('foo')).to.be.eql(['foo']);
      });
    });

    describe('multiple fields', function () {
      it('requires the first argument as a non-empty string', function () {
        const throwable = v => () => OrderClauseTool.normalizeOrderClause(v);
        const error = v =>
          format(
            'The provided option "order" should be a non-empty String ' +
              'or an Array of non-empty String, but %s was given.',
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
        const fn = OrderClauseTool.normalizeOrderClause;
        expect(fn(['foo', 'bar'])).to.be.eql(['foo', 'bar']);
      });
    });
  });
});
