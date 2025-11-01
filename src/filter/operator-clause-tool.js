import {Service} from '@e22m4u/js-service';
import {likeToRegexp} from '../utils/index.js';
import {stringToRegexp} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {InvalidOperatorValueError} from '../errors/index.js';

/**
 * Operator clause tool.
 */
export class OperatorClauseTool extends Service {
  /**
   * Compare.
   *
   * @param {*} val1 The 1st value
   * @param {*} val2 The 2nd value
   * @returns {number} 0: =, positive: >, negative <
   */
  compare(val1, val2) {
    if (val1 == null || val2 == null) {
      return val1 == val2 ? 0 : NaN;
    }
    if (typeof val1 === 'number') {
      if (
        typeof val2 === 'number' ||
        typeof val2 === 'string' ||
        typeof val2 === 'boolean'
      ) {
        if (val1 === val2) return 0;
        return val1 - Number(val2);
      }
      return NaN;
    }
    if (typeof val1 === 'string') {
      const isDigits = /^\d+$/.test(val1);
      if (isDigits) return this.compare(Number(val1), val2);
      try {
        if (val1 > val2) return 1;
        if (val1 < val2) return -1;
        if (val1 == val2) return 0;
      } catch (e) {
        /**/
      }
      return NaN;
    }
    if (typeof val1 === 'boolean') {
      return Number(val1) - Number(val2);
    }
    // Return NaN if we don't know how to compare.
    return val1 === val2 ? 0 : NaN;
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

    // {eq: ...}
    // {neq: ...}
    const eqNeqTest = this.testEqNeq(clause, value);
    if (eqNeqTest !== undefined) return eqNeqTest;

    // {gt: ...}
    // {gte: ...}
    // {lt: ...}
    // {lte: ...}
    const gtLtTest = this.testGtLt(clause, value);
    if (gtLtTest !== undefined) return gtLtTest;

    // {inc: ...}
    const incTest = this.testInq(clause, value);
    if (incTest !== undefined) return incTest;

    // {nin: ...}
    const ninTest = this.testNin(clause, value);
    if (ninTest !== undefined) return ninTest;

    // {between: ...}
    const betweenTest = this.testBetween(clause, value);
    if (betweenTest !== undefined) return betweenTest;

    // {exists: ...}
    const existsTest = this.testExists(clause, value);
    if (existsTest !== undefined) return existsTest;

    // {like: ...}
    const likeTest = this.testLike(clause, value);
    if (likeTest !== undefined) return likeTest;

    // {nlike: ...}
    const nlikeTest = this.testNlike(clause, value);
    if (nlikeTest !== undefined) return nlikeTest;

    // {ilike: ...}
    const ilikeTest = this.testIlike(clause, value);
    if (ilikeTest !== undefined) return ilikeTest;

    // {nilike: ...}
    const nilikeTest = this.testNilike(clause, value);
    if (nilikeTest !== undefined) return nilikeTest;

    // {regexp: ...}
    const regExpTest = this.testRegexp(clause, value);
    if (regExpTest !== undefined) return regExpTest;
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
    if ('eq' in clause) return this.compare(clause.eq, value) === 0;
    if ('neq' in clause) return this.compare(clause.neq, value) !== 0;
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
        if (clause.inq[i] == value) return true;
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
      for (let i = 0; i < clause.nin.length; i++) {
        if (clause.nin[i] == value) return false;
      }
      return true;
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
