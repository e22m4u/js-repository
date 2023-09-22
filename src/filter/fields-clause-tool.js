import {Service} from '@e22m4u/js-service';
import {selectObjectKeys} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {ModelDefinitionUtils} from '../definition/index.js';

/**
 * Field clause tool.
 */
export class FieldsClauseTool extends Service {
  /**
   * Filter.
   *
   * @param {object|object[]} entities
   * @param {string} modelName
   * @param {string|string[]|undefined} clause
   * @returns {object|object[]}
   */
  filter(entities, modelName, clause) {
    const isArray = Array.isArray(entities);
    entities = isArray ? entities : [entities];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'A first argument of FieldClauseTool.filter should be an Object or ' +
            'an Array of Object, but %v given.',
          entity,
        );
    });

    if (!clause) return entities;
    const fields = Array.isArray(clause) ? clause.slice() : [clause];
    fields.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a String ' +
            'or an Array of String, but %v given.',
          field,
        );
    });

    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    if (fields.indexOf(pkPropName) === -1) fields.push(pkPropName);

    entities = entities.map(entity => selectObjectKeys(entity, fields));
    return isArray ? entities : entities[0];
  }

  /**
   * Validate fields clause.
   *
   * @param {string|string[]|undefined} clause
   */
  static validateFieldsClause(clause) {
    if (!clause) return;
    const tempClause = Array.isArray(clause) ? clause : [clause];
    tempClause.forEach(key => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of String, but %v given.',
          key,
        );
    });
  }

  /**
   * Normalize fields clause.
   *
   * @param {string|string[]|undefined} clause
   * @returns {string[]|undefined}
   */
  static normalizeFieldsClause(clause) {
    if (!clause) return;
    clause = Array.isArray(clause) ? clause : [clause];
    clause.forEach(key => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of String, but %v given.',
          key,
        );
    });
    return clause;
  }
}
