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
    // input
    if (!input || typeof input !== 'object') {
      throw new InvalidArgumentError(
        'Parameter "input" must be an Object or an Array, ' +
          'but %v was given.',
        input,
      );
    }
    // input[n]
    const isArrayInput = Array.isArray(input);
    if (isArrayInput) {
      input.forEach((entity, index) => {
        if (!entity || typeof entity !== 'object' || Array.isArray(entity)) {
          throw new InvalidArgumentError(
            'Element %d of the parameter "input" must be an Object, ' +
              'but %v was given.',
            index,
            entity,
          );
        }
      });
    }
    // modelName
    if (!modelName || typeof modelName !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "modelName" must be a non-empty String, but %v was given.',
        modelName,
      );
    }
    // clause
    if (clause == null) {
      return input;
    }
    const isArrayClause = Array.isArray(clause);
    if (!clause || (typeof clause !== 'string' && !isArrayClause)) {
      throw new InvalidArgumentError(
        'Option "fields" must be a non-empty String or an Array, ' +
          'but %v was given.',
        clause,
      );
    }
    // clause[n]
    if (isArrayClause) {
      if (!clause.length) {
        return input;
      }
      clause.forEach((field, index) => {
        if (!field || typeof field !== 'string') {
          throw new InvalidArgumentError(
            'Element %d of the option "fields" must be a non-empty String, ' +
              'but %v was given.',
            index,
            field,
          );
        }
      });
    }
    const fields = isArrayClause ? clause.slice() : [clause];
    const pkPropName =
      this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
        modelName,
      );
    if (fields.indexOf(pkPropName) === -1) {
      fields.push(pkPropName);
    }

    let entities = isArrayInput ? input : [input];
    entities = entities.map(entity => selectObjectKeys(entity, fields));
    return isArrayInput ? entities : entities[0];
  }

  /**
   * Validate fields clause.
   *
   * @param {string|string[]|undefined} clause
   */
  static validateFieldsClause(clause) {
    if (clause == null) {
      return;
    }
    // clause
    const isArray = Array.isArray(clause);
    if (!clause || (typeof clause !== 'string' && !isArray)) {
      throw new InvalidArgumentError(
        'Option "fields" must be a non-empty String or an Array, ' +
          'but %v was given.',
        clause,
      );
    }
    // clause[n]
    if (isArray && clause.length > 0) {
      clause.forEach((field, index) => {
        if (!field || typeof field !== 'string') {
          throw new InvalidArgumentError(
            'Element %d of the option "fields" must be a non-empty String, ' +
              'but %v was given.',
            index,
            field,
          );
        }
      });
    }
  }

  /**
   * Normalize fields clause.
   *
   * @param {string|string[]|undefined} clause
   * @returns {string[]|undefined}
   */
  static normalizeFieldsClause(clause) {
    if (clause == null) {
      return;
    }
    // clause
    const isArray = Array.isArray(clause);
    if (!clause || (typeof clause !== 'string' && !isArray)) {
      throw new InvalidArgumentError(
        'Option "fields" must be a non-empty String or an Array, ' +
          'but %v was given.',
        clause,
      );
    }
    // clause[n]
    if (isArray) {
      if (!clause.length) {
        return;
      }
      clause.forEach((field, index) => {
        if (!field || typeof field !== 'string') {
          throw new InvalidArgumentError(
            'Element %d of the option "fields" must be a non-empty String, ' +
              'but %v was given.',
            index,
            field,
          );
        }
      });
    }
    return isArray ? clause : [clause];
  }
}
