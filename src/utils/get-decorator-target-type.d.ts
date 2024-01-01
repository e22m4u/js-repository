/**
 * Decorator target type.
 */
export declare enum DecoratorTargetType {
  CONSTRUCTOR = 'constructor',
  INSTANCE = 'instance',
  STATIC_METHOD = 'staticMethod',
  INSTANCE_METHOD = 'instanceMethod',
  STATIC_PROPERTY = 'staticProperty',
  INSTANCE_PROPERTY = 'instanceProperty',
  CONSTRUCTOR_PARAMETER = 'constructorParameter',
  STATIC_METHOD_PARAMETER = 'staticMethodParameter',
  INSTANCE_METHOD_PARAMETER = 'instanceMethodParameter',
}

/**
 * Get decorator target type.
 *
 * @param target
 * @param propertyKey
 * @param descriptorOrIndex
 */
export declare function getDecoratorTargetType(
  target: object,
  propertyKey?: string,
  descriptorOrIndex?: PropertyDescriptor | number,
): DecoratorTargetType;
