/**
 * Relation type.
 *
 * @type {{
 *   BELONGS_TO: string,
 *   HAS_ONE: string,
 *   HAS_MANY: string,
 *   REFERENCES_MANY: string,
 * }}
 */
export const RelationType = {
  BELONGS_TO: 'belongsTo',
  HAS_ONE: 'hasOne',
  HAS_MANY: 'hasMany',
  REFERENCES_MANY: 'referencesMany',
};
