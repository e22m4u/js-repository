import {expect} from 'chai';
import {format} from '@e22m4u/util-format';
import {RelationType} from './relation-type.js';
import {RelationsDefinitionValidator} from './relations-definition-validator.js';

const S = new RelationsDefinitionValidator();

describe('RelationsDefinitionValidator', function () {
  describe('validate', function () {
    it('requires a first argument to be a non-empty string', function () {
      const validate = v => () => S.validate(v, {});
      const error = v =>
        format(
          'A first argument of RelationsDefinitionValidator.validate ' +
            'should be a non-empty String, but %s given.',
          v,
        );
      expect(validate('')).to.throw(error('""'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate('model')();
    });

    it('requires a second argument to be an object', function () {
      const validate = v => () => S.validate('model', v);
      const error = v =>
        format(
          'The provided option "relations" of the model "model" ' +
            'should be an Object, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate({})();
    });

    it('requires a relation name to be a non-empty string', function () {
      const validate = v => () => S.validate('model', v);
      const error = v =>
        format(
          'The relation name of the model "model" should be ' +
            'a non-empty String, but %s given.',
          v,
        );
      expect(validate({['']: {}})).to.throw(error('""'));
      validate({foo: {type: RelationType.BELONGS_TO, model: 'model'}})();
    });

    it('requires a relation definition to be an object', function () {
      const validate = v => () => S.validate('model', {foo: v});
      const error = v =>
        format(
          'The relation "foo" of the model "model" should ' +
            'be an Object, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate({type: RelationType.BELONGS_TO, model: 'model'})();
    });

    it('requires the option "type" to be a RelationType', function () {
      const validate = v => () => {
        const foo = {type: v, model: 'model'};
        S.validate('model', {foo});
      };
      const error = v =>
        format(
          'The relation "foo" of the model "model" requires the option "type" ' +
            'to have one of relation types: %l, but %s given.',
          Object.values(RelationType),
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate(RelationType.BELONGS_TO)();
    });

    describe('belongsTo', function () {
      describe('a regular relation', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.BELONGS_TO,
              model: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "belongsTo", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('expects the provided option "foreignKey" to be a string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.BELONGS_TO,
              model: 'model',
              foreignKey: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "belongsTo", ' +
                'so it expects the provided option "foreignKey" to be a String, ' +
                'but %s given.',
              v,
            );
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          validate('foreignKey')();
          validate('')();
          validate(false)();
          validate(undefined)();
          validate(null)();
        });

        it('throws an error if the option "discriminator" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.BELONGS_TO,
                model: 'model',
                discriminator: 'referenceType',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" is a non-polymorphic "belongsTo" relation, ' +
              'so it should not have the option "discriminator" to be provided.',
          );
        });
      });

      describe('a polymorphic relation', function () {
        it('requires the option "polymorphic" to be a boolean', function () {
          const validate = v => {
            const foo = {
              type: RelationType.BELONGS_TO,
              polymorphic: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "belongsTo", ' +
                'so it expects the option "polymorphic" to be a Boolean, ' +
                'but %s given.',
              v,
            );
          expect(validate('str')).to.throw(error('"str"'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate({})).to.throw(error('Object'));
          validate(true)();
        });

        it('expects the provided option "foreignKey" to be a string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.BELONGS_TO,
              polymorphic: true,
              foreignKey: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" is a polymorphic "belongsTo" relation, ' +
                'so it expects the provided option "foreignKey" to be a String, ' +
                'but %s given.',
              v,
            );
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          validate('foreignKey')();
          validate('')();
          validate(false)();
          validate(undefined)();
          validate(null)();
        });

        it('expects the provided option "discriminator" to be a string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.BELONGS_TO,
              polymorphic: true,
              discriminator: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" is a polymorphic "belongsTo" relation, ' +
                'so it expects the provided option "discriminator" to be a String, ' +
                'but %s given.',
              v,
            );
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          validate('discriminator')();
          validate('')();
          validate(false)();
          validate(undefined)();
          validate(null)();
        });
      });
    });

    describe('hasOne', function () {
      describe('a regular relation', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_ONE,
              model: 'model',
              foreignKey: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasOne", ' +
                'so it requires the option "foreignKey" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('modelId')();
        });

        it('requires the option "foreignKey" to be a string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_ONE,
              model: v,
              foreignKey: 'modelId',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasOne", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('throws an error if the option "discriminator" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.HAS_ONE,
                model: 'model',
                foreignKey: 'modelId',
                discriminator: 'modelType',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" is a non-polymorphic "hasOne" relation, ' +
              'so it should not have the option "discriminator" to be provided.',
          );
        });
      });

      describe('a polymorphic relation with a target relation name', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_ONE,
              model: v,
              polymorphic: 'reference',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasOne", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('throws an error if the option "foreignKey" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.HAS_ONE,
                model: 'model',
                polymorphic: 'reference',
                foreignKey: 'referenceId',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" has the option "polymorphic" with ' +
              'a String value, so it should not have the option "foreignKey" ' +
              'to be provided.',
          );
        });

        it('throws an error if the option "discriminator" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.HAS_ONE,
                model: 'model',
                polymorphic: 'reference',
                discriminator: 'referenceType',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" has the option "polymorphic" with ' +
              'a String value, so it should not have the option "discriminator" ' +
              'to be provided.',
          );
        });
      });

      describe('a polymorphic relation with target relation keys', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_ONE,
              model: v,
              polymorphic: true,
              foreignKey: 'referenceId',
              discriminator: 'referenceType',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasOne", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('requires the option "foreignKey" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_ONE,
              model: 'model',
              polymorphic: true,
              foreignKey: v,
              discriminator: 'referenceType',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the option "polymorphic" ' +
                'with "true" value, so it requires the option "foreignKey" ' +
                'to be a non-empty String, but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('referenceId')();
        });

        it('requires the option "discriminator" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_ONE,
              model: 'model',
              polymorphic: true,
              foreignKey: 'referenceId',
              discriminator: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the option "polymorphic" ' +
                'with "true" value, so it requires the option "discriminator" ' +
                'to be a non-empty String, but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('referenceType')();
        });
      });
    });

    describe('hasMany', function () {
      describe('a regular relation', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_MANY,
              model: 'model',
              foreignKey: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasMany", ' +
                'so it requires the option "foreignKey" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('modelId')();
        });

        it('requires the option "foreignKey" to be a string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_MANY,
              model: v,
              foreignKey: 'modelId',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasMany", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('throws an error if the option "discriminator" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.HAS_MANY,
                model: 'model',
                foreignKey: 'modelId',
                discriminator: 'modelType',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" is a non-polymorphic "hasMany" ' +
              'relation, so it should not have the option "discriminator" to be provided.',
          );
        });
      });

      describe('a polymorphic relation with a target relation name', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_MANY,
              model: v,
              polymorphic: 'reference',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasMany", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('throws an error if the option "foreignKey" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.HAS_MANY,
                model: 'model',
                polymorphic: 'reference',
                foreignKey: 'referenceId',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" has the option "polymorphic" ' +
              'with a String value, so it should not have the option "foreignKey" ' +
              'to be provided.',
          );
        });

        it('throws an error if the option "discriminator" is provided', function () {
          const throwable = () =>
            S.validate('model', {
              foo: {
                type: RelationType.HAS_MANY,
                model: 'model',
                polymorphic: 'reference',
                discriminator: 'referenceType',
              },
            });
          expect(throwable).to.throw(
            'The relation "foo" of the model "model" has the option "polymorphic" with ' +
              'a String value, so it should not have the option "discriminator" ' +
              'to be provided.',
          );
        });
      });

      describe('a polymorphic relation with target relation keys', function () {
        it('requires the option "model" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_MANY,
              model: v,
              polymorphic: true,
              foreignKey: 'referenceId',
              discriminator: 'referenceType',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the type "hasMany", ' +
                'so it requires the option "model" to be a non-empty String, ' +
                'but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('model')();
        });

        it('requires the option "foreignKey" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_MANY,
              model: 'model',
              polymorphic: true,
              foreignKey: v,
              discriminator: 'referenceType',
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the option "polymorphic" ' +
                'with "true" value, so it requires the option "foreignKey" ' +
                'to be a non-empty String, but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('referenceId')();
        });

        it('requires the option "discriminator" to be a non-empty string', function () {
          const validate = v => {
            const foo = {
              type: RelationType.HAS_MANY,
              model: 'model',
              polymorphic: true,
              foreignKey: 'referenceId',
              discriminator: v,
            };
            return () => S.validate('model', {foo});
          };
          const error = v =>
            format(
              'The relation "foo" of the model "model" has the option "polymorphic" ' +
                'with "true" value, so it requires the option "discriminator" ' +
                'to be a non-empty String, but %s given.',
              v,
            );
          expect(validate('')).to.throw(error('""'));
          expect(validate(10)).to.throw(error('10'));
          expect(validate(true)).to.throw(error('true'));
          expect(validate(false)).to.throw(error('false'));
          expect(validate({})).to.throw(error('Object'));
          expect(validate([])).to.throw(error('Array'));
          expect(validate(undefined)).to.throw(error('undefined'));
          expect(validate(null)).to.throw(error('null'));
          validate('referenceType')();
        });
      });
    });

    describe('referencesMany', function () {
      it('requires the option "model" to be a non-empty string', function () {
        const validate = v => {
          const foo = {
            type: RelationType.REFERENCES_MANY,
            model: v,
          };
          return () => S.validate('model', {foo});
        };
        const error = v =>
          format(
            'The relation "foo" of the model "model" has the type "referencesMany", ' +
              'so it requires the option "model" to be a non-empty String, ' +
              'but %s given.',
            v,
          );
        expect(validate('')).to.throw(error('""'));
        expect(validate(10)).to.throw(error('10'));
        expect(validate(true)).to.throw(error('true'));
        expect(validate(false)).to.throw(error('false'));
        expect(validate({})).to.throw(error('Object'));
        expect(validate([])).to.throw(error('Array'));
        expect(validate(undefined)).to.throw(error('undefined'));
        expect(validate(null)).to.throw(error('null'));
        validate('model')();
      });

      it('expects the provided option "foreignKey" to be a string', function () {
        const validate = v => {
          const foo = {
            type: RelationType.REFERENCES_MANY,
            model: 'model',
            foreignKey: v,
          };
          return () => S.validate('model', {foo});
        };
        const error = v =>
          format(
            'The relation "foo" of the model "model" has the type "referencesMany", ' +
              'so it expects the provided option "foreignKey" to be a String, ' +
              'but %s given.',
            v,
          );
        expect(validate(10)).to.throw(error('10'));
        expect(validate(true)).to.throw(error('true'));
        expect(validate({})).to.throw(error('Object'));
        expect(validate([])).to.throw(error('Array'));
        validate('foreignKey')();
        validate('')();
        validate(false)();
        validate(undefined)();
        validate(null)();
      });

      it('throws an error if the option "discriminator" is provided', function () {
        const throwable = () =>
          S.validate('model', {
            foo: {
              type: RelationType.REFERENCES_MANY,
              model: 'model',
              discriminator: 'referenceType',
            },
          });
        expect(throwable).to.throw(
          'The relation "foo" of the model "model" has the type "referencesMany", ' +
            'so it should not have the option "discriminator" to be provided.',
        );
      });
    });
  });
});
