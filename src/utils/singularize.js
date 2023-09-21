/**
 * Singularize.
 *
 * @param {string} noun
 * @returns {string}
 */
export function singularize(noun) {
  if (!noun || typeof noun !== 'string') return noun;
  const endings = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: '',
  };
  return noun.replace(
    new RegExp(`(${Object.keys(endings).join('|')})$`),
    r => endings[r],
  );
}
