import {Service} from '@e22m4u/service';
import {cloneDeep} from '../utils/index.js';
import {singularize} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {RepositoryRegistry} from '../repository/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';

/**
 * Belongs to resolver.
 */
export class BelongsToResolver extends Service {
  /**
   * Include to.
   *
   * @param {object[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string|undefined} foreignKey
   * @param {object|undefined} scope
   * @returns {Promise<void>}
   */
  async includeTo(
    entities,
    sourceName,
    targetName,
    relationName,
    foreignKey = undefined,
    scope = undefined,
  ) {
    if (!entities || !Array.isArray(entities))
      throw new InvalidArgumentError(
        'The parameter "entities" of BelongsToResolver.includeTo requires ' +
          'an Array of Object, but %v given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of BelongsToResolver.includeTo requires ' +
          'a non-empty String, but %v given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of BelongsToResolver.includeTo requires ' +
          'a non-empty String, but %v given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of BelongsToResolver.includeTo requires ' +
          'a non-empty String, but %v given.',
        relationName,
      );
    if (foreignKey && typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The provided parameter "foreignKey" of BelongsToResolver.includeTo ' +
          'should be a String, but %v given.',
        foreignKey,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of BelongsToResolver.includeTo ' +
          'should be an Object, but %v given.',
        scope,
      );
    if (foreignKey == null) foreignKey = `${relationName}Id`;
    const targetIds = entities.reduce((acc, entity) => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of BelongsToResolver.includeTo requires ' +
            'an Array of Object, but %v given.',
          entity,
        );
      const targetId = entity[foreignKey];
      return targetId != null ? [...acc, targetId] : acc;
    }, []);
    const targetRepository =
      this.getService(RepositoryRegistry).getRepository(targetName);
    const targetPkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        targetName,
      );
    scope = scope ? cloneDeep(scope) : {};
    const filter = cloneDeep(scope);
    filter.where = {
      and: [
        {[targetPkPropName]: {inq: targetIds}},
        ...(scope.where ? [scope.where] : []),
      ],
    };
    const targets = await targetRepository.find(filter);
    entities.forEach(entity => {
      const target = targets.find(
        e => e[targetPkPropName] === entity[foreignKey],
      );
      if (target) entity[relationName] = target;
    });
  }

  /**
   * Include polymorphic to.
   *
   * @param {object[]} entities
   * @param {string} sourceName
   * @param {string} relationName
   * @param {string|undefined} foreignKey
   * @param {string|undefined} discriminator
   * @param {object|undefined} scope
   * @returns {Promise<void>}
   */
  async includePolymorphicTo(
    entities,
    sourceName,
    relationName,
    foreignKey = undefined,
    discriminator = undefined,
    scope = undefined,
  ) {
    if (!entities || !Array.isArray(entities))
      throw new InvalidArgumentError(
        'The parameter "entities" of BelongsToResolver.includePolymorphicTo ' +
          'requires an Array of Object, but %v given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of BelongsToResolver.includePolymorphicTo ' +
          'requires a non-empty String, but %v given.',
        sourceName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of BelongsToResolver.includePolymorphicTo ' +
          'requires a non-empty String, but %v given.',
        relationName,
      );
    if (foreignKey && typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The provided parameter "foreignKey" of BelongsToResolver.includePolymorphicTo ' +
          'should be a String, but %v given.',
        foreignKey,
      );
    if (discriminator && typeof discriminator !== 'string')
      throw new InvalidArgumentError(
        'The provided parameter "discriminator" of BelongsToResolver.includePolymorphicTo ' +
          'should be a String, but %v given.',
        discriminator,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of BelongsToResolver.includePolymorphicTo ' +
          'should be an Object, but %v given.',
        scope,
      );
    if (foreignKey == null) {
      const singularRelationName = singularize(relationName);
      foreignKey = `${singularRelationName}Id`;
    }
    if (discriminator == null) {
      const singularRelationName = singularize(relationName);
      discriminator = `${singularRelationName}Type`;
    }
    const targetIdsByTargetName = {};
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of BelongsToResolver.includePolymorphicTo requires ' +
            'an Array of Object, but %v given.',
          entity,
        );
      const targetId = entity[foreignKey];
      const targetName = entity[discriminator];
      if (targetId == null || targetName == null) return;
      if (targetIdsByTargetName[targetName] == null)
        targetIdsByTargetName[targetName] = [];
      if (!targetIdsByTargetName[targetName].includes(targetId))
        targetIdsByTargetName[targetName].push(targetId);
    });
    const promises = [];
    const targetNames = Object.keys(targetIdsByTargetName);
    scope = scope ? cloneDeep(scope) : {};
    const targetEntitiesByTargetNames = {};
    targetNames.forEach(targetName => {
      let targetRepository;
      try {
        targetRepository =
          this.getService(RepositoryRegistry).getRepository(targetName);
      } catch (error) {
        if (error instanceof InvalidArgumentError) {
          if (
            error.message === `The model "${targetName}" is not defined.` ||
            error.message ===
              `The model "${targetName}" does not have a specified datasource.`
          ) {
            return;
          }
        } else {
          throw error;
        }
      }
      const targetPkPropName =
        this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          targetName,
        );
      const targetFilter = cloneDeep(scope);
      const targetIds = targetIdsByTargetName[targetName];
      targetFilter.where = {
        and: [
          {[targetPkPropName]: {inq: targetIds}},
          ...(scope.where ? [scope.where] : []),
        ],
      };
      const promise = targetRepository.find(targetFilter).then(result => {
        targetEntitiesByTargetNames[targetName] = [
          ...(targetEntitiesByTargetNames[targetName] ?? []),
          ...result,
        ];
      });
      promises.push(promise);
    });
    await Promise.all(promises);
    entities.forEach(entity => {
      const targetId = entity[foreignKey];
      const targetName = entity[discriminator];
      if (
        targetId == null ||
        targetName == null ||
        targetEntitiesByTargetNames[targetName] == null
      ) {
        return;
      }
      const targetEntities = targetEntitiesByTargetNames[targetName] ?? [];
      const targetPkPropName =
        this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          targetName,
        );
      const target = targetEntities.find(e => e[targetPkPropName] === targetId);
      if (target) entity[relationName] = target;
    });
  }
}
