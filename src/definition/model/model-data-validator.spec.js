import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from './properties/index.js';
import {DatabaseSchema} from '../../database-schema.js';
import {EmptyValuesService} from '@e22m4u/js-empty-values';
import {ModelDataValidator} from './model-data-validator.js';
import {DefinitionRegistry} from '../definition-registry.js';
import {PropertyValidatorRegistry} from './properties/index.js';

describe('ModelDataValidator', function () {
  describe('validate', function () {
    it('does not throw an error if a model does not have a property of a given data', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({name: 'model'});
      dbs.getService(ModelDataValidator).validate('model', {foo: 'bar'});
    });

    it('throws an error if a given data is not a pure object', function () {
      const throwable = modelData => () => {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          datasource: 'datasource',
        });
        dbs.getService(ModelDataValidator).validate('model', modelData);
      };
      const error = v =>
        format(
          'The data of the model "model" should be an Object, but %s was given.',
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
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        properties: {
          foo: DataType.STRING,
        },
      });
      dbs.defineModel({
        name: 'modelB',
        base: 'modelA',
      });
      const throwable = () =>
        dbs.getService(ModelDataValidator).validate('modelB', {foo: 10});
      expect(throwable).to.throw(
        'The property "foo" of the model "modelB" must ' +
          'have a String, but Number was given.',
      );
    });

    it('throws an error if a given data does not have a required property', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const throwable = () =>
        dbs.getService(ModelDataValidator).validate('model', {});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" ' +
          'is required, but undefined was given.',
      );
    });

    it('throws an error if a required property is undefined', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const throwable = () =>
        dbs.getService(ModelDataValidator).validate('model', {foo: undefined});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" is required, but undefined was given.',
      );
    });

    it('throws an error if a required property is null', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      const throwable = () =>
        dbs.getService(ModelDataValidator).validate('model', {foo: null});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" is required, but null was given.',
      );
    });

    it('throws an error if a required property has an empty value', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
      dbs
        .getService(EmptyValuesService)
        .setEmptyValuesOf(DataType.STRING, ['empty']);
      const throwable = () =>
        dbs.getService(ModelDataValidator).validate('model', {foo: 'empty'});
      expect(throwable).to.throw(
        'The property "foo" of the model "model" ' +
          'is required, but "empty" was given.',
      );
    });

    it('should validate property type before passing value through property validators', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'model',
        properties: {
          foo: {
            type: DataType.STRING,
            validate: () => false,
          },
        },
      });
      const typeCheckFail = () =>
        dbs.getService(ModelDataValidator).validate('model', {foo: 10});
      expect(typeCheckFail).to.throw(
        'The property "foo" of the model "model" must have ' +
          'a String, but Number was given.',
      );
      const validatorCheckFail = () =>
        dbs.getService(ModelDataValidator).validate('model', {foo: 'test'});
      expect(validatorCheckFail).to.throw(
        'The property "foo" of the model "model" has the invalid value "test" ' +
          'that caught by a property validator.',
      );
    });

    describe('an option "isPartial" is true', function () {
      it('does not throw an error if a given data does not have a required property', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        dbs.getService(ModelDataValidator).validate('model', {}, true);
      });

      it('throws an error if a required property is undefined', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        const throwable = () =>
          dbs
            .getService(ModelDataValidator)
            .validate('model', {foo: undefined}, true);
        expect(throwable).to.throw(
          'The property "foo" of the model "model" ' +
            'is required, but undefined was given.',
        );
      });

      it('throws an error if a required property is null', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        const throwable = () =>
          dbs
            .getService(ModelDataValidator)
            .validate('model', {foo: null}, true);
        expect(throwable).to.throw(
          'The property "foo" of the model "model" is required, but null was given.',
        );
      });

      it('throws an error if a required property has an empty value', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          properties: {
            foo: {
              type: DataType.STRING,
              required: true,
            },
          },
        });
        dbs
          .getService(EmptyValuesService)
          .setEmptyValuesOf(DataType.STRING, [5]);
        const throwable = () =>
          dbs.getService(ModelDataValidator).validate('model', {foo: 5}, true);
        expect(throwable).to.throw(
          'The property "foo" of the model "model" is required, but 5 was given.',
        );
      });
    });

    describe('validate by property type', function () {
      it('should not validate the empty value', function () {
        const dbs = new DatabaseSchema();
        dbs.defineModel({
          name: 'model',
          datasource: 'datasource',
          properties: {
            foo: {
              type: DataType.STRING,
            },
          },
        });
        dbs
          .getService(EmptyValuesService)
          .setEmptyValuesOf(DataType.STRING, [5]);
        dbs.getService(ModelDataValidator).validate('model', {foo: 5});
      });

      describe('DataType.ANY', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('does not throw an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('does not throw an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('does not throw an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('does not throw an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ANY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('does not throw an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('does not throw an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('does not throw an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('does not throw an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ANY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });
        });
      });

      describe('DataType.STRING', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Number was given.',
            );
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean was given.',
            );
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Array was given.',
            );
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.STRING,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Object was given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('does not throw an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'bar',
            });
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Number was given.',
            );
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Boolean was given.',
            );
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Array was given.',
            );
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.STRING,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a String, but Object was given.',
            );
          });
        });
      });

      describe('DataType.NUMBER', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but String was given.',
            );
          });

          it('does not throw an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean was given.',
            );
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Array was given.',
            );
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.NUMBER,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Object was given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but String was given.',
            );
          });

          it('does not throw an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 10,
            });
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Boolean was given.',
            );
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Array was given.',
            );
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.NUMBER,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Number, but Object was given.',
            );
          });
        });
      });

      describe('DataType.BOOLEAN', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but String was given.',
            );
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Number was given.',
            );
          });

          it('does not throw an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Array was given.',
            );
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.BOOLEAN,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Object was given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but String was given.',
            );
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Number was given.',
            );
          });

          it('does not throw an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: true,
            });
          });

          it('does not throw an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: false,
            });
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Array was given.',
            );
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.BOOLEAN,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'a Boolean, but Object was given.',
            );
          });
        });
      });

      describe('DataType.ARRAY', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but String was given.',
            );
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Number was given.',
            );
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean was given.',
            );
          });

          it('does not throw an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.ARRAY,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Object was given.',
            );
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but String was given.',
            );
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Number was given.',
            );
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Boolean was given.',
            );
          });

          it('does not throw an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: [],
            });
          });

          it('throws an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.ARRAY,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: {},
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Array, but Object was given.',
            );
          });

          describe('the "itemModel" option', function () {
            it('does not throw an error if the option "itemModel" is not specified in case of Object item type', function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ARRAY,
                    itemType: DataType.OBJECT,
                  },
                },
              });
              const value = {foo: [{a: 1}, {b: 2}]};
              dbs.getService(ModelDataValidator).validate('model', value);
            });

            it('throws an error when the given object element has an invalid model', function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              dbs.defineModel({
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
                dbs.getService(ModelDataValidator).validate('modelB', {
                  bar: [{foo: 10}],
                });
              expect(throwable).to.throw(
                'The property "foo" of the model "modelA" must have ' +
                  'a String, but Number was given.',
              );
            });

            it('does not throw an error when the given object element has a valid model', function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              dbs.defineModel({
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
              dbs.getService(ModelDataValidator).validate('modelB', {
                bar: [{foo: '10'}],
              });
            });
          });
        });
      });

      describe('DataType.OBJECT', function () {
        describe('ShortPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but String was given.',
            );
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Number was given.',
            );
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean was given.',
            );
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Array was given.',
            );
          });

          it('does not throw an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: DataType.OBJECT,
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });
        });

        describe('FullPropertyDefinition', function () {
          it('does not throw an error if an undefined given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: undefined,
            });
          });

          it('does not throw an error if a null given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: null,
            });
          });

          it('throws an error if a string given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'bar',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but String was given.',
            );
          });

          it('throws an error if a number given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 10,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Number was given.',
            );
          });

          it('throws an error if true given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: true,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean was given.',
            );
          });

          it('throws an error if false given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: false,
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Boolean was given.',
            );
          });

          it('throws an error if an array given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: [],
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" must have ' +
                'an Object, but Array was given.',
            );
          });

          it('does not throw an error if an object given', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              datasource: 'datasource',
              properties: {
                foo: {
                  type: DataType.OBJECT,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: {},
            });
          });

          describe('the "model" option', function () {
            it('throws an error when the given object has an invalid model', function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              dbs.defineModel({
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
                dbs.getService(ModelDataValidator).validate('modelB', {
                  bar: {foo: 10},
                });
              expect(throwable).to.throw(
                'The property "foo" of the model "modelA" must have ' +
                  'a String, but Number was given.',
              );
            });

            it('does not throw an error when the given object has a valid model', function () {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'modelA',
                properties: {
                  foo: DataType.STRING,
                },
              });
              dbs.defineModel({
                name: 'modelB',
                datasource: 'datasource',
                properties: {
                  bar: {
                    type: DataType.OBJECT,
                    model: 'modelA',
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('modelB', {
                bar: {foo: '10'},
              });
            });
          });
        });
      });
    });

    describe('validate by property validators', function () {
      describe('when the option "validate" is a String', function () {
        it('should not validate the non-provided property', function () {
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const validator = dbs.getService(ModelDataValidator);
          validator.validate('model', {});
        });

        it('should not validate undefined and null values', function () {
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const validator = dbs.getService(ModelDataValidator);
          validator.validate('model', {foo: undefined});
          validator.validate('model', {foo: null});
        });

        it('should not validate the empty value', function () {
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.STRING,
                validate: 'myValidator',
              },
            },
          });
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.STRING, [5]);
          dbs.getService(ModelDataValidator).validate('model', {foo: 5});
        });

        it('should throw the error for the non-existent validator name', function () {
          const dbs = new DatabaseSchema();
          const modelDef = {
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: undefined,
              },
            },
          };
          dbs.defineModel(modelDef);
          modelDef.properties.foo.validate = 'myValidator';
          const throwable = () =>
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'The property validator "myValidator" is not defined.',
          );
        });

        it('should throw the error from the validator', function () {
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            throw Error('My error');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const throwable = () =>
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw('My error');
        });

        it('should allow the given value if the validator returns true', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            called++;
            return true;
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(called).to.be.eq(1);
        });

        it('should throw the error if the validator returns a promise', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            called++;
            return Promise.resolve(true);
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          const throwable = () =>
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'Asynchronous property validators are not supported, ' +
              'but the property "foo" of the model "model" has the property ' +
              'validator "myValidator" that returns a Promise.',
          );
          expect(called).to.be.eq(1);
        });

        it('should throw the error for a non-true result from the validator', function () {
          const testFn = v => {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator', function () {
              called++;
              return v;
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: 'myValidator',
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" has the invalid value "test" ' +
                'that caught by the property validator "myValidator".',
            );
            expect(called).to.be.eq(1);
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

        it('should pass arguments to the validator', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.undefined;
            expect(context).to.be.eql({
              validatorName: 'myValidator',
              modelName: 'model',
              propName: 'foo',
            });
            called++;
            return true;
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(called).to.be.eq(1);
        });

        it('should invoke the validator only once per value', function () {
          let invoked = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator', function () {
            invoked++;
            return true;
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: 'myValidator',
              },
            },
          });
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invoked).to.be.eq(1);
        });
      });

      describe('when the option "validate" is a Function', function () {
        describe('named validators', function () {
          it('should not validate the non-provided property', function () {
            const dbs = new DatabaseSchema();
            const myValidator = function () {
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: myValidator,
                },
              },
            });
            const validator = dbs.getService(ModelDataValidator);
            validator.validate('model', {});
          });

          it('should not validate undefined and null values', function () {
            const dbs = new DatabaseSchema();
            const myValidator = () => {
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: myValidator,
                },
              },
            });
            const validator = dbs.getService(ModelDataValidator);
            validator.validate('model', {foo: undefined});
            validator.validate('model', {foo: null});
          });

          it('should not validate the empty value', function () {
            const dbs = new DatabaseSchema();
            const myValidator = function () {
              throw new Error('Should not to be called.');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.STRING,
                  validate: myValidator,
                },
              },
            });
            dbs
              .getService(EmptyValuesService)
              .setEmptyValuesOf(DataType.STRING, [5]);
            dbs.getService(ModelDataValidator).validate('model', {foo: 5});
          });

          it('should throw the error from the validator', function () {
            const dbs = new DatabaseSchema();
            const myValidator = function () {
              throw Error('My error');
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: myValidator,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw('My error');
          });

          it('should allow the given value if the validator returns true', function () {
            const dbs = new DatabaseSchema();
            let called = 0;
            const myValidator = function () {
              called++;
              return true;
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: myValidator,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(called).to.be.eq(1);
          });

          it('should throw the error if the validator returns a promise', function () {
            const dbs = new DatabaseSchema();
            const myValidator = function () {
              return Promise.resolve(true);
            };
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: myValidator,
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'Asynchronous property validators are not supported, ' +
                'but the property "foo" of the model "model" has the property ' +
                'validator "myValidator" that returns a Promise.',
            );
          });

          it('should throw the error for a non-true result from the validator', function () {
            const testFn = v => {
              const dbs = new DatabaseSchema();
              const myValidator = function () {
                return v;
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: myValidator,
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'The property "foo" of the model "model" has the invalid value "test" ' +
                  'that caught by the property validator "myValidator".',
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

          it('should pass arguments to the validator', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const myValidator = function (value, options, context) {
              expect(value).to.be.eq('test');
              expect(options).to.be.undefined;
              expect(context).to.be.eql({
                validatorName: 'myValidator',
                modelName: 'model',
                propName: 'foo',
              });
              called++;
              return true;
            };
            dbs
              .getService(PropertyValidatorRegistry)
              .addValidator('myValidator', myValidator);
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: 'myValidator',
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(called).to.be.eq(1);
          });

          it('should invoke the validator only once per value', function () {
            let invoked = 0;
            const myValidator = function () {
              invoked++;
              return true;
            };
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: myValidator,
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(invoked).to.be.eq(1);
          });
        });

        describe('anonymous validators', function () {
          it('should not validate the non-provided property', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate() {
                    throw new Error('Should not to be called.');
                  },
                },
              },
            });
            const validator = dbs.getService(ModelDataValidator);
            validator.validate('model', {});
          });

          it('should not validate undefined and null values', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate() {
                    throw new Error('Should not to be called.');
                  },
                },
              },
            });
            const validator = dbs.getService(ModelDataValidator);
            validator.validate('model', {foo: undefined});
            validator.validate('model', {foo: null});
          });

          it('should not validate the empty value', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.STRING,
                  validate() {
                    throw new Error('Should not to be called.');
                  },
                },
              },
            });
            dbs
              .getService(EmptyValuesService)
              .setEmptyValuesOf(DataType.STRING, [5]);
            dbs.getService(ModelDataValidator).validate('model', {foo: 5});
          });

          it('should throw the error from the validator', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate() {
                    throw Error('My error');
                  },
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw('My error');
          });

          it('should allow the given value if the validator returns true', function () {
            const dbs = new DatabaseSchema();
            let called = 0;
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate() {
                    called++;
                    return true;
                  },
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(called).to.be.eq(1);
          });

          it('should throw the error if the validator returns a promise', function () {
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate() {
                    return Promise.resolve(true);
                  },
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'Asynchronous property validators are not supported, ' +
                'but the property "foo" of the model "model" has a property ' +
                'validator that returns a Promise.',
            );
          });

          it('should throw the error for a non-true result from the validator', function () {
            const testFn = v => {
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate() {
                      return v;
                    },
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'The property "foo" of the model "model" has the invalid value "test" ' +
                  'that caught by a property validator.',
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

          it('should pass arguments to the validator', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate(value, options, context) {
                    expect(value).to.be.eq('test');
                    expect(options).to.be.undefined;
                    expect(context).to.be.eql({
                      validatorName: undefined,
                      modelName: 'model',
                      propName: 'foo',
                    });
                    called++;
                    return true;
                  },
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(called).to.be.eq(1);
          });

          it('should invoke the validator only once per value', function () {
            let invoked = 0;
            const dbs = new DatabaseSchema();
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate() {
                    invoked++;
                    return true;
                  },
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(invoked).to.be.eq(1);
          });
        });
      });

      describe('when the option "validate" is an Array', function () {
        it('does nothing for an empty array validators', function () {
          const dbs = new DatabaseSchema();
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: [],
              },
            },
          });
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
        });

        it('the option "validate" requires a non-empty String, a Function, an Array or an Object', function () {
          const dbs = new DatabaseSchema();
          dbs
            .getService(PropertyValidatorRegistry)
            .addValidator('myValidator', () => true);
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: undefined,
              },
            },
          });
          const V = dbs.getService(ModelDataValidator);
          const throwable = v => () => {
            const models = dbs.getService(DefinitionRegistry)['_models'];
            models.model.properties.foo.validate = v;
            V.validate('model', {foo: 'bar'});
          };
          const error = v =>
            format(
              'The provided option "validate" for the property "foo" in the model "model" ' +
                'should be either a validator name, a validator function, an array ' +
                'of validator names or functions, or an object mapping validator ' +
                'names to their arguments, but %s was given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          throwable('myValidator')();
          throwable(() => true)();
          throwable(['myValidator'])();
          throwable([() => true])();
          throwable([])();
          throwable({myValidator: true})();
          throwable({})();
        });

        it('the option "validate" with an Array value requires elements to be a non-empty String or a Function', function () {
          const dbs = new DatabaseSchema();
          dbs
            .getService(PropertyValidatorRegistry)
            .addValidator('myValidator', () => true);
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: undefined,
              },
            },
          });
          const V = dbs.getService(ModelDataValidator);
          const throwable = v => () => {
            const models = dbs.getService(DefinitionRegistry)['_models'];
            models.model.properties.foo.validate = [v];
            V.validate('model', {foo: 'bar'});
          };
          const error = v =>
            format(
              'The provided option "validate" for the property "foo" in the model "model" ' +
                'has an Array value that should contain validator names or validator ' +
                'functions, but %s was given.',
              v,
            );
          expect(throwable('')).to.throw(error('""'));
          expect(throwable(10)).to.throw(error('10'));
          expect(throwable(0)).to.throw(error('0'));
          expect(throwable(true)).to.throw(error('true'));
          expect(throwable(false)).to.throw(error('false'));
          expect(throwable([1, 2, 3])).to.throw(error('Array'));
          expect(throwable({foo: 'bar'})).to.throw(error('Object'));
          expect(throwable(null)).to.throw(error('null'));
          expect(throwable(undefined)).to.throw(error('undefined'));
          throwable('myValidator')();
          throwable(() => true)();
        });

        describe('when an array element is a String', function () {
          it('should not validate the non-provided property', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              calls++;
              throw new Error('Should not to be called.');
            });
            reg.addValidator('myValidator2', function () {
              calls++;
              throw new Error('Should not to be called.');
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const validator = dbs.getService(ModelDataValidator);
            validator.validate('model', {});
            expect(calls).to.be.eq(0);
          });

          it('should not validate undefined and null values', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              calls++;
              throw new Error('Should not to be called.');
            });
            reg.addValidator('myValidator2', function () {
              calls++;
              throw new Error('Should not to be called.');
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const validator = dbs.getService(ModelDataValidator);
            validator.validate('model', {foo: undefined});
            validator.validate('model', {foo: null});
            expect(calls).to.be.eq(0);
          });

          it('should not validate the empty value', function () {
            let calls = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              calls++;
              throw new Error('Should not to be called.');
            });
            reg.addValidator('myValidator2', function () {
              calls++;
              throw new Error('Should not to be called.');
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.STRING,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            dbs
              .getService(EmptyValuesService)
              .setEmptyValuesOf(DataType.STRING, [5]);
            dbs.getService(ModelDataValidator).validate('model', {foo: 5});
            expect(calls).to.be.eq(0);
          });

          it('should throw the error for the non-existent validator name', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return true;
            });
            const modelDef = {
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1'],
                },
              },
            };
            dbs.defineModel(modelDef);
            modelDef.properties.foo.validate.push('myValidator2');
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property validator "myValidator2" is not defined.',
            );
            expect(called).to.be.eq(1);
          });

          it('should throw the error from the first validator', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              throw Error('My error');
            });
            reg.addValidator('myValidator2', function () {
              called++;
              return false;
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw('My error');
            expect(called).to.be.eq(1);
          });

          it('should throw the error from the second validator', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return true;
            });
            reg.addValidator('myValidator2', function () {
              called++;
              throw Error('My error');
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw('My error');
            expect(called).to.be.eq(2);
          });

          it('should allow the given value if validators returns true', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return true;
            });
            reg.addValidator('myValidator2', function () {
              called++;
              return true;
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(called).to.be.eq(2);
          });

          it('should throw the error if the first validator returns a promise', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return Promise.resolve(true);
            });
            reg.addValidator('myValidator2', function () {
              called++;
              return true;
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'Asynchronous property validators are not supported, ' +
                'but the property "foo" of the model "model" has the property ' +
                'validator "myValidator1" that returns a Promise.',
            );
            expect(called).to.be.eq(1);
          });

          it('should throw the error if the second validator returns a promise', function () {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return true;
            });
            reg.addValidator('myValidator2', function () {
              called++;
              return Promise.resolve(true);
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            const throwable = () =>
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'Asynchronous property validators are not supported, ' +
                'but the property "foo" of the model "model" has the property ' +
                'validator "myValidator2" that returns a Promise.',
            );
            expect(called).to.be.eq(2);
          });

          it('should throw the error for a non-true result from the first validator', function () {
            const testFn = v => {
              let called = 0;
              const dbs = new DatabaseSchema();
              const reg = dbs.getService(PropertyValidatorRegistry);
              reg.addValidator('myValidator1', function () {
                called++;
                return v;
              });
              reg.addValidator('myValidator2', function () {
                called++;
                return true;
              });
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: ['myValidator1', 'myValidator2'],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'The property "foo" of the model "model" has the invalid value "test" ' +
                  'that caught by the property validator "myValidator1".',
              );
              expect(called).to.be.eq(1);
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

          it('should throw the error for a non-true result from the second validator', function () {
            const testFn = v => {
              let called = 0;
              const dbs = new DatabaseSchema();
              const reg = dbs.getService(PropertyValidatorRegistry);
              reg.addValidator('myValidator1', function () {
                called++;
                return true;
              });
              reg.addValidator('myValidator2', function () {
                called++;
                return v;
              });
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: ['myValidator1', 'myValidator2'],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'The property "foo" of the model "model" has the invalid value "test" ' +
                  'that caught by the property validator "myValidator2".',
              );
              expect(called).to.be.eq(2);
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

          it('should pass arguments to validators', function () {
            let called = false;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator(
              'myValidator1',
              function (value, options, context) {
                expect(value).to.be.eq('test');
                expect(options).to.be.undefined;
                expect(context).to.be.eql({
                  validatorName: 'myValidator1',
                  modelName: 'model',
                  propName: 'foo',
                });
                called++;
                return true;
              },
            );
            reg.addValidator(
              'myValidator2',
              function (value, options, context) {
                expect(value).to.be.eq('test');
                expect(options).to.be.undefined;
                expect(context).to.be.eql({
                  validatorName: 'myValidator2',
                  modelName: 'model',
                  propName: 'foo',
                });
                called++;
                return true;
              },
            );
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(called).to.be.eq(2);
          });

          it('should invoke validators in the correct order', function () {
            const invocation = [];
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              invocation.push('myValidator1');
              return true;
            });
            reg.addValidator('myValidator2', function () {
              invocation.push('myValidator2');
              return true;
            });
            dbs.defineModel({
              name: 'model',
              properties: {
                foo: {
                  type: DataType.ANY,
                  validate: ['myValidator1', 'myValidator2'],
                },
              },
            });
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
            expect(invocation).to.be.eql(['myValidator1', 'myValidator2']);
          });
        });

        describe('when an array element is a Function', function () {
          describe('named validators', function () {
            it('should not validate the non-provided property', function () {
              let calls = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                calls++;
                throw new Error('Should not to be called.');
              };
              const myValidator2 = function () {
                calls++;
                throw new Error('Should not to be called.');
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              const validator = dbs.getService(ModelDataValidator);
              validator.validate('model', {});
              expect(calls).to.be.eq(0);
            });

            it('should not validate undefined and null values', function () {
              let calls = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                calls++;
                throw new Error('Should not to be called.');
              };
              const myValidator2 = function () {
                calls++;
                throw new Error('Should not to be called.');
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              const validator = dbs.getService(ModelDataValidator);
              validator.validate('model', {foo: undefined});
              validator.validate('model', {foo: null});
              expect(calls).to.be.eq(0);
            });

            it('should not validate the empty value', function () {
              let calls = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                calls++;
                throw new Error('Should not to be called.');
              };
              const myValidator2 = function () {
                calls++;
                throw new Error('Should not to be called.');
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.STRING,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              dbs
                .getService(EmptyValuesService)
                .setEmptyValuesOf(DataType.STRING, [5]);
              dbs.getService(ModelDataValidator).validate('model', {foo: 5});
              expect(calls).to.be.eq(0);
            });

            it('should throw the error from the first validator', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                called++;
                throw Error('My error');
              };
              const myValidator2 = function () {
                called++;
                return false;
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw('My error');
              expect(called).to.be.eq(1);
            });

            it('should throw the error from the second validator', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                called++;
                return true;
              };
              const myValidator2 = function () {
                called++;
                throw Error('My error');
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw('My error');
              expect(called).to.be.eq(2);
            });

            it('should allow the given value if validators returns true', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                called++;
                return true;
              };
              const myValidator2 = function () {
                called++;
                return true;
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
              expect(called).to.be.eq(2);
            });

            it('should throw the error if the first validator returns a promise', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                called++;
                return Promise.resolve(true);
              };
              const myValidator2 = function () {
                called++;
                return true;
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'Asynchronous property validators are not supported, ' +
                  'but the property "foo" of the model "model" has the property ' +
                  'validator "myValidator1" that returns a Promise.',
              );
              expect(called).to.be.eq(1);
            });

            it('should throw the error if the second validator returns a promise', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              const myValidator1 = function () {
                called++;
                return true;
              };
              const myValidator2 = function () {
                called++;
                return Promise.resolve(true);
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'Asynchronous property validators are not supported, ' +
                  'but the property "foo" of the model "model" has the property ' +
                  'validator "myValidator2" that returns a Promise.',
              );
              expect(called).to.be.eq(2);
            });

            it('should throw the error for a non-true result from the first validator', function () {
              const testFn = v => {
                let called = 0;
                const dbs = new DatabaseSchema();
                const myValidator1 = function () {
                  called++;
                  return v;
                };
                const myValidator2 = function () {
                  called++;
                  return true;
                };
                dbs.defineModel({
                  name: 'model',
                  properties: {
                    foo: {
                      type: DataType.ANY,
                      validate: [myValidator1, myValidator2],
                    },
                  },
                });
                const throwable = () =>
                  dbs.getService(ModelDataValidator).validate('model', {
                    foo: 'test',
                  });
                expect(throwable).to.throw(
                  'The property "foo" of the model "model" has the invalid value "test" ' +
                    'that caught by the property validator "myValidator1".',
                );
                expect(called).to.be.eq(1);
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

            it('should throw the error for a non-true result from the second validator', function () {
              const testFn = v => {
                let called = 0;
                const dbs = new DatabaseSchema();
                const myValidator1 = function () {
                  called++;
                  return true;
                };
                const myValidator2 = function () {
                  called++;
                  return v;
                };
                dbs.defineModel({
                  name: 'model',
                  properties: {
                    foo: {
                      type: DataType.ANY,
                      validate: [myValidator1, myValidator2],
                    },
                  },
                });
                const throwable = () =>
                  dbs.getService(ModelDataValidator).validate('model', {
                    foo: 'test',
                  });
                expect(throwable).to.throw(
                  'The property "foo" of the model "model" has the invalid value "test" ' +
                    'that caught by the property validator "myValidator2".',
                );
                expect(called).to.be.eq(2);
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

            it('should pass arguments to validators', function () {
              let called = false;
              const dbs = new DatabaseSchema();
              const myValidator1 = function (value, options, context) {
                expect(value).to.be.eq('test');
                expect(options).to.be.undefined;
                expect(context).to.be.eql({
                  validatorName: 'myValidator1',
                  modelName: 'model',
                  propName: 'foo',
                });
                called++;
                return true;
              };
              const myValidator2 = function (value, options, context) {
                expect(value).to.be.eq('test');
                expect(options).to.be.undefined;
                expect(context).to.be.eql({
                  validatorName: 'myValidator2',
                  modelName: 'model',
                  propName: 'foo',
                });
                called++;
                return true;
              };
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
              expect(called).to.be.eq(2);
            });

            it('should invoke validators in the correct order', function () {
              const invocation = [];
              const myValidator1 = function () {
                invocation.push('myValidator1');
                return true;
              };
              const myValidator2 = function () {
                invocation.push('myValidator2');
                return true;
              };
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [myValidator1, myValidator2],
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
              expect(invocation).to.be.eql(['myValidator1', 'myValidator2']);
            });
          });

          describe('anonymous validators', function () {
            it('should not validate the non-provided property', function () {
              let calls = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        calls++;
                        throw new Error('Should not to be called.');
                      },
                      () => {
                        calls++;
                        throw new Error('Should not to be called.');
                      },
                    ],
                  },
                },
              });
              const validator = dbs.getService(ModelDataValidator);
              validator.validate('model', {});
              expect(calls).to.be.eq(0);
            });

            it('should not validate undefined and null values', function () {
              let calls = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        calls++;
                        throw new Error('Should not to be called.');
                      },
                      () => {
                        calls++;
                        throw new Error('Should not to be called.');
                      },
                    ],
                  },
                },
              });
              const validator = dbs.getService(ModelDataValidator);
              validator.validate('model', {foo: undefined});
              validator.validate('model', {foo: null});
              expect(calls).to.be.eq(0);
            });

            it('should not validate the empty value', function () {
              let calls = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.STRING,
                    validate: [
                      () => {
                        calls++;
                        throw new Error('Should not to be called.');
                      },
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
                .setEmptyValuesOf(DataType.STRING, [5]);
              dbs.getService(ModelDataValidator).validate('model', {foo: 5});
              expect(calls).to.be.eq(0);
            });

            it('should throw the error from the first validator', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        called++;
                        throw Error('My error');
                      },
                      () => {
                        called++;
                        return false;
                      },
                    ],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw('My error');
              expect(called).to.be.eq(1);
            });

            it('should throw the error from the second validator', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        called++;
                        return true;
                      },
                      () => {
                        called++;
                        throw Error('My error');
                      },
                    ],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw('My error');
              expect(called).to.be.eq(2);
            });

            it('should allow the given value if validators returns true', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        called++;
                        return true;
                      },
                      () => {
                        called++;
                        return true;
                      },
                    ],
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
              expect(called).to.be.eq(2);
            });

            it('should throw the error if the first validator returns a promise', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        called++;
                        return Promise.resolve(true);
                      },
                      () => {
                        called++;
                        return true;
                      },
                    ],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'Asynchronous property validators are not supported, ' +
                  'but the property "foo" of the model "model" has a property ' +
                  'validator that returns a Promise.',
              );
              expect(called).to.be.eq(1);
            });

            it('should throw the error if the second validator returns a promise', function () {
              let called = 0;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        called++;
                        return true;
                      },
                      () => {
                        called++;
                        return Promise.resolve(true);
                      },
                    ],
                  },
                },
              });
              const throwable = () =>
                dbs.getService(ModelDataValidator).validate('model', {
                  foo: 'test',
                });
              expect(throwable).to.throw(
                'Asynchronous property validators are not supported, ' +
                  'but the property "foo" of the model "model" has a property ' +
                  'validator that returns a Promise.',
              );
              expect(called).to.be.eq(2);
            });

            it('should throw the error for a non-true result from the first validator', function () {
              const testFn = v => {
                let called = 0;
                const dbs = new DatabaseSchema();
                dbs.defineModel({
                  name: 'model',
                  properties: {
                    foo: {
                      type: DataType.ANY,
                      validate: [
                        () => {
                          called++;
                          return v;
                        },
                        () => {
                          called++;
                          return true;
                        },
                      ],
                    },
                  },
                });
                const throwable = () =>
                  dbs.getService(ModelDataValidator).validate('model', {
                    foo: 'test',
                  });
                expect(throwable).to.throw(
                  'The property "foo" of the model "model" has the invalid value "test" ' +
                    'that caught by a property validator.',
                );
                expect(called).to.be.eq(1);
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

            it('should throw the error for a non-true result from the second validator', function () {
              const testFn = v => {
                let called = 0;
                const dbs = new DatabaseSchema();
                dbs.defineModel({
                  name: 'model',
                  properties: {
                    foo: {
                      type: DataType.ANY,
                      validate: [
                        () => {
                          called++;
                          return true;
                        },
                        () => {
                          called++;
                          return v;
                        },
                      ],
                    },
                  },
                });
                const throwable = () =>
                  dbs.getService(ModelDataValidator).validate('model', {
                    foo: 'test',
                  });
                expect(throwable).to.throw(
                  'The property "foo" of the model "model" has the invalid value "test" ' +
                    'that caught by a property validator.',
                );
                expect(called).to.be.eq(2);
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

            it('should pass arguments to validators', function () {
              let called = false;
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      (value, options, context) => {
                        expect(value).to.be.eq('test');
                        expect(options).to.be.undefined;
                        expect(context).to.be.eql({
                          validatorName: undefined,
                          modelName: 'model',
                          propName: 'foo',
                        });
                        called++;
                        return true;
                      },
                      (value, options, context) => {
                        expect(value).to.be.eq('test');
                        expect(options).to.be.undefined;
                        expect(context).to.be.eql({
                          validatorName: undefined,
                          modelName: 'model',
                          propName: 'foo',
                        });
                        called++;
                        return true;
                      },
                    ],
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
              expect(called).to.be.eq(2);
            });

            it('should invoke validators in the correct order', function () {
              const invocation = [];
              const dbs = new DatabaseSchema();
              dbs.defineModel({
                name: 'model',
                properties: {
                  foo: {
                    type: DataType.ANY,
                    validate: [
                      () => {
                        invocation.push('myValidator1');
                        return true;
                      },
                      () => {
                        invocation.push('myValidator2');
                        return true;
                      },
                    ],
                  },
                },
              });
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
              expect(invocation).to.be.eql(['myValidator1', 'myValidator2']);
            });
          });
        });
      });

      describe('when the option "validate" is an Object', function () {
        it('should not validate the non-provided property', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            calls++;
            throw new Error('Should not to be called.');
          });
          reg.addValidator('myValidator2', function () {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
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
          const validator = dbs.getService(ModelDataValidator);
          validator.validate('model', {});
          expect(calls).to.be.eq(0);
        });

        it('should not validate undefined and null values', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            calls++;
            throw new Error('Should not to be called.');
          });
          reg.addValidator('myValidator2', function () {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
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
          const validator = dbs.getService(ModelDataValidator);
          validator.validate('model', {foo: undefined});
          validator.validate('model', {foo: null});
          expect(calls).to.be.eq(0);
        });

        it('should not validate the empty value', function () {
          let calls = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            calls++;
            throw new Error('Should not to be called.');
          });
          reg.addValidator('myValidator2', function () {
            calls++;
            throw new Error('Should not to be called.');
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.STRING,
                validate: {
                  myValidator1: true,
                  myValidator2: true,
                },
              },
            },
          });
          dbs
            .getService(EmptyValuesService)
            .setEmptyValuesOf(DataType.STRING, [5]);
          dbs.getService(ModelDataValidator).validate('model', {foo: 5});
          expect(calls).to.be.eq(0);
        });

        it('should throw the error for the non-existent validator name', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            called++;
            return true;
          });
          const modelDef = {
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator1: true,
                },
              },
            },
          };
          dbs.defineModel(modelDef);
          modelDef.properties.foo.validate['myValidator2'] = true;
          const throwable = () =>
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'The property validator "myValidator2" is not defined.',
          );
          expect(called).to.be.eq(1);
        });

        it('should throw the error from the first validator', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            called++;
            throw Error('My error');
          });
          reg.addValidator('myValidator2', function () {
            called++;
            return false;
          });
          dbs.defineModel({
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
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw('My error');
          expect(called).to.be.eq(1);
        });

        it('should throw the error from the second validator', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            called++;
            return true;
          });
          reg.addValidator('myValidator2', function () {
            called++;
            throw Error('My error');
          });
          dbs.defineModel({
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
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw('My error');
          expect(called).to.be.eq(2);
        });

        it('should allow the given value if validators returns true', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            called++;
            return true;
          });
          reg.addValidator('myValidator2', function () {
            called++;
            return true;
          });
          dbs.defineModel({
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
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(called).to.be.eq(2);
        });

        it('should throw the error if the first validator returns a promise', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            called++;
            return Promise.resolve(true);
          });
          reg.addValidator('myValidator2', function () {
            called++;
            return true;
          });
          dbs.defineModel({
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
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'Asynchronous property validators are not supported, ' +
              'but the property "foo" of the model "model" has the property ' +
              'validator "myValidator1" that returns a Promise.',
          );
          expect(called).to.be.eq(1);
        });

        it('should throw the error if the second validator returns a promise', function () {
          let called = 0;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            called++;
            return true;
          });
          reg.addValidator('myValidator2', function () {
            called++;
            return Promise.resolve(true);
          });
          dbs.defineModel({
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
            dbs.getService(ModelDataValidator).validate('model', {
              foo: 'test',
            });
          expect(throwable).to.throw(
            'Asynchronous property validators are not supported, ' +
              'but the property "foo" of the model "model" has the property ' +
              'validator "myValidator2" that returns a Promise.',
          );
          expect(called).to.be.eq(2);
        });

        it('should throw the error for a non-true result from the first validator', function () {
          const testFn = v => {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return v;
            });
            reg.addValidator('myValidator2', function () {
              called++;
              return true;
            });
            dbs.defineModel({
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
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" has the invalid value "test" ' +
                'that caught by the property validator "myValidator1".',
            );
            expect(called).to.be.eq(1);
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

        it('should throw the error for a non-true result from the second validator', function () {
          const testFn = v => {
            let called = 0;
            const dbs = new DatabaseSchema();
            const reg = dbs.getService(PropertyValidatorRegistry);
            reg.addValidator('myValidator1', function () {
              called++;
              return true;
            });
            reg.addValidator('myValidator2', function () {
              called++;
              return v;
            });
            dbs.defineModel({
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
              dbs.getService(ModelDataValidator).validate('model', {
                foo: 'test',
              });
            expect(throwable).to.throw(
              'The property "foo" of the model "model" has the invalid value "test" ' +
                'that caught by the property validator "myValidator2".',
            );
            expect(called).to.be.eq(2);
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

        it('should pass arguments to validators', function () {
          let called = false;
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.eq('foo');
            expect(context).to.be.eql({
              validatorName: 'myValidator1',
              modelName: 'model',
              propName: 'foo',
            });
            called++;
            return true;
          });
          reg.addValidator('myValidator2', function (value, options, context) {
            expect(value).to.be.eq('test');
            expect(options).to.be.eq('bar');
            expect(context).to.be.eql({
              validatorName: 'myValidator2',
              modelName: 'model',
              propName: 'foo',
            });
            called++;
            return true;
          });
          dbs.defineModel({
            name: 'model',
            properties: {
              foo: {
                type: DataType.ANY,
                validate: {
                  myValidator1: 'foo',
                  myValidator2: 'bar',
                },
              },
            },
          });
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(called).to.be.eq(2);
        });

        it('should invoke validators in the correct order', function () {
          const invocation = [];
          const dbs = new DatabaseSchema();
          const reg = dbs.getService(PropertyValidatorRegistry);
          reg.addValidator('myValidator1', function () {
            invocation.push('myValidator1');
            return true;
          });
          reg.addValidator('myValidator2', function () {
            invocation.push('myValidator2');
            return true;
          });
          dbs.defineModel({
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
          dbs.getService(ModelDataValidator).validate('model', {
            foo: 'test',
          });
          expect(invocation).to.be.eql(['myValidator1', 'myValidator2']);
        });
      });
    });
  });
});
