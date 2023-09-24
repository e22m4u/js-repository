import {ModelData} from '../types.js';
import {OrderClause} from './filter.js';
import {Service} from '@e22m4u/js-service';

/**
 * Order clause tool.
 */
export declare class OrderClauseTool extends Service {
  /**
   * Sort.
   *
   * @param entities
   * @param clause
   */
  sort(entities: ModelData[], clause: OrderClause | undefined): void;

  /**
   * Validate order clause.
   *
   * @param clause
   */
  static validateOrderClause(clause: OrderClause | undefined): void;

  /**
   * Normalize order clause.
   *
   * @param clause
   */
  static normalizeOrderClause(
    clause: OrderClause | undefined,
  ): string[] | undefined;
}