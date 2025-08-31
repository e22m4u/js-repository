import {expect} from 'chai';
import {DataType} from './data-type.js';
import {format} from '@e22m4u/js-format';
import {DatabaseSchema} from '../../../database-schema.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
import {PropertyUniqueness} from './property-uniqueness.js';
import {PropertyUniquenessValidator} from './property-uniqueness-validator.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../model-definition-utils.js';

describe('PropertyUniquenessValidator', function () {
  describe('validate', function () {
    it('requires the parameter "countMethod" to be a Function', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: true,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const throwable = v => puv.validate(v, 'create', 'model', {});
      const error = v =>
        format(
          'The parameter "countMethod" of the PropertyUniquenessValidator ' +
            'must be a Function, but %s was given.',
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(0)).to.be.rejectedWith(error('0'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
      await expect(throwable(new Date())).to.be.rejectedWith(error('Date'));
      await expect(throwable([1, 2, 3])).to.be.rejectedWith(error('Array'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({foo: 'bar'})).to.be.rejectedWith(error('Object'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await throwable(() => 0);
    });

    it('requires the parameter "methodName" to be a non-empty String', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: true,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const throwable = v => puv.validate(() => 0, v, 'model', {});
      const error = v =>
        format(
          'The parameter "methodName" of the PropertyUniquenessValidator ' +
            'must be a non-empty String, but %s was given.',
          v,
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(0)).to.be.rejectedWith(error('0'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
      await expect(throwable(new Date())).to.be.rejectedWith(error('Date'));
      await expect(throwable([1, 2, 3])).to.be.rejectedWith(error('Array'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({foo: 'bar'})).to.be.rejectedWith(error('Object'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(() => 0)).to.be.rejectedWith(error('Function'));
      await throwable('create');
    });

    it('requires the parameter "modelName" to be a non-empty String', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: true,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const throwable = v => puv.validate(() => 0, 'create', v, {});
      const error = v =>
        format(
          'The parameter "modelName" of the PropertyUniquenessValidator ' +
            'must be a non-empty String, but %s was given.',
          v,
        );
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(0)).to.be.rejectedWith(error('0'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
      await expect(throwable(new Date())).to.be.rejectedWith(error('Date'));
      await expect(throwable([1, 2, 3])).to.be.rejectedWith(error('Array'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable({foo: 'bar'})).to.be.rejectedWith(error('Object'));
      await expect(throwable({})).to.be.rejectedWith(error('Object'));
      await expect(throwable(() => 0)).to.be.rejectedWith(error('Function'));
      await throwable('model');
    });

    it('requires the parameter "modelData" to be a pure Object', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: true,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const throwable = v => puv.validate(() => 0, 'create', 'model', v);
      const error = v =>
        format(
          'The data of the model "model" should be an Object, but %s was given.',
          v,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable('')).to.be.rejectedWith(error('""'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(0)).to.be.rejectedWith(error('0'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
      await expect(throwable([1, 2, 3])).to.be.rejectedWith(error('Array'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable(new Date())).to.be.rejectedWith(error('Date'));
      await expect(throwable(() => 0)).to.be.rejectedWith(error('Function'));
      await throwable({foo: 'bar'});
      await throwable({});
    });

    it('skips checking if the option "unique" is not provided', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.ANY,
          bar: {
            type: DataType.ANY,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const promise = puv.validate(() => 1, 'create', 'model', {});
      await expect(promise).not.to.be.rejected;
    });

    it('skips checking if the option "unique" is undefined', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: undefined,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const promise = puv.validate(() => 1, 'create', 'model', {});
      await expect(promise).not.to.be.rejected;
    });

    it('skips checking if the option "unique" is null', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: null,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const promise = puv.validate(() => 1, 'create', 'model', {});
      await expect(promise).not.to.be.rejected;
    });

    it('skips checking if the option "unique" is false', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: false,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const promise = puv.validate(() => 1, 'create', 'model', {});
      await expect(promise).not.to.be.rejected;
    });

    it('skips checking if the option "unique" is "nonUnique"', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: PropertyUniqueness.NON_UNIQUE,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const promise = puv.validate(() => 1, 'create', 'model', {});
      await expect(promise).not.to.be.rejected;
    });

    it('throws an error for unsupported method', async function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            unique: true,
          },
        },
      });
      const puv = dbs.getService(PropertyUniquenessValidator);
      const promise = puv.validate(() => 1, 'unsupported', 'model', {});
      await expect(promise).to.be.rejectedWith(
        'The PropertyUniquenessValidator does not ' +
          'support the adapter method "unsupported".',
      );
    });

    describe('the "unique" option is true', function () {
      describe('create', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'create', 'model', {
            foo: 'bar',
          });
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'create', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for each unique property of the model', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) {
              expect(where).to.be.eql({foo: 'val1'});
            } else if (invoked === 1) {
              expect(where).to.be.eql({baz: undefined});
            }
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'create', 'model', modelData);
          expect(invoked).to.be.eq(2);
        });
      });

      describe('replaceById', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(
            () => 1,
            'replaceById',
            'model',
            {foo: 'bar'},
            1,
          );
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'replaceById', 'model', {foo: 'bar'}, 1);
        });

        it('invokes the "countMethod" for each unique property of the model', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) {
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            } else if (invoked === 1) {
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                baz: undefined,
              });
            }
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(2);
        });

        it('can use a custom primary key', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              myId: {
                type: DataType.NUMBER,
                primaryKey: true,
              },
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'bar'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                myId: {neq: idValue},
                foo: 'bar',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });
      });

      describe('replaceOrCreate', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'replaceOrCreate', 'model', {
            foo: 'bar',
          });
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'replaceOrCreate', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for each unique property of the model', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) {
              expect(where).to.be.eql({foo: 'val1'});
            } else if (invoked === 1) {
              expect(where).to.be.eql({baz: undefined});
            }
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceOrCreate',
            'model',
            modelData,
          );
          expect(invoked).to.be.eq(2);
        });

        describe('in case that the given model has a document identifier', function () {
          describe('a document of the given identifier does not exist', function () {
            it('uses the default primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: true,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'bar'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'bar'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(2);
            });

            it('uses a custom primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  myId: {
                    type: DataType.NUMBER,
                    primaryKey: true,
                  },
                  foo: {
                    type: DataType.ANY,
                    unique: true,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {myId: idValue, foo: 'bar'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({myId: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'bar'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
                idValue,
              );
              expect(invoked).to.be.eq(2);
            });

            it('checks the given identifier only once', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: true,
                  },
                  bar: {
                    type: DataType.ANY,
                    unique: true,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'val1', bar: 'val2'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'val1'});
                } else if (invoked === 2) {
                  expect(where).to.be.eql({bar: 'val2'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(3);
            });
          });

          describe('a document of the given identifier already exist', function () {
            it('uses the default primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: true,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {
                [DEF_PK]: idValue,
                foo: 'bar',
              };
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({
                    [DEF_PK]: idValue,
                  });
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'bar',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(2);
            });

            it('uses a custom primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  myId: {
                    type: DataType.NUMBER,
                    primaryKey: true,
                  },
                  foo: {
                    type: DataType.ANY,
                    unique: true,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {myId: idValue, foo: 'bar'};
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({
                    myId: idValue,
                  });
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    myId: {neq: idValue},
                    foo: 'bar',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
                idValue,
              );
              expect(invoked).to.be.eq(2);
            });

            it('checks the given identifier only once', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: true,
                  },
                  bar: {
                    type: DataType.ANY,
                    unique: true,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {
                [DEF_PK]: idValue,
                foo: 'val1',
                bar: 'val2',
              };
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'val1',
                  });
                  return 0;
                } else if (invoked === 3) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    bar: 'val2',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(3);
            });
          });
        });
      });

      describe('patch', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'patch', 'model', {foo: 'bar'});
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'patch', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'patch', 'model', modelData);
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for non-provided fields', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise1 = puv.validate(() => 1, 'patch', 'model', {
            foo: 'bar',
          });
          const promise2 = puv.validate(() => 1, 'patch', 'model', {
            baz: 'qux',
          });
          await expect(promise1).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
          await expect(promise2).not.to.be.rejected;
        });
      });

      describe('patchById', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(
            () => 1,
            'patchById',
            'model',
            {foo: 'bar'},
            1,
          );
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'patchById', 'model', {foo: 'bar'}, 1);
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'patchById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for non-provided fields', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise1 = puv.validate(() => 1, 'patchById', 'model', {
            foo: 'bar',
          });
          const promise2 = puv.validate(() => 1, 'patchById', 'model', {
            baz: 'qux',
          });
          await expect(promise1).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
          await expect(promise2).not.to.be.rejected;
        });

        it('uses a custom primary key to check existence of the given identifier', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              myId: {
                type: DataType.NUMBER,
                primaryKey: true,
              },
              foo: {
                type: DataType.ANY,
                unique: true,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'bar'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                myId: {neq: idValue},
                foo: 'bar',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'patchById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });
      });
    });

    describe('the "unique" option is "strict"', function () {
      describe('create', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'create', 'model', {
            foo: 'bar',
          });
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'create', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for each unique property of the model', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) {
              expect(where).to.be.eql({foo: 'val1'});
            } else if (invoked === 1) {
              expect(where).to.be.eql({baz: undefined});
            }
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'create', 'model', modelData);
          expect(invoked).to.be.eq(2);
        });
      });

      describe('replaceById', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(
            () => 1,
            'replaceById',
            'model',
            {foo: 'bar'},
            1,
          );
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'replaceById', 'model', {foo: 'bar'}, 1);
        });

        it('invokes the "countMethod" for each unique property of the model', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) {
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            } else if (invoked === 1) {
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                baz: undefined,
              });
            }
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(2);
        });

        it('can use a custom primary key', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              myId: {
                type: DataType.NUMBER,
                primaryKey: true,
              },
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'bar'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                myId: {neq: idValue},
                foo: 'bar',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });
      });

      describe('replaceOrCreate', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'replaceOrCreate', 'model', {
            foo: 'bar',
          });
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'replaceOrCreate', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for each unique property of the model', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) {
              expect(where).to.be.eql({foo: 'val1'});
            } else if (invoked === 1) {
              expect(where).to.be.eql({baz: undefined});
            }
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceOrCreate',
            'model',
            modelData,
          );
          expect(invoked).to.be.eq(2);
        });

        describe('in case that the given model has a document identifier', function () {
          describe('a document of the given identifier does not exist', function () {
            it('uses the default primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'bar'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'bar'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(2);
            });

            it('uses a custom primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  myId: {
                    type: DataType.NUMBER,
                    primaryKey: true,
                  },
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {myId: idValue, foo: 'bar'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({myId: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'bar'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
                idValue,
              );
              expect(invoked).to.be.eq(2);
            });

            it('checks the given identifier only once', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                  bar: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'val1', bar: 'val2'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'val1'});
                } else if (invoked === 2) {
                  expect(where).to.be.eql({bar: 'val2'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(3);
            });
          });

          describe('a document of the given identifier already exist', function () {
            it('uses the default primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {
                [DEF_PK]: idValue,
                foo: 'bar',
              };
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({
                    [DEF_PK]: idValue,
                  });
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'bar',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(2);
            });

            it('uses a custom primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  myId: {
                    type: DataType.NUMBER,
                    primaryKey: true,
                  },
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {myId: idValue, foo: 'bar'};
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({
                    myId: idValue,
                  });
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    myId: {neq: idValue},
                    foo: 'bar',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
                idValue,
              );
              expect(invoked).to.be.eq(2);
            });

            it('checks the given identifier only once', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                  bar: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.STRICT,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {
                [DEF_PK]: idValue,
                foo: 'val1',
                bar: 'val2',
              };
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'val1',
                  });
                  return 0;
                } else if (invoked === 3) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    bar: 'val2',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(3);
            });
          });
        });
      });

      describe('patch', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'patch', 'model', {foo: 'bar'});
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'patch', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'patch', 'model', modelData);
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for non-provided fields', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise1 = puv.validate(() => 1, 'patch', 'model', {
            foo: 'bar',
          });
          const promise2 = puv.validate(() => 1, 'patch', 'model', {
            baz: 'qux',
          });
          await expect(promise1).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
          await expect(promise2).not.to.be.rejected;
        });
      });

      describe('patchById', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(
            () => 1,
            'patchById',
            'model',
            {foo: 'bar'},
            1,
          );
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'patchById', 'model', {foo: 'bar'}, 1);
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'patchById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for non-provided fields', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise1 = puv.validate(() => 1, 'patchById', 'model', {
            foo: 'bar',
          });
          const promise2 = puv.validate(() => 1, 'patchById', 'model', {
            baz: 'qux',
          });
          await expect(promise1).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
          await expect(promise2).not.to.be.rejected;
        });

        it('uses a custom primary key to check existence of the given identifier', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              myId: {
                type: DataType.NUMBER,
                primaryKey: true,
              },
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.STRICT,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'bar'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                myId: {neq: idValue},
                foo: 'bar',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'patchById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });
      });
    });

    describe('the "unique" option is "sparse"', function () {
      describe('create', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'create', 'model', {
            foo: 'bar',
          });
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'create', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'create', 'model', modelData);
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for empty values', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.STRING, ['val2']);
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'create', 'model', modelData);
          expect(invoked).to.be.eql(1);
        });
      });

      describe('replaceById', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(
            () => 1,
            'replaceById',
            'model',
            {foo: 'bar'},
            1,
          );
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'replaceById', 'model', {foo: 'bar'}, 1);
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for empty values', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.STRING, ['val2']);
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eql(1);
        });

        it('uses a custom primary key to check existence of the given identifier', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              myId: {
                type: DataType.NUMBER,
                primaryKey: true,
              },
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'bar'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                myId: {neq: idValue},
                foo: 'bar',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });
      });

      describe('replaceOrCreate', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'replaceOrCreate', 'model', {
            foo: 'bar',
          });
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'replaceOrCreate', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'replaceOrCreate',
            'model',
            modelData,
          );
          expect(invoked).to.be.eq(1);
        });

        describe('in case that the given model has a document identifier', function () {
          describe('a document of the given identifier does not exist', function () {
            it('uses the default primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'bar'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'bar'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(2);
            });

            it('uses a custom primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  myId: {
                    type: DataType.NUMBER,
                    primaryKey: true,
                  },
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {myId: idValue, foo: 'bar'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({myId: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'bar'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
                idValue,
              );
              expect(invoked).to.be.eq(2);
            });

            it('checks the given identifier only once', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                  bar: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'val1', bar: 'val2'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'val1'});
                } else if (invoked === 2) {
                  expect(where).to.be.eql({bar: 'val2'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(3);
            });

            it('skips uniqueness checking for empty values', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.STRING,
                    unique: PropertyUniqueness.SPARSE,
                  },
                  bar: {
                    type: DataType.STRING,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              dbs
                .getService(EmptyValuesService)
                .setEmptyValuesOf(DataType.STRING, ['val2']);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'val1', bar: 'val2'};
              const countMethod = where => {
                if (invoked === 0) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                } else if (invoked === 1) {
                  expect(where).to.be.eql({foo: 'val1'});
                }
                invoked++;
                return 0;
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eql(2);
            });
          });

          describe('a document of the given identifier already exist', function () {
            it('uses the default primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {
                [DEF_PK]: idValue,
                foo: 'bar',
              };
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({
                    [DEF_PK]: idValue,
                  });
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'bar',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(2);
            });

            it('uses a custom primary key to check existence of the given identifier', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  myId: {
                    type: DataType.NUMBER,
                    primaryKey: true,
                  },
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {myId: idValue, foo: 'bar'};
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({
                    myId: idValue,
                  });
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    myId: {neq: idValue},
                    foo: 'bar',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
                idValue,
              );
              expect(invoked).to.be.eq(2);
            });

            it('checks the given identifier only once', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                  bar: {
                    type: DataType.ANY,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              let invoked = 0;
              const idValue = 1;
              const modelData = {
                [DEF_PK]: idValue,
                foo: 'val1',
                bar: 'val2',
              };
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'val1',
                  });
                  return 0;
                } else if (invoked === 3) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    bar: 'val2',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eq(3);
            });

            it('skips uniqueness checking for empty values', async function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.STRING,
                    unique: PropertyUniqueness.SPARSE,
                  },
                  bar: {
                    type: DataType.STRING,
                    unique: PropertyUniqueness.SPARSE,
                  },
                },
              });
              const puv = dbs.getService(PropertyUniquenessValidator);
              dbs
                .getService(EmptyValuesService)
                .setEmptyValuesOf(DataType.STRING, ['val2']);
              let invoked = 0;
              const idValue = 1;
              const modelData = {[DEF_PK]: idValue, foo: 'val1', bar: 'val2'};
              const countMethod = where => {
                invoked++;
                if (invoked === 1) {
                  expect(where).to.be.eql({[DEF_PK]: idValue});
                  return 1;
                } else if (invoked === 2) {
                  expect(where).to.be.eql({
                    [DEF_PK]: {neq: idValue},
                    foo: 'val1',
                  });
                  return 0;
                }
              };
              await puv.validate(
                countMethod,
                'replaceOrCreate',
                'model',
                modelData,
              );
              expect(invoked).to.be.eql(2);
            });
          });
        });
      });

      describe('patch', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(() => 1, 'patch', 'model', {foo: 'bar'});
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'patch', 'model', {foo: 'bar'});
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'patch', 'model', modelData);
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for non-provided fields', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise1 = puv.validate(() => 1, 'patch', 'model', {
            foo: 'bar',
          });
          const promise2 = puv.validate(() => 1, 'patch', 'model', {
            baz: 'qux',
          });
          await expect(promise1).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
          await expect(promise2).not.to.be.rejected;
        });

        it('skips uniqueness checking for empty values', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.STRING, ['val2']);
          let invoked = 0;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0) expect(where).to.be.eql({foo: 'val1'});
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'patch', 'model', modelData);
          expect(invoked).to.be.eql(1);
        });
      });

      describe('patchById', function () {
        it('throws an error if the "countMethod" returns a positive number', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise = puv.validate(
            () => 1,
            'patchById',
            'model',
            {foo: 'bar'},
            1,
          );
          await expect(promise).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
        });

        it('passes validation if the "countMethod" returns zero', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          await puv.validate(() => 0, 'patchById', 'model', {foo: 'bar'}, 1);
        });

        it('invokes the "countMethod" for given properties which should be unique', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.ANY,
                unique: false,
              },
              baz: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                [DEF_PK]: {neq: idValue},
                foo: 'val1',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'patchById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });

        it('skips uniqueness checking for non-provided fields', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          const promise1 = puv.validate(() => 1, 'patchById', 'model', {
            foo: 'bar',
          });
          const promise2 = puv.validate(() => 1, 'patchById', 'model', {
            baz: 'qux',
          });
          await expect(promise1).to.be.rejectedWith(
            'An existing document of the model "model" already has ' +
              'the property "foo" with the value "bar" and should be unique.',
          );
          await expect(promise2).not.to.be.rejected;
        });

        it('skips uniqueness checking for empty values', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
              bar: {
                type: DataType.STRING,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.STRING, ['val2']);
          const modelData = {foo: 'val1', bar: 'val2'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                [DEF_PK]: {neq: 1},
                foo: 'val1',
              });
            invoked++;
            return 0;
          };
          await puv.validate(countMethod, 'patchById', 'model', modelData, 1);
          expect(invoked).to.be.eql(1);
        });

        it('uses a custom primary key to check existence of the given identifier', async function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              myId: {
                type: DataType.NUMBER,
                primaryKey: true,
              },
              foo: {
                type: DataType.ANY,
                unique: PropertyUniqueness.SPARSE,
              },
            },
          });
          const puv = dbs.getService(PropertyUniquenessValidator);
          let invoked = 0;
          const idValue = 1;
          const modelData = {foo: 'bar'};
          const countMethod = where => {
            if (invoked === 0)
              expect(where).to.be.eql({
                myId: {neq: idValue},
                foo: 'bar',
              });
            invoked++;
            return 0;
          };
          await puv.validate(
            countMethod,
            'patchById',
            'model',
            modelData,
            idValue,
          );
          expect(invoked).to.be.eq(1);
        });
      });
    });
  });
});
