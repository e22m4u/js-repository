import {ModelData} from '../types.js';
import {Service} from '@e22m4u/js-service';
import {FieldsClause} from './filter-clause.js';
import {NormalizedFieldsClause} from './filter-clause.js';

/**
 * Field clause tool.
 */
export declare class FieldsClauseTool extends Service {
  /**
   * Filter.
   *
   * @param input
   * @param modelName
   * @param clause
   */
  filter<T extends ModelData | ModelData[]>(
    input: T,
    modelName: string,
    clause: FieldsClause | undefined,
  ): T;

  /**
   * Validate fields clause.
   *
   * @param clause
   */
  static validateFieldsClause(clause: FieldsClause | undefined): void;

  /**
   * Normalize fields clause.
   *
   * @param clause
   */
  static normalizeFieldsClause(
    clause: FieldsClause | undefined,
  ): NormalizedFieldsClause | undefined;
}
