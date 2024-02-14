import {expect} from 'chai';
import {Schema} from '../../schema.js';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {ModelDataValidator} from './model-data-validator.js';
import {PropertyValidatorRegistry} from './properties/index.js';

describe('ModelDataValidator', function () {
  describe('validate', function () {
    it('does not throw an error if a model does not have a property of a given data', async function () {
      const schema = new Schema();
      schema.defineModel({name: 'model'});
      await schema
        .getService(ModelDataValidator)
        .validate('model', {foo: 'bar'});
    });

    it('throws an error if a given data is not a pure object', async function () {
      const throwable = modelData => {
        const schema = new Schema();
        schema.defineModel({
          name: 'model',
          datasource: 'datasource',
        });
        return schema
          .getService(ModelDataValidator)
          .validate('model', modelData);
      };
      const error = given =>
        format(
          'The data of the model "model" should be an Object, but %s given.',
          given,
        );
      await expect(throwable('str')).to.be.rejectedWith(error('"str"'));
      await expect(throwable(10)).to.be.rejectedWith(error('10'));
      await expect(throwable(true)).to.be.rejectedWith(error('true'));
      await expect(throwable(false)).to.be.rejectedWith(error('false'));
      await expect(throwable([])).to.be.rejectedWith(error('Array'));
      await expect(throwable(null)).to.be.rejectedWith(error('null'));
      await expect(throwable(undefined)).to.be.rejectedWith(error('undefined'));
    });

    it('uses a base model hierarchy to validate a given data', async function () {
      const schema = new Schema();
      schema.defineModel({
        name: 'modelA',
        properties: {
          foo: DataType.STRING,
        },
      });
      schema.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const promise = schema
        .getService(ModelDataValidator)
        .validate('modelB', {foo: 10});
      await expect(promise).to.be.rejectedWith(
        'The property "foo" of the model "modelB" must ' +
          'have a String, but Number given.',
      );
    });

    it('throws an error if a given data does not have a required property', async function () {
      const schema = new Schema();
      schema.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const promise = schema
        .getService(ModelDataValidator)
        .validate('model', {});
      await expect(promise).to.be.rejectedWith(
        'The property "foo" of the model "model" ' +
          'is required, but undefined given.',
      );
    });

    it('throws an error if a required property is undefined', async function () {
      const schema = new Schema();
      schema.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const promise = schema
        .getService(ModelDataValidator)
        .validate('model', {foo: undefined});
      await expect(promise).to.be.rejectedWith(
        'The property "foo" of the model "model" is required, but undefined given.',
      );
    });

    it('throws an error if a required property is null', async function () {
      const schema = new Schema();
      schema.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const promise = schema
        .getService(ModelDataValidator)
        .validate('model', {foo: null});
      await expect(promise).to.be.rejectedWith(
        'The property "foo" of the model "model" is required, but null given.',
      );
    });

    describe('an option "isPartial" is true', function () {
      it('does not throw an error if a given data does not have a required property', async function () {
        const schema = new Schema();
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        await schema.getService(ModelDataValidator).validate('model', {}, true);
      });

      it('throws an error if a required property is undefined', async function () {
        const schema = new Schema();
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        const promise = schema
          .getService(ModelDataValidator)
          .validate('model', {foo: undefined}, true);
        await expect(promise).to.be.rejectedWith(
          'The property "foo" of the model "model" ' +
            'is required, but undefined given.',
        );
      });

      it('throws an error if a required property is null', async function () {
        const schema = new Schema();
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        const promise = schema
          .getService(ModelDataValidator)
          .validate('model', {foo: null}, true);
        await expect(promise).to.be.rejectedWith(
          'The property "foo" of the model "model" is required, but null given.',
        );
      });
    });

    describe('validate by property type', function () {
      describe('DataType.ANY', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('does not throw an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('does not throw an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('does not throw an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('does not throw an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('does not throw an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('does not throw an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('does not throw an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('does not throw an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });
        });
      });

      describe('DataType.STRING', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Number given.',
            );
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean given.',
            );
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Array given.',
            );
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Object given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Number given.',
            );
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean given.',
            );
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Array given.',
            );
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a String, but Object given.',
            );
          });
        });
      });

      describe('DataType.NUMBER', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but String given.',
            );
          });

          it('does not throw an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean given.',
            );
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Array given.',
            );
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Object given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but String given.',
            );
          });

          it('does not throw an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean given.',
            );
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Array given.',
            );
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Object given.',
            );
          });
        });
      });

      describe('DataType.BOOLEAN', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but String given.',
            );
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Number given.',
            );
          });

          it('does not throw an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Array given.',
            );
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Object given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but String given.',
            );
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Number given.',
            );
          });

          it('does not throw an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Array given.',
            );
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Object given.',
            );
          });
        });
      });

      describe('DataType.ARRAY', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but String given.',
            );
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Number given.',
            );
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean given.',
            );
          });

          it('does not throw an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Object given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but String given.',
            );
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Number given.',
            );
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean given.',
            );
          });

          it('does not throw an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('throws an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Object given.',
            );
          });

          describe('the "model" option', function () {
            it('throws an error when the given object element has an invalid model', async function () {
              const S = new Schema();
              S.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              S.defineModel({
                name: 'modelB',
                datasource: 'datasource',
                properties: {
                  bar: {
                    type: DataType.ARRAY,
                    itemType: DataType.OBJECT,
                    model: 'modelA',
                  },
                },
              });
              const promise = S.getService(ModelDataValidator).validate(
                'modelB',
                {
                  bar: [{foo: 10}],
                },
              );
              await expect(promise).to.be.rejectedWith(
                'The property "foo" of the model "modelA" must have ' +
                  'a String, but Number given.',
              );
            });

            it('does not throw an error when the given object element has a valid model', async function () {
              const S = new Schema();
              S.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              S.defineModel({
                name: 'modelB',
                datasource: 'datasource',
                properties: {
                  bar: {
                    type: DataType.ARRAY,
                    itemType: DataType.OBJECT,
                    model: 'modelA',
                  },
                },
              });
              await S.getService(ModelDataValidator).validate('modelB', {
                bar: [{foo: '10'}],
              });
            });
          });
        });
      });

      describe('DataType.OBJECT', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but String given.',
            );
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Number given.',
            );
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean given.',
            );
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Array given.',
            );
          });

          it('does not throw an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but String given.',
            );
          });

          it('throws an error if a number given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Number given.',
            );
          });

          it('throws an error if true given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean given.',
            );
          });

          it('throws an error if false given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean given.',
            );
          });

          it('throws an error if an array given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
            await expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Array given.',
            );
          });

          it('does not throw an error if an object given', async function () {
            const S = new Schema();
            S.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            await S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });

          describe('the "model" option', function () {
            it('throws an error when the given object has an invalid model', async function () {
              const S = new Schema();
              S.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              S.defineModel({
                name: 'modelB',
                datasource: 'datasource',
                properties: {
                  bar: {
                    type: DataType.OBJECT,
                    model: 'modelA',
                  },
                },
              });
              const promise = S.getService(ModelDataValidator).validate(
                'modelB',
                {
                  bar: {foo: 10},
                },
              );
              await expect(promise).to.be.rejectedWith(
                'The property "foo" of the model "modelA" must have ' +
                  'a String, but Number given.',
              );
            });

            it('does not throw an error when the given object has a valid model', async function () {
              const S = new Schema();
              S.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              S.defineModel({
                name: 'modelB',
                datasource: 'datasource',
                properties: {
                  bar: {
                    type: DataType.OBJECT,
                    model: 'modelA',
                  },
                },
              });
              await S.getService(ModelDataValidator).validate('modelB', {
                bar: {foo: '10'},
              });
            });
          });
        });
      });
    });

    describe('validate by property validators', function () {
      describe('the option "validate" with the string value', function () {
        it('do not validate null and undefined values', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
              bar: {
                type: DataType.ANY,
                validate: 'validator',
              },
              baz: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: null,
            bar: undefined,
          });
        });

        it('throws an error from the validator', async function () {
          const validator = function () {
            throw Error('My error');
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          const promise = S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          await expect(promise).to.be.rejectedWith('My error');
        });

        it('allows the given value if the validator returns true', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            () => true,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('allows the given value if the validator returns a promise of true', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            () => Promise.resolve(true),
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('throws an error for non-true result from the validator', async function () {
          const testFn = async v => {
            const S = new Schema();
            S.getService(PropertyValidatorRegistry).addValidator(
              'validator',
              () => v,
            );
            S.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: 'validator',
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            return expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" has an invalid value "test" ' +
                'that caught by the validator "validator".',
            );
          };
          await testFn('str');
          await testFn('');
          await testFn(10);
          await testFn(0);
          await testFn(false);
          await testFn(undefined);
          await testFn(null);
          await testFn({});
          await testFn([]);
          await testFn(() => undefined);
        });

        it('passes arguments to the validator', async function () {
          let validated = false;
          const S = new Schema();
          const validator = function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              validatorName: 'validator',
              modelName: 'model',
              propName: 'foo',
              propDef: {
                type: DataType.ANY,
                validate: 'validator',
              },
              container: S.container,
            });
            validated = true;
            return true;
          };
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('invokes the validator only once per value', async function () {
          let invoked = 0;
          const validator = function () {
            invoked++;
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invoked).to.be.eq(1);
        });

        it('waits rejection from an async validator', async function () {
          const error = new Error('My error');
          const validator = function () {
            return new Promise((resolve, reject) => {
              setTimeout(() => reject(error), 5);
            });
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'validator',
              },
            },
          });
          const promise = S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          await expect(promise).to.be.rejectedWith(error);
        });
      });

      describe('the option "validate" with an array value', function () {
        it('does nothing for an empty array validators', async function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: [],
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('do not validate null and undefined values', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator'],
              },
              bar: {
                type: DataType.ANY,
                validate: ['validator'],
              },
              baz: {
                type: DataType.ANY,
                validate: ['validator'],
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: null,
            bar: undefined,
          });
        });

        it('throws an error from the validator', async function () {
          const validator = function () {
            throw Error('My error');
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator'],
              },
            },
          });
          const promise = S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          await expect(promise).to.be.rejectedWith('My error');
        });

        it('allows the given value if validators returns true', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', () => true)
            .addValidator('validator2', () => true);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator1', 'validator2'],
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('allows the given value if validators returns a promise of true', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', () => Promise.resolve(true))
            .addValidator('validator2', () => Promise.resolve(true));
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator1', 'validator2'],
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('throws an error by non-true result from one of validators', async function () {
          const testFn = v => {
            const S = new Schema();
            S.getService(PropertyValidatorRegistry)
              .addValidator('validator1', () => true)
              .addValidator('validator2', () => v);
            S.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['validator1', 'validator2'],
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            return expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" has an invalid value "test" ' +
                'that caught by the validator "validator2".',
            );
          };
          await testFn('str');
          await testFn('');
          await testFn(10);
          await testFn(0);
          await testFn(false);
          await testFn(undefined);
          await testFn(null);
          await testFn({});
          await testFn([]);
          await testFn(() => undefined);
        });

        it('passes arguments to the validator', async function () {
          let validated = false;
          const S = new Schema();
          const validator = function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              validatorName: 'validator',
              modelName: 'model',
              propName: 'foo',
              propDef: {
                type: DataType.ANY,
                validate: ['validator'],
              },
              container: S.container,
            });
            validated = true;
            return true;
          };
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator'],
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('invokes validators by the given order', async function () {
          const invocation = [];
          const validator1 = function () {
            invocation.push('validator1');
            return true;
          };
          const validator2 = function () {
            invocation.push('validator2');
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', validator1)
            .addValidator('validator2', validator2);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator1', 'validator2'],
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invocation).to.be.eql(['validator1', 'validator2']);
        });

        it('waits rejection from one of async validators', async function () {
          const error1 = new Error('Occurs after 15 ms');
          const error2 = new Error('Occurs after 5 ms');
          const validator1 = () =>
            new Promise((res, rej) => {
              setTimeout(() => rej(error1), 15);
            });
          const validator2 = () =>
            new Promise((res, rej) => {
              setTimeout(() => rej(error2), 5);
            });
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', validator1)
            .addValidator('validator2', validator2);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['validator1', 'validator2'],
              },
            },
          });
          const promise = S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          await expect(promise).to.be.rejectedWith(error2);
        });
      });

      describe('the option "validate" with an object value', function () {
        it('does nothing for an empty validators object', async function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {},
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('do not validate null and undefined values', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator: true,
                },
              },
              bar: {
                type: DataType.ANY,
                validate: {
                  validator: true,
                },
              },
              baz: {
                type: DataType.ANY,
                validate: {
                  validator: true,
                },
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: null,
            bar: undefined,
          });
        });

        it('throws an error from the validator', async function () {
          const validator = function () {
            throw Error('My error');
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator: true,
                },
              },
            },
          });
          const promise = S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          await expect(promise).to.be.rejectedWith('My error');
        });

        it('allows the given value if validators returns true', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', () => true)
            .addValidator('validator2', () => true);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator1: true,
                  validator2: true,
                },
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('allows the given value if validators returns a promise of true', async function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', () => Promise.resolve(true))
            .addValidator('validator2', () => Promise.resolve(true));
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator1: true,
                  validator2: true,
                },
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('throws an error by non-true result from one of validators', async function () {
          const testFn = v => {
            const S = new Schema();
            S.getService(PropertyValidatorRegistry)
              .addValidator('validator1', () => true)
              .addValidator('validator2', () => v);
            S.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: {
                    validator1: true,
                    validator2: true,
                  },
                },
              },
            });
            const promise = S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            return expect(promise).to.be.rejectedWith(
              'The property "foo" of the model "model" has an invalid value "test" ' +
                'that caught by the validator "validator2".',
            );
          };
          await testFn('str');
          await testFn('');
          await testFn(10);
          await testFn(0);
          await testFn(false);
          await testFn(undefined);
          await testFn(null);
          await testFn({});
          await testFn([]);
          await testFn(() => undefined);
        });

        it('passes arguments to the validator', async function () {
          let validated = false;
          const S = new Schema();
          const validator = function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.eql({
              option1: 'value1',
              option2: 'value2',
            });
            expect(context).to.be.eql({
              validatorName: 'validator',
              modelName: 'model',
              propName: 'foo',
              propDef: {
                type: DataType.ANY,
                validate: {
                  validator: {
                    option1: 'value1',
                    option2: 'value2',
                  },
                },
              },
              container: S.container,
            });
            validated = true;
            return true;
          };
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator: {
                    option1: 'value1',
                    option2: 'value2',
                  },
                },
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('invokes validators by the given order', async function () {
          const invocation = [];
          const validator1 = function () {
            invocation.push('validator1');
            return true;
          };
          const validator2 = function () {
            invocation.push('validator2');
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', validator1)
            .addValidator('validator2', validator2);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator1: true,
                  validator2: true,
                },
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invocation).to.be.eql(['validator1', 'validator2']);
        });

        it('validates even the validator options is false', async function () {
          let validated = false;
          const validator = function () {
            validated = true;
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'validator',
            validator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator: false,
                },
              },
            },
          });
          await S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('waits rejection from one of async validators', async function () {
          const error1 = new Error('Occurs after 15 ms');
          const error2 = new Error('Occurs after 5 ms');
          const validator1 = () =>
            new Promise((res, rej) => {
              setTimeout(() => rej(error1), 15);
            });
          const validator2 = () =>
            new Promise((res, rej) => {
              setTimeout(() => rej(error2), 5);
            });
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('validator1', validator1)
            .addValidator('validator2', validator2);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  validator1: true,
                  validator2: true,
                },
              },
            },
          });
          const promise = S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          await expect(promise).to.be.rejectedWith(error2);
        });
      });
    });
  });
});
