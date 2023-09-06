import {Service} from '../../service/index.js';
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
   * @param modelName
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
          'The property name %s of the model %s is defined as a regular property. ' +
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
   * @param modelName
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
   * @param modelName
   */
  getTableNameByModelName(modelName) {
    const modelDef = this.get(DefinitionRegistry).getModel(modelName);
    return modelDef.tableName ?? modelName;
  }

  /**
   * Get column name by property name.
   *
   * @param modelName
   * @param propertyName
   */
  getColumnNameByPropertyName(modelName, propertyName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propDef = propDefs[propertyName];
    if (!propDef)
      throw new InvalidArgumentError(
        'The model %s does not have the property %s.',
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
   * @param modelName
   * @param propertyName
   */
  getDefaultPropertyValue(modelName, propertyName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propDef = propDefs[propertyName];
    if (!propDef)
      throw new InvalidArgumentError(
        'The model %s does not have the property %s.',
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
   * @param modelName
   * @param modelData
   * @param onlyProvidedProperties
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
   * @param modelName
   * @param modelData
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
   * @param modelName
   * @param tableData
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
   * @param modelName
   * @param propertyName
   */
  getDataTypeByPropertyName(modelName, propertyName) {
    const propDefs =
      this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
    const propDef = propDefs[propertyName];
    if (!propDef) {
      const pkPropName = this.getPrimaryKeyAsPropertyName(modelName);
      if (pkPropName === propertyName) return DataType.ANY;
      throw new InvalidArgumentError(
        'The model %s does not have the property %s.',
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
   * @param modelName
   * @return {Record<string, {}>}
   */
  getOwnPropertiesDefinitionOfPrimaryKeys(modelName) {
    const modelDef = this.get(DefinitionRegistry).getModel(modelName);
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
   * @param modelName
   * @return {Record<string, {}>}
   */
  getOwnPropertiesDefinitionWithoutPrimaryKeys(modelName) {
    const modelDef = this.get(DefinitionRegistry).getModel(modelName);
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
   * @param modelName
   * @return {Record<string, {}>}
   */
  getPropertiesDefinitionInBaseModelHierarchy(modelName) {
    let result = {};
    let pkPropDefs = {};
    const recursion = (currModelName, prevModelName = undefined) => {
      if (currModelName === prevModelName)
        throw new InvalidArgumentError(
          'The model %s has a circular inheritance.',
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
      const modelDef = this.get(DefinitionRegistry).getModel(currModelName);
      if (modelDef.base) recursion(modelDef.base, currModelName);
    };
    recursion(modelName);
    return result;
  }

  /**
   * Get own relations definition.
   *
   * @param modelName
   * @return {Record<string, {}>}
   */
  getOwnRelationsDefinition(modelName) {
    const modelDef = this.get(DefinitionRegistry).getModel(modelName);
    return modelDef.relations ?? {};
  }

  /**
   * Get relations definition in base model hierarchy.
   *
   * @param modelName
   * @return {Record<string, {}>}
   */
  getRelationsDefinitionInBaseModelHierarchy(modelName) {
    let result = {};
    const recursion = (currModelName, prevModelName = undefined) => {
      if (currModelName === prevModelName)
        throw new InvalidArgumentError(
          'The model %s has a circular inheritance.',
          currModelName,
        );
      const modelDef = this.get(DefinitionRegistry).getModel(currModelName);
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
   * @param modelName
   * @param relationName
   * @return {Record<string, unknown>}
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
        'The model %s does not have relation name %s.',
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
   * @return {object}
   */
  excludeObjectKeysByRelationNames(modelName, modelData) {
    if (!modelData || typeof modelData !== 'object' || Array.isArray(modelData))
      throw new InvalidArgumentError(
        'The second argument of ModelDefinitionUtils.excludeObjectKeysByRelationNames ' +
          'must be an Object, but %s given.',
        modelData,
      );
    const relDefs = this.getRelationsDefinitionInBaseModelHierarchy(modelName);
    const relNames = Object.keys(relDefs);
    return excludeObjectKeys(modelData, relNames);
  }
}
