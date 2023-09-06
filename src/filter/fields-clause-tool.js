import {Service} from '../service/index.js';
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
   * @param {string|string[]} clause
   * @return {object|object[]}
   */
  filter(entities, modelName, clause) {
    const isArray = Array.isArray(entities);
    entities = isArray ? entities : [entities];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'A first argument of FieldClauseTool.filter should be an Object or ' +
            'an Array of Object, but %s given.',
          entity,
        );
    });

    const fields = Array.isArray(clause) ? clause.slice() : [clause];
    fields.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a String ' +
            'or an Array of String, but %s given.',
          field,
        );
    });

    const pkPropName =
      this.get(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(modelName);
    if (fields.indexOf(pkPropName) === -1) fields.push(pkPropName);

    entities = entities.map(entity => selectObjectKeys(entity, fields));
    return isArray ? entities : entities[0];
  }

  /**
   * Validate fields clause.
   *
   * @param clause
   */
  static validateFieldsClause(clause) {
    if (!clause) return;
    const tempClause = Array.isArray(clause) ? clause : [clause];
    tempClause.forEach(key => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of String, but %s given.',
          key,
        );
    });
  }

  /**
   * Normalize fields clause.
   *
   * @param clause
   */
  static normalizeFieldsClause(clause) {
    if (!clause) return;
    clause = Array.isArray(clause) ? clause : [clause];
    clause.forEach(key => {
      if (!key || typeof key !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of String, but %s given.',
          key,
        );
    });
    return clause;
  }
}
