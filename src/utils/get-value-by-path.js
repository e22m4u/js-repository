/**
 * Get value by path.
 *
 * @param obj
 * @param path
 * @param orElse
 */
export function getValueByPath(obj, path, orElse = undefined) {
  if (!obj || typeof obj !== 'object') return orElse;
  if (!path || typeof path !== 'string') return orElse;
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (typeof value === 'object' && value !== null && key in value) {
      value = value[key];
    } else {
      value = orElse;
      break;
    }
  }
  return value;
}
