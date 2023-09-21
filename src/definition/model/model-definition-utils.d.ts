import {DataType} from './properties';
import {ModelData} from '../../types';
import {Service} from '@e22m4u/service';
import {RelationDefinition} from './relations';
import {PropertyDefinitionMap} from './model-definition';
import {RelationDefinitionMap} from './model-definition';

/**
 * Default primary key property name.
 */
export type DEFAULT_PRIMARY_KEY_PROPERTY_NAME = 'id';

/**
 * Model definition utils.
 */
export declare class ModelDefinitionUtils extends Service {
  /**
   * Get primary key as property name.
   *
   * @param modelName
   */
  getPrimaryKeyAsPropertyName(modelName: string): string;

  /**
   * Get primary key as column name.
   *
   * @param modelName
   */
  getPrimaryKeyAsColumnName(modelName: string): string;

  /**
   * Get table name by model name.
   *
   * @param modelName
   */
  getTableNameByModelName(modelName: string): string;

  /**
   * Get column name by property name.
   *
   * @param modelName
   * @param propertyName
   */
  getColumnNameByPropertyName(modelName: string, propertyName: string): string;

  /**
   * Get default property value.
   *
   * @param modelName
   * @param propertyName
   */
  getDefaultPropertyValue(modelName: string, propertyName: string): unknown;

  /**
   * Set default values to empty properties.
   *
   * @param modelName
   * @param modelData
   * @param onlyProvidedProperties
   */
  setDefaultValuesToEmptyProperties<T extends ModelData>(
    modelName: string,
    modelData: T,
    onlyProvidedProperties?: boolean,
  ): T;

  /**
   * Convert property names to column names.
   *
   * @param modelName
   * @param modelData
   */
  convertPropertyNamesToColumnNames(
    modelName: string,
    modelData: ModelData,
  ): ModelData;

  /**
   * Convert column names to property names.
   *
   * @param modelName
   * @param tableData
   */
  convertColumnNamesToPropertyNames(
    modelName: string,
    tableData: ModelData,
  ): ModelData;

  /**
   * Get data type by property name.
   *
   * @param modelName
   * @param propertyName
   */
  getDataTypeByPropertyName(modelName: string, propertyName: string): DataType;

  /**
   * Get own properties definition of primary keys.
   *
   * @param modelName
   */
  getOwnPropertiesDefinitionOfPrimaryKeys(
    modelName: string,
  ): PropertyDefinitionMap;

  /**
   * Get own properties definition without primary keys.
   *
   * @param modelName
   */
  getOwnPropertiesDefinitionWithoutPrimaryKeys(
    modelName: string,
  ): PropertyDefinitionMap;

  /**
   * Get properties definition in base model hierarchy.
   *
   * @param modelName
   */
  getPropertiesDefinitionInBaseModelHierarchy(
    modelName: string,
  ): PropertyDefinitionMap;

  /**
   * Get own relations definition.
   *
   * @param modelName
   */
  getOwnRelationsDefinition(modelName: string): RelationDefinitionMap;

  /**
   * Get relations definition in base model hierarchy.
   *
   * @param modelName
   */
  getRelationsDefinitionInBaseModelHierarchy(
    modelName: string,
  ): RelationDefinitionMap;

  /**
   * Get relation definition by name.
   *
   * @param modelName
   * @param relationName
   */
  getRelationDefinitionByName(
    modelName: string,
    relationName: string,
  ): RelationDefinition;

  /**
   * Exclude object keys by relation names.
   *
   * @param modelName
   * @param modelData
   */
  excludeObjectKeysByRelationNames<T extends ModelData>(
    modelName: string,
    modelData: T,
  ): Partial<T>;
}
