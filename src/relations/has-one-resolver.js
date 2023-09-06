import {Service} from '../service/index.js';
import {cloneDeep} from '../utils/index.js';
import {RelationType} from '../definition/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {RepositoryRegistry} from '../repository/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';

/**
 * Has one resolver.
 */
export class HasOneResolver extends Service {
  /**
   * Include to.
   *
   * @param {Record<string, unknown>[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string} foreignKey
   * @param {Record<string, unknown>|undefined} scope
   * @return {Promise<void>}
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
        'The parameter "entities" of HasOneResolver.includeTo requires ' +
          'an Array of Object, but %s given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of HasOneResolver.includeTo requires ' +
          'a non-empty String, but %s given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of HasOneResolver.includeTo requires ' +
          'a non-empty String, but %s given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of HasOneResolver.includeTo requires ' +
          'a non-empty String, but %s given.',
        relationName,
      );
    if (!foreignKey || typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The parameter "foreignKey" of HasOneResolver.includeTo requires ' +
          'a non-empty String, but %s given.',
        foreignKey,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of HasOneResolver.includeTo ' +
          'should be an Object, but %s given.',
        scope,
      );

    const sourcePkPropName =
      this.get(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(sourceName);
    const sourceIds = [];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of HasOneResolver.includeTo requires ' +
            'an Array of Object, but %s given.',
          entity,
        );
      const sourceId = entity[sourcePkPropName];
      if (sourceIds.includes(sourceId)) return;
      sourceIds.push(sourceId);
    });

    const promises = [];
    const targetRepository =
      this.get(RepositoryRegistry).getRepository(targetName);
    scope = scope ? cloneDeep(scope) : {};
    const targetBySourceId = new Map();
    sourceIds.forEach(sourceId => {
      const filter = cloneDeep(scope);
      filter.where = {
        and: [{[foreignKey]: sourceId}, ...(scope.where ? [scope.where] : [])],
      };
      filter.limit = 1;
      promises.push(
        targetRepository.find(filter).then(result => {
          if (result.length) targetBySourceId.set(sourceId, result[0]);
        }),
      );
    });
    await Promise.all(promises);

    Array.from(targetBySourceId.keys()).forEach(sourceId => {
      const sources = entities.filter(v => v[sourcePkPropName] === sourceId);
      sources.forEach(v => (v[relationName] = targetBySourceId.get(sourceId)));
    });
  }

  /**
   * Include polymorphic to.
   *
   * @param {Record<string, unknown>[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string} foreignKey
   * @param {string} discriminator
   * @param {Record<string, unknown>|undefined} scope
   * @return {Promise<void>}
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
        'The parameter "entities" of HasOneResolver.includePolymorphicTo requires ' +
          'an Array of Object, but %s given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of HasOneResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %s given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of HasOneResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %s given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of HasOneResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %s given.',
        relationName,
      );
    if (!foreignKey || typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The parameter "foreignKey" of HasOneResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %s given.',
        foreignKey,
      );
    if (!discriminator || typeof discriminator !== 'string')
      throw new InvalidArgumentError(
        'The parameter "discriminator" of HasOneResolver.includePolymorphicTo requires ' +
          'a non-empty String, but %s given.',
        discriminator,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of HasOneResolver.includePolymorphicTo ' +
          'should be an Object, but %s given.',
        scope,
      );

    const sourcePkPropName =
      this.get(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(sourceName);
    const sourceIds = [];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of HasOneResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %s given.',
          entity,
        );
      const sourceId = entity[sourcePkPropName];
      if (sourceIds.includes(sourceId)) return;
      sourceIds.push(sourceId);
    });

    const promises = [];
    const targetRepository =
      this.get(RepositoryRegistry).getRepository(targetName);
    scope = scope ? cloneDeep(scope) : {};
    const targetBySourceId = new Map();
    sourceIds.forEach(sourceId => {
      const filter = cloneDeep(scope);
      filter.where = {
        and: [
          {[foreignKey]: sourceId, [discriminator]: sourceName},
          ...(scope.where ? [scope.where] : []),
        ],
      };
      filter.limit = 1;
      promises.push(
        targetRepository.find(filter).then(result => {
          if (result.length) targetBySourceId.set(sourceId, result[0]);
        }),
      );
    });
    await Promise.all(promises);

    Array.from(targetBySourceId.keys()).forEach(sourceId => {
      const sources = entities.filter(v => v[sourcePkPropName] === sourceId);
      sources.forEach(v => (v[relationName] = targetBySourceId.get(sourceId)));
    });
  }

  /**
   * Include polymorphic by relation name.
   *
   * @param {Record<string, unknown>[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string} targetRelationName
   * @param {Record<string, unknown>|undefined} scope
   * @return {Promise<void>}
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
        'The parameter "entities" of HasOneResolver.includePolymorphicByRelationName requires ' +
          'an Array of Object, but %s given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of HasOneResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %s given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of HasOneResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %s given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of HasOneResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %s given.',
        relationName,
      );
    if (!targetRelationName || typeof targetRelationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetRelationName" of HasOneResolver.includePolymorphicByRelationName requires ' +
          'a non-empty String, but %s given.',
        targetRelationName,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of HasOneResolver.includePolymorphicByRelationName ' +
          'should be an Object, but %s given.',
        scope,
      );

    const targetRelationDef = this.get(
      ModelDefinitionUtils,
    ).getRelationDefinitionByName(targetName, targetRelationName);
    if (targetRelationDef.type !== RelationType.BELONGS_TO)
      throw new InvalidArgumentError(
        'The relation %s of the model %s is a polymorphic "hasOne" relation, ' +
          'so it requires the target relation %s to be a polymorphic "belongsTo", ' +
          'but %s type given.',
        relationName,
        sourceName,
        targetRelationName,
        targetRelationDef.type,
      );
    if (!targetRelationDef.polymorphic)
      throw new InvalidArgumentError(
        'The relation %s of the model %s is a polymorphic "hasOne" relation, ' +
          'so it requires the target relation %s to be a polymorphic too.',
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
