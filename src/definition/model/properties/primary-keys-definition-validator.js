import {Service} from '@e22m4u/service';
import {InvalidArgumentError} from '../../../errors/index.js';
import {DEFAULT_PRIMARY_KEY_PROPERTY_NAME as DEF_PK} from '../model-definition-utils.js';

/**
 * Primary keys definition validator.
 */
export class PrimaryKeysDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} propDefs
   */
  validate(modelName, propDefs) {
    const propNames = Object.keys(propDefs).filter(propName => {
      const propDef = propDefs[propName];
      return propDef && typeof propDef === 'object' && propDef.primaryKey;
    });
    if (propNames.length < 1) {
      const isDefaultPrimaryKeyAlreadyInUse =
        Object.keys(propDefs).includes(DEF_PK);
      if (isDefaultPrimaryKeyAlreadyInUse)
        throw new InvalidArgumentError(
          'The property name %v of the model %v is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEF_PK,
          modelName,
        );
      return;
    }
    if (propNames.length > 1)
      throw new InvalidArgumentError(
        'The model definition %v should not have ' +
          'multiple primary keys, but %v keys given.',
        modelName,
        propNames.length,
      );
    const pkPropName = propNames[0];
    const pkPropDef = propDefs[pkPropName];
    if (
      pkPropDef &&
      typeof pkPropDef === 'object' &&
      pkPropDef.default !== undefined
    ) {
      throw new InvalidArgumentError(
        'Do not specify a default value for the ' +
          'primary key %v of the model %v.',
        pkPropName,
        modelName,
      );
    }
  }
}
