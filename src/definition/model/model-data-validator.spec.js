import {expect} from 'chai';
import {Schema} from '../../schema.js';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {EmptyValuesDefiner} from './properties/index.js';
import {ModelDataValidator} from './model-data-validator.js';
import {DefinitionRegistry} from '../definition-registry.js';
import {PropertyValidatorRegistry} from './properties/index.js';

describe('ModelDataValidator', function () {
  describe('validate', function () {
    it('does not throw an error if a model does not have a property of a given data', function () {
      const schema = new Schema();
      schema.defineModel({name: 'model'});
      schema.getService(ModelDataValidator).validate('model', {foo: 'bar'});
    });

    it('throws an error if a given data is not a pure object', function () {
      const throwable = modelData => () => {
        const schema = new Schema();
        schema.defineModel({
          name: 'model',
          datasource: 'datasource',
        });
        schema.getService(ModelDataValidator).validate('model', modelData);
      };
      const error = v =>
        format(
          'The data of the model "model" should be an Object, but %s given.',
          v,
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

    it('throws an error if a required property has an empty value', function () {
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
      schema
        .getService(EmptyValuesDefiner)
        .setEmptyValuesOf(DataType.STRING, ['empty']);
      const throwable = () =>
        schema.getService(ModelDataValidator).validate('model', {foo: 'empty'});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" ' +
          'is required, but "empty" given.',
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

      it('throws an error if a required property has an empty value', function () {
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
        schema
          .getService(EmptyValuesDefiner)
          .setEmptyValuesOf(DataType.STRING, [5]);
        const throwable = () =>
          schema
            .getService(ModelDataValidator)
            .validate('model', {foo: 5}, true);
        expect(throwable).to.throw(
          'The property "foo" of the model "model" is required, but 5 given.',
        );
      });
    });

    describe('validate by property type', function () {
      it('skips validation for an empty value', function () {
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
        S.getService(EmptyValuesDefiner).setEmptyValuesOf(DataType.STRING, [5]);
        S.getService(ModelDataValidator).validate('model', {foo: 5});
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

          describe('the "itemModel" option', function () {
            it('does not throw an error if the option "itemModel" is not specified in case of Object item type', function () {
              const S = new Schema();
              S.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ARRAY,
                    itemType: DataType.OBJECT,
                  },
                },
              });
              const value = {foo: [{a: 1}, {b: 2}]};
              S.getService(ModelDataValidator).validate('model', value);
            });

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
                    itemModel: 'modelA',
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
                    itemModel: 'modelA',
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

    describe('validate by property validators', function () {
      it('skips validation for an empty value', function () {
        const S = new Schema();
        S.getService(PropertyValidatorRegistry).addValidator(
          'myValidator',
          () => false,
        );
        S.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              validate: 'myValidator',
            },
          },
        });
        S.getService(EmptyValuesDefiner).setEmptyValuesOf(DataType.STRING, [5]);
        S.getService(ModelDataValidator).validate('model', {foo: 5});
      });

      describe('the option "validate" with the string value', function () {
        it('does not validate a property value if it is not provided', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const validator = S.getService(ModelDataValidator);
          validator.validate('model', {});
        });

        it('does not validate undefined and null values', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const validator = S.getService(ModelDataValidator);
          validator.validate('model', {foo: undefined});
          validator.validate('model', {foo: null});
        });

        it('throws an error from the validator', function () {
          const myValidator = function () {
            throw Error('My error');
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw('My error');
        });

        it('allows the given value if the validator returns true', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => true,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('throws an error if the validator returns a promise', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => Promise.resolve(true),
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'Asynchronous property validators are not supported, ' +
              'but the property validator "myValidator" returns a Promise.',
          );
        });

        it('throws an error for non-true result from the validator', function () {
          const testFn = v => {
            const S = new Schema();
            S.getService(PropertyValidatorRegistry).addValidator(
              'myValidator',
              () => v,
            );
            S.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: 'myValidator',
                },
              },
            });
            const throwable = () =>
              S.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" has an invalid value "test" ' +
                'that caught by the validator "myValidator".',
            );
          };
          testFn('str');
          testFn('');
          testFn(10);
          testFn(0);
          testFn(false);
          testFn(undefined);
          testFn(null);
          testFn({});
          testFn([]);
          testFn(() => undefined);
        });

        it('passes arguments to the validator', function () {
          let validated = false;
          const S = new Schema();
          const myValidator = function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              validatorName: 'myValidator',
              modelName: 'model',
              propName: 'foo',
            });
            validated = true;
            return true;
          };
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('invokes the validator only once per value', function () {
          let invoked = 0;
          const myValidator = function () {
            invoked++;
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invoked).to.be.eq(1);
        });
      });

      describe('the option "validate" with an array value', function () {
        it('does nothing for an empty array validators', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('does not validate a property value if it is not provided', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator'],
              },
            },
          });
          const validator = S.getService(ModelDataValidator);
          validator.validate('model', {});
        });

        it('does not validate undefined and null values', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator'],
              },
            },
          });
          const validator = S.getService(ModelDataValidator);
          validator.validate('model', {foo: undefined});
          validator.validate('model', {foo: null});
        });

        it('throws an error from the validator', function () {
          const myValidator = function () {
            throw Error('My error');
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator'],
              },
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw('My error');
        });

        it('allows the given value if validators returns true', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('myValidator1', () => true)
            .addValidator('myValidator2', () => true);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator1', 'myValidator2'],
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('throws an error if the validator returns a promise', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => Promise.resolve(true),
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator'],
              },
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'Asynchronous property validators are not supported, ' +
              'but the property validator "myValidator" returns a Promise.',
          );
        });

        it('throws an error by non-true result from one of validators', function () {
          const testFn = v => {
            const S = new Schema();
            S.getService(PropertyValidatorRegistry)
              .addValidator('myValidator1', () => true)
              .addValidator('myValidator2', () => v);
            S.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const throwable = () =>
              S.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" has an invalid value "test" ' +
                'that caught by the validator "myValidator2".',
            );
          };
          testFn('str');
          testFn('');
          testFn(10);
          testFn(0);
          testFn(false);
          testFn(undefined);
          testFn(null);
          testFn({});
          testFn([]);
          testFn(() => undefined);
        });

        it('passes arguments to the validator', function () {
          let validated = false;
          const S = new Schema();
          const myValidator = function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              validatorName: 'myValidator',
              modelName: 'model',
              propName: 'foo',
            });
            validated = true;
            return true;
          };
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator'],
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('invokes validators by the given order', function () {
          const invocation = [];
          const validator1 = function () {
            invocation.push('myValidator1');
            return true;
          };
          const validator2 = function () {
            invocation.push('myValidator2');
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('myValidator1', validator1)
            .addValidator('myValidator2', validator2);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: ['myValidator1', 'myValidator2'],
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invocation).to.be.eql(['myValidator1', 'myValidator2']);
        });
      });

      describe('the option "validate" with an object value', function () {
        it('does nothing for an empty validators object', function () {
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
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('does not validate a property value if it is not provided', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator: true,
                },
              },
            },
          });
          const validator = S.getService(ModelDataValidator);
          validator.validate('model', {});
        });

        it('does not validate undefined and null values', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => false,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator: true,
                },
              },
            },
          });
          const validator = S.getService(ModelDataValidator);
          validator.validate('model', {foo: undefined});
          validator.validate('model', {foo: null});
        });

        it('throws an error from the validator', function () {
          const myValidator = function () {
            throw Error('My error');
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator: true,
                },
              },
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw('My error');
        });

        it('allows the given value if validators returns true', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('myValidator1', () => true)
            .addValidator('myValidator2', () => true);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator1: true,
                  myValidator2: true,
                },
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('throws an error if the validator returns a promise', function () {
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            () => Promise.resolve(true),
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator: true,
                },
              },
            },
          });
          const throwable = () =>
            S.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'Asynchronous property validators are not supported, ' +
              'but the property validator "myValidator" returns a Promise.',
          );
        });

        it('throws an error by non-true result from one of validators', function () {
          const testFn = v => {
            const S = new Schema();
            S.getService(PropertyValidatorRegistry)
              .addValidator('myValidator1', () => true)
              .addValidator('myValidator2', () => v);
            S.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: {
                    myValidator1: true,
                    myValidator2: true,
                  },
                },
              },
            });
            const throwable = () =>
              S.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" has an invalid value "test" ' +
                'that caught by the validator "myValidator2".',
            );
          };
          testFn('str');
          testFn('');
          testFn(10);
          testFn(0);
          testFn(false);
          testFn(undefined);
          testFn(null);
          testFn({});
          testFn([]);
          testFn(() => undefined);
        });

        it('passes arguments to the validator', function () {
          let validated = false;
          const S = new Schema();
          const myValidator = function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.eql({
              option1: 'value1',
              option2: 'value2',
            });
            expect(context).to.be.eql({
              validatorName: 'myValidator',
              modelName: 'model',
              propName: 'foo',
            });
            validated = true;
            return true;
          };
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator: {
                    option1: 'value1',
                    option2: 'value2',
                  },
                },
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });

        it('invokes validators by the given order', function () {
          const invocation = [];
          const validator1 = function () {
            invocation.push('myValidator1');
            return true;
          };
          const validator2 = function () {
            invocation.push('myValidator2');
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry)
            .addValidator('myValidator1', validator1)
            .addValidator('myValidator2', validator2);
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator1: true,
                  myValidator2: true,
                },
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invocation).to.be.eql(['myValidator1', 'myValidator2']);
        });

        it('validates even the validator options is false', function () {
          let validated = false;
          const myValidator = function () {
            validated = true;
            return true;
          };
          const S = new Schema();
          S.getService(PropertyValidatorRegistry).addValidator(
            'myValidator',
            myValidator,
          );
          S.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator: false,
                },
              },
            },
          });
          S.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(validated).to.be.true;
        });
      });

      it('the option "validate" requires a non-empty String, an Array or an Object', function () {
        const schema = new Schema();
        schema
          .getService(PropertyValidatorRegistry)
          .addValidator('myValidator', () => true);
        schema.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.ANY,
              validate: undefined,
            },
          },
        });
        const V = schema.getService(ModelDataValidator);
        const throwable = v => () => {
          const models = schema.getService(DefinitionRegistry)['_models'];
          models.model.properties.foo.validate = v;
          V.validate('model', {foo: 'bar'});
        };
        const error = v =>
          format(
            'The provided option "validate" of the property "foo" in the model "model" ' +
              'should be a non-empty String, an Array of String or an Object, ' +
              'but %s given.',
            v,
          );
        expect(throwable('')).to.throw(error('""'));
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(0)).to.throw(error('0'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        throwable('myValidator')();
        throwable(['myValidator'])();
        throwable([])();
        throwable({myValidator: true})();
        throwable({})();
      });
    });
  });
});
