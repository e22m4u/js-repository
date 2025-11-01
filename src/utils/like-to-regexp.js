import {InvalidArgumentError} from '../errors/index.js';

/**
 * Преобразует SQL LIKE-шаблон в объект RegExp.
 *
 * Экранирует специальные символы регулярных выражений,
 * чтобы они обрабатывались как обычные символы, и преобразует
 * SQL wildcards (% и _) в их эквиваленты в регулярных выражениях.
 *
 * @param {string} pattern
 * @param {boolean} isCaseInsensitive
 * @returns {RegExp}
 */
export function likeToRegexp(pattern, isCaseInsensitive = false) {
  if (typeof pattern !== 'string') {
    throw new InvalidArgumentError(
      'The first argument of `likeToRegexp` ' +
        'should be a String, but %v was given.',
      pattern,
    );
  }
  // символы, которые имеют специальное значение
  // в RegExp и должны быть экранированы
  const regexSpecials = '-[]{}()*+?.\\^$|';
  let regexString = '';
  let isEscaping = false;
  // экранирование
  for (const char of pattern) {
    if (isEscaping) {
      // предыдущий символ был '\', значит текущий символ - литерал
      regexString += regexSpecials.includes(char) ? `\\${char}` : char;
      isEscaping = false;
    } else if (char === '\\') {
      // символ экранирования, следующий символ будет литералом
      isEscaping = true;
    } else if (char === '%') {
      // SQL wildcard: любое количество любых символов
      regexString += '.*';
    } else if (char === '_') {
      // SQL wildcard: ровно один любой символ
      regexString += '.';
    } else if (regexSpecials.includes(char)) {
      // экранирование других специальных символов RegExp
      regexString += `\\${char}`;
    } else {
      // обычный символ
      regexString += char;
    }
  }
  // если строка заканчивается на экранирующий символ,
  // считаем его литералом.
  if (isEscaping) {
    regexString += '\\\\';
  }
  const flags = isCaseInsensitive ? 'i' : '';
  return new RegExp(`^${regexString}$`, flags);
}
