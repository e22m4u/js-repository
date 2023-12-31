import {expect} from 'chai';
import {Schema} from '../../schema.js';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {ModelDataValidator} from './model-data-validator.js';

describe('ModelDataValidator', function () {
  describe('validate', function () {
    it('does not throw an error if a model does not have a property of a given data', function () {
      const schema = new Schema();
      schema.defineModel({name: 'model'});
      schema.getService(ModelDataValidator).validate('model', {foo: 'bar'});
    });

    it('throws an error if a given data is not a pure object', function () {
      const throwable = modelData => {
        const schema = new Schema();
        schema.defineModel({
          name: 'model',
          datasource: 'datasource',
        });
        return () =>
          schema.getService(ModelDataValidator).validate('model', modelData);
      };
      const error = given =>
        format(
          'The data of the model "model" should be an Object, but %s given.',
          given,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable(undefined)).to.throw(error('undefined'));
    });

    it('uses a base model hierarchy to validate a given data', function () {
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
      const throwable = () =>
        schema.getService(ModelDataValidator).validate('modelB', {foo: 10});
      expect(throwable).to.throw(
        'The property "foo" of the model "modelB" must ' +
          'have a String, but Number given.',
      );
    });

    it('throws an error if a given data does not have a required property', function () {
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
      const throwable = () =>
        schema.getService(ModelDataValidator).validate('model', {});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" ' +
          'is required, but undefined given.',
      );
    });

    it('throws an error if a required property is undefined', function () {
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
      const throwable = () =>
        schema
          .getService(ModelDataValidator)
          .validate('model', {foo: undefined});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" is required, but undefined given.',
      );
    });

    it('throws an error if a required property is null', function () {
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
      const throwable = () =>
        schema.getService(ModelDataValidator).validate('model', {foo: null});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" is required, but null given.',
      );
    });

    describe('an option "isPartial" is true', function () {
      it('does not throw an error if a given data does not have a required property', function () {
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
        schema.getService(ModelDataValidator).validate('model', {}, true);
      });

      it('throws an error if a required property is undefined', function () {
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
        const throwable = () =>
          schema
            .getService(ModelDataValidator)
            .validate('model', {foo: undefined}, true);
        expect(throwable).to.throw(
          'The property "foo" of the model "model" ' +
            'is required, but undefined given.',
        );
      });

      it('throws an error if a required property is null', function () {
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
        const throwable = () =>
          schema
            .getService(ModelDataValidator)
            .validate('model', {foo: null}, true);
        expect(throwable).to.throw(
          'The property "foo" of the model "model" is required, but null given.',
        );
      });
    });

    describe('DataType.ANY', function () {
      describe('ShortPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('does not throw an error if a string given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'bar',
          });
        });

        it('does not throw an error if a number given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 10,
          });
        });

        it('does not throw an error if true given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: true,
          });
        });

        it('does not throw an error if false given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: false,
          });
        });

        it('does not throw an error if an array given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: [],
          });
        });

        it('does not throw an error if an object given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ANY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: {},
          });
        });
      });

      describe('FullPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('does not throw an error if a string given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: 'bar',
          });
        });

        it('does not throw an error if a number given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: 10,
          });
        });

        it('does not throw an error if true given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: true,
          });
        });

        it('does not throw an error if false given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: false,
          });
        });

        it('does not throw an error if an array given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: [],
          });
        });

        it('does not throw an error if an object given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: {},
          });
        });
      });
    });

    describe('DataType.STRING', function () {
      describe('ShortPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('does not throw an error if a string given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'bar',
          });
        });

        it('throws an error if a number given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Number given.',
          );
        });

        it('throws an error if true given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Boolean given.',
          );
        });

        it('throws an error if an array given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Array given.',
          );
        });

        it('throws an error if an object given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.STRING,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Object given.',
          );
        });
      });

      describe('FullPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('does not throw an error if a string given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: 'bar',
          });
        });

        it('throws an error if a number given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Number given.',
          );
        });

        it('throws an error if true given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Boolean given.',
          );
        });

        it('throws an error if an array given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Array given.',
          );
        });

        it('throws an error if an object given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a String, but Object given.',
          );
        });
      });
    });

    describe('DataType.NUMBER', function () {
      describe('ShortPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but String given.',
          );
        });

        it('does not throw an error if a number given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 10,
          });
        });

        it('throws an error if true given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Boolean given.',
          );
        });

        it('throws an error if an array given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Array given.',
          );
        });

        it('throws an error if an object given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.NUMBER,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Object given.',
          );
        });
      });

      describe('FullPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but String given.',
          );
        });

        it('does not throw an error if a number given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: 10,
          });
        });

        it('throws an error if true given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Boolean given.',
          );
        });

        it('throws an error if an array given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Array given.',
          );
        });

        it('throws an error if an object given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Number, but Object given.',
          );
        });
      });
    });

    describe('DataType.BOOLEAN', function () {
      describe('ShortPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but String given.',
          );
        });

        it('throws an error if a number given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but Number given.',
          );
        });

        it('does not throw an error if true given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: true,
          });
        });

        it('does not throw an error if false given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: false,
          });
        });

        it('throws an error if an array given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but Array given.',
          );
        });

        it('throws an error if an object given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.BOOLEAN,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but Object given.',
          );
        });
      });

      describe('FullPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but String given.',
          );
        });

        it('throws an error if a number given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but Number given.',
          );
        });

        it('does not throw an error if true given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: true,
          });
        });

        it('does not throw an error if false given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: false,
          });
        });

        it('throws an error if an array given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but Array given.',
          );
        });

        it('throws an error if an object given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'a Boolean, but Object given.',
          );
        });
      });
    });

    describe('DataType.ARRAY', function () {
      describe('ShortPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but String given.',
          );
        });

        it('throws an error if a number given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Number given.',
          );
        });

        it('throws an error if true given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Boolean given.',
          );
        });

        it('does not throw an error if an array given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: [],
          });
        });

        it('throws an error if an object given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.ARRAY,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Object given.',
          );
        });
      });

      describe('FullPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but String given.',
          );
        });

        it('throws an error if a number given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Number given.',
          );
        });

        it('throws an error if true given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Boolean given.',
          );
        });

        it('does not throw an error if an array given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: [],
          });
        });

        it('throws an error if an object given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Array, but Object given.',
          );
        });

        describe('the "model" option', function () {
          it('throws an error when the given object element has an invalid model', function () {
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
            const throwable = () =>
              S.getService(ModelDataValidator).validate('modelB', {
                bar: [{foo: 10}],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "modelA" must have ' +
                'a String, but Number given.',
            );
          });

          it('does not throw an error when the given object element has a valid model', function () {
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
            S.getService(ModelDataValidator).validate('modelB', {
              bar: [{foo: '10'}],
            });
          });
        });
      });
    });

    describe('DataType.OBJECT', function () {
      describe('ShortPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but String given.',
          );
        });

        it('throws an error if a number given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Number given.',
          );
        });

        it('throws an error if true given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Boolean given.',
          );
        });

        it('throws an error if an array given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Array given.',
          );
        });

        it('does not throw an error if an object given', function () {
          const S = new Schema();
          S.defineModel({
            name: 'model',
            datasource: 'datasource',
            properties: {
              foo: DataType.OBJECT,
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: {},
          });
        });
      });

      describe('FullPropertyDefinition', function () {
        it('does not throw an error if an undefined given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: undefined,
          });
        });

        it('does not throw an error if a null given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: null,
          });
        });

        it('throws an error if a string given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but String given.',
          );
        });

        it('throws an error if a number given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Number given.',
          );
        });

        it('throws an error if true given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Boolean given.',
          );
        });

        it('throws an error if false given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Boolean given.',
          );
        });

        it('throws an error if an array given', function () {
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
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          expect(throwable).to.throw(
            'The property "foo" of the model "model" must have ' +
              'an Object, but Array given.',
          );
        });

        it('does not throw an error if an object given', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: {},
          });
        });

        describe('the "model" option', function () {
          it('throws an error when the given object has an invalid model', function () {
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
            const throwable = () =>
              S.getService(ModelDataValidator).validate('modelB', {
                bar: {foo: 10},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "modelA" must have ' +
                'a String, but Number given.',
            );
          });

          it('does not throw an error when the given object has a valid model', function () {
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
            S.getService(ModelDataValidator).validate('modelB', {
              bar: {foo: '10'},
            });
          });
        });
      });
    });
  });
});
