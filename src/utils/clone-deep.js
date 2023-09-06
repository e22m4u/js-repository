/**
 * Clone deep.
 *
 * @author https://stackoverflow.com/a/4460624
 * @param value
 */
export function cloneDeep(value) {
  if (!value) return value; // null, undefined values check

  const types = [Number, String, Boolean];
  let result;

  // normalizing primitives if someone did new String('aaa'),
  // or new Number('444');
  types.forEach(type => {
    if (value instanceof type) result = type(value);
  });

  if (result === undefined) {
    if (Array.isArray(value)) {
      result = [];
      value.forEach((child, index) => {
        result[index] = cloneDeep(child);
      });
    } else if (typeof value === 'object') {
      // testing that this is DOM
      if (
        'nodeType' in value &&
        value.nodeType &&
        'cloneNode' in value &&
        typeof value.cloneNode === 'function'
      ) {
        result = value.cloneNode(true);
        // check that this is a literal
      } else if (!('prototype' in value) || !value.prototype) {
        if (value instanceof Date) {
          result = new Date(value);
        } else if (value.constructor && value.constructor.name === 'Object') {
          // it is an object literal
          result = {};
          for (const key in value) {
            result[key] = cloneDeep(value[key]);
          }
        } else {
          // just keep the reference,
          // or create new object
          result = value;
        }
      } else {
        // just keep the reference,
        // or create new object
        result = value;
      }
    } else {
      result = value;
    }
  }

  return result;
}
