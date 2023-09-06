import {RelationType} from './relation-type.js';
import {Service} from '../../../service/index.js';
import {arrayToString} from '../../../utils/index.js';
import {RelationType as Type} from './relation-type.js';
import {InvalidArgumentError} from '../../../errors/index.js';

/**
 * Relations definition validator.
 */
export class RelationsDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelName
   * @param relDefs
   */
  validate(modelName, relDefs) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'A first argument of RelationsDefinitionValidator.validate ' +
          'should be a non-empty String, but %s given.',
        modelName,
      );
    if (!relDefs || typeof relDefs !== 'object' || Array.isArray(relDefs))
      throw new InvalidArgumentError(
        'The provided option "relations" of the model %s ' +
          'should be an Object, but %s given.',
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
   * @param modelName
   * @param relName
   * @param relDef
   */
  _validateRelation(modelName, relName, relDef) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'A first argument of RelationsDefinitionValidator._validateRelation ' +
          'should be a non-empty String, but %s given.',
        modelName,
      );
    if (!relName || typeof relName !== 'string')
      throw new InvalidArgumentError(
        'The relation name of the model %s should be ' +
          'a non-empty String, but %s given.',
        modelName,
        relName,
      );
    if (!relDef || typeof relDef !== 'object' || Array.isArray(relDef))
      throw new InvalidArgumentError(
        'The relation %s of the model %s should be an Object, but %s given.',
        relName,
        modelName,
        relDef,
      );
    if (!relDef.type || !Object.values(Type).includes(relDef.type))
      throw new InvalidArgumentError(
        'The relation %s of the model %s requires the option "type" ' +
          'to have one of relation types: %s, but %s given.',
        relName,
        modelName,
        new String(arrayToString(Object.values(Type))),
        relDef.type,
      );
    this._validateBelongsTo(modelName, relName, relDef);
    this._validateHasOne(modelName, relName, relDef);
    this._validateHasMany(modelName, relName, relDef);
    this._validateReferencesMany(modelName, relName, relDef);
  }

  /**
   * Validate belongs to.
   *
   * @example A regular "belongsTo" relation.
   * ```
   * {
   *   type: RelationType.BELONGS_TO,
   *   model: 'model',
   *   foreignKey: 'modelId', // optional
   * }
   * ```
   *
   * @example A polymorphic "belongsTo" relation.
   * ```
   * {
   *   type: RelationType.BELONGS_TO,
   *   polymorphic: true,
   *   foreignKey: 'referenceId',     // optional
   *   discriminator: 'referenceType, // optional
   * }
   * ```
   *
   * @param {string} modelName
   * @param {string} relName
   * @param {Record<string, unknown>} relDef
   * @private
   */
  _validateBelongsTo(modelName, relName, relDef) {
    if (relDef.type !== Type.BELONGS_TO) return;
    if (relDef.polymorphic) {
      // A polymorphic "belongsTo" relation.
      if (typeof relDef.polymorphic !== 'boolean')
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "belongsTo", ' +
            'so it expects the option "polymorphic" to be a Boolean, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.polymorphic,
        );
      if (relDef.foreignKey && typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %s of the model %s is a polymorphic "belongsTo" relation, ' +
            'so it expects the provided option "foreignKey" to be a String, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator && typeof relDef.discriminator !== 'string')
        throw new InvalidArgumentError(
          'The relation %s of the model %s is a polymorphic "belongsTo" relation, ' +
            'so it expects the provided option "discriminator" to be a String, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.discriminator,
        );
    } else {
      // A regular "belongsTo" relation.
      if (!relDef.model || typeof relDef.model !== 'string')
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "belongsTo", ' +
            'so it requires the option "model" to be a non-empty String, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.model,
        );
      if (relDef.foreignKey && typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "belongsTo", ' +
            'so it expects the provided option "foreignKey" to be a String, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator)
        throw new InvalidArgumentError(
          'The relation %s of the model %s is a non-polymorphic "belongsTo" relation, ' +
            'so it should not have the option "discriminator" to be provided.',
          relName,
          modelName,
        );
    }
  }

  /**
   * Validate has one.
   *
   * @example A regular "hasOne" relation.
   * ```
   * {
   *   type: RelationType.HAS_ONE,
   *   model: 'model',
   *   foreignKey: 'modelId',
   * }
   * ```
   *
   * @example A polymorphic "hasOne" relation with a target relation name.
   * ```
   * {
   *   type: RelationType.HAS_ONE,
   *   model: 'model',
   *   polymorphic: 'reference',
   * }
   * ```
   *
   * @example A polymorphic "hasOne" relation with target relation keys.
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
   * @param {Record<string, unknown>} relDef
   * @private
   */
  _validateHasOne(modelName, relName, relDef) {
    if (relDef.type !== RelationType.HAS_ONE) return;
    if (!relDef.model || typeof relDef.model !== 'string')
      throw new InvalidArgumentError(
        'The relation %s of the model %s has the type "hasOne", ' +
          'so it requires the option "model" to be a non-empty String, ' +
          'but %s given.',
        relName,
        modelName,
        relDef.model,
      );
    if (relDef.polymorphic) {
      if (typeof relDef.polymorphic === 'string') {
        // A polymorphic "hasOne" relation with a target relation name.
        if (relDef.foreignKey)
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" with ' +
              'a String value, so it should not have the option "foreignKey" ' +
              'to be provided.',
            relName,
            modelName,
          );
        if (relDef.discriminator)
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" with ' +
              'a String value, so it should not have the option "discriminator" ' +
              'to be provided.',
            relName,
            modelName,
          );
      } else if (typeof relDef.polymorphic === 'boolean') {
        // A polymorphic "hasOne" relation with target relation keys.
        if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" ' +
              'with "true" value, so it requires the option "foreignKey" ' +
              'to be a non-empty String, but %s given.',
            relName,
            modelName,
            relDef.foreignKey,
          );
        if (!relDef.discriminator || typeof relDef.discriminator !== 'string')
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" ' +
              'with "true" value, so it requires the option "discriminator" ' +
              'to be a non-empty String, but %s given.',
            relName,
            modelName,
            relDef.discriminator,
          );
      } else {
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "hasOne", ' +
            'so it expects the provided option "polymorphic" to be ' +
            'a String or a Boolean, but %s given.',
          relName,
          modelName,
          relDef.polymorphic,
        );
      }
    } else {
      // A regular "hasOne" relation.
      if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "hasOne", ' +
            'so it requires the option "foreignKey" to be a non-empty String, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator)
        throw new InvalidArgumentError(
          'The relation %s of the model %s is a non-polymorphic "hasOne" relation, ' +
            'so it should not have the option "discriminator" to be provided.',
          relName,
          modelName,
        );
    }
  }

  /**
   * Validate has one.
   *
   * @example A regular "hasMany" relation.
   * ```
   * {
   *   type: RelationType.HAS_MANY,
   *   model: 'model',
   *   foreignKey: 'modelId',
   * }
   * ```
   *
   * @example A polymorphic "hasMany" relation with a target relation name.
   * ```
   * {
   *   type: RelationType.HAS_MANY,
   *   model: 'model',
   *   polymorphic: 'reference',
   * }
   * ```
   *
   * @example A polymorphic "hasMany" relation with target relation keys.
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
   * @param {Record<string, unknown>} relDef
   * @private
   */
  _validateHasMany(modelName, relName, relDef) {
    if (relDef.type !== RelationType.HAS_MANY) return;
    if (!relDef.model || typeof relDef.model !== 'string')
      throw new InvalidArgumentError(
        'The relation %s of the model %s has the type "hasMany", ' +
          'so it requires the option "model" to be a non-empty String, ' +
          'but %s given.',
        relName,
        modelName,
        relDef.model,
      );
    if (relDef.polymorphic) {
      if (typeof relDef.polymorphic === 'string') {
        // A polymorphic "hasMany" relation with a target relation name.
        if (relDef.foreignKey)
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" with ' +
              'a String value, so it should not have the option "foreignKey" ' +
              'to be provided.',
            relName,
            modelName,
          );
        if (relDef.discriminator)
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" with ' +
              'a String value, so it should not have the option "discriminator" ' +
              'to be provided.',
            relName,
            modelName,
          );
      } else if (typeof relDef.polymorphic === 'boolean') {
        // A polymorphic "hasMany" relation with target relation keys.
        if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" ' +
              'with "true" value, so it requires the option "foreignKey" ' +
              'to be a non-empty String, but %s given.',
            relName,
            modelName,
            relDef.foreignKey,
          );
        if (!relDef.discriminator || typeof relDef.discriminator !== 'string')
          throw new InvalidArgumentError(
            'The relation %s of the model %s has the option "polymorphic" ' +
              'with "true" value, so it requires the option "discriminator" ' +
              'to be a non-empty String, but %s given.',
            relName,
            modelName,
            relDef.discriminator,
          );
      } else {
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "hasMany", ' +
            'so it expects the provided option "polymorphic" to be ' +
            'a String or a Boolean, but %s given.',
          relName,
          modelName,
          relDef.polymorphic,
        );
      }
    } else {
      // A regular "hasMany" relation.
      if (!relDef.foreignKey || typeof relDef.foreignKey !== 'string')
        throw new InvalidArgumentError(
          'The relation %s of the model %s has the type "hasMany", ' +
            'so it requires the option "foreignKey" to be a non-empty String, ' +
            'but %s given.',
          relName,
          modelName,
          relDef.foreignKey,
        );
      if (relDef.discriminator)
        throw new InvalidArgumentError(
          'The relation %s of the model %s is a non-polymorphic "hasMany" relation, ' +
            'so it should not have the option "discriminator" to be provided.',
          relName,
          modelName,
        );
    }
  }

  /**
   * Validate references many.
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
   * @param {Record<string, unknown>} relDef
   * @private
   */
  _validateReferencesMany(modelName, relName, relDef) {
    if (relDef.type !== Type.REFERENCES_MANY) return;
    if (!relDef.model || typeof relDef.model !== 'string')
      throw new InvalidArgumentError(
        'The relation %s of the model %s has the type "referencesMany", ' +
          'so it requires the option "model" to be a non-empty String, ' +
          'but %s given.',
        relName,
        modelName,
        relDef.model,
      );
    if (relDef.foreignKey && typeof relDef.foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The relation %s of the model %s has the type "referencesMany", ' +
          'so it expects the provided option "foreignKey" to be a String, ' +
          'but %s given.',
        relName,
        modelName,
        relDef.foreignKey,
      );
    if (relDef.discriminator)
      throw new InvalidArgumentError(
        'The relation %s of the model %s has the type "referencesMany", ' +
          'so it should not have the option "discriminator" to be provided.',
        relName,
        modelName,
      );
  }
}
