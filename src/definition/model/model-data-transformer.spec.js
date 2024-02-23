import {expect} from 'chai';
import {Schema} from '../../schema.js';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {DefinitionRegistry} from '../definition-registry.js';
import {ModelDataTransformer} from './model-data-transformer.js';
import {PropertyTransformerRegistry} from './properties/index.js';

describe('ModelDataTransformer', function () {
  describe('transform', function () {
    it('throws an error if the given model name is not defined', function () {
      const schema = new Schema();
      const T = schema.getService(ModelDataTransformer);
      const throwable = () => T.transform('model', {});
      expect(throwable).to.throw('The model "model" is not defined.');
    });

    it('throws an error if the given model data is not a pure object', function () {
      const schema = new Schema();
      const T = schema.getService(ModelDataTransformer);
      const throwable = v => () => T.transform('model', v);
      const error = v =>
        format(
          'The data of the model "model" should be an Object, but %s given.',
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
      const schema = new Schema();
      schema.defineModel({
        name: 'model',
        properties: {
          foo: DataType.STRING,
          bar: {
            type: DataType.STRING,
            default: 'test',
          },
        },
      });
      const T = schema.getService(ModelDataTransformer);
      const modelData = {baz: 'qux'};
      const res = T.transform('model', modelData);
      expect(res).to.be.eql(modelData);
    });

    describe('the option "transform" with a string value', function () {
      it('transforms the property value by its transformer', function () {
        const schema = new Schema();
        const myTransformer = value => String(value);
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 10});
        expect(res).to.be.eql({foo: '10'});
      });

      it('passes specific arguments to the transformer function', function () {
        const schema = new Schema();
        const myTransformer = (value, options, context) => {
          expect(value).to.be.eq('input');
          expect(options).to.be.undefined;
          expect(context).to.be.eql({
            transformerName: 'myTransformer',
            modelName: 'model',
            propName: 'foo',
          });
          return 'transformed';
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: 'myTransformer',
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 'input'});
        expect(res).to.be.eql({foo: 'transformed'});
      });

      it('does not transform a property value if it is not provided', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: 'myTransformer',
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {});
        expect(res).to.be.eql({});
      });

      it('does not transform undefined and null values', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: 'myTransformer',
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res1 = T.transform('model', {foo: undefined});
        const res2 = T.transform('model', {foo: null});
        expect(res1).to.be.eql({foo: undefined});
        expect(res2).to.be.eql({foo: null});
      });

      it('the parameter "isPartial" prevents to transform values of not provided properties', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: 'myTransformer',
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {}, true);
        expect(res).to.be.eql({});
      });

      it('transforms the property value by its asynchronous transformer', async function () {
        const schema = new Schema();
        const myTransformer1 = (value, options) => {
          expect(options).to.be.undefined;
          return Promise.resolve(`${value}2`);
        };
        const myTransformer2 = (value, options) => {
          expect(options).to.be.undefined;
          return Promise.resolve(`${value}3`);
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer1', myTransformer1)
          .addTransformer('myTransformer2', myTransformer2);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: 'myTransformer1',
            },
            bar: {
              type: DataType.STRING,
              transform: 'myTransformer2',
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: '1', bar: '2'});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '12', bar: '23'});
      });
    });

    describe('the option "transform" with an array value', function () {
      it('transforms given properties by their transformers', function () {
        const schema = new Schema();
        const myTransformer = value => String(value);
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
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
            baz: {
              type: DataType.ANY,
              transform: ['myTransformer'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 1, bar: 2, baz: 3});
        expect(res).to.be.eql({foo: '1', bar: '2', baz: '3'});
      });

      it('transforms the property value by its transformers in specified order', function () {
        const schema = new Schema();
        const order = [];
        const myTransformer1 = value => {
          order.push('myTransformer1');
          return value + '1';
        };
        const myTransformer2 = value => {
          order.push('myTransformer2');
          return value + '2';
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer1', myTransformer1)
          .addTransformer('myTransformer2', myTransformer2);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: ['myTransformer1', 'myTransformer2'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 'value'});
        expect(res).to.be.eql({foo: 'value12'});
        expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
      });

      it('passes specific arguments to the transformer function', function () {
        const schema = new Schema();
        const myTransformer = (value, options, context) => {
          expect(value).to.be.eq('input');
          expect(options).to.be.undefined;
          expect(context).to.be.eql({
            transformerName: 'myTransformer',
            modelName: 'model',
            propName: 'foo',
          });
          return 'transformed';
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: ['myTransformer'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 'input'});
        expect(res).to.be.eql({foo: 'transformed'});
      });

      it('does not transform a property value if it is not provided', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: ['myTransformer'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {});
        expect(res).to.be.eql({});
      });

      it('transforms undefined and null values', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: ['myTransformer'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res1 = T.transform('model', {foo: undefined});
        const res2 = T.transform('model', {foo: null});
        expect(res1).to.be.eql({foo: undefined});
        expect(res2).to.be.eql({foo: null});
      });

      it('the parameter "isPartial" prevents to transform values of not provided properties', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: ['myTransformer'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {}, true);
        expect(res).to.be.eql({});
      });

      it('transforms the property value by its asynchronous transformers', async function () {
        const schema = new Schema();
        const myTransformer1 = (value, options) => {
          expect(options).to.be.undefined;
          return Promise.resolve(`${value}2`);
        };
        const myTransformer2 = (value, options) => {
          expect(options).to.be.undefined;
          return Promise.resolve(`${value}3`);
        };
        const myTransformer3 = (value, options) => {
          expect(options).to.be.undefined;
          return Promise.resolve(`${value}4`);
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer1', myTransformer1)
          .addTransformer('myTransformer2', myTransformer2)
          .addTransformer('myTransformer3', myTransformer3);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: ['myTransformer1', 'myTransformer2'],
            },
            bar: {
              type: DataType.STRING,
              transform: ['myTransformer2', 'myTransformer3'],
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: '1', bar: '2'});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '123', bar: '234'});
      });
    });

    describe('the option "transform" with an object value', function () {
      it('transforms given properties by their transformers', function () {
        const schema = new Schema();
        const myTransformer = value => String(value);
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {myTransformer: true},
            },
            bar: {
              type: DataType.ANY,
              transform: {myTransformer: true},
            },
            baz: {
              type: DataType.ANY,
              transform: {myTransformer: true},
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 1, bar: 2, baz: 3});
        expect(res).to.be.eql({foo: '1', bar: '2', baz: '3'});
      });

      it('transforms the property value by its transformers in specified order', function () {
        const schema = new Schema();
        const order = [];
        const myTransformer1 = value => {
          order.push('myTransformer1');
          return value + '1';
        };
        const myTransformer2 = value => {
          order.push('myTransformer2');
          return value + '2';
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer1', myTransformer1)
          .addTransformer('myTransformer2', myTransformer2);
        schema.defineModel({
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
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 'value'});
        expect(res).to.be.eql({foo: 'value12'});
        expect(order).to.be.eql(['myTransformer1', 'myTransformer2']);
      });

      it('passes specific arguments to the transformer function', function () {
        const schema = new Schema();
        const myTransformer = (value, options, context) => {
          expect(value).to.be.eq('input');
          expect(options).to.be.eql({
            option1: 'value1',
            option2: 'value2',
          });
          expect(context).to.be.eql({
            transformerName: 'myTransformer',
            modelName: 'model',
            propName: 'foo',
          });
          return 'transformed';
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              transform: {
                myTransformer: {
                  option1: 'value1',
                  option2: 'value2',
                },
              },
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {foo: 'input'});
        expect(res).to.be.eql({foo: 'transformed'});
      });

      it('does not transform a property value if it is not provided', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {});
        expect(res).to.be.eql({});
      });

      it('transforms undefined and null values', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res1 = T.transform('model', {foo: undefined});
        const res2 = T.transform('model', {foo: null});
        expect(res1).to.be.eql({foo: undefined});
        expect(res2).to.be.eql({foo: null});
      });

      it('the parameter "isPartial" prevents to transform values of not provided properties', function () {
        const schema = new Schema();
        const myTransformer = () => 'transformed';
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer', myTransformer);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: {
                myTransformer: true,
              },
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const res = T.transform('model', {}, true);
        expect(res).to.be.eql({});
      });

      it('transforms the property value by its asynchronous transformers', async function () {
        const schema = new Schema();
        const myTransformer1 = (value, options) => {
          expect(options).to.be.eq('foo');
          return Promise.resolve(`${value}2`);
        };
        const myTransformer2 = (value, options) => {
          expect(options).to.be.eq('bar');
          return Promise.resolve(`${value}3`);
        };
        const myTransformer3 = (value, options) => {
          expect(options).to.be.eq('baz');
          return Promise.resolve(`${value}4`);
        };
        schema
          .getService(PropertyTransformerRegistry)
          .addTransformer('myTransformer1', myTransformer1)
          .addTransformer('myTransformer2', myTransformer2)
          .addTransformer('myTransformer3', myTransformer3);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              transform: {
                myTransformer1: 'foo',
                myTransformer2: 'bar',
              },
            },
            bar: {
              type: DataType.STRING,
              transform: {
                myTransformer2: 'bar',
                myTransformer3: 'baz',
              },
            },
          },
        });
        const T = schema.getService(ModelDataTransformer);
        const promise = T.transform('model', {foo: '1', bar: '2'});
        expect(promise).to.be.instanceof(Promise);
        const res = await promise;
        expect(res).to.be.eql({foo: '123', bar: '234'});
      });
    });

    it('the option "transform" requires a non-empty String, an Array or an Object', function () {
      const schema = new Schema();
      schema
        .getService(PropertyTransformerRegistry)
        .addTransformer('myTransformer', () => 'transformed');
      schema.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.ANY,
            transform: undefined,
          },
        },
      });
      const T = schema.getService(ModelDataTransformer);
      const throwable = v => () => {
        const models = schema.getService(DefinitionRegistry)['_models'];
        models.model.properties.foo.transform = v;
        T.transform('model', {foo: 'bar'});
      };
      const error = v =>
        format(
          'The provided option "transform" of the property "foo" in the model "model" ' +
            'should be a non-empty String, an Array of String or an Object, ' +
            'but %s given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      throwable('myTransformer')();
      throwable(['myTransformer'])();
      throwable([])();
      throwable({myTransformer: true})();
      throwable({})();
    });
  });
});
