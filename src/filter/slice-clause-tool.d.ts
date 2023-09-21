import {ModelData} from '../types';
import {Service} from '@e22m4u/service';

/**
 * Slice clause tool.
 */
export declare class SliceClauseTool extends Service {
  /**
   * Slice.
   *
   * @param entities
   * @param skip
   * @param limit
   */
  slice(entities: ModelData[], skip?: number, limit?: number): ModelData[];

  /**
   * Validate skip clause.
   *
   * @param skip
   */
  static validateSkipClause(skip: number | undefined): void;

  /**
   * Validate limit clause.
   *
   * @param limit
   */
  static validateLimitClause(limit: number | undefined): void;
}
