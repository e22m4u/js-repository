import {Service} from '@e22m4u/js-service';
import {cloneDeep} from '../utils/index.js';
import {RelationType} from '../definition/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {RepositoryRegistry} from '../repository/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';

/**
 * Has many resolver.
 */
export class HasManyResolver extends Service {
  /**
   * Include to.
   *
   * @param {object[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string} foreignKey
   * @param {object|undefined} scope
   * @returns {Promise<void>}
   */
  async includeTo(
    entities,
    sourceName,
    targetName,
    relationName,
    foreignKey,
    scope = undefined,
  ) {
    if (!entities || !Array.isArray(entities))
      throw new InvalidArgumentError(
        'The parameter "entities" of HasManyResolver.includeTo requires ' +
          'an Array of Object, but %v was given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of HasManyResolver.includeTo requires ' +
          'a non-empty String, but %v was given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of HasManyResolver.includeTo requires ' +
          'a non-empty String, but %v was given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of HasManyResolver.includeTo requires ' +
          'a non-empty String, but %v was given.',
        relationName,
      );
    if (!foreignKey || typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The parameter "foreignKey" of HasManyResolver.includeTo requires ' +
          'a non-empty String, but %v was given.',
        foreignKey,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of HasManyResolver.includeTo ' +
          'should be an Object, but %v was given.',
        scope,
      );

    const sourcePkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        sourceName,
      );
    const sourceIds = [];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of HasManyResolver.includeTo requires ' +
            'an Array of Object, but %v was given.',
          entity,
        );
      const sourceId = entity[sourcePkPropName];
      if (sourceIds.includes(sourceId)) return;
      sourceIds.push(sourceId);
    });

    const promises = [];
    const targetRepository =
      this.getService(RepositoryRegistry).getRepository(targetName);
    scope = scope ? cloneDeep(scope) : {};
    const targetsBySourceId = new Map();
    sourceIds.forEach(sourceId => {
      const filter = cloneDeep(scope);
      filter.where = {
        and: [{[foreignKey]: sourceId}, ...(scope.where ? [scope.where] : [])],
      };
      promises.push(
        targetRepository.find(filter).then(result => {
          if (result.length) {
            let targets = targetsBySourceId.get(sourceId) ?? [];
            targets = [...targets, ...result];
            targetsBySourceId.set(sourceId, targets);
          }
        }),
      );
    });
    await Promise.all(promises);

    entities.forEach(entity => {
      const sourceId = entity[sourcePkPropName];
      entity[relationName] = targetsBySourceId.get(sourceId) ?? [];
    });
  }

  /**
   * Include polymorphic to.
   *
   * @param {object[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string} foreignKey
   * @param {string} discriminator
   * @param {object|undefined} scope
   * @returns {Promise<void>}
   */
  async includePolymorphicTo(
    entities,
    sourceName,
    targetName,
    relationName,
    foreignKey,
    discriminator,
    scope = undefined,
  ) {
    if (!entities || !Array.isArray(entities))
      throw new InvalidArgumentError(
        'The parameter "entities" of HasManyResolver.includePolymorphicTo requires ' +
          'an Array of Object, but %v was given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of HasManyResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %v was given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of HasManyResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %v was given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of HasManyResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %v was given.',
        relationName,
      );
    if (!foreignKey || typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The parameter "foreignKey" of HasManyResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %v was given.',
        foreignKey,
      );
    if (!discriminator || typeof discriminator !== 'string')
      throw new InvalidArgumentError(
        'The parameter "discriminator" of HasManyResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %v was given.',
        discriminator,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of HasManyResolver.includePolymorphicTo ' +
          'should be an Object, but %v was given.',
        scope,
      );

    const sourcePkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        sourceName,
      );
    const sourceIds = [];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of HasManyResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %v was given.',
          entity,
        );
      const sourceId = entity[sourcePkPropName];
      if (sourceIds.includes(sourceId)) return;
      sourceIds.push(sourceId);
    });

    const promises = [];
    const targetRepository =
      this.getService(RepositoryRegistry).getRepository(targetName);
    scope = scope ? cloneDeep(scope) : {};
    const targetsBySourceId = new Map();
    sourceIds.forEach(sourceId => {
      const filter = cloneDeep(scope);
      filter.where = {
        and: [
          {[foreignKey]: sourceId, [discriminator]: sourceName},
          ...(scope.where ? [scope.where] : []),
        ],
      };
      promises.push(
        targetRepository.find(filter).then(result => {
          if (result.length) {
            let targets = targetsBySourceId.get(sourceId) ?? [];
            targets = [...targets, ...result];
            targetsBySourceId.set(sourceId, targets);
          }
        }),
      );
    });
    await Promise.all(promises);

    entities.forEach(entity => {
      const sourceId = entity[sourcePkPropName];
      entity[relationName] = targetsBySourceId.get(sourceId) ?? [];
    });
  }

  /**
   * Include polymorphic by relation name.
   *
   * @param {object[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string} targetRelationName
   * @param {object|undefined} scope
   * @returns {Promise<void>}
   */
  async includePolymorphicByRelationName(
    entities,
    sourceName,
    targetName,
    relationName,
    targetRelationName,
    scope = undefined,
  ) {
    if (!entities || !Array.isArray(entities))
      throw new InvalidArgumentError(
        'The parameter "entities" of HasManyResolver.includePolymorphicByRelationName requires ' +
          'an Array of Object, but %v was given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of HasManyResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %v was given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of HasManyResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %v was given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of HasManyResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %v was given.',
        relationName,
      );
    if (!targetRelationName || typeof targetRelationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetRelationName" of HasManyResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %v was given.',
        targetRelationName,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of HasManyResolver.includePolymorphicByRelationName ' +
          'should be an Object, but %v was given.',
        scope,
      );

    const targetRelationDef = this.getService(
      ModelDefinitionUtils,
    ).getRelationDefinitionByName(targetName, targetRelationName);
    if (targetRelationDef.type !== RelationType.BELONGS_TO)
      throw new InvalidArgumentError(
        'The relation %v of the model %v is a polymorphic "hasMany" relation, ' +
          'so it requires the target relation %v to be a polymorphic "belongsTo", ' +
          'but %v type was given.',
        relationName,
        sourceName,
        targetRelationName,
        targetRelationDef.type,
      );
    if (!targetRelationDef.polymorphic)
      throw new InvalidArgumentError(
        'The relation %v of the model %v is a polymorphic "hasMany" relation, ' +
          'so it requires the target relation %v to be a polymorphic too.',
        relationName,
        sourceName,
        targetRelationName,
      );
    const foreignKey =
      targetRelationDef.foreignKey || `${targetRelationName}Id`;
    const discriminator =
      targetRelationDef.discriminator || `${targetRelationName}Type`;

    return this.includePolymorphicTo(
      entities,
      sourceName,
      targetName,
      relationName,
      foreignKey,
      discriminator,
      scope,
    );
  }
}
