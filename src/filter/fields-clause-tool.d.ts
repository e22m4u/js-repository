import {ModelData} from '../types';
import {FieldsClause} from './filter';
import {Service} from '@e22m4u/service';
import {NormalizedFieldsClause} from './filter';

/**
 * Field clause tool.
 */
export declare class FieldsClauseTool extends Service {
  /**
   * Filter.
   *
   * @param entities
   * @param modelName
   * @param clause
   */
  filter<T extends ModelData | ModelData[]>(
    entities: T,
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
