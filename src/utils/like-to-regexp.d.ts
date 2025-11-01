/**
 * Преобразует SQL LIKE-шаблон в объект RegExp.
 *
 * Экранирует специальные символы регулярных выражений,
 * чтобы они обрабатывались как обычные символы, и преобразует
 * SQL wildcards (% и _) в их эквиваленты в регулярных выражениях.
 *
 * @param pattern
 * @param isCaseInsensitive
 */
export function likeToRegexp(
  pattern: string,
  isCaseInsensitive?: boolean,
): RegExp;
