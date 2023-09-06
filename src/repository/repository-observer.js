import {Service} from '../service/index.js';
import {isPromise} from 'mocha/lib/utils.js';
import {InvalidArgumentError} from '../errors/index.js';
import {DefinitionRegistry} from '../definition/index.js';

/**
 * Repository event.
 *
 * @type {{
 *   BEFORE_UPDATE: string,
 *   AFTER_READ: string,
 *   BEFORE_READ: string,
 *   AFTER_DELETE: string,
 *   AFTER_CREATE: string,
 *   BEFORE_DELETE: string,
 *   BEFORE_CREATE: string,
 *   AFTER_UPDATE: string,
 * }}
 */
export const RepositoryEvent = {
  BEFORE_CREATE: 'beforeCreate',
  BEFORE_READ: 'beforeRead',
  BEFORE_UPDATE: 'beforeUpdate',
  BEFORE_DELETE: 'beforeDelete',
  AFTER_CREATE: 'afterCreate',
  AFTER_READ: 'afterRead',
  AFTER_UPDATE: 'afterUpdate',
  AFTER_DELETE: 'afterDelete',
};

/**
 * Repository observer.
 */
export class RepositoryObserver extends Service {
  /**
   * Handlers map.
   *
   * @example
   * ```
   * const eventsMap = this._handlersMap.get(modelName) || new Map();
   * const handlers = eventsMap.get(eventName) || [];
   * ```
   *
   * @type {Map<any, any>}
   * @private
   */
  _handlersMap = new Map();

  /**
   * Observe.
   *
   * @param modelName
   * @param eventName
   * @param handler
   */
  observe(modelName, eventName, handler) {
    if (arguments.length === 2) {
      handler = eventName;
      eventName = modelName;
      modelName = null;
    }
    if (modelName || arguments.length === 3) {
      if (!modelName || typeof modelName !== 'string')
        throw new InvalidArgumentError(
          'The parameter "modelName" of RepositoryObserver.observe ' +
            'must be a non-empty String, but %s given.',
          modelName,
        );
      if (!this.get(DefinitionRegistry).hasModel(modelName))
        throw new InvalidArgumentError(
          'Cannot observe repository of a not defined model %s.',
          modelName,
        );
    }
    if (!eventName || typeof eventName !== 'string') {
      throw new InvalidArgumentError(
        'The parameter "eventName" of RepositoryObserver.observe ' +
          'must be a non-empty String, but %s given.',
        eventName,
      );
    }
    if (!handler || typeof handler !== 'function')
      throw new InvalidArgumentError(
        'The parameter "handler" of RepositoryObserver.observe ' +
          'must be a Function, but %s given.',
        handler,
      );
    const eventsMap = this._handlersMap.get(modelName) ?? new Map();
    const handlers = eventsMap.get(eventName) ?? [];
    handlers.push(handler);
    eventsMap.set(eventName, handlers);
    this._handlersMap.set(modelName, eventsMap);
  }

  /**
   * Get handlers.
   *
   * @param {string} modelName
   * @param {string} eventName
   * @return {function[]}
   * @private
   */
  _getHandlers(modelName, eventName) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "modelName" of RepositoryObserver._getHandlers ' +
          'must be a non-empty String, but %s given.',
        modelName,
      );
    if (!eventName || typeof eventName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "eventName" of RepositoryObserver._getHandlers ' +
          'must be a non-empty String, but %s given.',
        eventName,
      );
    const rootEventsMap = this._handlersMap.get(null) ?? new Map();
    const rootHandlers = rootEventsMap.get(eventName) ?? [];
    const modelEventsMap = this._handlersMap.get(modelName) ?? new Map();
    const modelHandlers = modelEventsMap.get(eventName) ?? [];
    return [...rootHandlers, ...modelHandlers];
  }

  /**
   * Emit.
   *
   * @param {string} modelName
   * @param {string} eventName
   * @param {string} methodName
   * @param {object} context
   * @return {Promise<unknown[]>}
   */
  emit(modelName, eventName, methodName, context) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "modelName" of RepositoryObserver.emit ' +
          'must be a non-empty String, but %s given.',
        modelName,
      );
    if (!eventName || typeof eventName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "eventName" of RepositoryObserver.emit ' +
          'must be a non-empty String, but %s given.',
        eventName,
      );
    if (!methodName || typeof methodName !== 'string')
      throw new InvalidArgumentError(
        'The parameter "methodName" of RepositoryObserver.emit ' +
          'must be a non-empty String, but %s given.',
        methodName,
      );
    if (!context || typeof context !== 'object' || Array.isArray(context))
      throw new InvalidArgumentError(
        'The parameter "context" of RepositoryObserver.emit ' +
          'must be an Object, but %s given.',
        context,
      );
    const promises = [];
    const handlers = this._getHandlers(modelName, eventName);
    handlers.forEach(handler => {
      const result = handler({modelName, eventName, methodName, ...context});
      if (isPromise(result)) promises.push(result);
    });
    return Promise.all(promises);
  }
}
