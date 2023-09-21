import {RelationType} from './relation-type';

/**
 * Relation definition.
 */
declare type RelationDefinition = {
  type: RelationType;
  model?: string;
  foreignKey?: string;
  polymorphic?: boolean | string;
  discriminator?: string;
};
