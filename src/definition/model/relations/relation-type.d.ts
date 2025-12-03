/**
 * Relation type.
 */
export declare const RelationType: {
  BELONGS_TO: 'belongsTo';
  HAS_ONE: 'hasOne';
  HAS_MANY: 'hasMany';
  REFERENCES_MANY: 'referencesMany';
};

/**
 * Type of RelationType.
 */
export type RelationType = (typeof RelationType)[keyof typeof RelationType];
