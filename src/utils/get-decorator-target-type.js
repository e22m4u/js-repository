/**
 * @typedef {object} PropertyDescriptor
 * @property {boolean|undefined} configurable
 * @property {boolean|undefined} enumerable
 * @property {*} value
 * @property {boolean|undefined} writable
 * @property {Function} get
 * @property {Function} set
 */

/**
 * Decorator target type.
 *
 * @enum {string}
 * @property {string} CONSTRUCTOR
 * @property {string} INSTANCE
 * @property {string} STATIC_METHOD
 * @property {string} INSTANCE_METHOD
 * @property {string} STATIC_PROPERTY
 * @property {string} INSTANCE_PROPERTY
 * @property {string} CONSTRUCTOR_PARAMETER
 * @property {string} STATIC_METHOD_PARAMETER
 * @property {string} INSTANCE_METHOD_PARAMETER
 */
export const DecoratorTargetType = {
  CONSTRUCTOR: 'constructor',
  INSTANCE: 'instance',
  STATIC_METHOD: 'staticMethod',
  INSTANCE_METHOD: 'instanceMethod',
  STATIC_PROPERTY: 'staticProperty',
  INSTANCE_PROPERTY: 'instanceProperty',
  CONSTRUCTOR_PARAMETER: 'constructorParameter',
  STATIC_METHOD_PARAMETER: 'staticMethodParameter',
  INSTANCE_METHOD_PARAMETER: 'instanceMethodParameter',
};

/**
 * Get decorator target type.
 *
 * @param {object} target
 * @param {string|undefined} propertyKey
 * @param {PropertyDescriptor|number|undefined} descriptorOrIndex
 * @returns {DecoratorTargetType}
 */
export function getDecoratorTargetType(target, propertyKey, descriptorOrIndex) {
  const isCtor = typeof target === 'function';
  const isParameter = typeof descriptorOrIndex === 'number';
  const isProperty = propertyKey != null && descriptorOrIndex == null;
  const isMethod = propertyKey != null && descriptorOrIndex != null;
  const D = DecoratorTargetType;
  if (isCtor) {
    if (isParameter)
      return propertyKey ? D.STATIC_METHOD_PARAMETER : D.CONSTRUCTOR_PARAMETER;
    if (isProperty) return D.STATIC_PROPERTY;
    if (isMethod) return D.STATIC_METHOD;
    return D.CONSTRUCTOR;
  } else {
    if (isParameter) return D.INSTANCE_METHOD_PARAMETER;
    if (isProperty) return D.INSTANCE_PROPERTY;
    if (isMethod) return D.INSTANCE_METHOD;
    return D.INSTANCE;
  }
}
