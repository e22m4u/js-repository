import {ModelData} from '../types';
import {WhereClause} from './filter';
import {Service} from '@e22m4u/service';

/**
 * Where clause tool.
 */
export declare class WhereClauseTool extends Service {
  /**
   * Filter.
   *
   * @param entities
   * @param where
   */
  filter(entities: ModelData[], where: WhereClause | undefined): ModelData[];

  /**
   * Validate where clause.
   *
   * @param clause
   */
  static validateWhereClause(clause: WhereClause | undefined): void;
}
