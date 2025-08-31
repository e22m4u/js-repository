import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {DatabaseSchema} from '../../database-schema.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
import {DefinitionRegistry} from '../definition-registry.js';
import {ModelDataTransformer} from './model-data-transformer.js';
import {PropertyTransformerRegistry} from './properties/index.js';

describe('ModelDataTransformer', function () {
  describe('transform', function () {
    it('throws an error if the given model name is not defined', function () {
      const dbs = new DatabaseSchema();
      const T = dbs.getService(ModelDataTransformer);
      const throwable = () => T.transform('model', {});
      expect(throwable).to.throw('The model "model" is not defined.');
    });

    it('throws an error if the given model data is not a pure object', function () {
      const dbs = new DatabaseSchema();
      const T = dbs.getService(ModelDataTransformer);
      const throwable = v => () => T.transform('model', v);
      const error = v =>
        format(
          'The data of the model "model" should be an Object, but %s was given.',
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
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(new Date())).to.throw(error('Date'));
    });

    it('does nothing with the given model if no transformers are set', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
          bar: {
            type: DataType.STRING,
            default: 'test',
          },
        },
      });
      const T = dbs.getService(ModelDataTransformer);
      const modelData = {baz: 'qux'};
      const res = T.transform('model', modelData);
      expect(res).to.be.eql(modelData);
    });

    it('the option "transform" requires a non-empty String, a Function, an Array or an Object', function () {
      const dbs = new DatabaseSchema();
      dbs
        .getService(PropertyTransformerRegistry)
        .addTransformer('myTransformer', () => 'transformed');
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            transform: undefined,
          },
        },
      });
      const T = dbs.getService(ModelDataTransformer);
      const throwable = v => () => {
        const models = dbs.getService(DefinitionRegistry)['_models'];
        models.model.properties.foo.transform = v;
        T.transform('model', {foo: 'bar'});
      };
      const error = v =>
        format(
          'The provided option "transform" for the property "foo" in the model "model" ' +
            'should be either a transformer name, a transformer function, an array ' +
            'of transformer names or functions, or an object mapping transformer ' +
            'names to their arguments, but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      throwable('myTransformer')();
      throwable(() => 10)();
      throwable(() => Promise.resolve('bar'))();
      throwable(['myTransformer'])();
      throwable([() => Promise.resolve('bar')])();
      throwable([])();
      throwable({myTransformer: true})();
      throwable({})();
    });

    describe('when the option "transform" is a String', function () {
      it('should not transform the non-provided property', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {});
        expect(res).to.be.eql({});
        expect(calls).to.be.eq(0);
      });

      it('should not transform non-provided properties when the option "isPartial" is true', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
            bar: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {}, true);
        expect(res).to.be.eql({});
        expect(calls).to.be.eq(0);
      });

      it('should not transform undefined and null values', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res1 = T.transform('model', {foo: undefined});
        const res2 = T.transform('model', {foo: null});
        expect(res1).to.be.eql({foo: undefined});
        expect(res2).to.be.eql({foo: null});
        expect(calls).to.be.eq(0);
      });

      it('should not transform the empty value', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        dbs.getService(EmptyValuesService).setEmptyValuesOf(DataType.ANY, [10]);
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: 10});
        expect(calls).to.be.eq(0);
      });

      it('should transform the property by the transformer', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: '10'});
        expect(calls).to.be.eq(1);
      });

      it('should transform properties by transformers', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: ['myTransformer'],
            },
            bar: {
              type: DataType.ANY,
              transform: ['myTransformer'],
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 1, bar: 2});
        expect(res).to.be.eql({foo: '1', bar: '2'});
        expect(calls).to.be.eq(2);
      });

      it('should pass arguments to the transformer', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', (value, options, context) => {
          calls++;
          expect(value).to.be.eq(10);
          expect(options).to.be.undefined;
          expect(context).to.be.eql({
            transformerName: 'myTransformer',
            modelName: 'model',
            propName: 'foo',
          });
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: '10'});
        expect(calls).to.be.eq(1);
      });

      it('should transform the property by the asynchronous transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return Promise.resolve(String(value));
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: 10});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '10'});
        expect(calls).to.be.eq(1);
      });

      it('should transform properties by the asynchronous transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return Promise.resolve(String(value));
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
            bar: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: 10, bar: 20});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '10', bar: '20'});
        expect(calls).to.be.eq(2);
      });

      it('should throw an error from the transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('My error');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const throwable = () => T.transform('model', {foo: 10});
        expect(throwable).to.throw('My error');
        expect(calls).to.be.eq(1);
      });

      it('should throw an error from the asynchronous transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', async () => {
          calls++;
          throw new Error('My error');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: 10});
        await expect(promise).to.rejectedWith('My error');
        expect(calls).to.be.eq(1);
      });
    });

    describe('when the option "transform" is a Function', function () {
      describe('named transformers', function () {
        it('should not transform the non-provided property', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function () {
            calls++;
            throw new Error('Should not to be called.');
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {});
          expect(res).to.be.eql({});
          expect(calls).to.be.eq(0);
        });

        it('should not transform non-provided properties when the option "isPartial" is true', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function () {
            calls++;
            throw new Error('Should not to be called.');
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
              bar: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {}, true);
          expect(res).to.be.eql({});
          expect(calls).to.be.eq(0);
        });

        it('should not transform undefined and null values', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function () {
            calls++;
            throw new Error('Should not to be called.');
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res1 = T.transform('model', {foo: undefined});
          const res2 = T.transform('model', {foo: null});
          expect(res1).to.be.eql({foo: undefined});
          expect(res2).to.be.eql({foo: null});
          expect(calls).to.be.eq(0);
        });

        it('should not transform the empty value', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function () {
            calls++;
            throw new Error('Should not to be called.');
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.ANY, [10]);
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: 10});
          expect(calls).to.be.eq(0);
        });

        it('should transform the property by the transformer', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function (value) {
            calls++;
            return String(value);
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform properties by transformers', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function (value) {
            calls++;
            return String(value);
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
              bar: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 1, bar: 2});
          expect(res).to.be.eql({foo: '1', bar: '2'});
          expect(calls).to.be.eq(2);
        });

        it('should pass arguments to the transformer', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function (value, options, context) {
            calls++;
            expect(value).to.be.eq(10);
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              transformerName: 'myTransformer',
              modelName: 'model',
              propName: 'foo',
            });
            return String(value);
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform the property by the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function (value) {
            calls++;
            return Promise.resolve(String(value));
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10});
          expect(promise).to.be.instanceof(Promise);
          const res = await promise;
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform properties by the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function (value) {
            calls++;
            return Promise.resolve(String(value));
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
              bar: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10, bar: 20});
          expect(promise).to.be.instanceof(Promise);
          const res = await promise;
          expect(res).to.be.eql({foo: '10', bar: '20'});
          expect(calls).to.be.eq(2);
        });

        it('should throw an error from the transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = function () {
            calls++;
            throw new Error('My error');
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const throwable = () => T.transform('model', {foo: 10});
          expect(throwable).to.throw('My error');
          expect(calls).to.be.eq(1);
        });

        it('should throw an error from the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const myTransformer = async function () {
            calls++;
            throw new Error('My error');
          };
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: myTransformer,
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10});
          await expect(promise).to.rejectedWith('My error');
          expect(calls).to.be.eq(1);
        });
      });

      describe('anonymous transformers', function () {
        it('should not transform the non-provided property', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform() {
                  calls++;
                  throw new Error('Should not to be called.');
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {});
          expect(res).to.be.eql({});
          expect(calls).to.be.eq(0);
        });

        it('should not transform non-provided properties when the option "isPartial" is true', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform() {
                  calls++;
                  throw new Error('Should not to be called.');
                },
              },
              bar: {
                type: DataType.ANY,
                transform() {
                  calls++;
                  throw new Error('Should not to be called.');
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {}, true);
          expect(res).to.be.eql({});
          expect(calls).to.be.eq(0);
        });

        it('should not transform undefined and null values', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform() {
                  calls++;
                  throw new Error('Should not to be called.');
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res1 = T.transform('model', {foo: undefined});
          const res2 = T.transform('model', {foo: null});
          expect(res1).to.be.eql({foo: undefined});
          expect(res2).to.be.eql({foo: null});
          expect(calls).to.be.eq(0);
        });

        it('should not transform the empty value', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform() {
                  calls++;
                  throw new Error('Should not to be called.');
                },
              },
            },
          });
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.ANY, [10]);
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: 10});
          expect(calls).to.be.eq(0);
        });

        it('should transform the property by the transformer', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform(value) {
                  calls++;
                  return String(value);
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform properties by transformers', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform(value) {
                  calls++;
                  return String(value);
                },
              },
              bar: {
                type: DataType.ANY,
                transform(value) {
                  calls++;
                  return String(value);
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 1, bar: 2});
          expect(res).to.be.eql({foo: '1', bar: '2'});
          expect(calls).to.be.eq(2);
        });

        it('should pass arguments to the transformer', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform(value, options, context) {
                  calls++;
                  expect(value).to.be.eq(10);
                  expect(options).to.be.undefined;
                  expect(context).to.be.eql({
                    transformerName: undefined,
                    modelName: 'model',
                    propName: 'foo',
                  });
                  return String(value);
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform the property by the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform(value) {
                  calls++;
                  return Promise.resolve(String(value));
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10});
          expect(promise).to.be.instanceof(Promise);
          const res = await promise;
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform properties by the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform(value) {
                  calls++;
                  return Promise.resolve(String(value));
                },
              },
              bar: {
                type: DataType.ANY,
                transform(value) {
                  calls++;
                  return Promise.resolve(String(value));
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10, bar: 20});
          expect(promise).to.be.instanceof(Promise);
          const res = await promise;
          expect(res).to.be.eql({foo: '10', bar: '20'});
          expect(calls).to.be.eq(2);
        });

        it('should throw an error from the transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform() {
                  calls++;
                  throw new Error('My error');
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const throwable = () => T.transform('model', {foo: 10});
          expect(throwable).to.throw('My error');
          expect(calls).to.be.eq(1);
        });

        it('should throw an error from the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                async transform() {
                  calls++;
                  throw new Error('My error');
                },
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10});
          await expect(promise).to.rejectedWith('My error');
          expect(calls).to.be.eq(1);
        });
      });
    });

    describe('when the option "transform" is an Array', function () {
      describe('when an Array element is a String', function () {
        it('should not transform the non-provided property', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', () => {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {});
          expect(res).to.be.eql({});
          expect(calls).to.be.eq(0);
        });

        it('should not transform non-provided properties when the option "isPartial" is true', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', () => {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
              bar: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {}, true);
          expect(res).to.be.eql({});
          expect(calls).to.be.eq(0);
        });

        it('should not transform undefined and null values', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', () => {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res1 = T.transform('model', {foo: undefined});
          const res2 = T.transform('model', {foo: null});
          expect(res1).to.be.eql({foo: undefined});
          expect(res2).to.be.eql({foo: null});
          expect(calls).to.be.eq(0);
        });

        it('should not transform the empty value', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', () => {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.ANY, [10]);
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: 10});
          expect(calls).to.be.eq(0);
        });

        it('should transform the property by the transformer', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', value => {
            calls++;
            return String(value);
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform properties by transformers', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', value => {
            calls++;
            return String(value);
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
              bar: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 1, bar: 2});
          expect(res).to.be.eql({foo: '1', bar: '2'});
          expect(calls).to.be.eq(2);
        });

        it('should pass arguments to the transformer', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', (value, options, context) => {
            calls++;
            expect(value).to.be.eq(10);
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              transformerName: 'myTransformer',
              modelName: 'model',
              propName: 'foo',
            });
            return String(value);
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: 10});
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform the property by the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', value => {
            calls++;
            return Promise.resolve(String(value));
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10});
          expect(promise).to.be.instanceof(Promise);
          const res = await promise;
          expect(res).to.be.eql({foo: '10'});
          expect(calls).to.be.eq(1);
        });

        it('should transform properties by the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', value => {
            calls++;
            return Promise.resolve(String(value));
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
              bar: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10, bar: 20});
          expect(promise).to.be.instanceof(Promise);
          const res = await promise;
          expect(res).to.be.eql({foo: '10', bar: '20'});
          expect(calls).to.be.eq(2);
        });

        it('should throw an error from the transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', () => {
            calls++;
            throw new Error('My error');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const throwable = () => T.transform('model', {foo: 10});
          expect(throwable).to.throw('My error');
          expect(calls).to.be.eq(1);
        });

        it('should throw an error from the asynchronous transformer', async function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer', async () => {
            calls++;
            throw new Error('My error');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const promise = T.transform('model', {foo: 10});
          await expect(promise).to.rejectedWith('My error');
          expect(calls).to.be.eq(1);
        });

        it('should transform the property by transformers with the correct order', function () {
          const order = [];
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer1', value => {
            order.push('myTransformer1');
            return String(value);
          });
          reg.addTransformer('myTransformer2', value => {
            order.push('myTransformer2');
            return value.toUpperCase();
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer1', 'myTransformer2'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = T.transform('model', {foo: true});
          expect(res).to.be.eql({foo: 'TRUE'});
          expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
        });

        it('should transform the property by asynchronous transformers with the correct order', async function () {
          const order = [];
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyTransformerRegistry);
          reg.addTransformer('myTransformer1', async value => {
            order.push('myTransformer1');
            return String(value);
          });
          reg.addTransformer('myTransformer2', async value => {
            order.push('myTransformer2');
            return value.toUpperCase();
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                transform: ['myTransformer1', 'myTransformer2'],
              },
            },
          });
          const T = dbs.getService(ModelDataTransformer);
          const res = await T.transform('model', {foo: true});
          expect(res).to.be.eql({foo: 'TRUE'});
          expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
        });
      });

      describe('when an Array element is a Function', function () {
        describe('named transformers', function () {
          it('should not transform the non-provided property', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function () {
              calls++;
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {});
            expect(res).to.be.eql({});
            expect(calls).to.be.eq(0);
          });

          it('should not transform non-provided properties when the option "isPartial" is true', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function () {
              calls++;
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
                bar: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {}, true);
            expect(res).to.be.eql({});
            expect(calls).to.be.eq(0);
          });

          it('should not transform undefined and null values', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function () {
              calls++;
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res1 = T.transform('model', {foo: undefined});
            const res2 = T.transform('model', {foo: null});
            expect(res1).to.be.eql({foo: undefined});
            expect(res2).to.be.eql({foo: null});
            expect(calls).to.be.eq(0);
          });

          it('should not transform the empty value', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function () {
              calls++;
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            dbs
              .getService(EmptyValuesService)
              .setEmptyValuesOf(DataType.ANY, [10]);
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 10});
            expect(res).to.be.eql({foo: 10});
            expect(calls).to.be.eq(0);
          });

          it('should transform the property by the transformer', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function (value) {
              calls++;
              return String(value);
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 10});
            expect(res).to.be.eql({foo: '10'});
            expect(calls).to.be.eq(1);
          });

          it('should transform properties by transformers', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function (value) {
              calls++;
              return String(value);
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
                bar: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 1, bar: 2});
            expect(res).to.be.eql({foo: '1', bar: '2'});
            expect(calls).to.be.eq(2);
          });

          it('should pass arguments to the transformer', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function (value, options, context) {
              calls++;
              expect(value).to.be.eq(10);
              expect(options).to.be.undefined;
              expect(context).to.be.eql({
                transformerName: 'myTransformer',
                modelName: 'model',
                propName: 'foo',
              });
              return String(value);
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 10});
            expect(res).to.be.eql({foo: '10'});
            expect(calls).to.be.eq(1);
          });

          it('should transform the property by the asynchronous transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function (value) {
              calls++;
              return Promise.resolve(String(value));
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const promise = T.transform('model', {foo: 10});
            expect(promise).to.be.instanceof(Promise);
            const res = await promise;
            expect(res).to.be.eql({foo: '10'});
            expect(calls).to.be.eq(1);
          });

          it('should transform properties by the asynchronous transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function (value) {
              calls++;
              return Promise.resolve(String(value));
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
                bar: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const promise = T.transform('model', {foo: 10, bar: 20});
            expect(promise).to.be.instanceof(Promise);
            const res = await promise;
            expect(res).to.be.eql({foo: '10', bar: '20'});
            expect(calls).to.be.eq(2);
          });

          it('should throw an error from the transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = function () {
              calls++;
              throw new Error('My error');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const throwable = () => T.transform('model', {foo: 10});
            expect(throwable).to.throw('My error');
            expect(calls).to.be.eq(1);
          });

          it('should throw an error from the asynchronous transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const myTransformer = async function () {
              calls++;
              throw new Error('My error');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const promise = T.transform('model', {foo: 10});
            await expect(promise).to.rejectedWith('My error');
            expect(calls).to.be.eq(1);
          });

          it('should transform the property by transformers with the correct order', function () {
            const order = [];
            const dbs = new DatabaseSchema();
            const myTransformer1 = function (value) {
              order.push('myTransformer1');
              return String(value);
            };
            const myTransformer2 = function (value) {
              order.push('myTransformer2');
              return value.toUpperCase();
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer1, myTransformer2],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: true});
            expect(res).to.be.eql({foo: 'TRUE'});
            expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
          });

          it('should transform the property by asynchronous transformers with the correct order', async function () {
            const order = [];
            const dbs = new DatabaseSchema();
            const myTransformer1 = async function (value) {
              order.push('myTransformer1');
              return String(value);
            };
            const myTransformer2 = async function (value) {
              order.push('myTransformer2');
              return value.toUpperCase();
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [myTransformer1, myTransformer2],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = await T.transform('model', {foo: true});
            expect(res).to.be.eql({foo: 'TRUE'});
            expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
          });
        });

        describe('anonymous transformers', function () {
          it('should not transform the non-provided property', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    () => {
                      calls++;
                      throw new Error('Should not to be called.');
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {});
            expect(res).to.be.eql({});
            expect(calls).to.be.eq(0);
          });

          it('should not transform non-provided properties when the option "isPartial" is true', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    () => {
                      calls++;
                      throw new Error('Should not to be called.');
                    },
                  ],
                },
                bar: {
                  type: DataType.ANY,
                  transform: [
                    () => {
                      calls++;
                      throw new Error('Should not to be called.');
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {}, true);
            expect(res).to.be.eql({});
            expect(calls).to.be.eq(0);
          });

          it('should not transform undefined and null values', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    () => {
                      calls++;
                      throw new Error('Should not to be called.');
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res1 = T.transform('model', {foo: undefined});
            const res2 = T.transform('model', {foo: null});
            expect(res1).to.be.eql({foo: undefined});
            expect(res2).to.be.eql({foo: null});
            expect(calls).to.be.eq(0);
          });

          it('should not transform the empty value', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    () => {
                      calls++;
                      throw new Error('Should not to be called.');
                    },
                  ],
                },
              },
            });
            dbs
              .getService(EmptyValuesService)
              .setEmptyValuesOf(DataType.ANY, [10]);
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 10});
            expect(res).to.be.eql({foo: 10});
            expect(calls).to.be.eq(0);
          });

          it('should transform the property by the transformer', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      calls++;
                      return String(value);
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 10});
            expect(res).to.be.eql({foo: '10'});
            expect(calls).to.be.eq(1);
          });

          it('should transform properties by transformers', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      calls++;
                      return String(value);
                    },
                  ],
                },
                bar: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      calls++;
                      return String(value);
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 1, bar: 2});
            expect(res).to.be.eql({foo: '1', bar: '2'});
            expect(calls).to.be.eq(2);
          });

          it('should pass arguments to the transformer', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    (value, options, context) => {
                      calls++;
                      expect(value).to.be.eq(10);
                      expect(options).to.be.undefined;
                      expect(context).to.be.eql({
                        transformerName: undefined,
                        modelName: 'model',
                        propName: 'foo',
                      });
                      return String(value);
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: 10});
            expect(res).to.be.eql({foo: '10'});
            expect(calls).to.be.eq(1);
          });

          it('should transform the property by the asynchronous transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      calls++;
                      return Promise.resolve(String(value));
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const promise = T.transform('model', {foo: 10});
            expect(promise).to.be.instanceof(Promise);
            const res = await promise;
            expect(res).to.be.eql({foo: '10'});
            expect(calls).to.be.eq(1);
          });

          it('should transform properties by the asynchronous transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      calls++;
                      return Promise.resolve(String(value));
                    },
                  ],
                },
                bar: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      calls++;
                      return Promise.resolve(String(value));
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const promise = T.transform('model', {foo: 10, bar: 20});
            expect(promise).to.be.instanceof(Promise);
            const res = await promise;
            expect(res).to.be.eql({foo: '10', bar: '20'});
            expect(calls).to.be.eq(2);
          });

          it('should throw an error from the transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    () => {
                      calls++;
                      throw new Error('My error');
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const throwable = () => T.transform('model', {foo: 10});
            expect(throwable).to.throw('My error');
            expect(calls).to.be.eq(1);
          });

          it('should throw an error from the asynchronous transformer', async function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    async () => {
                      calls++;
                      throw new Error('My error');
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const promise = T.transform('model', {foo: 10});
            await expect(promise).to.rejectedWith('My error');
            expect(calls).to.be.eq(1);
          });

          it('should transform the property by transformers with the correct order', function () {
            const order = [];
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    value => {
                      order.push('myTransformer1');
                      return String(value);
                    },
                    value => {
                      order.push('myTransformer2');
                      return value.toUpperCase();
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = T.transform('model', {foo: true});
            expect(res).to.be.eql({foo: 'TRUE'});
            expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
          });

          it('should transform the property by asynchronous transformers with the correct order', async function () {
            const order = [];
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  transform: [
                    async value => {
                      order.push('myTransformer1');
                      return String(value);
                    },
                    async value => {
                      order.push('myTransformer2');
                      return value.toUpperCase();
                    },
                  ],
                },
              },
            });
            const T = dbs.getService(ModelDataTransformer);
            const res = await T.transform('model', {foo: true});
            expect(res).to.be.eql({foo: 'TRUE'});
            expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
          });
        });
      });
    });

    describe('when the option "transform" is an Object', function () {
      it('should not transform the non-provided property', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {});
        expect(res).to.be.eql({});
        expect(calls).to.be.eq(0);
      });

      it('should not transform non-provided properties when the option "isPartial" is true', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
            bar: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {}, true);
        expect(res).to.be.eql({});
        expect(calls).to.be.eq(0);
      });

      it('should not transform undefined and null values', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res1 = T.transform('model', {foo: undefined});
        const res2 = T.transform('model', {foo: null});
        expect(res1).to.be.eql({foo: undefined});
        expect(res2).to.be.eql({foo: null});
        expect(calls).to.be.eq(0);
      });

      it('should not transform the empty value', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('Should not to be called.');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        dbs.getService(EmptyValuesService).setEmptyValuesOf(DataType.ANY, [10]);
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: 10});
        expect(calls).to.be.eq(0);
      });

      it('should transform the property by the transformer', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: '10'});
        expect(calls).to.be.eq(1);
      });

      it('should transform properties by transformers', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
            bar: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 1, bar: 2});
        expect(res).to.be.eql({foo: '1', bar: '2'});
        expect(calls).to.be.eq(2);
      });

      it('should pass arguments to the transformer', function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', (value, options, context) => {
          calls++;
          expect(value).to.be.eq(10);
          expect(options).to.be.eq('test');
          expect(context).to.be.eql({
            transformerName: 'myTransformer',
            modelName: 'model',
            propName: 'foo',
          });
          return String(value);
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: 'test',
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: '10'});
        expect(calls).to.be.eq(1);
      });

      it('should transform the property by the asynchronous transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return Promise.resolve(String(value));
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: 10});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '10'});
        expect(calls).to.be.eq(1);
      });

      it('should transform properties by the asynchronous transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', value => {
          calls++;
          return Promise.resolve(String(value));
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
            bar: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: 10, bar: 20});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '10', bar: '20'});
        expect(calls).to.be.eq(2);
      });

      it('should throw an error from the transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', () => {
          calls++;
          throw new Error('My error');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const throwable = () => T.transform('model', {foo: 10});
        expect(throwable).to.throw('My error');
        expect(calls).to.be.eq(1);
      });

      it('should throw an error from the asynchronous transformer', async function () {
        let calls = 0;
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer', async () => {
          calls++;
          throw new Error('My error');
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: 10});
        await expect(promise).to.rejectedWith('My error');
        expect(calls).to.be.eq(1);
      });

      it('should transform the property by transformers with the correct order', function () {
        const order = [];
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer1', value => {
          order.push('myTransformer1');
          return String(value);
        });
        reg.addTransformer('myTransformer2', value => {
          order.push('myTransformer2');
          return value.toUpperCase();
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer1: true,
                myTransformer2: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: true});
        expect(res).to.be.eql({foo: 'TRUE'});
        expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
      });

      it('should transform the property by asynchronous transformers with the correct order', async function () {
        const order = [];
        const dbs = new DatabaseSchema();
        const reg = dbs.getService(PropertyTransformerRegistry);
        reg.addTransformer('myTransformer1', async value => {
          order.push('myTransformer1');
          return String(value);
        });
        reg.addTransformer('myTransformer2', async value => {
          order.push('myTransformer2');
          return value.toUpperCase();
        });
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer1: true,
                myTransformer2: true,
              },
            },
          },
        });
        const T = dbs.getService(ModelDataTransformer);
        const res = await T.transform('model', {foo: true});
        expect(res).to.be.eql({foo: 'TRUE'});
        expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
      });
    });
  });
});
