import {Service} from '@e22m4u/js-service';
import {RelationType} from '../definition/index.js';
import {HasOneResolver} from '../relations/index.js';
import {HasManyResolver} from '../relations/index.js';
import {WhereClauseTool} from './where-clause-tool.js';
import {OrderClauseTool} from './order-clause-tool.js';
import {SliceClauseTool} from './slice-clause-tool.js';
import {InvalidArgumentError} from '../errors/index.js';
import {BelongsToResolver} from '../relations/index.js';
import {FieldsClauseTool} from './fields-clause-tool.js';
import {ModelDefinitionUtils} from '../definition/index.js';
import {ReferencesManyResolver} from '../relations/index.js';

/**
 * Include clause tool.
 *
 * @typedef {string|string[]|object|object[]} IncludeClause
 */
export class IncludeClauseTool extends Service {
  /**
   * Include to.
   *
   * @param {object[]} entities
   * @param {string} modelName
   * @param {IncludeClause|undefined} clause
   * @returns {Promise<void>}
   */
  async includeTo(entities, modelName, clause) {
    clause = IncludeClauseTool.normalizeIncludeClause(clause);
    const promises = [];
    clause.forEach(inclusion => {
      const relDef = this.getService(
        ModelDefinitionUtils,
      ).getRelationDefinitionByName(modelName, inclusion.relation);
      switch (relDef.type) {
        // BELONGS_TO
        case RelationType.BELONGS_TO:
          if (relDef.polymorphic) {
            promises.push(
              this.getService(BelongsToResolver).includePolymorphicTo(
                entities,
                modelName,
                inclusion.relation,
                relDef.foreignKey,
                relDef.discriminator,
                inclusion.scope,
              ),
            );
          } else {
            promises.push(
              this.getService(BelongsToResolver).includeTo(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.foreignKey,
                inclusion.scope,
              ),
            );
          }
          break;
        // HAS_ONE
        case RelationType.HAS_ONE:
          if (relDef.polymorphic && typeof relDef.polymorphic === 'string') {
            promises.push(
              this.getService(HasOneResolver).includePolymorphicByRelationName(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.polymorphic,
                inclusion.scope,
              ),
            );
          } else if (relDef.polymorphic) {
            promises.push(
              this.getService(HasOneResolver).includePolymorphicTo(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.foreignKey,
                relDef.discriminator,
                inclusion.scope,
              ),
            );
          } else {
            promises.push(
              this.getService(HasOneResolver).includeTo(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.foreignKey,
                inclusion.scope,
              ),
            );
          }
          break;
        // HAS_MANY
        case RelationType.HAS_MANY:
          if (relDef.polymorphic && typeof relDef.polymorphic === 'string') {
            promises.push(
              this.getService(HasManyResolver).includePolymorphicByRelationName(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.polymorphic,
                inclusion.scope,
              ),
            );
          } else if (relDef.polymorphic) {
            promises.push(
              this.getService(HasManyResolver).includePolymorphicTo(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.foreignKey,
                relDef.discriminator,
                inclusion.scope,
              ),
            );
          } else {
            promises.push(
              this.getService(HasManyResolver).includeTo(
                entities,
                modelName,
                relDef.model,
                inclusion.relation,
                relDef.foreignKey,
                inclusion.scope,
              ),
            );
          }
          break;
        case RelationType.REFERENCES_MANY:
          promises.push(
            this.getService(ReferencesManyResolver).includeTo(
              entities,
              modelName,
              relDef.model,
              inclusion.relation,
              relDef.foreignKey,
              inclusion.scope,
            ),
          );
          break;
        default:
          throw new InvalidArgumentError(
            'The relation type %v does not have an inclusion resolver.',
            relDef.type,
          );
      }
    });
    await Promise.all(promises);
  }

  /**
   * Validate include clause.
   *
   * @param {IncludeClause|undefined} clause
   */
  static validateIncludeClause(clause) {
    if (clause == null) {
      // allows undefined and null
    } else if (clause && typeof clause === 'string') {
      // allows non-empty string
    } else if (Array.isArray(clause)) {
      // validate array
      const relNames = [];
      clause.flat(Infinity).forEach(el => {
        this.validateIncludeClause(el);
        if (typeof el === 'string') {
          relNames.push(el);
        } else if (typeof el === 'object') {
          Object.keys(el).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(el, key))
              relNames.push(key);
          });
        }
      });
      // duplicates checking
      const duplicateNames = relNames.filter(
        (name, i) => relNames.indexOf(name) !== i,
      );
      if (duplicateNames.length)
        throw new InvalidArgumentError(
          'The provided option "include" has duplicates of %v.',
          duplicateNames[0],
        );
    } else if (typeof clause === 'object') {
      // validate object
      if ('relation' in clause) {
        // {relation: 'name', scope: {}}
        if (!clause.relation || typeof clause.relation !== 'string')
          throw new InvalidArgumentError(
            'The provided option "relation" should be ' +
              'a non-empty String, but %v was given.',
            clause.relation,
          );
        if ('scope' in clause && clause) this.validateScopeClause(clause.scope);
      } else {
        // {foo: 'bar', 'baz': ['qux'], ...}
        Object.keys(clause).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(clause, key)) return;
          this.validateIncludeClause(key);
          this.validateIncludeClause(clause[key]);
        });
      }
    } else {
      // unsupported
      throw new InvalidArgumentError(
        'The provided option "include" should have a non-empty String, ' +
          'an Object or an Array, but %v was given.',
        clause,
      );
    }
  }

  /**
   * Validate scope clause.
   *
   * @param {object|undefined} clause
   */
  static validateScopeClause(clause) {
    if (clause == null) return;
    if (typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The provided option "scope" should be an Object, but %v was given.',
        clause,
      );
    // {where: ...}
    if (clause.where != null) {
      WhereClauseTool.validateWhereClause(clause.where);
    }
    // {order: ...}
    if (clause.order != null) {
      OrderClauseTool.validateOrderClause(clause.order);
    }
    // {skip: ...}
    if (clause.skip != null) {
      SliceClauseTool.validateSkipClause(clause.skip);
    }
    // {limit: ...}
    if (clause.limit != null) {
      SliceClauseTool.validateLimitClause(clause.limit);
    }
    // {fields: ...}
    if (clause.fields != null) {
      FieldsClauseTool.validateFieldsClause(clause.fields);
    }
    // {include: ...}
    if (clause.include != null) {
      IncludeClauseTool.validateIncludeClause(clause.include);
    }
  }

  /**
   * Normalize include clause.
   *
   * @param {IncludeClause|undefined} clause
   * @returns {object[]}
   */
  static normalizeIncludeClause(clause) {
    let result = [];
    if (clause == null) {
      // allows undefined and null
      return result;
    } else if (clause && typeof clause === 'string') {
      // normalize non-empty string
      result.push({relation: clause});
    } else if (Array.isArray(clause)) {
      // normalize array
      clause.flat(Infinity).forEach(el => {
        el = this.normalizeIncludeClause(el);
        result = [...result, ...el];
      });
      // duplicates checking
      const relNames = result.map(v => v.relation);
      const duplicateNames = relNames.filter(
        (name, i) => relNames.indexOf(name) !== i,
      );
      if (duplicateNames.length)
        throw new InvalidArgumentError(
          'The provided option "include" has duplicates of %v.',
          duplicateNames[0],
        );
    } else if (typeof clause === 'object') {
      // normalize object
      if ('relation' in clause) {
        // {relation: 'name', scope: {...}}
        if (!clause.relation || typeof clause.relation !== 'string')
          throw new InvalidArgumentError(
            'The provided option "relation" should be ' +
              'a non-empty String, but %v was given.',
            clause.relation,
          );
        const normalized = {relation: clause.relation};
        const scope = this.normalizeScopeClause(clause.scope);
        if (scope) normalized.scope = scope;
        result.push(normalized);
      } else {
        // {foo: 'bar', baz: ['qux'], ...}
        Object.keys(clause).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(clause, key)) return;
          this.validateIncludeClause(key);
          const normalized = {relation: key};
          const include = this.normalizeIncludeClause(clause[key]);
          if (include.length) normalized.scope = {include};
          result.push(normalized);
        });
      }
    } else {
      // unsupported
      throw new InvalidArgumentError(
        'The provided option "include" should have a non-empty String, ' +
          'an Object or an Array, but %v was given.',
        clause,
      );
    }
    return result;
  }

  /**
   * Normalize scope clause.
   *
   * @param {object|undefined} clause
   * @returns {object|undefined}
   */
  static normalizeScopeClause(clause) {
    if (clause == null) return;
    if (typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The provided option "scope" should be an Object, but %v was given.',
        clause,
      );
    const result = {};
    // {where: ...}
    if (clause.where != null) {
      WhereClauseTool.validateWhereClause(clause.where);
      result.where = clause.where;
    }
    // {order: ...}
    if (clause.order != null) {
      OrderClauseTool.validateOrderClause(clause.order);
      result.order = clause.order;
    }
    // {skip: ...}
    if (clause.skip != null) {
      SliceClauseTool.validateSkipClause(clause.skip);
      result.skip = clause.skip;
    }
    // {limit: ...}
    if (clause.limit != null) {
      SliceClauseTool.validateLimitClause(clause.limit);
      result.limit = clause.limit;
    }
    // {fields: ...}
    if (clause.fields != null) {
      FieldsClauseTool.validateFieldsClause(clause.fields);
      result.fields = clause.fields;
    }
    // {include: ...}
    if (clause.include != null) {
      result.include = this.normalizeIncludeClause(clause.include);
    }
    if (Object.keys(result).length) return result;
    return undefined;
  }
}
