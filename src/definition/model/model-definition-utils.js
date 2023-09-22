import {Service} from '@e22m4u/js-service';
import {DataType} from './properties/index.js';
import {cloneDeep} from '../../utils/index.js';
import {excludeObjectKeys} from '../../utils/index.js';
import {InvalidArgumentError} from '../../errors/index.js';
import {DefinitionRegistry} from '../definition-registry.js';

/**
 * Default primary key property name.
 *
 * @type {string}
 */
export const DEFAULT_PRIMARY_KEY_PROPERTY_NAME = 'id';

/**
 * Model definition utils.
 */
export class ModelDefinitionUtils extends Service {
  /**
   * Get primary key as property name.
   *
   * @param {string} modelName
   * @returns {string}
   */
  getPrimaryKeyAsPropertyName(modelName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propNames = Object.keys(propDefs).filter(propName => {
      const propDef = propDefs[propName];
      return propDef && typeof propDef === 'object' && propDef.primaryKey;
    });
    if (propNames.length < 1) {
      const isDefaultPrimaryKeyAlreadyInUse = Object.keys(propDefs).includes(
        DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
      );
      if (isDefaultPrimaryKeyAlreadyInUse)
        throw new InvalidArgumentError(
          'The property name %v of the model %v is defined as a regular property. ' +
            'In this case, a primary key should be defined explicitly. ' +
            'Do use the option "primaryKey" to specify the primary key.',
          DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
          modelName,
        );
      return DEFAULT_PRIMARY_KEY_PROPERTY_NAME;
    }
    return propNames[0];
  }

  /**
   * Get primary key as column name.
   *
   * @param {string} modelName
   * @returns {string}
   */
  getPrimaryKeyAsColumnName(modelName) {
    const pkPropName = this.getPrimaryKeyAsPropertyName(modelName);
    let pkColName;
    try {
      pkColName = this.getColumnNameByPropertyName(modelName, pkPropName);
    } catch (error) {
      if (!(error instanceof InvalidArgumentError)) throw error;
    }
    if (pkColName === undefined) return pkPropName;
    return pkColName;
  }

  /**
   * Get table name by model name.
   *
   * @param {string} modelName
   * @returns {string}
   */
  getTableNameByModelName(modelName) {
    const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
    return modelDef.tableName ?? modelName;
  }

  /**
   * Get column name by property name.
   *
   * @param {string} modelName
   * @param {string} propertyName
   * @returns {string}
   */
  getColumnNameByPropertyName(modelName, propertyName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propDef = propDefs[propertyName];
    if (!propDef)
      throw new InvalidArgumentError(
        'The model %v does not have the property %v.',
        modelName,
        propertyName,
      );
    if (propDef && typeof propDef === 'object')
      return propDef.columnName ?? propertyName;
    return propertyName;
  }

  /**
   * Get default property value.
   *
   * @param {string} modelName
   * @param {string} propertyName
   * @returns {*}
   */
  getDefaultPropertyValue(modelName, propertyName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propDef = propDefs[propertyName];
    if (!propDef)
      throw new InvalidArgumentError(
        'The model %v does not have the property %v.',
        modelName,
        propertyName,
      );
    if (propDef && typeof propDef === 'object')
      return propDef.default instanceof Function
        ? propDef.default()
        : propDef.default;
  }

  /**
   * Set default values for empty properties.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @param {boolean|undefined} onlyProvidedProperties
   * @returns {object}
   */
  setDefaultValuesToEmptyProperties(
    modelName,
    modelData,
    onlyProvidedProperties = false,
  ) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propNames = onlyProvidedProperties
      ? Object.keys(modelData)
      : Object.keys(propDefs);
    const extendedData = cloneDeep(modelData);
    propNames.forEach(propName => {
      const value = extendedData[propName];
      if (value != null) return;
      const propDef = propDefs[propName];
      if (
        propDef &&
        typeof propDef === 'object' &&
        propDef.default !== undefined
      ) {
        extendedData[propName] = this.getDefaultPropertyValue(
          modelName,
          propName,
        );
      }
    });
    return extendedData;
  }

  /**
   * Convert property names to column names.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @returns {object}
   */
  convertPropertyNamesToColumnNames(modelName, modelData) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propNames = Object.keys(propDefs);
    const convertedData = cloneDeep(modelData);
    propNames.forEach(propName => {
      if (!(propName in convertedData)) return;
      const colName = this.getColumnNameByPropertyName(modelName, propName);
      if (propName === colName) return;
      const propValue = convertedData[propName];
      delete convertedData[propName];
      convertedData[colName] = propValue;
    });
    return convertedData;
  }

  /**
   * Convert column names to property names.
   *
   * @param {string} modelName
   * @param {object} tableData
   * @returns {object}
   */
  convertColumnNamesToPropertyNames(modelName, tableData) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propNames = Object.keys(propDefs);
    const convertedData = cloneDeep(tableData);
    propNames.forEach(propName => {
      const colName = this.getColumnNameByPropertyName(modelName, propName);
      if (!(colName in convertedData) || colName === propName) return;
      const colValue = convertedData[colName];
      delete convertedData[colName];
      convertedData[propName] = colValue;
    });
    return convertedData;
  }

  /**
   * Get data type by property name.
   *
   * @param {string} modelName
   * @param {string} propertyName
   * @returns {string}
   */
  getDataTypeByPropertyName(modelName, propertyName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propDef = propDefs[propertyName];
    if (!propDef) {
      const pkPropName = this.getPrimaryKeyAsPropertyName(modelName);
      if (pkPropName === propertyName) return DataType.ANY;
      throw new InvalidArgumentError(
        'The model %v does not have the property %v.',
        modelName,
        propertyName,
      );
    }
    if (typeof propDef === 'string') return propDef;
    return propDef.type;
  }

  /**
   * Get own properties definition of primary keys.
   *
   * @param {string} modelName
   * @returns {object}
   */
  getOwnPropertiesDefinitionOfPrimaryKeys(modelName) {
    const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
    const propDefs = modelDef.properties ?? {};
    const pkPropNames = Object.keys(propDefs).filter(propName => {
      const propDef = propDefs[propName];
      return typeof propDef === 'object' && propDef.primaryKey;
    });
    return pkPropNames.reduce((a, k) => ({...a, [k]: propDefs[k]}), {});
  }

  /**
   * Get own properties definition without primary keys.
   *
   * @param {string} modelName
   * @returns {object}
   */
  getOwnPropertiesDefinitionWithoutPrimaryKeys(modelName) {
    const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
    const propDefs = modelDef.properties ?? {};
    return Object.keys(propDefs).reduce((result, propName) => {
      const propDef = propDefs[propName];
      if (typeof propDef === 'object' && propDef.primaryKey) return result;
      return {...result, [propName]: propDef};
    }, {});
  }

  /**
   * Get properties definition in base model hierarchy.
   *
   * @param {string} modelName
   * @returns {object}
   */
  getPropertiesDefinitionInBaseModelHierarchy(modelName) {
    let result = {};
    let pkPropDefs = {};
    const recursion = (currModelName, prevModelName = undefined) => {
      if (currModelName === prevModelName)
        throw new InvalidArgumentError(
          'The model %v has a circular inheritance.',
          currModelName,
        );
      if (Object.keys(pkPropDefs).length === 0) {
        pkPropDefs =
          this.getOwnPropertiesDefinitionOfPrimaryKeys(currModelName);
        result = {...result, ...pkPropDefs};
      }
      const regularPropDefs =
        this.getOwnPropertiesDefinitionWithoutPrimaryKeys(currModelName);
      result = {...regularPropDefs, ...result};
      const modelDef =
        this.getService(DefinitionRegistry).getModel(currModelName);
      if (modelDef.base) recursion(modelDef.base, currModelName);
    };
    recursion(modelName);
    return result;
  }

  /**
   * Get own relations definition.
   *
   * @param {string} modelName
   * @returns {object}
   */
  getOwnRelationsDefinition(modelName) {
    const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
    return modelDef.relations ?? {};
  }

  /**
   * Get relations definition in base model hierarchy.
   *
   * @param {string} modelName
   * @returns {object}
   */
  getRelationsDefinitionInBaseModelHierarchy(modelName) {
    let result = {};
    const recursion = (currModelName, prevModelName = undefined) => {
      if (currModelName === prevModelName)
        throw new InvalidArgumentError(
          'The model %v has a circular inheritance.',
          currModelName,
        );
      const modelDef =
        this.getService(DefinitionRegistry).getModel(currModelName);
      const ownRelDefs = modelDef.relations ?? {};
      result = {...ownRelDefs, ...result};
      if (modelDef.base) recursion(modelDef.base, currModelName);
    };
    recursion(modelName);
    return result;
  }

  /**
   * Get relation definition by name.
   *
   * @param {string} modelName
   * @param {string} relationName
   * @returns {object}
   */
  getRelationDefinitionByName(modelName, relationName) {
    const relDefs = this.getRelationsDefinitionInBaseModelHierarchy(modelName);
    const relNames = Object.keys(relDefs);
    let foundDef;
    for (const relName of relNames) {
      if (relName === relationName) {
        foundDef = relDefs[relName];
        break;
      }
    }
    if (!foundDef)
      throw new InvalidArgumentError(
        'The model %v does not have relation name %v.',
        modelName,
        relationName,
      );
    return foundDef;
  }

  /**
   * Exclude object keys by relation names.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @returns {object}
   */
  excludeObjectKeysByRelationNames(modelName, modelData) {
    if (!modelData || typeof modelData !== 'object' || Array.isArray(modelData))
      throw new InvalidArgumentError(
        'The second argument of ModelDefinitionUtils.excludeObjectKeysByRelationNames ' +
          'must be an Object, but %v given.',
        modelData,
      );
    const relDefs = this.getRelationsDefinitionInBaseModelHierarchy(modelName);
    const relNames = Object.keys(relDefs);
    return excludeObjectKeys(modelData, relNames);
  }
}
