/**
 * Datasource definition.
 */
export declare type DatasourceDefinition = {
  name: string;
  adapter: string;
  [option: string]: unknown;
};
