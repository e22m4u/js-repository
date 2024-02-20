/**
 * Is deep equal.
 * https://github.com/pinglu85/BFEdevSolutions/blob/main/Coding-Problems/69.implement-deep-equal-isEqual.md
 *
 * @param {*} firstValue
 * @param {*} secondValue
 * @returns {boolean}
 */
export function isDeepEqual(firstValue, secondValue) {
  const cached = new WeakMap();
  const compare = (a, b) => {
    // Check if one of the two inputs is primitive by using typeof
    // operator; since the typeof primitive null is object, check
    // if one of the inputs is equal to null. If one of the two
    // inputs is primitive, then I can compare them by reference.
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object' || typeof b !== 'object') return a === b;
    // Check if the data type of the two inputs are the same,
    // both are arrays or objects. If they are not, return false.
    const dataTypeA = Array.isArray(a) ? 'array' : 'object';
    const dataTypeB = Array.isArray(b) ? 'array' : 'object';
    if (dataTypeA !== dataTypeB) return false;
    // Use Object.keys and Object.getOwnPropertySymbols to get
    // all of enumerable and not-inherited properties of the two
    // inputs. Compare their size respectively, if one of them
    // is not equal, return false.
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    const symbolsA = Object.getOwnPropertySymbols(a);
    const symbolsB = Object.getOwnPropertySymbols(b);
    if (symbolsA.length !== symbolsB.length) return false;
    // To handle the circular reference, initialize a WeakMap
    // that is going to keep track of the objects or arrays
    // that have been seen, in which each key is an object
    // or an array and each value is a set of objects or arrays,
    // that have been compared to that object or array.
    let setForA = cached.get(a);
    if (setForA == null) {
      setForA = new Set();
      cached.set(a, setForA);
    } else if (setForA.has(b)) {
      return true;
    }
    setForA.add(b);
    let setForB = cached.get(b);
    if (setForB == null) {
      setForB = new Set();
      cached.set(b, setForB);
    } else if (setForB.has(a)) {
      return true;
    }
    setForB.add(a);
    // Compare the property names and the values. Loop through
    // all the properties of the first input data, check if
    // the property name also exist in the second input data,
    // if not, return false; otherwise recursively compare
    // the property value.
    const propertyNamesA = [...keysA, ...symbolsA];
    for (const propertyNameA of propertyNamesA) {
      if (!b.hasOwnProperty(propertyNameA)) return false;
      const propertyValueA = a[propertyNameA];
      const propertyValueB = b[propertyNameA];
      if (!compare(propertyValueA, propertyValueB)) return false;
    }
    // If we get out of the loop without
    // returning false, return true.
    return true;
  };
  return compare(firstValue, secondValue);
}
