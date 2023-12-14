import {Service} from '@e22m4u/js-service';
import {RelationType} from './relation-type.js';
import {RelationType as Type} from './relation-type.js';
import {InvalidArgumentError} from '../../../errors/index.js';

/**
 * Relations definition validator.
 */
export class RelationsDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} relDefs
   */
  validate(modelName, relDefs) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of RelationsDefinitionValidator.validate ' +
          'should be a non-empty String, but %v given.',
        modelName,
      );
    if (!relDefs || typeof relDefs !== 'object' || Array.isArray(relDefs))
      throw new InvalidArgumentError(
        'The provided option "relations" of the model %v ' +
          'should be an Object, but %v given.',
        modelName,
        relDefs,
      );
    const relNames = Object.keys(relDefs);
    relNames.forEach(relName => {
      const relDef = relDefs[relName];
      this._validateRelation(modelName, relName, relDef);
    });
  }

  /**
   * Validate relation.
   *
   * @param {string} modelName
   * @param {string} relName
   * @param {object} relDef
   */
  _validateRelation(modelName, relName, relDef) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of RelationsDefinitionValidator._validateRelation ' +
          'should be a non-empty String, but %v given.',
        modelName,
      );
    if (!relName || typeof relName !== 'string')
      throw new InvalidArgumentError(
        'The relation name of the model %v should be ' +
          'a non-empty String, but %v given.',
        modelName,
        relName,
      );
    if (!relDef || typeof relDef !== 'object' || Array.isArray(relDef))
      throw new InvalidArgumentError(
        'The relation %v of the model %v should be an Object, but %v given.',
        relName,
        modelName,
        relDef,
      );
    if (!relDef.type || !Object.values(Type).includes(relDef.type))
      throw new InvalidArgumentError(
        'The relation %v of the model %v requires the option "type" ' +
          'to have one of relation types: %l, but %v given.',
        relName,
        modelName,
        Object.values(Type),
        relDef.type,
      );
    this._validateBelongsTo(modelName, relName, relDef);
    this._validateHasOne(modelName, relName, relDef);
    this._validateHasMany(modelName, relName, relDef);
    this._validateReferencesMany(modelName, relName, relDef);
  }

  /**
   * Validate "belongsTo".
   *
   * @example The regular "belongsTo" relation.
   * ```
   * {
   *   type: RelationType.BELONGS_TO,
   *   model: 'model',
   *   foreignKey: 'modelId', // optional
   * }
   * ```
   *
   * @example The polymorphic "belongsTo" relation.
   * ```
   * {
   *   type: RelationType.BELONGS_TO,
   *   polymorphic: true,
   *   foreignKey: 'referenceId',      // optional
   *   discriminator: 'referenceType', // optional
   * }
   * ```
   *
   * @param {string} modelName
   * @param {string} relName
   * @param {object} relDef
   * @private
   */
  _validateBelongsTo(modelName, relName, relDef) {
    if (relDef.type !== Type.BELONGS_TO) return;
    if (relDef.polymorphic) {
      // A polymorphic "belongsTo" relation.
      if (typeof relDef.polymorphic !== 'boolean')
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "belongsTo", ' +
            'so it expects the option "polymorphic" to be a Boolean, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.polymorphic,
        );
      if (relDef.foreignKey && typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %v of the model %v is a polymorphic "belongsTo" relation, ' +
            'so it expects the provided option "foreignKey" to be a String, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator && typeof relDef.discriminator !== 'string')
        throw new InvalidArgumentError(
          'The relation %v of the model %v is a polymorphic "belongsTo" relation, ' +
            'so it expects the provided option "discriminator" to be a String, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.discriminator,
        );
    } else {
      // A regular "belongsTo" relation.
      if (!relDef.model || typeof relDef.model !== 'string')
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "belongsTo", ' +
            'so it requires the option "model" to be a non-empty String, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.model,
        );
      if (relDef.foreignKey && typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "belongsTo", ' +
            'so it expects the provided option "foreignKey" to be a String, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator)
        throw new InvalidArgumentError(
          'The relation %v of the model %v is a non-polymorphic "belongsTo" relation, ' +
            'so it should not have the option "discriminator" to be provided.',
          relName,
          modelName,
        );
    }
  }

  /**
   * Validate "hasOne".
   *
   * @example The regular "hasOne" relation.
   * ```
   * {
   *   type: RelationType.HAS_ONE,
   *   model: 'model',
   *   foreignKey: 'modelId',
   * }
   * ```
   *
   * @example The polymorphic "hasOne" relation with a target relation name.
   * ```
   * {
   *   type: RelationType.HAS_ONE,
   *   model: 'model',
   *   polymorphic: 'reference',
   * }
   * ```
   *
   * @example The polymorphic "hasOne" relation with target relation keys.
   * ```
   * {
   *   type: RelationType.HAS_ONE,
   *   model: 'model',
   *   polymorphic: true,
   *   foreignKey: 'referenceId',
   *   discriminator: 'referenceType,
   * }
   * ```
   *
   * @param {string} modelName
   * @param {string} relName
   * @param {object} relDef
   * @private
   */
  _validateHasOne(modelName, relName, relDef) {
    if (relDef.type !== RelationType.HAS_ONE) return;
    if (!relDef.model || typeof relDef.model !== 'string')
      throw new InvalidArgumentError(
        'The relation %v of the model %v has the type "hasOne", ' +
          'so it requires the option "model" to be a non-empty String, ' +
          'but %v given.',
        relName,
        modelName,
        relDef.model,
      );
    if (relDef.polymorphic) {
      if (typeof relDef.polymorphic === 'string') {
        // A polymorphic "hasOne" relation with a target relation name.
        if (relDef.foreignKey)
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" with ' +
              'a String value, so it should not have the option "foreignKey" ' +
              'to be provided.',
            relName,
            modelName,
          );
        if (relDef.discriminator)
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" with ' +
              'a String value, so it should not have the option "discriminator" ' +
              'to be provided.',
            relName,
            modelName,
          );
      } else if (typeof relDef.polymorphic === 'boolean') {
        // A polymorphic "hasOne" relation with target relation keys.
        if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" ' +
              'with "true" value, so it requires the option "foreignKey" ' +
              'to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.foreignKey,
          );
        if (!relDef.discriminator || typeof relDef.discriminator !== 'string')
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" ' +
              'with "true" value, so it requires the option "discriminator" ' +
              'to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.discriminator,
          );
      } else {
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "hasOne", ' +
            'so it expects the provided option "polymorphic" to be ' +
            'a String or a Boolean, but %v given.',
          relName,
          modelName,
          relDef.polymorphic,
        );
      }
    } else {
      // A regular "hasOne" relation.
      if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "hasOne", ' +
            'so it requires the option "foreignKey" to be a non-empty String, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator)
        throw new InvalidArgumentError(
          'The relation %v of the model %v is a non-polymorphic "hasOne" relation, ' +
            'so it should not have the option "discriminator" to be provided.',
          relName,
          modelName,
        );
    }
  }

  /**
   * Validate "hasMany".
   *
   * @example The regular "hasMany" relation.
   * ```
   * {
   *   type: RelationType.HAS_MANY,
   *   model: 'model',
   *   foreignKey: 'modelId',
   * }
   * ```
   *
   * @example The polymorphic "hasMany" relation with a target relation name.
   * ```
   * {
   *   type: RelationType.HAS_MANY,
   *   model: 'model',
   *   polymorphic: 'reference',
   * }
   * ```
   *
   * @example The polymorphic "hasMany" relation with target relation keys.
   * ```
   * {
   *   type: RelationType.HAS_MANY,
   *   model: 'model',
   *   polymorphic: true,
   *   foreignKey: 'referenceId',
   *   discriminator: 'referenceType,
   * }
   * ```
   *
   * @param {string} modelName
   * @param {string} relName
   * @param {object} relDef
   * @private
   */
  _validateHasMany(modelName, relName, relDef) {
    if (relDef.type !== RelationType.HAS_MANY) return;
    if (!relDef.model || typeof relDef.model !== 'string')
      throw new InvalidArgumentError(
        'The relation %v of the model %v has the type "hasMany", ' +
          'so it requires the option "model" to be a non-empty String, ' +
          'but %v given.',
        relName,
        modelName,
        relDef.model,
      );
    if (relDef.polymorphic) {
      if (typeof relDef.polymorphic === 'string') {
        // A polymorphic "hasMany" relation with a target relation name.
        if (relDef.foreignKey)
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" with ' +
              'a String value, so it should not have the option "foreignKey" ' +
              'to be provided.',
            relName,
            modelName,
          );
        if (relDef.discriminator)
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" with ' +
              'a String value, so it should not have the option "discriminator" ' +
              'to be provided.',
            relName,
            modelName,
          );
      } else if (typeof relDef.polymorphic === 'boolean') {
        // A polymorphic "hasMany" relation with target relation keys.
        if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" ' +
              'with "true" value, so it requires the option "foreignKey" ' +
              'to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.foreignKey,
          );
        if (!relDef.discriminator || typeof relDef.discriminator !== 'string')
          throw new InvalidArgumentError(
            'The relation %v of the model %v has the option "polymorphic" ' +
              'with "true" value, so it requires the option "discriminator" ' +
              'to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.discriminator,
          );
      } else {
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "hasMany", ' +
            'so it expects the provided option "polymorphic" to be ' +
            'a String or a Boolean, but %v given.',
          relName,
          modelName,
          relDef.polymorphic,
        );
      }
    } else {
      // A regular "hasMany" relation.
      if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %v of the model %v has the type "hasMany", ' +
            'so it requires the option "foreignKey" to be a non-empty String, ' +
            'but %v given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator)
        throw new InvalidArgumentError(
          'The relation %v of the model %v is a non-polymorphic "hasMany" relation, ' +
            'so it should not have the option "discriminator" to be provided.',
          relName,
          modelName,
        );
    }
  }

  /**
   * Validate "referencesMany".
   *
   * @example
   * ```
   * {
   *   type: RelationType.REFERENCES_MANY,
   *   model: 'model',
   *   foreignKey: 'modelIds', // optional
   * }
   * ```
   *
   * @param {string} modelName
   * @param {string} relName
   * @param {object} relDef
   * @private
   */
  _validateReferencesMany(modelName, relName, relDef) {
    if (relDef.type !== Type.REFERENCES_MANY) return;
    if (!relDef.model || typeof relDef.model !== 'string')
      throw new InvalidArgumentError(
        'The relation %v of the model %v has the type "referencesMany", ' +
          'so it requires the option "model" to be a non-empty String, ' +
          'but %v given.',
        relName,
        modelName,
        relDef.model,
      );
    if (relDef.foreignKey && typeof relDef.foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The relation %v of the model %v has the type "referencesMany", ' +
          'so it expects the provided option "foreignKey" to be a String, ' +
          'but %v given.',
        relName,
        modelName,
        relDef.foreignKey,
      );
    if (relDef.discriminator)
      throw new InvalidArgumentError(
        'The relation %v of the model %v has the type "referencesMany", ' +
          'so it should not have the option "discriminator" to be provided.',
        relName,
        modelName,
      );
  }
}
