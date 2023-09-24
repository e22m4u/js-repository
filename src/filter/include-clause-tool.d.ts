import {ModelData} from '../types.js';
import {Service} from '@e22m4u/js-service';
import {FilterClause} from './filter-clause.js';
import {IncludeClause} from './filter-clause.js';
import {NormalizedIncludeClause} from './filter-clause.js';

/**
 * Include clause tool.
 */
export declare class IncludeClauseTool extends Service {
  /**
   * Include to.
   *
   * @param entities
   * @param modelName
   * @param clause
   */
  includeTo(
    entities: ModelData[],
    modelName: string,
    clause: IncludeClause | undefined,
  ): Promise<void>;

  /**
   * Validate include clause.
   *
   * @param clause
   */
  static validateIncludeClause(clause: IncludeClause | undefined): void;

  /**
   * Validate scope clause.
   *
   * @param clause
   */
  static validateScopeClause(clause: FilterClause | undefined): void;

  /**
   * Normalize include clause.
   *
   * @param clause
   */
  static normalizeIncludeClause(
    clause: IncludeClause | undefined,
  ): NormalizedIncludeClause[];

  /**
   * Normalize scope clause.
   *
   * @param clause
   */
  static normalizeScopeClause(
    clause: FilterClause | undefined,
  ): FilterClause | undefined;
}
