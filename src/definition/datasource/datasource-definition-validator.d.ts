import {Service} from '@e22m4u/service';
import {DatasourceDefinition} from './datasource-definition';

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
