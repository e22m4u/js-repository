import {Service} from '@e22m4u/js-service';
import {isDeepEqual, likeToRegexp, stringToRegexp} from '../utils/index.js';

import {
  InvalidArgumentError,
  InvalidOperatorValueError,
} from '../errors/index.js';

/**
 * Operator clause tool.
 */
export class OperatorClauseTool extends Service {
  /**
   * Compare.
   *
   * @param {*} val1 The 1st value
   * @param {*} val2 The 2nd value
   * @param {*} noTypeConversion
   * @returns {number} 0: =, positive: >, negative <
   */
  compare(val1, val2, noTypeConversion = false) {
    if (val1 === val2) {
      return 0;
    }
    if (val1 == null || val2 == null) {
      return val1 == val2 ? 0 : NaN;
    }
    const type1 = typeof val1;
    const type2 = typeof val2;
    // объекты и массивы
    if (type1 === 'object' || type2 === 'object') {
      return isDeepEqual(val1, val2) ? 0 : NaN;
    }
    // числовое сравнение
    if (
      (type1 === 'number' || type1 === 'string' || type1 === 'boolean') &&
      (type2 === 'number' || type2 === 'string' || type2 === 'boolean')
    ) {
      if (noTypeConversion && type1 !== type2) {
        return NaN;
      }
      const num1 = Number(val1);
      const num2 = Number(val2);
      if (!isNaN(num1) && !isNaN(num2)) {
        return num1 - num2;
      }
    }
    // лексикографическое сравнение
    if (type1 === 'string' && type2 === 'string') {
      if (val1 > val2) return 1;
      if (val1 < val2) return -1;
      return 0;
    }
    return NaN;
  }

  /**
   * Test all operators.
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testAll(clause, value) {
    if (!clause || typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testAll ' +
          'should be an Object, but %v was given.',
        clause,
      );
    const operatorMap = {
      eq: this.testEqNeq,
      neq: this.testEqNeq,
      gt: this.testGtLt,
      gte: this.testGtLt,
      lt: this.testGtLt,
      lte: this.testGtLt,
      inq: this.testInq,
      nin: this.testNin,
      between: this.testBetween,
      exists: this.testExists,
      like: this.testLike,
      nlike: this.testNlike,
      ilike: this.testIlike,
      nilike: this.testNilike,
      regexp: this.testRegexp,
    };
    const clauseKeys = Object.keys(clause);
    // поиск ключей, которые являются известными операторами
    const knownOperators = clauseKeys.filter(key => operatorMap[key]);
    // если в объекте clause нет ни одного известного оператора,
    // то возвращается undefined, чтобы _test() продолжил сравнение
    if (knownOperators.length === 0) {
      return undefined;
    }
    // проверка каждого из операторов
    return knownOperators.every(op => {
      // временный объект с текущим оператором для передачи в тестер
      const singleOpClause = {[op]: clause[op]};
      // обработка для regexp, для передачи флагов
      if (op === 'regexp' && 'flags' in clause) {
        singleOpClause.flags = clause.flags;
      }
      // вызов тестера с передачей контекста
      const testFn = operatorMap[op];
      const result = testFn.call(this, singleOpClause, value);
      return result;
    });
  }

  /**
   * Test eq/neq operator.
   *
   * @example
   * ```ts
   * {
   *   eq: 'foo',
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   neq: 'foo',
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testEqNeq(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testEqNeq ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('eq' in clause) return this.compare(clause.eq, value, true) === 0;
    if ('neq' in clause) return this.compare(clause.neq, value, true) !== 0;
  }

  /**
   * Test lt/gt/lte/gte operator.
   *
   * @example
   * ```ts
   * {
   *   lt: 10,
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   lte: 10,
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   gt: 10,
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   gte: 10,
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testGtLt(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testGtLt ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('gt' in clause) return this.compare(value, clause.gt) > 0;
    if ('gte' in clause) return this.compare(value, clause.gte) >= 0;
    if ('lt' in clause) return this.compare(value, clause.lt) < 0;
    if ('lte' in clause) return this.compare(value, clause.lte) <= 0;
  }

  /**
   * Test inc operator.
   *
   * @example
   * ```ts
   * {
   *   inc: ['foo', 'bar'],
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testInq(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testInq ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('inq' in clause && clause.inq !== undefined) {
      if (!clause.inq || !Array.isArray(clause.inq)) {
        throw new InvalidOperatorValueError(
          'inq',
          'an Array of possible values',
          clause.inq,
        );
      }
      for (let i = 0; i < clause.inq.length; i++) {
        if (this.compare(clause.inq[i], value, true) === 0) {
          return true;
        }
      }
      return false;
    }
  }

  /**
   * Test nin operator.
   *
   * @example
   * ```ts
   * {
   *   nin: ['foo', 'bar'],
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testNin(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testNin ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('nin' in clause && clause.nin !== undefined) {
      if (!clause.nin || !Array.isArray(clause.nin)) {
        throw new InvalidOperatorValueError(
          'nin',
          'an Array of possible values',
          clause.nin,
        );
      }
      return clause.nin.every(element => {
        return this.compare(element, value, true) !== 0;
      });
    }
  }

  /**
   * Test between operator.
   *
   * @example
   * ```ts
   * {
   *   between: [10, 20],
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testBetween(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testBetween ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('between' in clause && clause.between !== undefined) {
      if (!Array.isArray(clause.between) || clause.between.length !== 2) {
        throw new InvalidOperatorValueError(
          'between',
          'an Array of 2 elements',
          clause.between,
        );
      }
      return (
        this.testGtLt({gte: clause.between[0]}, value) &&
        this.testGtLt({lte: clause.between[1]}, value)
      );
    }
  }

  /**
   * Test exists operator.
   *
   * @example
   * ```ts
   * {
   *   exists: true,
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testExists(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testExists ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('exists' in clause && clause.exists !== undefined) {
      if (typeof clause.exists !== 'boolean') {
        throw new InvalidOperatorValueError(
          'exists',
          'a Boolean',
          clause.exists,
        );
      }
      return clause.exists ? value !== undefined : value === undefined;
    }
  }

  /**
   * Test like operator.
   *
   * @example
   * ```ts
   * {
   *   like: 'foo',
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testLike(clause, value) {
    if (!clause || typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testLike ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('like' in clause && clause.like !== undefined) {
      if (typeof clause.like !== 'string')
        throw new InvalidOperatorValueError('like', 'a String', clause.like);
      return likeToRegexp(clause.like).test(value);
    }
  }

  /**
   * Test nlike operator.
   *
   * @example
   * ```ts
   * {
   *   nlike: 'foo',
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testNlike(clause, value) {
    if (!clause || typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testNlike ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('nlike' in clause && clause.nlike !== undefined) {
      if (typeof clause.nlike !== 'string') {
        throw new InvalidOperatorValueError('nlike', 'a String', clause.nlike);
      }
      return !likeToRegexp(clause.nlike).test(value);
    }
  }

  /**
   * Test ilike operator.
   *
   * @example
   * ```ts
   * {
   *   ilike: 'foo',
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testIlike(clause, value) {
    if (!clause || typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testIlike ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('ilike' in clause && clause.ilike !== undefined) {
      if (typeof clause.ilike !== 'string') {
        throw new InvalidOperatorValueError('ilike', 'a String', clause.ilike);
      }
      return likeToRegexp(clause.ilike, true).test(value);
    }
  }

  /**
   * Test nilike operator.
   *
   * @example
   * ```ts
   * {
   *   nilike: 'foo',
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testNilike(clause, value) {
    if (!clause || typeof clause !== 'object' || Array.isArray(clause))
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testNilike ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('nilike' in clause && clause.nilike !== undefined) {
      if (typeof clause.nilike !== 'string') {
        throw new InvalidOperatorValueError(
          'nilike',
          'a String',
          clause.nilike,
        );
      }
      return !likeToRegexp(clause.nilike, true).test(value);
    }
  }

  /**
   * Test regexp.
   *
   * @example
   * ```ts
   * {
   *   regexp: 'foo.*',
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   regexp: 'foo.*',
   *   flags: 'i',
   * }
   * ```
   *
   * @param {object} clause
   * @param {*} value
   * @returns {boolean|undefined}
   */
  testRegexp(clause, value) {
    if (!clause || typeof clause !== 'object')
      throw new InvalidArgumentError(
        'The first argument of OperatorUtils.testRegexp ' +
          'should be an Object, but %v was given.',
        clause,
      );
    if ('regexp' in clause && clause.regexp !== undefined) {
      if (
        typeof clause.regexp !== 'string' &&
        !(clause.regexp instanceof RegExp)
      ) {
        throw new InvalidOperatorValueError(
          'regexp',
          'a String',
          clause.regexp,
        );
      }
      const flags = clause.flags || undefined;
      if (flags && typeof flags !== 'string')
        throw new InvalidArgumentError(
          'RegExp flags should be a String, but %v was given.',
          clause.flags,
        );
      if (!value || typeof value !== 'string') return false;
      const regExp = stringToRegexp(clause.regexp, flags);
      return !!value.match(regExp);
    }
  }
}
