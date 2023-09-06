import {Service} from '../../service/index.js';
import {InvalidArgumentError} from '../../errors/index.js';

/**
 * Datasource definition validator.
 */
export class DatasourceDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param datasourceDef
   */
  validate(datasourceDef) {
    if (!datasourceDef || typeof datasourceDef !== 'object')
      throw new InvalidArgumentError(
        'The datasource definition should be an Object, but %s given.',
        datasourceDef,
      );
    if (!datasourceDef.name || typeof datasourceDef.name !== 'string')
      throw new InvalidArgumentError(
        'The datasource definition requires the option "name" ' +
          'as a non-empty String, but %s given.',
        datasourceDef.name,
      );
    if (!datasourceDef.adapter || typeof datasourceDef.adapter !== 'string')
      throw new InvalidArgumentError(
        'The datasource %s requires the option "adapter" ' +
          'as a non-empty String, but %s given.',
        datasourceDef.name,
        datasourceDef.adapter,
      );
  }
}
