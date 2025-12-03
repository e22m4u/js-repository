import {Service} from '@e22m4u/js-service';
import {DatasourceDefinition} from './datasource-definition.js';

/**
 * Datasource definition validator.
 */
export declare class DatasourceDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param datasourceDef
   */
  validate(datasourceDef: DatasourceDefinition): void;
}
