/**
 * Is pure object.
 *
 * @param value
 */
export function isPureObject(value) {
  return Boolean(
    typeof value === 'object' &&
      value &&
      !Array.isArray(value) &&
      (!value.constructor ||
        (value.constructor && value.constructor.name === 'Object')),
  );
}
