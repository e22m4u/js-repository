import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {IncludeClauseTool} from './include-clause-tool.js';

describe('IncludeClauseTool', function () {
  describe('validateIncludeClause', function () {
    it('does not throw for valid values', function () {
      const validate = v => IncludeClauseTool.validateIncludeClause(v);
      // undefined and null
      validate(undefined);
      validate(null);
      // a non-empty string
      validate('foo');
      // an array
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
      // an object
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
      const throwable = v => () => IncludeClauseTool.validateIncludeClause(v);
      const createError = v =>
        format(
          'The provided option "include" should have a non-empty String, ' +
            'an Object or an Array, but %v given.',
          v,
        );
      const testOf = v => {
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
        clauses.forEach(c => expect(throwable(c)).to.throw(error));
      };
      testOf('');
      testOf(10);
      testOf(0);
      testOf(true);
      testOf(false);
      testOf(() => undefined);
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
    it('throws an error for unsupported values', function () {
      const throwable = v => () => IncludeClauseTool.normalizeIncludeClause(v);
      const createError = v =>
        format(
          'The provided option "include" should have a non-empty String, ' +
            'an Object or an Array, but %v given.',
          v,
        );
      const testOf = v => {
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
        clauses.forEach(c => expect(throwable(c)).to.throw(error));
      };
      testOf('');
      testOf(10);
      testOf(0);
      testOf(true);
      testOf(false);
      testOf(() => undefined);
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

    it('normalizes the given string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause('test');
      expect(result).to.be.eql([{relation: 'test'}]);
    });

    it('normalizes the given key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: 'bar',
        baz: 'qux',
      });
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

    it('normalizes the given key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: undefined,
        baz: undefined,
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
        },
        {
          relation: 'baz',
        },
      ]);
    });

    it('normalizes the given key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: null,
        baz: null,
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
        },
        {
          relation: 'baz',
        },
      ]);
    });

    it('normalizes the given key-value object with a key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {bar: 'baz'},
        qwe: {asd: 'zxc'},
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
        {
          relation: 'qwe',
          scope: {
            include: [
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
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with a key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {bar: undefined},
        qwe: {asd: undefined},
      });
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
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with a key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {bar: null},
        qwe: {asd: null},
      });
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
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: ['bar', 'baz'],
        qwe: ['asd', 'zxc'],
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
              {
                relation: 'baz',
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
              {
                relation: 'zxc',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: [{bar: 'baz'}, {qwe: 'asd'}],
        ewq: [{dsa: 'cxz'}, {rty: 'fgh'}],
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
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  include: [
                    {
                      relation: 'cxz',
                    },
                  ],
                },
              },
              {
                relation: 'rty',
                scope: {
                  include: [
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: [{bar: undefined}, {qwe: undefined}],
        ewq: [{dsa: undefined}, {rty: undefined}],
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
              {
                relation: 'qwe',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
              {
                relation: 'rty',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: [{bar: null}, {qwe: null}],
        ewq: [{dsa: null}, {rty: null}],
      });
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
              {
                relation: 'qwe',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
              {
                relation: 'rty',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: [{bar: ['baz', 'qux']}, {qwe: ['asd', 'zxc']}],
        ewq: [{dsa: ['cxz', 'rty']}, {fgh: ['vbn', 'uio']}],
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
                    {
                      relation: 'qux',
                    },
                  ],
                },
              },
              {
                relation: 'qwe',
                scope: {
                  include: [
                    {
                      relation: 'asd',
                    },
                    {
                      relation: 'zxc',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  include: [
                    {
                      relation: 'cxz',
                    },
                    {
                      relation: 'rty',
                    },
                  ],
                },
              },
              {
                relation: 'fgh',
                scope: {
                  include: [
                    {
                      relation: 'vbn',
                    },
                    {
                      relation: 'uio',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: 'baz',
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: 'zxc',
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
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
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with a key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: 'qux',
              ewq: 'dsa',
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: 'rty',
              fgh: 'vbn',
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
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
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'fgh',
                      scope: {
                        include: [
                          {
                            relation: 'vbn',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with a key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: undefined,
              ewq: undefined,
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: undefined,
              fgh: undefined,
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with a key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: null,
              ewq: null,
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: null,
              fgh: null,
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: ['baz', 'qux'],
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: ['zxc', 'rty'],
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'qux',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'rty',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with an array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: 'qux',
              ewq: 'dsa',
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: 'rty',
              fgh: 'vbn',
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
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
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'fgh',
                      scope: {
                        include: [
                          {
                            relation: 'vbn',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with an array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: undefined,
              ewq: undefined,
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: undefined,
              fgh: undefined,
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with an array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: null,
              ewq: null,
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: null,
              fgh: null,
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given key-value object with an inclusion object with an array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        foo: {
          relation: 'bar',
          scope: {
            where: {featured: true},
            order: 'id DESC',
            skip: 0,
            limit: 10,
            fields: 'barId',
            include: {
              baz: ['qux', 'xuq'],
              ewq: ['dsa', 'asd'],
            },
          },
        },
        qwe: {
          relation: 'asd',
          scope: {
            where: {removed: false},
            order: 'createdAt DESC',
            skip: 10,
            limit: 0,
            fields: 'asdId',
            include: {
              zxc: ['rty', 'ytr'],
              fgh: ['vbn', 'nbv'],
            },
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
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                      scope: {
                        include: [
                          {
                            relation: 'qux',
                          },
                          {
                            relation: 'xuq',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                          {
                            relation: 'asd',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                          {
                            relation: 'ytr',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'fgh',
                      scope: {
                        include: [
                          {
                            relation: 'vbn',
                          },
                          {
                            relation: 'nbv',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with string', function () {
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

    it('normalizes the given inclusion object with a key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: {
            bar: 'baz',
            qwe: 'asd',
          },
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
      ]);
    });

    it('normalizes the given inclusion object with a key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: {
            bar: undefined,
            qwe: undefined,
          },
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
              {
                relation: 'qwe',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with a key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: {
            bar: null,
            qwe: null,
          },
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
              {
                relation: 'qwe',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: ['bar', 'baz'],
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
              {
                relation: 'baz',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: [{bar: 'baz'}, {qwe: 'asd'}],
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
      ]);
    });

    it('normalizes the given inclusion object with an array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: [{bar: undefined}, {qwe: undefined}],
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
              {
                relation: 'qwe',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: [{bar: null}, {qwe: null}],
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
              {
                relation: 'qwe',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'id',
          include: [{bar: ['baz', 'qux']}, {qwe: ['asd', 'zxc']}],
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
                    {
                      relation: 'qux',
                    },
                  ],
                },
              },
              {
                relation: 'qwe',
                scope: {
                  include: [
                    {
                      relation: 'asd',
                    },
                    {
                      relation: 'zxc',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: 'baz',
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
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

    it('normalizes the given inclusion object with an inclusion object with a key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: {
                baz: 'qux',
                ewq: 'dsa',
              },
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
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
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with a key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: {
                baz: undefined,
                ewq: undefined,
              },
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with a key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: {
                baz: null,
                ewq: null,
              },
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: ['baz', 'qux'],
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'qux',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with an array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: [{baz: 'qux'}, {ewq: 'dsa'}],
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
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
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with an array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: [{baz: undefined}, {ewq: undefined}],
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with an array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: [{baz: null}, {ewq: null}],
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given inclusion object with an inclusion object with an array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause({
        relation: 'foo',
        scope: {
          where: {featured: true},
          order: 'id',
          skip: 5,
          limit: 10,
          fields: 'fooId',
          include: {
            relation: 'bar',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 0,
              limit: 0,
              fields: ['id', 'createdAt'],
              include: [{baz: ['qux', 'xuq']}, {ewq: ['dsa', 'asd']}],
            },
          },
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
            fields: 'fooId',
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 0,
                  limit: 0,
                  fields: ['id', 'createdAt'],
                  include: [
                    {
                      relation: 'baz',
                      scope: {
                        include: [
                          {
                            relation: 'qux',
                          },
                          {
                            relation: 'xuq',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                          {
                            relation: 'asd',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause(['foo', 'bar']);
      expect(result).to.be.eql([{relation: 'foo'}, {relation: 'bar'}]);
    });

    it('normalizes the given array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {foo: 'bar', baz: 'qux'},
        {qwe: 'asd', zxc: 'rty'},
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
        {
          relation: 'zxc',
          scope: {
            include: [
              {
                relation: 'rty',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {foo: undefined, bar: undefined},
        {baz: undefined, qux: undefined},
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
        {
          relation: 'qux',
        },
      ]);
    });

    it('normalizes the given array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {foo: null, bar: null},
        {baz: null, qux: null},
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
        {
          relation: 'qux',
        },
      ]);
    });

    it('normalizes the given array of key-value objects with a key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {bar: 'baz'},
          qwe: {asd: 'zxc'},
        },
        {
          ewq: {dsa: 'cxz'},
          rty: {fgh: 'vbn'},
        },
      ]);
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
        {
          relation: 'qwe',
          scope: {
            include: [
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
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  include: [
                    {
                      relation: 'cxz',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'rty',
          scope: {
            include: [
              {
                relation: 'fgh',
                scope: {
                  include: [
                    {
                      relation: 'vbn',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with a key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {bar: undefined},
          qwe: {asd: undefined},
        },
        {
          ewq: {dsa: undefined},
          cxz: {rty: undefined},
        },
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
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
            ],
          },
        },
        {
          relation: 'cxz',
          scope: {
            include: [
              {
                relation: 'rty',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with a key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {bar: null},
          qwe: {asd: null},
        },
        {
          ewq: {dsa: null},
          cxz: {rty: null},
        },
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
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
            ],
          },
        },
        {
          relation: 'cxz',
          scope: {
            include: [
              {
                relation: 'rty',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: ['bar', 'baz'],
          qwe: ['asd', 'zxc'],
        },
        {
          ewq: ['dsa', 'cxz'],
          rty: ['fgh', 'vbn'],
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
              {
                relation: 'baz',
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
              {
                relation: 'zxc',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
              {
                relation: 'cxz',
              },
            ],
          },
        },
        {
          relation: 'rty',
          scope: {
            include: [
              {
                relation: 'fgh',
              },
              {
                relation: 'vbn',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: [{bar: 'baz'}, {qwe: 'asd'}],
          ewq: [{dsa: 'cxz'}, {rty: 'fgh'}],
        },
        {
          qwe: [{asd: 'zxc'}, {rty: 'fgh'}],
          vbn: [{ewq: 'dsa'}, {cxz: 'rty'}],
        },
      ]);
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
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  include: [
                    {
                      relation: 'cxz',
                    },
                  ],
                },
              },
              {
                relation: 'rty',
                scope: {
                  include: [
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
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
              {
                relation: 'rty',
                scope: {
                  include: [
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'vbn',
          scope: {
            include: [
              {
                relation: 'ewq',
                scope: {
                  include: [
                    {
                      relation: 'dsa',
                    },
                  ],
                },
              },
              {
                relation: 'cxz',
                scope: {
                  include: [
                    {
                      relation: 'rty',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: [{bar: undefined}, {qwe: undefined}],
          ewq: [{dsa: undefined}, {rty: undefined}],
        },
        {
          qwe: [{asd: undefined}, {zxc: undefined}],
          rty: [{fgh: undefined}, {vbn: undefined}],
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
              {
                relation: 'qwe',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
              {
                relation: 'rty',
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
              {
                relation: 'zxc',
              },
            ],
          },
        },
        {
          relation: 'rty',
          scope: {
            include: [
              {
                relation: 'fgh',
              },
              {
                relation: 'vbn',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: [{bar: null}, {qwe: null}],
          ewq: [{dsa: null}, {rty: null}],
        },
        {
          ytr: [{hgf: null}, {nbv: null}],
          qwe: [{asd: null}, {zxc: null}],
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
              },
              {
                relation: 'qwe',
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
              },
              {
                relation: 'rty',
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
              },
              {
                relation: 'nbv',
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
              },
              {
                relation: 'zxc',
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: [{bar: ['baz', 'qux']}, {qwe: ['asd', 'zxc']}],
          ewq: [{dsa: ['cxz', 'rty']}, {fgh: ['vbn', 'uio']}],
        },
        {
          qwe: [{asd: ['zxc', 'rty']}, {fgh: ['vbn', 'ewq']}],
          dsa: [{cxz: ['rty', 'vbn']}, {ewq: ['dsa', 'cxz']}],
        },
      ]);
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
                    {
                      relation: 'qux',
                    },
                  ],
                },
              },
              {
                relation: 'qwe',
                scope: {
                  include: [
                    {
                      relation: 'asd',
                    },
                    {
                      relation: 'zxc',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  include: [
                    {
                      relation: 'cxz',
                    },
                    {
                      relation: 'rty',
                    },
                  ],
                },
              },
              {
                relation: 'fgh',
                scope: {
                  include: [
                    {
                      relation: 'vbn',
                    },
                    {
                      relation: 'uio',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'rty',
                    },
                  ],
                },
              },
              {
                relation: 'fgh',
                scope: {
                  include: [
                    {
                      relation: 'vbn',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'dsa',
          scope: {
            include: [
              {
                relation: 'cxz',
                scope: {
                  include: [
                    {
                      relation: 'rty',
                    },
                    {
                      relation: 'vbn',
                    },
                  ],
                },
              },
              {
                relation: 'ewq',
                scope: {
                  include: [
                    {
                      relation: 'dsa',
                    },
                    {
                      relation: 'cxz',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: 'baz',
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: 'zxc',
            },
          },
        },
        {
          ewq: {
            relation: 'dsa',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: 'cxz',
            },
          },
          ytr: {
            relation: 'hgf',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: 'nbv',
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
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
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'cxz',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'nbv',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with a key-value object with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: 'qux',
                ewq: 'dsa',
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: 'rty',
                fgh: 'vbn',
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: 'ewq',
                dsa: 'cxz',
              },
            },
          },
          rty: {
            relation: 'fgh',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                vbn: 'qwe',
                asd: 'zxc',
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
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
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'fgh',
                      scope: {
                        include: [
                          {
                            relation: 'vbn',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                      scope: {
                        include: [
                          {
                            relation: 'ewq',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'dsa',
                      scope: {
                        include: [
                          {
                            relation: 'cxz',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'rty',
          scope: {
            include: [
              {
                relation: 'fgh',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'vbn',
                      scope: {
                        include: [
                          {
                            relation: 'qwe',
                          },
                        ],
                      },
                    },
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
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with a key-value object with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: undefined,
                ewq: undefined,
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: undefined,
                fgh: undefined,
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: undefined,
                ewq: undefined,
              },
            },
          },
          dsa: {
            relation: 'cxz',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                rty: undefined,
                fgh: undefined,
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'dsa',
          scope: {
            include: [
              {
                relation: 'cxz',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'rty',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with a key-value object with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: null,
                ewq: null,
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: null,
                fgh: null,
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: null,
                ewq: null,
              },
            },
          },
          dsa: {
            relation: 'cxz',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                rty: null,
                fgh: null,
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'dsa',
          scope: {
            include: [
              {
                relation: 'cxz',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'rty',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: ['baz', 'qux'],
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: ['zxc', 'rty'],
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: ['nbv', 'ewq'],
            },
          },
          dsa: {
            relation: 'cxz',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: ['ytr', 'hgf'],
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'qux',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'rty',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'dsa',
          scope: {
            include: [
              {
                relation: 'cxz',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'ytr',
                    },
                    {
                      relation: 'hgf',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with an array of key-value objects with string', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: 'qux',
                ewq: 'dsa',
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: 'rty',
                fgh: 'vbn',
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: 'ewq',
                dsa: 'cxz',
              },
            },
          },
          rty: {
            relation: 'fgh',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                vbn: 'qwe',
                asd: 'zxc',
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
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
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'fgh',
                      scope: {
                        include: [
                          {
                            relation: 'vbn',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                      scope: {
                        include: [
                          {
                            relation: 'ewq',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'dsa',
                      scope: {
                        include: [
                          {
                            relation: 'cxz',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'rty',
          scope: {
            include: [
              {
                relation: 'fgh',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'vbn',
                      scope: {
                        include: [
                          {
                            relation: 'qwe',
                          },
                        ],
                      },
                    },
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
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with an array of key-value objects with undefined', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: undefined,
                ewq: undefined,
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: undefined,
                fgh: undefined,
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: undefined,
                ewq: undefined,
              },
            },
          },
          dsa: {
            relation: 'cxz',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                ytr: undefined,
                hgf: undefined,
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'dsa',
          scope: {
            include: [
              {
                relation: 'cxz',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'ytr',
                    },
                    {
                      relation: 'hgf',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with an array of key-value objects with null', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: null,
                ewq: null,
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: null,
                fgh: null,
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: null,
                ewq: null,
              },
            },
          },
          dsa: {
            relation: 'cxz',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                ytr: null,
                hgf: null,
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                    },
                    {
                      relation: 'fgh',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                    },
                    {
                      relation: 'ewq',
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'dsa',
          scope: {
            include: [
              {
                relation: 'cxz',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'ytr',
                    },
                    {
                      relation: 'hgf',
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });

    it('normalizes the given array of key-value objects with an inclusion object with an array of key-value objects with an array of strings', function () {
      const result = IncludeClauseTool.normalizeIncludeClause([
        {
          foo: {
            relation: 'bar',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                baz: ['qux', 'xuq'],
                ewq: ['dsa', 'asd'],
              },
            },
          },
          qwe: {
            relation: 'asd',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                zxc: ['rty', 'ytr'],
                fgh: ['vbn', 'nbv'],
              },
            },
          },
        },
        {
          ytr: {
            relation: 'hgf',
            scope: {
              where: {featured: true},
              order: 'id DESC',
              skip: 0,
              limit: 10,
              fields: 'barId',
              include: {
                nbv: ['ewq', 'dsa'],
                cxz: ['rty', 'fgh'],
              },
            },
          },
          ewq: {
            relation: 'dsa',
            scope: {
              where: {removed: false},
              order: 'createdAt DESC',
              skip: 10,
              limit: 0,
              fields: 'asdId',
              include: {
                cxz: ['ytr', 'hgf'],
                nbv: ['qwe', 'asd'],
              },
            },
          },
        },
      ]);
      expect(result).to.be.eql([
        {
          relation: 'foo',
          scope: {
            include: [
              {
                relation: 'bar',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'baz',
                      scope: {
                        include: [
                          {
                            relation: 'qux',
                          },
                          {
                            relation: 'xuq',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'ewq',
                      scope: {
                        include: [
                          {
                            relation: 'dsa',
                          },
                          {
                            relation: 'asd',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'qwe',
          scope: {
            include: [
              {
                relation: 'asd',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'zxc',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                          {
                            relation: 'ytr',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'fgh',
                      scope: {
                        include: [
                          {
                            relation: 'vbn',
                          },
                          {
                            relation: 'nbv',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ytr',
          scope: {
            include: [
              {
                relation: 'hgf',
                scope: {
                  where: {featured: true},
                  order: 'id DESC',
                  skip: 0,
                  limit: 10,
                  fields: 'barId',
                  include: [
                    {
                      relation: 'nbv',
                      scope: {
                        include: [
                          {
                            relation: 'ewq',
                          },
                          {
                            relation: 'dsa',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'cxz',
                      scope: {
                        include: [
                          {
                            relation: 'rty',
                          },
                          {
                            relation: 'fgh',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          relation: 'ewq',
          scope: {
            include: [
              {
                relation: 'dsa',
                scope: {
                  where: {removed: false},
                  order: 'createdAt DESC',
                  skip: 10,
                  limit: 0,
                  fields: 'asdId',
                  include: [
                    {
                      relation: 'cxz',
                      scope: {
                        include: [
                          {
                            relation: 'ytr',
                          },
                          {
                            relation: 'hgf',
                          },
                        ],
                      },
                    },
                    {
                      relation: 'nbv',
                      scope: {
                        include: [
                          {
                            relation: 'qwe',
                          },
                          {
                            relation: 'asd',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]);
    });
  });
});
