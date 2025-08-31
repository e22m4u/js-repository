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
   * @param {object|object[]} input
   * @param {string} modelName
   * @param {string|string[]|undefined} clause
   * @returns {object|object[]}
   */
  filter(input, modelName, clause) {
    const isArray = Array.isArray(input);
    let entities = isArray ? input : [input];
    entities.forEach(entity => {
      if (!entity || typeof entity !== 'object' || Array.isArray(entity))
        throw new InvalidArgumentError(
          'The first argument of FieldsClauseTool.filter should be an Object or ' +
            'an Array of Object, but %v was given.',
          entity,
        );
    });

    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The second argument of FieldsClauseTool.filter should be ' +
          'a non-empty String, but %v was given.',
        modelName,
      );

    if (clause == null) return input;
    const fields = Array.isArray(clause) ? clause.slice() : [clause];
    if (!fields.length) return input;

    fields.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of non-empty String, but %v was given.',
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
    if (clause == null) return;
    const fields = Array.isArray(clause) ? clause : [clause];
    if (!fields.length) return;
    fields.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of non-empty String, but %v was given.',
          field,
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
    if (clause == null) return;
    const fields = Array.isArray(clause) ? clause : [clause];
    if (!fields.length) return;
    fields.forEach(field => {
      if (!field || typeof field !== 'string')
        throw new InvalidArgumentError(
          'The provided option "fields" should be a non-empty String ' +
            'or an Array of non-empty String, but %v was given.',
          field,
        );
    });
    return fields;
  }
}
