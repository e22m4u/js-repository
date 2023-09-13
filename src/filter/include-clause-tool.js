import {Service} from '@e22m4u/service';
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
 */
export class IncludeClauseTool extends Service {
  /**
   * Include to.
   *
   * @param {Record<string, unknown>[]} entities
   * @param {string} modelName
   * @param {Record<string, unknown>[]} clause
   * @return {Promise<void>}
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
   * @param clause
   */
  static validateIncludeClause(clause) {
    if (!clause) {
      // empty
    } else if (typeof clause === 'string') {
      // string
    } else if (Array.isArray(clause)) {
      // array
      const relNames = [];
      clause.flat().forEach(el => {
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
      // object
      if ('relation' in clause) {
        // {relation: 'name', scope: {}}
        if (!clause.relation || typeof clause.relation !== 'string')
          throw new InvalidArgumentError(
            'The provided option "relation" should be ' +
              'a non-empty String, but %v given.',
            clause.relation,
          );
        if ('scope' in clause && clause) this.validateScopeClause(clause.scope);
      } else {
        // {foo: 'bar', 'baz': ['qux'], ...}
        Object.keys(clause).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(clause, key)) return;
          this.validateIncludeClause(clause[key]);
        });
      }
    } else {
      // unknown.
      throw new InvalidArgumentError(
        'The provided option "include" should have a value of ' +
          'following types: String, Object or Array, but %v given.',
        clause,
      );
    }
  }

  /**
   * Validate scope clause.
   *
   * @param clause
   */
  static validateScopeClause(clause) {
    if (!clause) return;
    if (typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The provided option "scope" should be an Object, but %v given.',
        clause,
      );
    if ('where' in clause && clause.where)
      WhereClauseTool.validateWhereClause(clause.where);
    if ('order' in clause && clause.order)
      OrderClauseTool.validateOrderClause(clause.order);
    if ('skip' in clause && clause.skip)
      SliceClauseTool.validateSkipClause(clause.skip);
    if ('limit' in clause && clause.limit)
      SliceClauseTool.validateLimitClause(clause.limit);
    if ('fields' in clause && clause.fields)
      FieldsClauseTool.validateFieldsClause(clause.fields);
    if ('include' in clause && clause.include)
      IncludeClauseTool.validateIncludeClause(clause.include);
  }

  /**
   * Normalize include clause.
   *
   * @param clause
   */
  static normalizeIncludeClause(clause) {
    let result = [];
    if (!clause) {
      // empty
      return result;
    } else if (typeof clause === 'string') {
      // string
      result.push({relation: clause});
    } else if (Array.isArray(clause)) {
      // array
      clause.flat().forEach(el => {
        if (Array.isArray(el)) {
          el = el
            .flat()
            .map(v => this.normalizeIncludeClause(v))
            .flat();
        } else {
          el = this.normalizeIncludeClause(el);
        }
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
      // object
      if ('relation' in clause) {
        // {relation: 'name', scope: {...}}
        if (!clause.relation || typeof clause.relation !== 'string')
          throw new InvalidArgumentError(
            'The provided option "relation" should be ' +
              'a non-empty String, but %v given.',
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
          const normalized = {relation: key};
          const include = this.normalizeIncludeClause(clause[key]);
          if (include.length) normalized.scope = {include};
          result.push(normalized);
        });
      }
    } else {
      // unknown
      throw new InvalidArgumentError(
        'The provided option "include" should have a value of ' +
          'following types: String, Object or Array, but %v given.',
        clause,
      );
    }
    return result;
  }

  /**
   * Normalize scope clause.
   *
   * @param clause
   * @return {undefined|{}}
   */
  static normalizeScopeClause(clause) {
    if (!clause) return;
    if (typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The provided option "scope" should be an Object, but %v given.',
        clause,
      );
    const result = {};
    // {where: ...}
    if ('where' in clause && clause.where) {
      WhereClauseTool.validateWhereClause(clause.where);
      result.where = clause.where;
    }
    // {order: ...}
    if ('order' in clause && clause.order) {
      OrderClauseTool.validateOrderClause(clause.order);
      result.order = clause.order;
    }
    // {skip: ...}
    if ('skip' in clause && clause.skip) {
      SliceClauseTool.validateSkipClause(clause.skip);
      result.skip = clause.skip;
    }
    // {limit: ...}
    if ('limit' in clause && clause.limit) {
      SliceClauseTool.validateLimitClause(clause.limit);
      result.limit = clause.limit;
    }
    // {fields: ...}
    if ('fields' in clause && clause.fields) {
      FieldsClauseTool.validateFieldsClause(clause.fields);
      result.fields = clause.fields;
    }
    // {include: ...}
    if ('include' in clause && clause.include)
      result.include = this.normalizeIncludeClause(clause.include);
    if (Object.keys(result).length) return result;
    return undefined;
  }
}
