import {Service} from '@e22m4u/service';
import {InvalidArgumentError} from '../../errors/index.js';

/**
 * Datasource definition validator.
 */
export class DatasourceDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param {object} datasourceDef
   * @return {void}
   */
  validate(datasourceDef) {
    if (!datasourceDef || typeof datasourceDef !== 'object')
      throw new InvalidArgumentError(
        'The datasource definition should be an Object, but %v given.',
        datasourceDef,
      );
    if (!datasourceDef.name || typeof datasourceDef.name !== 'string')
      throw new InvalidArgumentError(
        'The datasource definition requires the option "name" ' +
          'as a non-empty String, but %v given.',
        datasourceDef.name,
      );
    if (!datasourceDef.adapter || typeof datasourceDef.adapter !== 'string')
      throw new InvalidArgumentError(
        'The datasource %v requires the option "adapter" ' +
          'as a non-empty String, but %v given.',
        datasourceDef.name,
        datasourceDef.adapter,
      );
  }
}
