import {Filter} from './filter.js';
import {ModelData} from '../types.js';
import {IncludeClause} from './filter.js';
import {Service} from '@e22m4u/js-service';
import {NormalizedIncludeClause} from './filter.js';

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
  static validateScopeClause(clause: Filter | undefined): void;

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
  static normalizeScopeClause(clause: Filter | undefined): Filter | undefined;
}
