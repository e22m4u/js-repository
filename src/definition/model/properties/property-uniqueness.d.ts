/**
 * Property uniqueness.
 */
export declare const PropertyUniqueness: {
  STRICT: 'strict';
  SPARSE: 'sparse';
  NON_UNIQUE: 'nonUnique';
};

/**
 * Type of PropertyUniqueness.
 */
export type PropertyUniqueness =
  (typeof PropertyUniqueness)[keyof typeof PropertyUniqueness];
