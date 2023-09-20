import {Service} from '@e22m4u/service';
import {cloneDeep} from '../utils/index.js';
import {singularize} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {RepositoryRegistry} from '../repository/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';

/**
 * References many resolver.
 */
export class ReferencesManyResolver extends Service {
  /**
   * Include to.
   *
   * @param {object[]} entities
   * @param {string} sourceName
   * @param {string} targetName
   * @param {string} relationName
   * @param {string|undefined} foreignKey
   * @param {object|undefined} scope
   * @return {Promise<void>}
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
        'The parameter "entities" of ReferencesManyResolver.includeTo requires ' +
          'an Array of Object, but %v given.',
        entities,
      );
    if (!sourceName || typeof sourceName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "sourceName" of ReferencesManyResolver.includeTo requires ' +
          'a non-empty String, but %v given.',
        sourceName,
      );
    if (!targetName || typeof targetName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "targetName" of ReferencesManyResolver.includeTo requires ' +
          'a non-empty String, but %v given.',
        targetName,
      );
    if (!relationName || typeof relationName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "relationName" of ReferencesManyResolver.includeTo requires ' +
          'a non-empty String, but %v given.',
        relationName,
      );
    if (foreignKey && typeof foreignKey !== 'string')
      throw new InvalidArgumentError(
        'The provided parameter "foreignKey" of ReferencesManyResolver.includeTo ' +
          'should be a String, but %v given.',
        foreignKey,
      );
    if (scope && (typeof scope !== 'object' || Array.isArray(scope)))
      throw new InvalidArgumentError(
        'The provided parameter "scope" of ReferencesManyResolver.includeTo ' +
          'should be an Object, but %v given.',
        scope,
      );
    if (foreignKey == null) {
      const singularRelationName = singularize(relationName);
      foreignKey = `${singularRelationName}Ids`;
    }
    const targetIds = entities.reduce((acc, entity) => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The parameter "entities" of ReferencesManyResolver.includeTo requires ' +
            'an Array of Object, but %v given.',
          entity,
        );
      const ids = entity[foreignKey];
      if (Array.isArray(ids))
        ids.forEach(id => {
          if (id == null || acc.includes(id)) return;
          acc.push(id);
        });
      return acc;
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
      const ids = entity[foreignKey];
      entity[relationName] = [];
      if (Array.isArray(ids))
        targets.forEach(target => {
          const targetId = target[targetPkPropName];
          if (ids.includes(targetId)) entity[relationName].push(target);
        });
    });
  }
}
