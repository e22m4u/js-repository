import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {IncludeClauseTool} from './include-clause-tool.js';

describe('IncludeClauseTool', function () {
  describe('validateIncludeClause', function () {
    it('does not throw for valid values', function () {
      const validate = v => IncludeClauseTool.validateIncludeClause(v);
      // empty
      validate(0);
      validate('');
      validate(null);
      validate(undefined);
      // strings
      validate('foo');
      // arrays
      validate(['foo']);
      validate([['foo']]);
      validate([{foo: 'bar'}]);
      validate([{foo: ['bar']}]);
      validate([{foo: {bar: 'baz'}}]);
      validate([{foo: [{bar: 'baz'}]}]);
      validate([{relation: 'foo', scope: {where: {bar: 'baz'}}}]);
      validate([{relation: 'foo', scope: {include: 'bar'}}]);
      validate([{relation: 'foo', scope: {include: ['bar']}}]);
      validate([{relation: 'foo', scope: {include: {bar: 'baz'}}}]);
      validate([{relation: 'foo', scope: {include: [{bar: 'baz'}]}}]);
      // objects
      validate({foo: 'bar'});
      validate({foo: ['bar']});
      validate({foo: {bar: 'baz'}});
      validate({foo: [{bar: 'baz'}]});
      validate({relation: 'foo'});
      validate({relation: 'foo', scope: {where: {bar: 'baz'}}});
      validate({relation: 'foo', scope: {include: 'bar'}});
      validate({relation: 'foo', scope: {include: ['bar']}});
      validate({relation: 'foo', scope: {include: {bar: 'baz'}}});
      validate({relation: 'foo', scope: {include: [{bar: 'baz'}]}});
    });

    it('throws an error for unsupported values', function () {
      const validate = v => () => IncludeClauseTool.validateIncludeClause(v);
      const createError = v =>
        format(
          'The provided option "include" should have a value of ' +
            'following types: String, Object or Array, but %v given.',
          v,
        );
      const testFor = v => {
        const error = createError(v);
        const clauses = [
          v,
          // arrays
          [v],
          [{foo: v}],
          [{foo: [v]}],
          [{foo: {bar: v}}],
          [{foo: {bar: [v]}}],
          [{foo: [{bar: v}]}],
          [{foo: [{bar: [v]}]}],
          [{relation: 'foo', scope: {include: v}}],
          [{relation: 'foo', scope: {include: {bar: v}}}],
          // objects
          {foo: v},
          {foo: [v]},
          {foo: {bar: v}},
          {foo: {bar: [v]}},
          {foo: [{bar: v}]},
          {foo: [{bar: [v]}]},
          {relation: 'foo', scope: {include: v}},
          {relation: 'foo', scope: {include: {bar: v}}},
        ];
        clauses.forEach(c => expect(validate(c)).to.throw(error));
      };
      testFor(10);
      testFor(true);
      testFor(() => undefined);
    });

    it('throws an error for duplicates', function () {
      const validate = v => () => IncludeClauseTool.validateIncludeClause(v);
      const error = 'The provided option "include" has duplicates of "foo".';
      const clauses = [
        ['foo', 'foo'],
        [['foo'], 'foo'],
        ['foo', ['foo']],
        [['foo'], ['foo']],
        ['foo', {foo: 'bar'}],
        [{foo: 'bar'}, 'foo'],
        [{foo: 'bar'}, {foo: 'bar'}],
        [[{foo: 'bar'}], 'foo'],
        ['foo', [{foo: 'bar'}]],
        [[{foo: 'bar'}], [{foo: 'bar'}]],
      ];
      clauses.forEach(c => expect(validate(c)).to.throw(error));
      validate({foo: 'foo'})();
      validate([{foo: 'foo'}])();
    });
  });

  describe('normalizeClause', function () {
    it('normalizes a given string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause('test');
      expect(result).to.be.eql([{relation: 'test'}]);
    });

    it('normalizes a free-form object', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({foo: 'bar'});
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes a free-form object with a nested array', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({foo: ['bar']});
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes a free-form object with a nested free-form object', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {bar: 'baz'},
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  include: [
                    {
                      relation: 'baz',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes a free-form object with a nested inclusion object', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {baz: 'qux'},
            include: 'baz',
          },
        },
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {baz: 'qux'},
                  include: [
                    {
                      relation: 'baz',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an inclusion object', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: 'bar',
        },
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            where: {featured: true},
            order: 'id',
            skip: 5,
            limit: 10,
            fields: 'id',
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an inclusion object with a nested array', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: ['bar'],
        },
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            where: {featured: true},
            order: 'id',
            skip: 5,
            limit: 10,
            fields: 'id',
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an inclusion object with a nested free-form object', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: {bar: 'baz'},
        },
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            where: {featured: true},
            order: 'id',
            skip: 5,
            limit: 10,
            fields: 'id',
            include: [
              {
                relation: 'bar',
                scope: {
                  include: [
                    {
                      relation: 'baz',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an inclusion object with a nested inclusion object', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: [
            {
              relation: 'bar',
              scope: {
                where: {removed: false},
                order: 'myId',
                skip: 10,
                limit: 5,
                fields: ['id', 'removed'],
                include: 'qwe',
              },
            },
          ],
        },
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            where: {featured: true},
            order: 'id',
            skip: 5,
            limit: 10,
            fields: 'id',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'myId',
                  skip: 10,
                  limit: 5,
                  fields: ['id', 'removed'],
                  include: [
                    {
                      relation: 'qwe',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause(['foo', 'bar']);
      expect(result).to.be.eql([
        {
          relation: 'foo',
        },
        {
          relation: 'bar',
        },
      ]);
    });

    it('normalizes an array of nested free-form objects', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {foo: 'bar'},
        {baz: 'qux'},
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
        {
          relation: 'baz',
          scope: {
            include: [
              {
                relation: 'qux',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an array of nested inclusion objects', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          relation: 'foo',
          scope: {
            where: {featured: true},
            order: 'id',
            skip: 5,
            limit: 10,
            fields: 'id',
            include: 'bar',
          },
        },
        {
          relation: 'baz',
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            where: {featured: true},
            order: 'id',
            skip: 5,
            limit: 10,
            fields: 'id',
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
        {
          relation: 'baz',
        },
      ]);
    });

    it('normalizes an array of nested arrays', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        ['foo'],
        ['bar', ['baz']],
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
        },
        {
          relation: 'bar',
        },
        {
          relation: 'baz',
        },
      ]);
    });

    it('normalizes a free-form object with mixed inclusions', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        // a string
        foo: 'bar',
        // an array
        baz: ['qux'],
        // a free-form object
        bat: {qwe: 'asd'},
        // an inclusion object
        zxc: {
          relation: 'rty',
          scope: {
            fields: ['id', 'featured'],
          },
        },
      });
      expect(result).to.be.eql([
        // a string
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
            ],
          },
        },
        // an array
        {
          relation: 'baz',
          scope: {
            include: [
              {
                relation: 'qux',
              },
            ],
          },
        },
        // a free-form object
        {
          relation: 'bat',
          scope: {
            include: [
              {
                relation: 'qwe',
                scope: {
                  include: [
                    {
                      relation: 'asd',
                    },
                  ],
                },
              },
            ],
          },
        },
        // an inclusion object
        {
          relation: 'zxc',
          scope: {
            include: [
              {
                relation: 'rty',
                scope: {
                  fields: ['id', 'featured'],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes an array with mixed inclusions', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        // a string
        'foo',
        // a free-form object
        {
          bar: 'baz',
          qux: {
            relation: 'qwe',
          },
        },
        // an inclusion object
        {
          relation: 'asd',
          scope: {
            include: 'zxc',
          },
        },
        // a nested array
        ['rty', 'fgh', ['vbn']],
      ]);
      expect(result).to.be.eql([
        // a string
        {
          relation: 'foo',
        },
        // a free-form object
        {
          relation: 'bar',
          scope: {
            include: [
              {
                relation: 'baz',
              },
            ],
          },
        },
        {
          relation: 'qux',
          scope: {
            include: [
              {
                relation: 'qwe',
              },
            ],
          },
        },
        // an inclusion object
        {
          relation: 'asd',
          scope: {
            include: [
              {
                relation: 'zxc',
              },
            ],
          },
        },
        // a nested array
        {
          relation: 'rty',
        },
        {
          relation: 'fgh',
        },
        {
          relation: 'vbn',
        },
      ]);
    });

    it('throws an error for unsupported values', function () {
      const validate = v => () => IncludeClauseTool.normalizeIncludeClause(v);
      const createError = v =>
        format(
          'The provided option "include" should have a value of ' +
            'following types: String, Object or Array, but %v given.',
          v,
        );
      const testFor = v => {
        const error = createError(v);
        const clauses = [
          v,
          // arrays
          [v],
          [{foo: v}],
          [{foo: [v]}],
          [{foo: {bar: v}}],
          [{foo: {bar: [v]}}],
          [{foo: [{bar: v}]}],
          [{foo: [{bar: [v]}]}],
          [{relation: 'foo', scope: {include: v}}],
          [{relation: 'foo', scope: {include: {bar: v}}}],
          // objects
          {foo: v},
          {foo: [v]},
          {foo: {bar: v}},
          {foo: {bar: [v]}},
          {foo: [{bar: v}]},
          {foo: [{bar: [v]}]},
          {relation: 'foo', scope: {include: v}},
          {relation: 'foo', scope: {include: {bar: v}}},
        ];
        clauses.forEach(c => expect(validate(c)).to.throw(error));
      };
      testFor(10);
      testFor(true);
      testFor(() => undefined);
    });

    it('throws an error for duplicates', function () {
      const validate = v => () => IncludeClauseTool.normalizeIncludeClause(v);
      const error = 'The provided option "include" has duplicates of "foo".';
      const clauses = [
        ['foo', 'foo'],
        [['foo'], 'foo'],
        ['foo', ['foo']],
        [['foo'], ['foo']],
        ['foo', {foo: 'bar'}],
        [{foo: 'bar'}, 'foo'],
        [{foo: 'bar'}, {foo: 'bar'}],
        [[{foo: 'bar'}], 'foo'],
        ['foo', [{foo: 'bar'}]],
        [[{foo: 'bar'}], [{foo: 'bar'}]],
      ];
      clauses.forEach(c => expect(validate(c)).to.throw(error));
      validate({foo: 'foo'})();
      validate([{foo: 'foo'}])();
    });
  });
});
