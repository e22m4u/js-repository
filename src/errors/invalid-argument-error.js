import {format} from 'util';
import {valueToString} from '../utils/index.js';

/**
 * Invalid argument error.
 */
export class InvalidArgumentError extends Error {
  /**
   * Constructor.
   *
   * @param pattern
   * @param args
   */
  constructor(pattern, ...args) {
    const vars = args.map(valueToString);
    const message =
      typeof pattern === 'string' ? format(pattern, ...vars) : undefined;
    super(message);
  }
}
