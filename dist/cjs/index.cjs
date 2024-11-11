"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __glob = (map) => (path) => {
  var fn = map[path];
  if (fn) return fn();
  throw new Error("Module not found in bundle: " + path);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@e22m4u/js-format/src/utils/is-class.js
function isClass(value) {
  if (!value) return false;
  return typeof value === "function" && /^class\s/.test(Function.prototype.toString.call(value));
}
var init_is_class = __esm({
  "node_modules/@e22m4u/js-format/src/utils/is-class.js"() {
    __name(isClass, "isClass");
  }
});

// node_modules/@e22m4u/js-format/src/utils/index.js
var init_utils = __esm({
  "node_modules/@e22m4u/js-format/src/utils/index.js"() {
    init_is_class();
  }
});

// node_modules/@e22m4u/js-format/src/value-to-string.js
function valueToString(input) {
  if (input == null) return String(input);
  if (typeof input === "string") return `"${input}"`;
  if (typeof input === "number" || typeof input === "boolean")
    return String(input);
  if (isClass(input)) return input.name ? input.name : "Class";
  if (input.constructor && input.constructor.name)
    return BASE_CTOR_NAMES.includes(input.constructor.name) ? input.constructor.name : `${input.constructor.name} (instance)`;
  if (typeof input === "object" && input.constructor == null) return "Object";
  return String(input);
}
var BASE_CTOR_NAMES;
var init_value_to_string = __esm({
  "node_modules/@e22m4u/js-format/src/value-to-string.js"() {
    init_utils();
    BASE_CTOR_NAMES = [
      "String",
      "Number",
      "Boolean",
      "Object",
      "Array",
      "Function",
      "Symbol",
      "Map",
      "Set",
      "Date"
    ];
    __name(valueToString, "valueToString");
  }
});

// node_modules/@e22m4u/js-format/src/array-to-list.js
function arrayToList(input) {
  if (Array.isArray(input) && input.length)
    return input.map(valueToString).join(SEPARATOR);
  return valueToString(input);
}
var SEPARATOR;
var init_array_to_list = __esm({
  "node_modules/@e22m4u/js-format/src/array-to-list.js"() {
    init_value_to_string();
    SEPARATOR = ", ";
    __name(arrayToList, "arrayToList");
  }
});

// node_modules/@e22m4u/js-format/src/format.js
function format(pattern) {
  if (pattern instanceof Date) {
    pattern = pattern.toISOString();
  } else if (typeof pattern !== "string") {
    pattern = String(pattern);
  }
  const re = /(%?)(%([sdjvl]))/g;
  const args = Array.prototype.slice.call(arguments, 1);
  if (args.length) {
    pattern = pattern.replace(re, function(match, escaped, ptn, flag) {
      let arg = args.shift();
      switch (flag) {
        case "s":
          arg = String(arg);
          break;
        case "d":
          arg = Number(arg);
          break;
        case "j":
          arg = JSON.stringify(arg);
          break;
        case "v":
          arg = valueToString(arg);
          break;
        case "l":
          arg = arrayToList(arg);
          break;
      }
      if (!escaped) return arg;
      args.unshift(arg);
      return match;
    });
  }
  if (args.length) pattern += " " + args.join(" ");
  pattern = pattern.replace(/%{2}/g, "%");
  return "" + pattern;
}
var init_format = __esm({
  "node_modules/@e22m4u/js-format/src/format.js"() {
    init_array_to_list();
    init_value_to_string();
    __name(format, "format");
  }
});

// node_modules/@e22m4u/js-format/src/errorf.js
var _Errorf, Errorf;
var init_errorf = __esm({
  "node_modules/@e22m4u/js-format/src/errorf.js"() {
    init_format();
    _Errorf = class _Errorf extends Error {
      /**
       * Constructor.
       *
       * @param {string|undefined} pattern
       * @param {any} args
       */
      constructor(pattern = void 0, ...args) {
        const message = pattern != null ? format(pattern, ...args) : void 0;
        super(message);
      }
    };
    __name(_Errorf, "Errorf");
    Errorf = _Errorf;
  }
});

// node_modules/@e22m4u/js-format/src/index.js
var init_src = __esm({
  "node_modules/@e22m4u/js-format/src/index.js"() {
    init_format();
    init_errorf();
  }
});

// node_modules/@e22m4u/js-service/src/errors/invalid-argument-error.js
var _InvalidArgumentError, InvalidArgumentError;
var init_invalid_argument_error = __esm({
  "node_modules/@e22m4u/js-service/src/errors/invalid-argument-error.js"() {
    init_src();
    _InvalidArgumentError = class _InvalidArgumentError extends Errorf {
    };
    __name(_InvalidArgumentError, "InvalidArgumentError");
    InvalidArgumentError = _InvalidArgumentError;
  }
});

// node_modules/@e22m4u/js-service/src/errors/index.js
var init_errors = __esm({
  "node_modules/@e22m4u/js-service/src/errors/index.js"() {
    init_invalid_argument_error();
  }
});

// node_modules/@e22m4u/js-service/src/service-container.js
var _ServiceContainer, ServiceContainer;
var init_service_container = __esm({
  "node_modules/@e22m4u/js-service/src/service-container.js"() {
    init_service();
    init_errors();
    _ServiceContainer = class _ServiceContainer {
      /**
       * Services map.
       *
       * @type {Map<any, any>}
       * @private
       */
      _services = /* @__PURE__ */ new Map();
      /**
       * Parent container.
       *
       * @type {ServiceContainer}
       * @private
       */
      _parent;
      /**
       * Constructor.
       *
       * @param {ServiceContainer|undefined} parent
       */
      constructor(parent = void 0) {
        if (parent != null) {
          if (!(parent instanceof _ServiceContainer))
            throw new InvalidArgumentError(
              'The provided parameter "parent" of ServicesContainer.constructor must be an instance ServiceContainer, but %v given.',
              parent
            );
          this._parent = parent;
        }
      }
      /**
       * Получить существующий или новый экземпляр.
       *
       * @param {*} ctor
       * @param {*} args
       * @return {*}
       */
      get(ctor, ...args) {
        if (!ctor || typeof ctor !== "function")
          throw new InvalidArgumentError(
            "The first argument of ServicesContainer.get must be a class constructor, but %v given.",
            ctor
          );
        if (!this._services.has(ctor) && this._parent && this._parent.has(ctor)) {
          return this._parent.get(ctor);
        }
        let service = this._services.get(ctor);
        if (!service || args.length) {
          service = "prototype" in ctor && ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
          this._services.set(ctor, service);
        } else if (typeof service === "function") {
          service = service();
          this._services.set(ctor, service);
        }
        return service;
      }
      /**
       * Проверка существования конструктора в контейнере.
       *
       * @param {*} ctor
       * @return {boolean}
       */
      has(ctor) {
        if (this._services.has(ctor)) return true;
        if (this._parent) return this._parent.has(ctor);
        return false;
      }
      /**
       * Добавить конструктор в контейнер.
       *
       * @param {*} ctor
       * @param {*} args
       * @return {this}
       */
      add(ctor, ...args) {
        if (!ctor || typeof ctor !== "function")
          throw new InvalidArgumentError(
            "The first argument of ServicesContainer.add must be a class constructor, but %v given.",
            ctor
          );
        const factory = /* @__PURE__ */ __name(() => ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args), "factory");
        this._services.set(ctor, factory);
        return this;
      }
      /**
       * Добавить конструктор и создать экземпляр.
       *
       * @param {*} ctor
       * @param {*} args
       * @return {this}
       */
      use(ctor, ...args) {
        if (!ctor || typeof ctor !== "function")
          throw new InvalidArgumentError(
            "The first argument of ServicesContainer.use must be a class constructor, but %v given.",
            ctor
          );
        const service = ctor.prototype instanceof Service ? new ctor(this, ...args) : new ctor(...args);
        this._services.set(ctor, service);
        return this;
      }
      /**
       * Добавить конструктор и связанный экземпляр.
       *
       * @param {*} ctor
       * @param {*} service
       * @return {this}
       */
      set(ctor, service) {
        if (!ctor || typeof ctor !== "function")
          throw new InvalidArgumentError(
            "The first argument of ServicesContainer.set must be a class constructor, but %v given.",
            ctor
          );
        if (!service || typeof service !== "object" || Array.isArray(service))
          throw new InvalidArgumentError(
            "The second argument of ServicesContainer.set must be an Object, but %v given.",
            service
          );
        this._services.set(ctor, service);
        return this;
      }
    };
    __name(_ServiceContainer, "ServiceContainer");
    ServiceContainer = _ServiceContainer;
  }
});

// node_modules/@e22m4u/js-service/src/service.js
var _Service, Service;
var init_service = __esm({
  "node_modules/@e22m4u/js-service/src/service.js"() {
    init_service_container();
    _Service = class _Service {
      /**
       * Container.
       *
       * @type {ServiceContainer}
       */
      container;
      /**
       * Constructor.
       *
       * @param {ServiceContainer|undefined} container
       */
      constructor(container = void 0) {
        this.container = container instanceof ServiceContainer ? container : new ServiceContainer();
      }
      /**
       * Получить существующий или новый экземпляр.
       *
       * @param {*} ctor
       * @param {*} args
       * @return {*}
       */
      getService(ctor, ...args) {
        return this.container.get(ctor, ...args);
      }
      /**
       * Проверка существования конструктора в контейнере.
       *
       * @param {*} ctor
       * @return {boolean}
       */
      hasService(ctor) {
        return this.container.has(ctor);
      }
      /**
       * Добавить конструктор в контейнер.
       *
       * @param {*} ctor
       * @param {*} args
       * @return {this}
       */
      addService(ctor, ...args) {
        this.container.add(ctor, ...args);
        return this;
      }
      /**
       * Добавить конструктор и создать экземпляр.
       *
       * @param {*} ctor
       * @param {*} args
       * @return {this}
       */
      useService(ctor, ...args) {
        this.container.use(ctor, ...args);
        return this;
      }
      /**
       * Добавить конструктор и связанный экземпляр.
       *
       * @param {*} ctor
       * @param {*} service
       * @return {this}
       */
      setService(ctor, service) {
        this.container.set(ctor, service);
        return this;
      }
    };
    __name(_Service, "Service");
    Service = _Service;
  }
});

// node_modules/@e22m4u/js-service/src/index.js
var init_src2 = __esm({
  "node_modules/@e22m4u/js-service/src/index.js"() {
    init_service();
    init_service_container();
  }
});

// src/errors/not-implemented-error.js
var _NotImplementedError, NotImplementedError;
var init_not_implemented_error = __esm({
  "src/errors/not-implemented-error.js"() {
    "use strict";
    init_src();
    _NotImplementedError = class _NotImplementedError extends Errorf {
    };
    __name(_NotImplementedError, "NotImplementedError");
    NotImplementedError = _NotImplementedError;
  }
});

// src/errors/invalid-argument-error.js
var _InvalidArgumentError2, InvalidArgumentError2;
var init_invalid_argument_error2 = __esm({
  "src/errors/invalid-argument-error.js"() {
    "use strict";
    init_src();
    _InvalidArgumentError2 = class _InvalidArgumentError2 extends Errorf {
    };
    __name(_InvalidArgumentError2, "InvalidArgumentError");
    InvalidArgumentError2 = _InvalidArgumentError2;
  }
});

// src/errors/invalid-operator-value-error.js
var _InvalidOperatorValueError, InvalidOperatorValueError;
var init_invalid_operator_value_error = __esm({
  "src/errors/invalid-operator-value-error.js"() {
    "use strict";
    init_src();
    _InvalidOperatorValueError = class _InvalidOperatorValueError extends Error {
      /**
       * Constructor.
       *
       * @param {string} operator
       * @param {string} expected
       * @param {*} value
       */
      constructor(operator, expected, value) {
        super(
          format(
            "Condition of {%s: ...} should have %s, but %v given.",
            operator,
            expected,
            value
          )
        );
      }
    };
    __name(_InvalidOperatorValueError, "InvalidOperatorValueError");
    InvalidOperatorValueError = _InvalidOperatorValueError;
  }
});

// src/errors/index.js
var init_errors2 = __esm({
  "src/errors/index.js"() {
    "use strict";
    init_not_implemented_error();
    init_invalid_argument_error2();
    init_invalid_operator_value_error();
  }
});

// src/filter/slice-clause-tool.js
var _SliceClauseTool, SliceClauseTool;
var init_slice_clause_tool = __esm({
  "src/filter/slice-clause-tool.js"() {
    "use strict";
    init_src2();
    init_errors2();
    _SliceClauseTool = class _SliceClauseTool extends Service {
      /**
       * Slice.
       *
       * @param {object[]} entities
       * @param {number|undefined} skip
       * @param {number|undefined} limit
       * @returns {object[]}
       */
      slice(entities, skip = void 0, limit = void 0) {
        if (!Array.isArray(entities))
          throw new InvalidArgumentError2(
            "The first argument of SliceClauseTool.slice should be an Array, but %v given.",
            entities
          );
        if (skip != null && typeof skip !== "number")
          throw new InvalidArgumentError2(
            'The provided option "skip" should be a Number, but %v given.',
            skip
          );
        if (limit != null && typeof limit !== "number")
          throw new InvalidArgumentError2(
            'The provided option "limit" should be a Number, but %v given.',
            limit
          );
        skip = skip || 0;
        limit = limit || entities.length;
        return entities.slice(skip, skip + limit);
      }
      /**
       * Validate skip clause.
       *
       * @param {number|undefined} skip
       */
      static validateSkipClause(skip) {
        if (skip == null) return;
        if (typeof skip !== "number")
          throw new InvalidArgumentError2(
            'The provided option "skip" should be a Number, but %v given.',
            skip
          );
      }
      /**
       * Validate limit clause.
       *
       * @param {number|undefined} limit
       */
      static validateLimitClause(limit) {
        if (limit == null) return;
        if (typeof limit !== "number")
          throw new InvalidArgumentError2(
            'The provided option "limit" should be a Number, but %v given.',
            limit
          );
      }
    };
    __name(_SliceClauseTool, "SliceClauseTool");
    SliceClauseTool = _SliceClauseTool;
  }
});

// src/utils/is-ctor.js
function isCtor(value) {
  if (!value) return false;
  return typeof value === "function" && "prototype" in value;
}
var init_is_ctor = __esm({
  "src/utils/is-ctor.js"() {
    "use strict";
    __name(isCtor, "isCtor");
  }
});

// src/utils/is-promise.js
function isPromise(value) {
  if (!value) return false;
  if (typeof value !== "object") return false;
  return typeof value.then === "function";
}
var init_is_promise = __esm({
  "src/utils/is-promise.js"() {
    "use strict";
    __name(isPromise, "isPromise");
  }
});

// src/utils/capitalize.js
function capitalize(string) {
  if (!string || typeof string !== "string") return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var init_capitalize = __esm({
  "src/utils/capitalize.js"() {
    "use strict";
    __name(capitalize, "capitalize");
  }
});

// src/utils/clone-deep.js
function cloneDeep(value) {
  if (!value) return value;
  const types = [Number, String, Boolean];
  let result;
  types.forEach((type) => {
    if (value instanceof type) result = type(value);
  });
  if (result === void 0) {
    if (Array.isArray(value)) {
      result = [];
      value.forEach((child, index) => {
        result[index] = cloneDeep(child);
      });
    } else if (typeof value === "object") {
      if ("nodeType" in value && value.nodeType && "cloneNode" in value && typeof value.cloneNode === "function") {
        result = value.cloneNode(true);
      } else if (!("prototype" in value) || !value.prototype) {
        if (value instanceof Date) {
          result = new Date(value);
        } else if (value.constructor && value.constructor.name === "Object") {
          result = {};
          for (const key in value) {
            result[key] = cloneDeep(value[key]);
          }
        } else {
          result = value;
        }
      } else {
        result = value;
      }
    } else {
      result = value;
    }
  }
  return result;
}
var init_clone_deep = __esm({
  "src/utils/clone-deep.js"() {
    "use strict";
    __name(cloneDeep, "cloneDeep");
  }
});

// src/utils/singularize.js
function singularize(noun) {
  if (!noun || typeof noun !== "string") return noun;
  const endings = {
    ves: "fe",
    ies: "y",
    i: "us",
    zes: "ze",
    ses: "s",
    es: "e",
    s: ""
  };
  return noun.replace(
    new RegExp(`(${Object.keys(endings).join("|")})$`),
    (r) => endings[r]
  );
}
var init_singularize = __esm({
  "src/utils/singularize.js"() {
    "use strict";
    __name(singularize, "singularize");
  }
});

// src/utils/is-deep-equal.js
function isDeepEqual(firstValue, secondValue) {
  const cached = /* @__PURE__ */ new WeakMap();
  const compare = /* @__PURE__ */ __name((a, b) => {
    if (a === null || b === null) return a === b;
    if (typeof a !== "object" || typeof b !== "object") return a === b;
    const dataTypeA = Array.isArray(a) ? "array" : "object";
    const dataTypeB = Array.isArray(b) ? "array" : "object";
    if (dataTypeA !== dataTypeB) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    const symbolsA = Object.getOwnPropertySymbols(a);
    const symbolsB = Object.getOwnPropertySymbols(b);
    if (symbolsA.length !== symbolsB.length) return false;
    let setForA = cached.get(a);
    if (setForA == null) {
      setForA = /* @__PURE__ */ new Set();
      cached.set(a, setForA);
    } else if (setForA.has(b)) {
      return true;
    }
    setForA.add(b);
    let setForB = cached.get(b);
    if (setForB == null) {
      setForB = /* @__PURE__ */ new Set();
      cached.set(b, setForB);
    } else if (setForB.has(a)) {
      return true;
    }
    setForB.add(a);
    const propertyNamesA = [...keysA, ...symbolsA];
    for (const propertyNameA of propertyNamesA) {
      if (!Object.prototype.hasOwnProperty.call(b, propertyNameA)) return false;
      const propertyValueA = a[propertyNameA];
      const propertyValueB = b[propertyNameA];
      if (!compare(propertyValueA, propertyValueB)) return false;
    }
    return true;
  }, "compare");
  return compare(firstValue, secondValue);
}
var init_is_deep_equal = __esm({
  "src/utils/is-deep-equal.js"() {
    "use strict";
    __name(isDeepEqual, "isDeepEqual");
  }
});

// src/utils/get-ctor-name.js
function getCtorName(value) {
  if (value === null) return "Null";
  if (value === void 0) return "Undefined";
  return value.constructor && value.constructor.name || void 0;
}
var init_get_ctor_name = __esm({
  "src/utils/get-ctor-name.js"() {
    "use strict";
    __name(getCtorName, "getCtorName");
  }
});

// src/utils/is-pure-object.js
function isPureObject(value) {
  return Boolean(
    typeof value === "object" && value && !Array.isArray(value) && (!value.constructor || value.constructor && value.constructor.name === "Object")
  );
}
var init_is_pure_object = __esm({
  "src/utils/is-pure-object.js"() {
    "use strict";
    __name(isPureObject, "isPureObject");
  }
});

// src/utils/string-to-regexp.js
function stringToRegexp(pattern, flags = void 0) {
  if (pattern instanceof RegExp) {
    return new RegExp(pattern, flags);
  }
  let regex = "";
  for (let i = 0, n = pattern.length; i < n; i++) {
    const char = pattern.charAt(i);
    if (char === "%") {
      regex += ".*";
    } else {
      regex += char;
    }
  }
  return new RegExp(regex, flags);
}
var init_string_to_regexp = __esm({
  "src/utils/string-to-regexp.js"() {
    "use strict";
    __name(stringToRegexp, "stringToRegexp");
  }
});

// src/utils/get-value-by-path.js
function getValueByPath(obj, path, orElse = void 0) {
  if (!obj || typeof obj !== "object") return orElse;
  if (!path || typeof path !== "string") return orElse;
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (typeof value === "object" && value !== null && key in value) {
      value = value[key];
    } else {
      value = orElse;
      break;
    }
  }
  return value;
}
var init_get_value_by_path = __esm({
  "src/utils/get-value-by-path.js"() {
    "use strict";
    __name(getValueByPath, "getValueByPath");
  }
});

// src/utils/transform-promise.js
function transformPromise(valueOrPromise, transformer) {
  return isPromise(valueOrPromise) ? valueOrPromise.then(transformer) : transformer(valueOrPromise);
}
var init_transform_promise = __esm({
  "src/utils/transform-promise.js"() {
    "use strict";
    init_is_promise();
    __name(transformPromise, "transformPromise");
  }
});

// src/utils/select-object-keys.js
function selectObjectKeys(obj, keys) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj))
    throw new InvalidArgumentError2(
      "The first argument of selectObjectKeys should be an Object, but %v given.",
      obj
    );
  if (!Array.isArray(keys))
    throw new InvalidArgumentError2(
      "The second argument of selectObjectKeys should be an Array of String, but %v given.",
      keys
    );
  keys.forEach((key) => {
    if (typeof key !== "string")
      throw new InvalidArgumentError2(
        "The second argument of selectObjectKeys should be an Array of String, but %v given.",
        key
      );
  });
  const result = {};
  const allKeys = Object.keys(obj);
  allKeys.forEach((key) => {
    if (keys.includes(key)) result[key] = obj[key];
  });
  return result;
}
var init_select_object_keys = __esm({
  "src/utils/select-object-keys.js"() {
    "use strict";
    init_errors2();
    __name(selectObjectKeys, "selectObjectKeys");
  }
});

// src/utils/exclude-object-keys.js
function excludeObjectKeys(obj, keys) {
  if (typeof obj !== "object" || !obj || Array.isArray(obj))
    throw new InvalidArgumentError2(
      "Cannot exclude keys from a non-Object value, %v given.",
      obj
    );
  const result = { ...obj };
  keys = Array.isArray(keys) ? keys : [keys];
  keys.forEach((key) => delete result[key]);
  return result;
}
var init_exclude_object_keys = __esm({
  "src/utils/exclude-object-keys.js"() {
    "use strict";
    init_errors2();
    __name(excludeObjectKeys, "excludeObjectKeys");
  }
});

// src/utils/get-decorator-target-type.js
function getDecoratorTargetType(target, propertyKey, descriptorOrIndex) {
  const isCtor2 = typeof target === "function";
  const isParameter = typeof descriptorOrIndex === "number";
  const isProperty = propertyKey != null && descriptorOrIndex == null;
  const isMethod = propertyKey != null && descriptorOrIndex != null;
  const D = DecoratorTargetType;
  if (isCtor2) {
    if (isParameter)
      return propertyKey ? D.STATIC_METHOD_PARAMETER : D.CONSTRUCTOR_PARAMETER;
    if (isProperty) return D.STATIC_PROPERTY;
    if (isMethod) return D.STATIC_METHOD;
    return D.CONSTRUCTOR;
  } else {
    if (isParameter) return D.INSTANCE_METHOD_PARAMETER;
    if (isProperty) return D.INSTANCE_PROPERTY;
    if (isMethod) return D.INSTANCE_METHOD;
    return D.INSTANCE;
  }
}
var DecoratorTargetType;
var init_get_decorator_target_type = __esm({
  "src/utils/get-decorator-target-type.js"() {
    "use strict";
    DecoratorTargetType = {
      CONSTRUCTOR: "constructor",
      INSTANCE: "instance",
      STATIC_METHOD: "staticMethod",
      INSTANCE_METHOD: "instanceMethod",
      STATIC_PROPERTY: "staticProperty",
      INSTANCE_PROPERTY: "instanceProperty",
      CONSTRUCTOR_PARAMETER: "constructorParameter",
      STATIC_METHOD_PARAMETER: "staticMethodParameter",
      INSTANCE_METHOD_PARAMETER: "instanceMethodParameter"
    };
    __name(getDecoratorTargetType, "getDecoratorTargetType");
  }
});

// src/utils/index.js
var init_utils2 = __esm({
  "src/utils/index.js"() {
    "use strict";
    init_is_ctor();
    init_is_promise();
    init_capitalize();
    init_clone_deep();
    init_singularize();
    init_is_deep_equal();
    init_get_ctor_name();
    init_is_pure_object();
    init_string_to_regexp();
    init_get_value_by_path();
    init_transform_promise();
    init_select_object_keys();
    init_exclude_object_keys();
    init_get_decorator_target_type();
  }
});

// src/filter/order-clause-tool.js
function compareFn(a, b) {
  let undefinedA, undefinedB;
  for (let i = 0, l = this.length; i < l; i++) {
    const aVal = getValueByPath(a, this[i].key);
    const bVal = getValueByPath(b, this[i].key);
    undefinedB = bVal === void 0 && aVal !== void 0;
    undefinedA = aVal === void 0 && bVal !== void 0;
    if (undefinedB || aVal > bVal) {
      return this[i].reverse;
    } else if (undefinedA || aVal < bVal) {
      return -1 * this[i].reverse;
    }
  }
  return 0;
}
var _OrderClauseTool, OrderClauseTool;
var init_order_clause_tool = __esm({
  "src/filter/order-clause-tool.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_errors2();
    _OrderClauseTool = class _OrderClauseTool extends Service {
      /**
       * Sort.
       *
       * @param {object[]} entities
       * @param {string|string[]|undefined} clause
       */
      sort(entities, clause) {
        if (clause == null) return;
        if (Array.isArray(clause) === false) clause = [clause];
        if (!clause.length) return;
        const mapping = [];
        clause.forEach((key, index) => {
          if (!key || typeof key !== "string")
            throw new InvalidArgumentError2(
              'The provided option "order" should be a non-empty String or an Array of non-empty String, but %v given.',
              key
            );
          let reverse = 1;
          const matches = key.match(/\s+(A|DE)SC$/i);
          if (matches) {
            key = key.replace(/\s+(A|DE)SC/i, "");
            if (matches[1].toLowerCase() === "de") reverse = -1;
          }
          mapping[index] = { key, reverse };
        });
        entities.sort(compareFn.bind(mapping));
      }
      /**
       * Validate order clause.
       *
       * @param {string|string[]|undefined} clause
       */
      static validateOrderClause(clause) {
        if (clause == null) return;
        if (Array.isArray(clause) === false) clause = [clause];
        if (!clause.length) return;
        clause.forEach((field) => {
          if (!field || typeof field !== "string")
            throw new InvalidArgumentError2(
              'The provided option "order" should be a non-empty String or an Array of non-empty String, but %v given.',
              field
            );
        });
      }
      /**
       * Normalize order clause.
       *
       * @param {string|string[]|undefined} clause
       * @returns {string[]|undefined}
       */
      static normalizeOrderClause(clause) {
        if (clause == null) return;
        if (Array.isArray(clause) === false) clause = [clause];
        if (!clause.length) return;
        clause.forEach((field) => {
          if (!field || typeof field !== "string")
            throw new InvalidArgumentError2(
              'The provided option "order" should be a non-empty String or an Array of non-empty String, but %v given.',
              field
            );
        });
        return clause;
      }
    };
    __name(_OrderClauseTool, "OrderClauseTool");
    OrderClauseTool = _OrderClauseTool;
    __name(compareFn, "compareFn");
  }
});

// src/filter/operator-clause-tool.js
var _OperatorClauseTool, OperatorClauseTool;
var init_operator_clause_tool = __esm({
  "src/filter/operator-clause-tool.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_errors2();
    init_errors2();
    _OperatorClauseTool = class _OperatorClauseTool extends Service {
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
        if (typeof val1 === "number") {
          if (typeof val2 === "number" || typeof val2 === "string" || typeof val2 === "boolean") {
            if (val1 === val2) return 0;
            return val1 - Number(val2);
          }
          return NaN;
        }
        if (typeof val1 === "string") {
          const isDigits = /^\d+$/.test(val1);
          if (isDigits) return this.compare(Number(val1), val2);
          try {
            if (val1 > val2) return 1;
            if (val1 < val2) return -1;
            if (val1 == val2) return 0;
          } catch (e) {
          }
          return NaN;
        }
        if (typeof val1 === "boolean") {
          return Number(val1) - Number(val2);
        }
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
        if (!clause || typeof clause !== "object" || Array.isArray(clause))
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testAll should be an Object, but %v given.",
            clause
          );
        const eqNeqTest = this.testEqNeq(clause, value);
        if (eqNeqTest !== void 0) return eqNeqTest;
        const gtLtTest = this.testGtLt(clause, value);
        if (gtLtTest !== void 0) return gtLtTest;
        const incTest = this.testInq(clause, value);
        if (incTest !== void 0) return incTest;
        const ninTest = this.testNin(clause, value);
        if (ninTest !== void 0) return ninTest;
        const betweenTest = this.testBetween(clause, value);
        if (betweenTest !== void 0) return betweenTest;
        const existsTest = this.testExists(clause, value);
        if (existsTest !== void 0) return existsTest;
        const likeTest = this.testLike(clause, value);
        if (likeTest !== void 0) return likeTest;
        const nlikeTest = this.testNlike(clause, value);
        if (nlikeTest !== void 0) return nlikeTest;
        const ilikeTest = this.testIlike(clause, value);
        if (ilikeTest !== void 0) return ilikeTest;
        const nilikeTest = this.testNilike(clause, value);
        if (nilikeTest !== void 0) return nilikeTest;
        const regExpTest = this.testRegexp(clause, value);
        if (regExpTest !== void 0) return regExpTest;
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testEqNeq should be an Object, but %v given.",
            clause
          );
        if ("eq" in clause) return this.compare(clause.eq, value) === 0;
        if ("neq" in clause) return this.compare(clause.neq, value) !== 0;
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testGtLt should be an Object, but %v given.",
            clause
          );
        if ("gt" in clause) return this.compare(value, clause.gt) > 0;
        if ("gte" in clause) return this.compare(value, clause.gte) >= 0;
        if ("lt" in clause) return this.compare(value, clause.lt) < 0;
        if ("lte" in clause) return this.compare(value, clause.lte) <= 0;
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testInq should be an Object, but %v given.",
            clause
          );
        if ("inq" in clause && clause.inq !== void 0) {
          if (!clause.inq || !Array.isArray(clause.inq)) {
            throw new InvalidOperatorValueError(
              "inq",
              "an Array of possible values",
              clause.inq
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testNin should be an Object, but %v given.",
            clause
          );
        if ("nin" in clause && clause.nin !== void 0) {
          if (!clause.nin || !Array.isArray(clause.nin)) {
            throw new InvalidOperatorValueError(
              "nin",
              "an Array of possible values",
              clause.nin
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testBetween should be an Object, but %v given.",
            clause
          );
        if ("between" in clause && clause.between !== void 0) {
          if (!Array.isArray(clause.between) || clause.between.length !== 2) {
            throw new InvalidOperatorValueError(
              "between",
              "an Array of 2 elements",
              clause.between
            );
          }
          return this.testGtLt({ gte: clause.between[0] }, value) && this.testGtLt({ lte: clause.between[1] }, value);
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testExists should be an Object, but %v given.",
            clause
          );
        if ("exists" in clause && clause.exists !== void 0) {
          if (typeof clause.exists !== "boolean") {
            throw new InvalidOperatorValueError(
              "exists",
              "a Boolean",
              clause.exists
            );
          }
          return clause.exists ? value !== void 0 : value === void 0;
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testLike should be an Object, but %v given.",
            clause
          );
        if ("like" in clause && clause.like !== void 0) {
          if (typeof clause.like !== "string" && !(clause.like instanceof RegExp))
            throw new InvalidOperatorValueError("like", "a String", clause.like);
          return stringToRegexp(clause.like).test(value);
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testNlike should be an Object, but %v given.",
            clause
          );
        if ("nlike" in clause && clause.nlike !== void 0) {
          if (typeof clause.nlike !== "string" && !(clause.nlike instanceof RegExp)) {
            throw new InvalidOperatorValueError("nlike", "a String", clause.nlike);
          }
          return !stringToRegexp(clause.nlike).test(value);
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testIlike should be an Object, but %v given.",
            clause
          );
        if ("ilike" in clause && clause.ilike !== void 0) {
          if (typeof clause.ilike !== "string" && !(clause.ilike instanceof RegExp)) {
            throw new InvalidOperatorValueError("ilike", "a String", clause.ilike);
          }
          return stringToRegexp(clause.ilike, "i").test(value);
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testNilike should be an Object, but %v given.",
            clause
          );
        if ("nilike" in clause && clause.nilike !== void 0) {
          if (typeof clause.nilike !== "string" && !(clause.nilike instanceof RegExp)) {
            throw new InvalidOperatorValueError(
              "nilike",
              "a String",
              clause.nilike
            );
          }
          return !stringToRegexp(clause.nilike, "i").test(value);
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
        if (!clause || typeof clause !== "object")
          throw new InvalidArgumentError2(
            "The first argument of OperatorUtils.testRegexp should be an Object, but %v given.",
            clause
          );
        if ("regexp" in clause && clause.regexp !== void 0) {
          if (typeof clause.regexp !== "string" && !(clause.regexp instanceof RegExp)) {
            throw new InvalidOperatorValueError(
              "regexp",
              "a String",
              clause.regexp
            );
          }
          const flags = clause.flags || void 0;
          if (flags && typeof flags !== "string")
            throw new InvalidArgumentError2(
              "RegExp flags should be a String, but %v given.",
              clause.flags
            );
          if (!value || typeof value !== "string") return false;
          const regExp = stringToRegexp(clause.regexp, flags);
          return !!value.match(regExp);
        }
      }
    };
    __name(_OperatorClauseTool, "OperatorClauseTool");
    OperatorClauseTool = _OperatorClauseTool;
  }
});

// src/filter/where-clause-tool.js
var _WhereClauseTool, WhereClauseTool;
var init_where_clause_tool = __esm({
  "src/filter/where-clause-tool.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_errors2();
    init_operator_clause_tool();
    _WhereClauseTool = class _WhereClauseTool extends Service {
      /**
       * Filter by where clause.
       *
       * @example
       * ```
       * const entities = [
       *   {foo: 1, bar: 'a'},
       *   {foo: 2, bar: 'b'},
       *   {foo: 3, bar: 'b'},
       *   {foo: 4, bar: 'b'},
       * ];
       *
       * const result = filterByWhereClause(entities, {
       *   foo: {gt: 2},
       *   bar: 'b',
       * });
       *
       * console.log(result);
       * // [
       * //   {foo: 3, bar: 'b'},
       * //   {foo: 4, bar: 'b'},
       * // ];
       *
       * ```
       *
       * @param {object[]} entities
       * @param {WhereClause|undefined} where
       * @returns {object[]}
       */
      filter(entities, where = void 0) {
        if (!Array.isArray(entities))
          throw new InvalidArgumentError2(
            "The first argument of WhereClauseTool.filter should be an Array of Object, but %v given.",
            entities
          );
        if (where == null) return entities;
        return entities.filter(this._createFilter(where));
      }
      /**
       * Create where filter.
       *
       * @param {WhereClause} whereClause
       * @returns {Function}
       */
      _createFilter(whereClause) {
        if (typeof whereClause !== "object" || Array.isArray(whereClause))
          throw new InvalidArgumentError2(
            'The provided option "where" should be an Object, but %v given.',
            whereClause
          );
        const keys = Object.keys(whereClause);
        return (data) => {
          if (typeof data !== "object")
            throw new InvalidArgumentError2(
              "The first argument of WhereClauseTool.filter should be an Array of Object, but %v given.",
              data
            );
          return keys.every((key) => {
            if (key === "and" && key in whereClause) {
              const andClause = whereClause[key];
              if (Array.isArray(andClause))
                return andClause.every((clause) => this._createFilter(clause)(data));
            } else if (key === "or" && key in whereClause) {
              const orClause = whereClause[key];
              if (Array.isArray(orClause))
                return orClause.some((clause) => this._createFilter(clause)(data));
            }
            const value = getValueByPath(data, key);
            const matcher = whereClause[key];
            if (Array.isArray(value)) {
              if (typeof matcher === "object" && matcher !== null && "neq" in matcher && matcher.neq !== void 0) {
                if (value.length === 0) return true;
                return value.every((el, index) => {
                  const where = {};
                  where[index] = matcher;
                  return this._createFilter(where)({ ...value });
                });
              }
              return value.some((el, index) => {
                const where = {};
                where[index] = matcher;
                return this._createFilter(where)({ ...value });
              });
            }
            if (this._test(matcher, value)) return true;
          });
        };
      }
      /**
       * Value testing.
       *
       * @param {*} example
       * @param {*} value
       * @returns {boolean}
       */
      _test(example, value) {
        if (example === null) {
          return value === null;
        }
        if (example === void 0) {
          return value === void 0;
        }
        if (example instanceof RegExp) {
          if (typeof value === "string") return !!value.match(example);
          return false;
        }
        if (typeof example === "object") {
          const operatorsTest = this.getService(OperatorClauseTool).testAll(
            example,
            value
          );
          if (operatorsTest !== void 0) return operatorsTest;
        }
        return example == value;
      }
      /**
       * Validate where clause.
       *
       * @param {WhereClause|undefined} clause
       */
      static validateWhereClause(clause) {
        if (clause == null || typeof clause === "function") return;
        if (typeof clause !== "object" || Array.isArray(clause))
          throw new InvalidArgumentError2(
            'The provided option "where" should be an Object, but %v given.',
            clause
          );
      }
    };
    __name(_WhereClauseTool, "WhereClauseTool");
    WhereClauseTool = _WhereClauseTool;
  }
});

// src/definition/model/relations/relation-type.js
var RelationType;
var init_relation_type = __esm({
  "src/definition/model/relations/relation-type.js"() {
    "use strict";
    RelationType = {
      BELONGS_TO: "belongsTo",
      HAS_ONE: "hasOne",
      HAS_MANY: "hasMany",
      REFERENCES_MANY: "referencesMany"
    };
  }
});

// src/definition/model/relations/relation-definition.js
var init_relation_definition = __esm({
  "src/definition/model/relations/relation-definition.js"() {
    "use strict";
  }
});

// src/definition/model/relations/relations-definition-validator.js
var _RelationsDefinitionValidator, RelationsDefinitionValidator;
var init_relations_definition_validator = __esm({
  "src/definition/model/relations/relations-definition-validator.js"() {
    "use strict";
    init_src2();
    init_relation_type();
    init_relation_type();
    init_errors2();
    _RelationsDefinitionValidator = class _RelationsDefinitionValidator extends Service {
      /**
       * Validate.
       *
       * @param {string} modelName
       * @param {object} relDefs
       */
      validate(modelName, relDefs) {
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            "The first argument of RelationsDefinitionValidator.validate should be a non-empty String, but %v given.",
            modelName
          );
        if (!relDefs || typeof relDefs !== "object" || Array.isArray(relDefs))
          throw new InvalidArgumentError2(
            'The provided option "relations" of the model %v should be an Object, but %v given.',
            modelName,
            relDefs
          );
        const relNames = Object.keys(relDefs);
        relNames.forEach((relName) => {
          const relDef = relDefs[relName];
          this._validateRelation(modelName, relName, relDef);
        });
      }
      /**
       * Validate relation.
       *
       * @param {string} modelName
       * @param {string} relName
       * @param {object} relDef
       */
      _validateRelation(modelName, relName, relDef) {
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            "The first argument of RelationsDefinitionValidator._validateRelation should be a non-empty String, but %v given.",
            modelName
          );
        if (!relName || typeof relName !== "string")
          throw new InvalidArgumentError2(
            "The relation name of the model %v should be a non-empty String, but %v given.",
            modelName,
            relName
          );
        if (!relDef || typeof relDef !== "object" || Array.isArray(relDef))
          throw new InvalidArgumentError2(
            "The relation %v of the model %v should be an Object, but %v given.",
            relName,
            modelName,
            relDef
          );
        if (!relDef.type || !Object.values(RelationType).includes(relDef.type))
          throw new InvalidArgumentError2(
            'The relation %v of the model %v requires the option "type" to have one of relation types: %l, but %v given.',
            relName,
            modelName,
            Object.values(RelationType),
            relDef.type
          );
        this._validateBelongsTo(modelName, relName, relDef);
        this._validateHasOne(modelName, relName, relDef);
        this._validateHasMany(modelName, relName, relDef);
        this._validateReferencesMany(modelName, relName, relDef);
      }
      /**
       * Validate "belongsTo".
       *
       * @example The regular "belongsTo" relation.
       * ```
       * {
       *   type: RelationType.BELONGS_TO,
       *   model: 'model',
       *   foreignKey: 'modelId', // optional
       * }
       * ```
       *
       * @example The polymorphic "belongsTo" relation.
       * ```
       * {
       *   type: RelationType.BELONGS_TO,
       *   polymorphic: true,
       *   foreignKey: 'referenceId',      // optional
       *   discriminator: 'referenceType', // optional
       * }
       * ```
       *
       * @param {string} modelName
       * @param {string} relName
       * @param {object} relDef
       * @private
       */
      _validateBelongsTo(modelName, relName, relDef) {
        if (relDef.type !== RelationType.BELONGS_TO) return;
        if (relDef.polymorphic) {
          if (typeof relDef.polymorphic !== "boolean")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "belongsTo", so it expects the option "polymorphic" to be a Boolean, but %v given.',
              relName,
              modelName,
              relDef.polymorphic
            );
          if (relDef.foreignKey && typeof relDef.foreignKey !== "string")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v is a polymorphic "belongsTo" relation, so it expects the provided option "foreignKey" to be a String, but %v given.',
              relName,
              modelName,
              relDef.foreignKey
            );
          if (relDef.discriminator && typeof relDef.discriminator !== "string")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v is a polymorphic "belongsTo" relation, so it expects the provided option "discriminator" to be a String, but %v given.',
              relName,
              modelName,
              relDef.discriminator
            );
        } else {
          if (!relDef.model || typeof relDef.model !== "string")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "belongsTo", so it requires the option "model" to be a non-empty String, but %v given.',
              relName,
              modelName,
              relDef.model
            );
          if (relDef.foreignKey && typeof relDef.foreignKey !== "string")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "belongsTo", so it expects the provided option "foreignKey" to be a String, but %v given.',
              relName,
              modelName,
              relDef.foreignKey
            );
          if (relDef.discriminator)
            throw new InvalidArgumentError2(
              'The relation %v of the model %v is a non-polymorphic "belongsTo" relation, so it should not have the option "discriminator" to be provided.',
              relName,
              modelName
            );
        }
      }
      /**
       * Validate "hasOne".
       *
       * @example The regular "hasOne" relation.
       * ```
       * {
       *   type: RelationType.HAS_ONE,
       *   model: 'model',
       *   foreignKey: 'modelId',
       * }
       * ```
       *
       * @example The polymorphic "hasOne" relation with a target relation name.
       * ```
       * {
       *   type: RelationType.HAS_ONE,
       *   model: 'model',
       *   polymorphic: 'reference',
       * }
       * ```
       *
       * @example The polymorphic "hasOne" relation with target relation keys.
       * ```
       * {
       *   type: RelationType.HAS_ONE,
       *   model: 'model',
       *   polymorphic: true,
       *   foreignKey: 'referenceId',
       *   discriminator: 'referenceType',
       * }
       * ```
       *
       * @param {string} modelName
       * @param {string} relName
       * @param {object} relDef
       * @private
       */
      _validateHasOne(modelName, relName, relDef) {
        if (relDef.type !== RelationType.HAS_ONE) return;
        if (!relDef.model || typeof relDef.model !== "string")
          throw new InvalidArgumentError2(
            'The relation %v of the model %v has the type "hasOne", so it requires the option "model" to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.model
          );
        if (relDef.polymorphic) {
          if (typeof relDef.polymorphic === "string") {
            if (relDef.foreignKey)
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with a String value, so it should not have the option "foreignKey" to be provided.',
                relName,
                modelName
              );
            if (relDef.discriminator)
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with a String value, so it should not have the option "discriminator" to be provided.',
                relName,
                modelName
              );
          } else if (typeof relDef.polymorphic === "boolean") {
            if (!relDef.foreignKey || typeof relDef.foreignKey !== "string")
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with "true" value, so it requires the option "foreignKey" to be a non-empty String, but %v given.',
                relName,
                modelName,
                relDef.foreignKey
              );
            if (!relDef.discriminator || typeof relDef.discriminator !== "string")
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with "true" value, so it requires the option "discriminator" to be a non-empty String, but %v given.',
                relName,
                modelName,
                relDef.discriminator
              );
          } else {
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "hasOne", so it expects the provided option "polymorphic" to be a String or a Boolean, but %v given.',
              relName,
              modelName,
              relDef.polymorphic
            );
          }
        } else {
          if (!relDef.foreignKey || typeof relDef.foreignKey !== "string")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "hasOne", so it requires the option "foreignKey" to be a non-empty String, but %v given.',
              relName,
              modelName,
              relDef.foreignKey
            );
          if (relDef.discriminator)
            throw new InvalidArgumentError2(
              'The relation %v of the model %v is a non-polymorphic "hasOne" relation, so it should not have the option "discriminator" to be provided.',
              relName,
              modelName
            );
        }
      }
      /**
       * Validate "hasMany".
       *
       * @example The regular "hasMany" relation.
       * ```
       * {
       *   type: RelationType.HAS_MANY,
       *   model: 'model',
       *   foreignKey: 'modelId',
       * }
       * ```
       *
       * @example The polymorphic "hasMany" relation with a target relation name.
       * ```
       * {
       *   type: RelationType.HAS_MANY,
       *   model: 'model',
       *   polymorphic: 'reference',
       * }
       * ```
       *
       * @example The polymorphic "hasMany" relation with target relation keys.
       * ```
       * {
       *   type: RelationType.HAS_MANY,
       *   model: 'model',
       *   polymorphic: true,
       *   foreignKey: 'referenceId',
       *   discriminator: 'referenceType',
       * }
       * ```
       *
       * @param {string} modelName
       * @param {string} relName
       * @param {object} relDef
       * @private
       */
      _validateHasMany(modelName, relName, relDef) {
        if (relDef.type !== RelationType.HAS_MANY) return;
        if (!relDef.model || typeof relDef.model !== "string")
          throw new InvalidArgumentError2(
            'The relation %v of the model %v has the type "hasMany", so it requires the option "model" to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.model
          );
        if (relDef.polymorphic) {
          if (typeof relDef.polymorphic === "string") {
            if (relDef.foreignKey)
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with a String value, so it should not have the option "foreignKey" to be provided.',
                relName,
                modelName
              );
            if (relDef.discriminator)
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with a String value, so it should not have the option "discriminator" to be provided.',
                relName,
                modelName
              );
          } else if (typeof relDef.polymorphic === "boolean") {
            if (!relDef.foreignKey || typeof relDef.foreignKey !== "string")
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with "true" value, so it requires the option "foreignKey" to be a non-empty String, but %v given.',
                relName,
                modelName,
                relDef.foreignKey
              );
            if (!relDef.discriminator || typeof relDef.discriminator !== "string")
              throw new InvalidArgumentError2(
                'The relation %v of the model %v has the option "polymorphic" with "true" value, so it requires the option "discriminator" to be a non-empty String, but %v given.',
                relName,
                modelName,
                relDef.discriminator
              );
          } else {
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "hasMany", so it expects the provided option "polymorphic" to be a String or a Boolean, but %v given.',
              relName,
              modelName,
              relDef.polymorphic
            );
          }
        } else {
          if (!relDef.foreignKey || typeof relDef.foreignKey !== "string")
            throw new InvalidArgumentError2(
              'The relation %v of the model %v has the type "hasMany", so it requires the option "foreignKey" to be a non-empty String, but %v given.',
              relName,
              modelName,
              relDef.foreignKey
            );
          if (relDef.discriminator)
            throw new InvalidArgumentError2(
              'The relation %v of the model %v is a non-polymorphic "hasMany" relation, so it should not have the option "discriminator" to be provided.',
              relName,
              modelName
            );
        }
      }
      /**
       * Validate "referencesMany".
       *
       * @example
       * ```
       * {
       *   type: RelationType.REFERENCES_MANY,
       *   model: 'model',
       *   foreignKey: 'modelIds', // optional
       * }
       * ```
       *
       * @param {string} modelName
       * @param {string} relName
       * @param {object} relDef
       * @private
       */
      _validateReferencesMany(modelName, relName, relDef) {
        if (relDef.type !== RelationType.REFERENCES_MANY) return;
        if (!relDef.model || typeof relDef.model !== "string")
          throw new InvalidArgumentError2(
            'The relation %v of the model %v has the type "referencesMany", so it requires the option "model" to be a non-empty String, but %v given.',
            relName,
            modelName,
            relDef.model
          );
        if (relDef.foreignKey && typeof relDef.foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The relation %v of the model %v has the type "referencesMany", so it expects the provided option "foreignKey" to be a String, but %v given.',
            relName,
            modelName,
            relDef.foreignKey
          );
        if (relDef.discriminator)
          throw new InvalidArgumentError2(
            'The relation %v of the model %v has the type "referencesMany", so it should not have the option "discriminator" to be provided.',
            relName,
            modelName
          );
      }
    };
    __name(_RelationsDefinitionValidator, "RelationsDefinitionValidator");
    RelationsDefinitionValidator = _RelationsDefinitionValidator;
  }
});

// src/definition/model/relations/index.js
var init_relations = __esm({
  "src/definition/model/relations/index.js"() {
    "use strict";
    init_relation_type();
    init_relation_definition();
    init_relations_definition_validator();
  }
});

// src/definition/model/properties/data-type.js
var DataType;
var init_data_type = __esm({
  "src/definition/model/properties/data-type.js"() {
    "use strict";
    DataType = {
      ANY: "any",
      STRING: "string",
      NUMBER: "number",
      BOOLEAN: "boolean",
      ARRAY: "array",
      OBJECT: "object"
    };
  }
});

// src/definition/model/properties/property-definition.js
var init_property_definition = __esm({
  "src/definition/model/properties/property-definition.js"() {
    "use strict";
  }
});

// src/definition/model/properties/property-uniqueness.js
var PropertyUniqueness;
var init_property_uniqueness = __esm({
  "src/definition/model/properties/property-uniqueness.js"() {
    "use strict";
    PropertyUniqueness = {
      STRICT: "strict",
      SPARSE: "sparse",
      NON_UNIQUE: "nonUnique"
    };
  }
});

// src/definition/model/properties/empty-values-definer.js
var _EmptyValuesDefiner, EmptyValuesDefiner;
var init_empty_values_definer = __esm({
  "src/definition/model/properties/empty-values-definer.js"() {
    "use strict";
    init_data_type();
    init_src2();
    init_utils2();
    init_errors2();
    _EmptyValuesDefiner = class _EmptyValuesDefiner extends Service {
      /**
       * Empty values map.
       *
       * @type {Map<string, *[]>}
       */
      _emptyValuesMap = /* @__PURE__ */ new Map([
        [DataType.ANY, [void 0, null]],
        [DataType.STRING, [void 0, null, ""]],
        [DataType.NUMBER, [void 0, null, 0]],
        [DataType.BOOLEAN, [void 0, null]],
        [DataType.ARRAY, [void 0, null, []]],
        [DataType.OBJECT, [void 0, null, {}]]
      ]);
      /**
       * Set empty values of data type.
       *
       * @param {string} dataType
       * @param {*[]} emptyValues
       * @returns {EmptyValuesDefiner}
       */
      setEmptyValuesOf(dataType, emptyValues) {
        if (!Object.values(DataType).includes(dataType))
          throw new InvalidArgumentError2(
            'The argument "dataType" of the EmptyValuesDefiner.setEmptyValuesOf must be one of data types: %l, but %v given.',
            Object.values(DataType),
            dataType
          );
        if (!Array.isArray(emptyValues))
          throw new InvalidArgumentError2(
            'The argument "emptyValues" of the EmptyValuesDefiner.setEmptyValuesOf must be an Array, but %v given.',
            emptyValues
          );
        this._emptyValuesMap.set(dataType, emptyValues);
        return this;
      }
      /**
       * Is empty.
       *
       * @param {string} dataType
       * @param {*} value
       * @returns {boolean}
       */
      isEmpty(dataType, value) {
        if (!Object.values(DataType).includes(dataType))
          throw new InvalidArgumentError2(
            'The argument "dataType" of the EmptyValuesDefiner.isEmpty must be one of data types: %l, but %v given.',
            Object.values(DataType),
            dataType
          );
        return this._emptyValuesMap.get(dataType).some((v) => isDeepEqual(v, value));
      }
    };
    __name(_EmptyValuesDefiner, "EmptyValuesDefiner");
    EmptyValuesDefiner = _EmptyValuesDefiner;
  }
});

// src/definition/model/properties/property-validator/property-validator.js
var init_property_validator = __esm({
  "src/definition/model/properties/property-validator/property-validator.js"() {
    "use strict";
  }
});

// src/definition/model/properties/property-validator/builtin/regexp-validator.js
function regexpValidator(value, options, context) {
  if (value == null || options === false) return true;
  if (typeof options !== "string" && !(options instanceof RegExp))
    throw new InvalidArgumentError2(
      'The validator %v requires the "options" argument as a String or RegExp, but %v given.',
      context.validatorName,
      options
    );
  if (typeof value === "string") {
    const regexp = stringToRegexp(options);
    return regexp.test(value);
  }
  throw new InvalidArgumentError2(
    "The property validator %v requires a String value, but %v given.",
    context.validatorName,
    value
  );
}
var init_regexp_validator = __esm({
  "src/definition/model/properties/property-validator/builtin/regexp-validator.js"() {
    "use strict";
    init_utils2();
    init_errors2();
    __name(regexpValidator, "regexpValidator");
  }
});

// src/definition/model/properties/property-validator/builtin/max-length-validator.js
function maxLengthValidator(value, options, context) {
  if (value == null || options === false) return true;
  if (typeof options !== "number")
    throw new InvalidArgumentError2(
      'The validator %v requires the "options" argument as a Number, but %v given.',
      context.validatorName,
      options
    );
  if (typeof value === "string" || Array.isArray(value))
    return value.length <= options;
  throw new InvalidArgumentError2(
    "The property validator %v requires a String or an Array value, but %v given.",
    context.validatorName,
    value
  );
}
var init_max_length_validator = __esm({
  "src/definition/model/properties/property-validator/builtin/max-length-validator.js"() {
    "use strict";
    init_errors2();
    __name(maxLengthValidator, "maxLengthValidator");
  }
});

// src/definition/model/properties/property-validator/builtin/min-length-validator.js
function minLengthValidator(value, options, context) {
  if (value == null || options === false) return true;
  if (typeof options !== "number")
    throw new InvalidArgumentError2(
      'The validator %v requires the "options" argument as a Number, but %v given.',
      context.validatorName,
      options
    );
  if (typeof value === "string" || Array.isArray(value))
    return value.length >= options;
  throw new InvalidArgumentError2(
    "The property validator %v requires a String or an Array value, but %v given.",
    context.validatorName,
    value
  );
}
var init_min_length_validator = __esm({
  "src/definition/model/properties/property-validator/builtin/min-length-validator.js"() {
    "use strict";
    init_errors2();
    __name(minLengthValidator, "minLengthValidator");
  }
});

// src/definition/model/properties/property-validator/builtin/index.js
var init_builtin = __esm({
  "src/definition/model/properties/property-validator/builtin/index.js"() {
    "use strict";
    init_regexp_validator();
    init_max_length_validator();
    init_min_length_validator();
  }
});

// src/definition/model/properties/property-validator/property-validator-registry.js
var _PropertyValidatorRegistry, PropertyValidatorRegistry;
var init_property_validator_registry = __esm({
  "src/definition/model/properties/property-validator/property-validator-registry.js"() {
    "use strict";
    init_src2();
    init_builtin();
    init_builtin();
    init_builtin();
    init_errors2();
    _PropertyValidatorRegistry = class _PropertyValidatorRegistry extends Service {
      /**
       * Validators.
       *
       * @type {object}
       */
      _validators = {
        maxLength: maxLengthValidator,
        minLength: minLengthValidator,
        regexp: regexpValidator
      };
      /**
       * Add validator.
       *
       * @param {string} name
       * @param {Function} validator
       * @returns {PropertyValidatorRegistry}
       */
      addValidator(name, validator) {
        if (!name || typeof name !== "string")
          throw new InvalidArgumentError2(
            "A name of the property validator must be a non-empty String, but %v given.",
            name
          );
        if (name in this._validators)
          throw new InvalidArgumentError2(
            "The property validator %v is already defined.",
            name
          );
        if (typeof validator !== "function")
          throw new InvalidArgumentError2(
            "The property validator %v must be a Function, but %v given.",
            name,
            validator
          );
        this._validators[name] = validator;
        return this;
      }
      /**
       * Has validator.
       *
       * @param {string} name
       * @returns {boolean}
       */
      hasValidator(name) {
        return Boolean(this._validators[name]);
      }
      /**
       * Get validator.
       *
       * @param {string} name
       * @returns {Function}
       */
      getValidator(name) {
        const validator = this._validators[name];
        if (!validator)
          throw new InvalidArgumentError2(
            "The property validator %v is not defined.",
            name
          );
        return validator;
      }
    };
    __name(_PropertyValidatorRegistry, "PropertyValidatorRegistry");
    PropertyValidatorRegistry = _PropertyValidatorRegistry;
  }
});

// src/definition/model/properties/property-validator/index.js
var init_property_validator2 = __esm({
  "src/definition/model/properties/property-validator/index.js"() {
    "use strict";
    init_property_validator();
    init_property_validator_registry();
  }
});

// src/definition/model/properties/property-transformer/property-transformer.js
var init_property_transformer = __esm({
  "src/definition/model/properties/property-transformer/property-transformer.js"() {
    "use strict";
  }
});

// src/definition/model/properties/property-transformer/builtin/trim-transformer.js
function trimTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === "string") return value.trim();
  throw new InvalidArgumentError2(
    "The property transformer %v requires a String value, but %v given.",
    context.transformerName,
    value
  );
}
var init_trim_transformer = __esm({
  "src/definition/model/properties/property-transformer/builtin/trim-transformer.js"() {
    "use strict";
    init_errors2();
    __name(trimTransformer, "trimTransformer");
  }
});

// src/definition/model/properties/property-transformer/builtin/to-lower-case-transformer.js
function toLowerCaseTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === "string") return value.toLowerCase();
  throw new InvalidArgumentError2(
    "The property transformer %v requires a String value, but %v given.",
    context.transformerName,
    value
  );
}
var init_to_lower_case_transformer = __esm({
  "src/definition/model/properties/property-transformer/builtin/to-lower-case-transformer.js"() {
    "use strict";
    init_errors2();
    __name(toLowerCaseTransformer, "toLowerCaseTransformer");
  }
});

// src/definition/model/properties/property-transformer/builtin/to-upper-case-transformer.js
function toUpperCaseTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === "string") return value.toUpperCase();
  throw new InvalidArgumentError2(
    "The property transformer %v requires a String value, but %v given.",
    context.transformerName,
    value
  );
}
var init_to_upper_case_transformer = __esm({
  "src/definition/model/properties/property-transformer/builtin/to-upper-case-transformer.js"() {
    "use strict";
    init_errors2();
    __name(toUpperCaseTransformer, "toUpperCaseTransformer");
  }
});

// src/definition/model/properties/property-transformer/builtin/to-title-case-transformer.js
function toTitleCaseTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === "string")
    return value.replace(new RegExp("\\p{L}\\S*", "gu"), (text) => {
      return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    });
  throw new InvalidArgumentError2(
    "The property transformer %v requires a String value, but %v given.",
    context.transformerName,
    value
  );
}
var init_to_title_case_transformer = __esm({
  "src/definition/model/properties/property-transformer/builtin/to-title-case-transformer.js"() {
    "use strict";
    init_errors2();
    __name(toTitleCaseTransformer, "toTitleCaseTransformer");
  }
});

// src/definition/model/properties/property-transformer/builtin/index.js
var init_builtin2 = __esm({
  "src/definition/model/properties/property-transformer/builtin/index.js"() {
    "use strict";
    init_trim_transformer();
    init_to_lower_case_transformer();
    init_to_upper_case_transformer();
    init_to_title_case_transformer();
  }
});

// src/definition/model/properties/property-transformer/property-transformer-registry.js
var _PropertyTransformerRegistry, PropertyTransformerRegistry;
var init_property_transformer_registry = __esm({
  "src/definition/model/properties/property-transformer/property-transformer-registry.js"() {
    "use strict";
    init_src2();
    init_builtin2();
    init_builtin2();
    init_builtin2();
    init_builtin2();
    init_errors2();
    _PropertyTransformerRegistry = class _PropertyTransformerRegistry extends Service {
      /**
       * Transformers.
       *
       * @type {object}
       */
      _transformers = {
        trim: trimTransformer,
        toUpperCase: toUpperCaseTransformer,
        toLowerCase: toLowerCaseTransformer,
        toTitleCase: toTitleCaseTransformer
      };
      /**
       * Add transformer.
       *
       * @param {string} name
       * @param {Function} transformer
       * @returns {PropertyTransformerRegistry}
       */
      addTransformer(name, transformer) {
        if (!name || typeof name !== "string")
          throw new InvalidArgumentError2(
            "A name of the property transformer must be a non-empty String, but %v given.",
            name
          );
        if (name in this._transformers)
          throw new InvalidArgumentError2(
            "The property transformer %v is already defined.",
            name
          );
        if (typeof transformer !== "function")
          throw new InvalidArgumentError2(
            "The property transformer %v must be a Function, but %v given.",
            name,
            transformer
          );
        this._transformers[name] = transformer;
        return this;
      }
      /**
       * Has transformer.
       *
       * @param {string} name
       * @returns {boolean}
       */
      hasTransformer(name) {
        return Boolean(this._transformers[name]);
      }
      /**
       * Get transformer.
       *
       * @param {string} name
       * @returns {Function}
       */
      getTransformer(name) {
        const transformer = this._transformers[name];
        if (!transformer)
          throw new InvalidArgumentError2(
            "The property transformer %v is not defined.",
            name
          );
        return transformer;
      }
    };
    __name(_PropertyTransformerRegistry, "PropertyTransformerRegistry");
    PropertyTransformerRegistry = _PropertyTransformerRegistry;
  }
});

// src/definition/model/properties/property-transformer/index.js
var init_property_transformer2 = __esm({
  "src/definition/model/properties/property-transformer/index.js"() {
    "use strict";
    init_property_transformer();
    init_property_transformer_registry();
  }
});

// src/definition/definition-registry.js
var _DefinitionRegistry, DefinitionRegistry;
var init_definition_registry = __esm({
  "src/definition/definition-registry.js"() {
    "use strict";
    init_src2();
    init_errors2();
    init_model();
    init_definition();
    _DefinitionRegistry = class _DefinitionRegistry extends Service {
      /**
       * Datasources.
       *
       * @type {object}
       */
      _datasources = {};
      /**
       * Models.
       *
       * @type {object}
       */
      _models = {};
      /**
       * Add datasource.
       *
       * @param {object} datasourceDef
       */
      addDatasource(datasourceDef) {
        this.getService(DatasourceDefinitionValidator).validate(datasourceDef);
        const name = datasourceDef.name;
        if (name in this._datasources)
          throw new InvalidArgumentError2(
            "The datasource %v is already defined.",
            name
          );
        this._datasources[name] = datasourceDef;
      }
      /**
       * Has datasource.
       *
       * @param {string} name
       * @returns {boolean}
       */
      hasDatasource(name) {
        return Boolean(this._datasources[name]);
      }
      /**
       * Get datasource.
       *
       * @param {string} name
       * @returns {object}
       */
      getDatasource(name) {
        const datasourceDef = this._datasources[name];
        if (!datasourceDef)
          throw new InvalidArgumentError2("The datasource %v is not defined.", name);
        return datasourceDef;
      }
      /**
       * Add model.
       *
       * @param {object} modelDef
       */
      addModel(modelDef) {
        this.getService(ModelDefinitionValidator).validate(modelDef);
        const name = modelDef.name;
        if (name in this._models)
          throw new InvalidArgumentError2("The model %v is already defined.", name);
        this._models[name] = modelDef;
      }
      /**
       * Has model.
       *
       * @param {string} name
       * @returns {boolean}
       */
      hasModel(name) {
        return Boolean(this._models[name]);
      }
      /**
       * Get model.
       *
       * @param {string} name
       * @returns {object}
       */
      getModel(name) {
        const modelDef = this._models[name];
        if (!modelDef)
          throw new InvalidArgumentError2("The model %v is not defined.", name);
        return modelDef;
      }
    };
    __name(_DefinitionRegistry, "DefinitionRegistry");
    DefinitionRegistry = _DefinitionRegistry;
  }
});

// src/definition/model/model-definition-utils.js
var DEFAULT_PRIMARY_KEY_PROPERTY_NAME, _ModelDefinitionUtils, ModelDefinitionUtils;
var init_model_definition_utils = __esm({
  "src/definition/model/model-definition-utils.js"() {
    "use strict";
    init_src2();
    init_properties();
    init_utils2();
    init_utils2();
    init_properties();
    init_errors2();
    init_definition_registry();
    DEFAULT_PRIMARY_KEY_PROPERTY_NAME = "id";
    _ModelDefinitionUtils = class _ModelDefinitionUtils extends Service {
      /**
       * Get primary key as property name.
       *
       * @param {string} modelName
       * @returns {string}
       */
      getPrimaryKeyAsPropertyName(modelName) {
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propNames = Object.keys(propDefs).filter((propName) => {
          const propDef = propDefs[propName];
          return propDef && typeof propDef === "object" && propDef.primaryKey;
        });
        if (propNames.length < 1) {
          const isDefaultPrimaryKeyAlreadyInUse = Object.keys(propDefs).includes(
            DEFAULT_PRIMARY_KEY_PROPERTY_NAME
          );
          if (isDefaultPrimaryKeyAlreadyInUse)
            throw new InvalidArgumentError2(
              'The property name %v of the model %v is defined as a regular property. In this case, a primary key should be defined explicitly. Do use the option "primaryKey" to specify the primary key.',
              DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
              modelName
            );
          return DEFAULT_PRIMARY_KEY_PROPERTY_NAME;
        }
        return propNames[0];
      }
      /**
       * Get primary key as column name.
       *
       * @param {string} modelName
       * @returns {string}
       */
      getPrimaryKeyAsColumnName(modelName) {
        const pkPropName = this.getPrimaryKeyAsPropertyName(modelName);
        let pkColName;
        try {
          pkColName = this.getColumnNameByPropertyName(modelName, pkPropName);
        } catch (error) {
          if (!(error instanceof InvalidArgumentError2)) throw error;
        }
        if (pkColName === void 0) return pkPropName;
        return pkColName;
      }
      /**
       * Get table name by model name.
       *
       * @param {string} modelName
       * @returns {string}
       */
      getTableNameByModelName(modelName) {
        var _a;
        const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
        return (_a = modelDef.tableName) != null ? _a : modelName;
      }
      /**
       * Get column name by property name.
       *
       * @param {string} modelName
       * @param {string} propertyName
       * @returns {string}
       */
      getColumnNameByPropertyName(modelName, propertyName) {
        var _a;
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propDef = propDefs[propertyName];
        if (!propDef)
          throw new InvalidArgumentError2(
            "The model %v does not have the property %v.",
            modelName,
            propertyName
          );
        if (propDef && typeof propDef === "object")
          return (_a = propDef.columnName) != null ? _a : propertyName;
        return propertyName;
      }
      /**
       * Get default property value.
       *
       * @param {string} modelName
       * @param {string} propertyName
       * @returns {*}
       */
      getDefaultPropertyValue(modelName, propertyName) {
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propDef = propDefs[propertyName];
        if (!propDef)
          throw new InvalidArgumentError2(
            "The model %v does not have the property %v.",
            modelName,
            propertyName
          );
        if (propDef && typeof propDef === "object")
          return propDef.default instanceof Function ? propDef.default() : propDef.default;
      }
      /**
       * Set default values for empty properties.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {boolean|undefined} onlyProvidedProperties
       * @returns {object}
       */
      setDefaultValuesToEmptyProperties(modelName, modelData, onlyProvidedProperties = false) {
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propNames = onlyProvidedProperties ? Object.keys(modelData) : Object.keys(propDefs);
        const extendedData = cloneDeep(modelData);
        const emptyValueDefiner = this.getService(EmptyValuesDefiner);
        propNames.forEach((propName) => {
          const propDef = propDefs[propName];
          const propValue = extendedData[propName];
          const propType = propDef != null ? this.getDataTypeFromPropertyDefinition(propDef) : DataType.ANY;
          const isEmpty = emptyValueDefiner.isEmpty(propType, propValue);
          if (!isEmpty) return;
          if (propDef && typeof propDef === "object" && propDef.default !== void 0) {
            extendedData[propName] = this.getDefaultPropertyValue(
              modelName,
              propName
            );
          }
        });
        return extendedData;
      }
      /**
       * Convert property names to column names.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @returns {object}
       */
      convertPropertyNamesToColumnNames(modelName, modelData) {
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propNames = Object.keys(propDefs);
        const convertedData = cloneDeep(modelData);
        propNames.forEach((propName) => {
          if (!(propName in convertedData)) return;
          const colName = this.getColumnNameByPropertyName(modelName, propName);
          if (propName === colName) return;
          const propValue = convertedData[propName];
          delete convertedData[propName];
          convertedData[colName] = propValue;
        });
        return convertedData;
      }
      /**
       * Convert column names to property names.
       *
       * @param {string} modelName
       * @param {object} tableData
       * @returns {object}
       */
      convertColumnNamesToPropertyNames(modelName, tableData) {
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propNames = Object.keys(propDefs);
        const convertedData = cloneDeep(tableData);
        propNames.forEach((propName) => {
          const colName = this.getColumnNameByPropertyName(modelName, propName);
          if (!(colName in convertedData) || colName === propName) return;
          const colValue = convertedData[colName];
          delete convertedData[colName];
          convertedData[propName] = colValue;
        });
        return convertedData;
      }
      /**
       * Get data type by property name.
       *
       * @param {string} modelName
       * @param {string} propertyName
       * @returns {string}
       */
      getDataTypeByPropertyName(modelName, propertyName) {
        const propDefs = this.getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propDef = propDefs[propertyName];
        if (!propDef) {
          const pkPropName = this.getPrimaryKeyAsPropertyName(modelName);
          if (pkPropName === propertyName) return DataType.ANY;
          throw new InvalidArgumentError2(
            "The model %v does not have the property %v.",
            modelName,
            propertyName
          );
        }
        if (typeof propDef === "string") return propDef;
        return propDef.type;
      }
      /**
       * Get data type from property definition.
       *
       * @param {object} propDef
       * @returns {string}
       */
      getDataTypeFromPropertyDefinition(propDef) {
        if ((!propDef || typeof propDef !== "object") && !Object.values(DataType).includes(propDef)) {
          throw new InvalidArgumentError2(
            'The argument "propDef" of the ModelDefinitionUtils.getDataTypeFromPropertyDefinition should be an Object or the DataType enum, but %v given.',
            propDef
          );
        }
        if (typeof propDef === "string") return propDef;
        const dataType = propDef.type;
        if (!Object.values(DataType).includes(dataType))
          throw new InvalidArgumentError2(
            'The given Object to the ModelDefinitionUtils.getDataTypeFromPropertyDefinition should have the "type" property with one of values: %l, but %v given.',
            Object.values(DataType),
            propDef.type
          );
        return dataType;
      }
      /**
       * Get own properties definition of primary keys.
       *
       * @param {string} modelName
       * @returns {object}
       */
      getOwnPropertiesDefinitionOfPrimaryKeys(modelName) {
        var _a;
        const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
        const propDefs = (_a = modelDef.properties) != null ? _a : {};
        const pkPropNames = Object.keys(propDefs).filter((propName) => {
          const propDef = propDefs[propName];
          return typeof propDef === "object" && propDef.primaryKey;
        });
        return pkPropNames.reduce((a, k) => ({ ...a, [k]: propDefs[k] }), {});
      }
      /**
       * Get own properties definition without primary keys.
       *
       * @param {string} modelName
       * @returns {object}
       */
      getOwnPropertiesDefinitionWithoutPrimaryKeys(modelName) {
        var _a;
        const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
        const propDefs = (_a = modelDef.properties) != null ? _a : {};
        return Object.keys(propDefs).reduce((result, propName) => {
          const propDef = propDefs[propName];
          if (typeof propDef === "object" && propDef.primaryKey) return result;
          return { ...result, [propName]: propDef };
        }, {});
      }
      /**
       * Get properties definition in base model hierarchy.
       *
       * @param {string} modelName
       * @returns {object}
       */
      getPropertiesDefinitionInBaseModelHierarchy(modelName) {
        let result = {};
        let pkPropDefs = {};
        const recursion = /* @__PURE__ */ __name((currModelName, prevModelName = void 0) => {
          if (currModelName === prevModelName)
            throw new InvalidArgumentError2(
              "The model %v has a circular inheritance.",
              currModelName
            );
          if (Object.keys(pkPropDefs).length === 0) {
            pkPropDefs = this.getOwnPropertiesDefinitionOfPrimaryKeys(currModelName);
            result = { ...result, ...pkPropDefs };
          }
          const regularPropDefs = this.getOwnPropertiesDefinitionWithoutPrimaryKeys(currModelName);
          result = { ...regularPropDefs, ...result };
          const modelDef = this.getService(DefinitionRegistry).getModel(currModelName);
          if (modelDef.base) recursion(modelDef.base, currModelName);
        }, "recursion");
        recursion(modelName);
        return result;
      }
      /**
       * Get own relations definition.
       *
       * @param {string} modelName
       * @returns {object}
       */
      getOwnRelationsDefinition(modelName) {
        var _a;
        const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
        return (_a = modelDef.relations) != null ? _a : {};
      }
      /**
       * Get relations definition in base model hierarchy.
       *
       * @param {string} modelName
       * @returns {object}
       */
      getRelationsDefinitionInBaseModelHierarchy(modelName) {
        let result = {};
        const recursion = /* @__PURE__ */ __name((currModelName, prevModelName = void 0) => {
          var _a;
          if (currModelName === prevModelName)
            throw new InvalidArgumentError2(
              "The model %v has a circular inheritance.",
              currModelName
            );
          const modelDef = this.getService(DefinitionRegistry).getModel(currModelName);
          const ownRelDefs = (_a = modelDef.relations) != null ? _a : {};
          result = { ...ownRelDefs, ...result };
          if (modelDef.base) recursion(modelDef.base, currModelName);
        }, "recursion");
        recursion(modelName);
        return result;
      }
      /**
       * Get relation definition by name.
       *
       * @param {string} modelName
       * @param {string} relationName
       * @returns {object}
       */
      getRelationDefinitionByName(modelName, relationName) {
        const relDefs = this.getRelationsDefinitionInBaseModelHierarchy(modelName);
        const relNames = Object.keys(relDefs);
        let foundDef;
        for (const relName of relNames) {
          if (relName === relationName) {
            foundDef = relDefs[relName];
            break;
          }
        }
        if (!foundDef)
          throw new InvalidArgumentError2(
            "The model %v does not have relation name %v.",
            modelName,
            relationName
          );
        return foundDef;
      }
      /**
       * Exclude object keys by relation names.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @returns {object}
       */
      excludeObjectKeysByRelationNames(modelName, modelData) {
        if (!modelData || typeof modelData !== "object" || Array.isArray(modelData))
          throw new InvalidArgumentError2(
            "The second argument of ModelDefinitionUtils.excludeObjectKeysByRelationNames should be an Object, but %v given.",
            modelData
          );
        const relDefs = this.getRelationsDefinitionInBaseModelHierarchy(modelName);
        const relNames = Object.keys(relDefs);
        return excludeObjectKeys(modelData, relNames);
      }
    };
    __name(_ModelDefinitionUtils, "ModelDefinitionUtils");
    ModelDefinitionUtils = _ModelDefinitionUtils;
  }
});

// src/definition/model/properties/property-uniqueness-validator.js
var _PropertyUniquenessValidator, PropertyUniquenessValidator;
var init_property_uniqueness_validator = __esm({
  "src/definition/model/properties/property-uniqueness-validator.js"() {
    "use strict";
    init_data_type();
    init_src2();
    init_utils2();
    init_property_uniqueness();
    init_empty_values_definer();
    init_errors2();
    init_model_definition_utils();
    _PropertyUniquenessValidator = class _PropertyUniquenessValidator extends Service {
      /**
       * Validate.
       *
       * @param {Function} countMethod
       * @param {string} methodName
       * @param {string} modelName
       * @param {object} modelData
       * @param {*} modelId
       * @returns {Promise<undefined>}
       */
      async validate(countMethod, methodName, modelName, modelData, modelId = void 0) {
        if (typeof countMethod !== "function")
          throw new InvalidArgumentError2(
            'The parameter "countMethod" of the PropertyUniquenessValidator must be a Function, but %v given.',
            countMethod
          );
        if (!methodName || typeof methodName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "methodName" of the PropertyUniquenessValidator must be a non-empty String, but %v given.',
            methodName
          );
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "modelName" of the PropertyUniquenessValidator must be a non-empty String, but %v given.',
            modelName
          );
        if (!isPureObject(modelData))
          throw new InvalidArgumentError2(
            "The data of the model %v should be an Object, but %v given.",
            modelName,
            modelData
          );
        const propDefs = this.getService(
          ModelDefinitionUtils
        ).getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const isPartial = methodName === "patch" || methodName === "patchById";
        const propNames = Object.keys(isPartial ? modelData : propDefs);
        const idProp = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        const createError = /* @__PURE__ */ __name((propName, propValue) => new InvalidArgumentError2(
          "An existing document of the model %v already has the property %v with the value %v and should be unique.",
          modelName,
          propName,
          propValue
        ), "createError");
        let willBeReplaced = void 0;
        const emptyValuesDefiner = this.getService(EmptyValuesDefiner);
        for (const propName of propNames) {
          const propDef = propDefs[propName];
          if (!propDef || typeof propDef === "string" || !propDef.unique || propDef.unique === PropertyUniqueness.NON_UNIQUE) {
            continue;
          }
          const propValue = modelData[propName];
          if (propDef.unique === PropertyUniqueness.SPARSE) {
            const propType = propDef.type || DataType.ANY;
            const isEmpty = emptyValuesDefiner.isEmpty(propType, propValue);
            if (isEmpty) continue;
          }
          if (methodName === "create") {
            const count = await countMethod({ [propName]: propValue });
            if (count > 0) throw createError(propName, propValue);
          } else if (methodName === "replaceById") {
            const count = await countMethod({
              [idProp]: { neq: modelId },
              [propName]: propValue
            });
            if (count > 0) throw createError(propName, propValue);
          } else if (methodName === "replaceOrCreate") {
            const idFromData = modelData[idProp];
            if (willBeReplaced == null && idFromData != null) {
              const count = await countMethod({ [idProp]: idFromData });
              willBeReplaced = count > 0;
            }
            if (willBeReplaced) {
              const count = await countMethod({
                [idProp]: { neq: idFromData },
                [propName]: propValue
              });
              if (count > 0) throw createError(propName, propValue);
            } else {
              const count = await countMethod({ [propName]: propValue });
              if (count > 0) throw createError(propName, propValue);
            }
          } else if (methodName === "patch") {
            const count = await countMethod({ [propName]: propValue });
            if (count > 0) throw createError(propName, propValue);
          } else if (methodName === "patchById") {
            const count = await countMethod({
              [idProp]: { neq: modelId },
              [propName]: propValue
            });
            if (count > 0) throw createError(propName, propValue);
          } else {
            throw new InvalidArgumentError2(
              "The PropertyUniquenessValidator does not support the adapter method %v.",
              methodName
            );
          }
        }
      }
    };
    __name(_PropertyUniquenessValidator, "PropertyUniquenessValidator");
    PropertyUniquenessValidator = _PropertyUniquenessValidator;
  }
});

// src/definition/model/properties/primary-keys-definition-validator.js
var _PrimaryKeysDefinitionValidator, PrimaryKeysDefinitionValidator;
var init_primary_keys_definition_validator = __esm({
  "src/definition/model/properties/primary-keys-definition-validator.js"() {
    "use strict";
    init_src2();
    init_errors2();
    init_model_definition_utils();
    _PrimaryKeysDefinitionValidator = class _PrimaryKeysDefinitionValidator extends Service {
      /**
       * Validate.
       *
       * @param {string} modelName
       * @param {object} propDefs
       */
      validate(modelName, propDefs) {
        const propNames = Object.keys(propDefs).filter((propName) => {
          const propDef = propDefs[propName];
          return propDef && typeof propDef === "object" && propDef.primaryKey;
        });
        if (propNames.length < 1) {
          const isDefaultPrimaryKeyAlreadyInUse = Object.keys(propDefs).includes(DEFAULT_PRIMARY_KEY_PROPERTY_NAME);
          if (isDefaultPrimaryKeyAlreadyInUse)
            throw new InvalidArgumentError2(
              'The property name %v of the model %v is defined as a regular property. In this case, a primary key should be defined explicitly. Do use the option "primaryKey" to specify the primary key.',
              DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
              modelName
            );
          return;
        }
        if (propNames.length > 1)
          throw new InvalidArgumentError2(
            "The model definition %v should not have multiple primary keys, but %v keys given.",
            modelName,
            propNames.length
          );
        const pkPropName = propNames[0];
        const pkPropDef = propDefs[pkPropName];
        if (pkPropDef && typeof pkPropDef === "object" && pkPropDef.default !== void 0) {
          throw new InvalidArgumentError2(
            "Do not specify a default value for the primary key %v of the model %v.",
            pkPropName,
            modelName
          );
        }
      }
    };
    __name(_PrimaryKeysDefinitionValidator, "PrimaryKeysDefinitionValidator");
    PrimaryKeysDefinitionValidator = _PrimaryKeysDefinitionValidator;
  }
});

// src/definition/model/properties/properties-definition-validator.js
var _PropertiesDefinitionValidator, PropertiesDefinitionValidator;
var init_properties_definition_validator = __esm({
  "src/definition/model/properties/properties-definition-validator.js"() {
    "use strict";
    init_src2();
    init_data_type();
    init_utils2();
    init_property_uniqueness();
    init_errors2();
    init_property_validator2();
    init_property_transformer2();
    init_primary_keys_definition_validator();
    _PropertiesDefinitionValidator = class _PropertiesDefinitionValidator extends Service {
      /**
       * Validate.
       *
       * @param {string} modelName
       * @param {object} propDefs
       */
      validate(modelName, propDefs) {
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            "The first argument of PropertiesDefinitionValidator.validate should be a non-empty String, but %v given.",
            modelName
          );
        if (!propDefs || typeof propDefs !== "object" || Array.isArray(propDefs)) {
          throw new InvalidArgumentError2(
            'The provided option "properties" of the model %v should be an Object, but %v given.',
            modelName,
            propDefs
          );
        }
        const propNames = Object.keys(propDefs);
        propNames.forEach((propName) => {
          const propDef = propDefs[propName];
          this._validateProperty(modelName, propName, propDef);
        });
        this.getService(PrimaryKeysDefinitionValidator).validate(
          modelName,
          propDefs
        );
      }
      /**
       * Validate property.
       *
       * @param {string} modelName
       * @param {string} propName
       * @param {object} propDef
       */
      _validateProperty(modelName, propName, propDef) {
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            "The first argument of PropertiesDefinitionValidator._validateProperty should be a non-empty String, but %v given.",
            modelName
          );
        if (!propName || typeof propName !== "string")
          throw new InvalidArgumentError2(
            "The property name of the model %v should be a non-empty String, but %v given.",
            modelName,
            propName
          );
        if (!propDef)
          throw new InvalidArgumentError2(
            "The property %v of the model %v should have a property definition, but %v given.",
            propName,
            modelName,
            propDef
          );
        if (typeof propDef === "string") {
          if (!Object.values(DataType).includes(propDef))
            throw new InvalidArgumentError2(
              "In case of a short property definition, the property %v of the model %v should have one of data types: %l, but %v given.",
              propName,
              modelName,
              Object.values(DataType),
              propDef
            );
          return;
        }
        if (!propDef || typeof propDef !== "object" || Array.isArray(propDef)) {
          throw new InvalidArgumentError2(
            "In case of a full property definition, the property %v of the model %v should be an Object, but %v given.",
            propName,
            modelName,
            propDef
          );
        }
        if (!propDef.type || !Object.values(DataType).includes(propDef.type))
          throw new InvalidArgumentError2(
            'The property %v of the model %v requires the option "type" to have one of data types: %l, but %v given.',
            propName,
            modelName,
            Object.values(DataType),
            propDef.type
          );
        if (propDef.itemType && !Object.values(DataType).includes(propDef.itemType)) {
          throw new InvalidArgumentError2(
            'The provided option "itemType" of the property %v in the model %v should have one of data types: %l, but %v given.',
            propName,
            modelName,
            Object.values(DataType),
            propDef.itemType
          );
        }
        if (propDef.model && typeof propDef.model !== "string")
          throw new InvalidArgumentError2(
            'The provided option "model" of the property %v in the model %v should be a String, but %v given.',
            propName,
            modelName,
            propDef.model
          );
        if (propDef.primaryKey && typeof propDef.primaryKey !== "boolean")
          throw new InvalidArgumentError2(
            'The provided option "primaryKey" of the property %v in the model %v should be a Boolean, but %v given.',
            propName,
            modelName,
            propDef.primaryKey
          );
        if (propDef.columnName && typeof propDef.columnName !== "string")
          throw new InvalidArgumentError2(
            'The provided option "columnName" of the property %v in the model %v should be a String, but %v given.',
            propName,
            modelName,
            propDef.columnName
          );
        if (propDef.columnType && typeof propDef.columnType !== "string")
          throw new InvalidArgumentError2(
            'The provided option "columnType" of the property %v in the model %v should be a String, but %v given.',
            propName,
            modelName,
            propDef.columnType
          );
        if (propDef.required && typeof propDef.required !== "boolean")
          throw new InvalidArgumentError2(
            'The provided option "required" of the property %v in the model %v should be a Boolean, but %v given.',
            propName,
            modelName,
            propDef.required
          );
        if (propDef.required && propDef.default !== void 0)
          throw new InvalidArgumentError2(
            'The property %v of the model %v is a required property, so it should not have the option "default" to be provided.',
            propName,
            modelName
          );
        if (propDef.primaryKey && propDef.required)
          throw new InvalidArgumentError2(
            'The property %v of the model %v is a primary key, so it should not have the option "required" to be provided.',
            propName,
            modelName
          );
        if (propDef.primaryKey && propDef.default !== void 0)
          throw new InvalidArgumentError2(
            'The property %v of the model %v is a primary key, so it should not have the option "default" to be provided.',
            propName,
            modelName
          );
        if (propDef.itemType && propDef.type !== DataType.ARRAY)
          throw new InvalidArgumentError2(
            'The property %v of the model %v has the non-array type, so it should not have the option "itemType" to be provided.',
            propName,
            modelName,
            propDef.type
          );
        if (propDef.model && propDef.type !== DataType.OBJECT && propDef.itemType !== DataType.OBJECT) {
          if (propDef.type !== DataType.ARRAY) {
            throw new InvalidArgumentError2(
              'The option "model" is not supported for %s property type, so the property %v of the model %v should not have the option "model" to be provided.',
              capitalize(propDef.type),
              propName,
              modelName
            );
          } else {
            throw new InvalidArgumentError2(
              'The option "model" is not supported for Array property type of %s, so the property %v of the model %v should not have the option "model" to be provided.',
              capitalize(propDef.itemType),
              propName,
              modelName
            );
          }
        }
        if (propDef.validate != null) {
          const propertyValidatorRegistry = this.getService(
            PropertyValidatorRegistry
          );
          if (propDef.validate && typeof propDef.validate === "string") {
            if (!propertyValidatorRegistry.hasValidator(propDef.validate))
              throw new InvalidArgumentError2(
                "The property validator %v is not found.",
                propDef.validate
              );
          } else if (Array.isArray(propDef.validate)) {
            for (const validatorName of propDef.validate) {
              if (typeof validatorName !== "string")
                throw new InvalidArgumentError2(
                  'The provided option "validate" of the property %v in the model %v has an Array value that should have a non-empty String, but %v given.',
                  propName,
                  modelName,
                  validatorName
                );
              if (!propertyValidatorRegistry.hasValidator(validatorName))
                throw new InvalidArgumentError2(
                  "The property validator %v is not found.",
                  validatorName
                );
            }
          } else if (typeof propDef.validate === "object") {
            for (const validatorName in propDef.validate) {
              if (!propertyValidatorRegistry.hasValidator(validatorName))
                throw new InvalidArgumentError2(
                  "The property validator %v is not found.",
                  validatorName
                );
            }
          } else {
            throw new InvalidArgumentError2(
              'The provided option "validate" of the property %v in the model %v should be a non-empty String, an Array of String or an Object, but %v given.',
              propName,
              modelName,
              propDef.validate
            );
          }
        }
        if (propDef.transform != null) {
          const propertyTransformerRegistry = this.getService(
            PropertyTransformerRegistry
          );
          if (propDef.transform && typeof propDef.transform === "string") {
            if (!propertyTransformerRegistry.hasTransformer(propDef.transform))
              throw new InvalidArgumentError2(
                "The property transformer %v is not found.",
                propDef.transform
              );
          } else if (Array.isArray(propDef.transform)) {
            for (const transformerName of propDef.transform) {
              if (typeof transformerName !== "string")
                throw new InvalidArgumentError2(
                  'The provided option "transform" of the property %v in the model %v has an Array value that should have a non-empty String, but %v given.',
                  propName,
                  modelName,
                  transformerName
                );
              if (!propertyTransformerRegistry.hasTransformer(transformerName))
                throw new InvalidArgumentError2(
                  "The property transformer %v is not found.",
                  transformerName
                );
            }
          } else if (typeof propDef.transform === "object") {
            for (const transformerName in propDef.transform) {
              if (!propertyTransformerRegistry.hasTransformer(transformerName))
                throw new InvalidArgumentError2(
                  "The property transformer %v is not found.",
                  transformerName
                );
            }
          } else {
            throw new InvalidArgumentError2(
              'The provided option "transform" of the property %v in the model %v should be a non-empty String, an Array of String or an Object, but %v given.',
              propName,
              modelName,
              propDef.transform
            );
          }
        }
        if (propDef.unique) {
          if (typeof propDef.unique !== "boolean" && !Object.values(PropertyUniqueness).includes(propDef.unique)) {
            throw new InvalidArgumentError2(
              'The provided option "unique" of the property %v in the model %v should be a Boolean or one of values: %l, but %v given.',
              propName,
              modelName,
              Object.values(PropertyUniqueness),
              propDef.unique
            );
          }
        }
        if (propDef.unique && propDef.primaryKey)
          throw new InvalidArgumentError2(
            'The property %v of the model %v is a primary key, so it should not have the option "unique" to be provided.',
            propName,
            modelName
          );
      }
    };
    __name(_PropertiesDefinitionValidator, "PropertiesDefinitionValidator");
    PropertiesDefinitionValidator = _PropertiesDefinitionValidator;
  }
});

// src/definition/model/properties/index.js
var init_properties = __esm({
  "src/definition/model/properties/index.js"() {
    "use strict";
    init_data_type();
    init_property_definition();
    init_property_uniqueness();
    init_empty_values_definer();
    init_property_validator2();
    init_property_transformer2();
    init_property_uniqueness_validator();
    init_properties_definition_validator();
    init_primary_keys_definition_validator();
  }
});

// src/definition/model/model-definition.js
var init_model_definition = __esm({
  "src/definition/model/model-definition.js"() {
    "use strict";
  }
});

// src/definition/model/model-data-validator.js
var _ModelDataValidator, ModelDataValidator;
var init_model_data_validator = __esm({
  "src/definition/model/model-data-validator.js"() {
    "use strict";
    init_src2();
    init_properties();
    init_utils2();
    init_utils2();
    init_properties();
    init_errors2();
    init_properties();
    init_model_definition_utils();
    _ModelDataValidator = class _ModelDataValidator extends Service {
      /**
       * Validate.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {boolean} isPartial
       * @returns {undefined}
       */
      validate(modelName, modelData, isPartial = false) {
        if (!isPureObject(modelData))
          throw new InvalidArgumentError2(
            "The data of the model %v should be an Object, but %v given.",
            modelName,
            modelData
          );
        const propDefs = this.getService(
          ModelDefinitionUtils
        ).getPropertiesDefinitionInBaseModelHierarchy(modelName);
        const propNames = Object.keys(isPartial ? modelData : propDefs);
        propNames.forEach((propName) => {
          const propDef = propDefs[propName];
          if (!propDef) return;
          this._validatePropertyValue(
            modelName,
            propName,
            propDef,
            modelData[propName]
          );
        });
      }
      /**
       * Validate property value.
       *
       * @param {string} modelName
       * @param {string} propName
       * @param {string|object} propDef
       * @param {*} propValue
       * @returns {undefined}
       */
      _validatePropertyValue(modelName, propName, propDef, propValue) {
        const propType = this.getService(ModelDefinitionUtils).getDataTypeFromPropertyDefinition(
          propDef
        );
        const isEmpty = this.getService(EmptyValuesDefiner).isEmpty(
          propType,
          propValue
        );
        if (isEmpty) {
          const isRequired = typeof propDef === "string" ? false : Boolean(propDef.required);
          if (!isRequired) return;
          throw new InvalidArgumentError2(
            "The property %v of the model %v is required, but %v given.",
            propName,
            modelName,
            propValue
          );
        }
        this._validateValueByPropertyValidators(
          modelName,
          propName,
          propDef,
          propValue
        );
        this._validateValueByPropertyType(modelName, propName, propDef, propValue);
      }
      /**
       * Validate value by property type.
       *
       * @param {string} modelName
       * @param {string} propName
       * @param {string|object} propDef
       * @param {*} propValue
       * @param {boolean} isArrayValue
       * @returns {undefined}
       */
      _validateValueByPropertyType(modelName, propName, propDef, propValue, isArrayValue = false) {
        var _a;
        let expectingType;
        if (isArrayValue) {
          if (typeof propDef === "object") {
            expectingType = (_a = propDef.itemType) != null ? _a : DataType.ANY;
          } else {
            expectingType = DataType.ANY;
          }
        } else {
          expectingType = typeof propDef !== "string" ? propDef.type : propDef;
        }
        const createError = /* @__PURE__ */ __name((expected) => {
          const pattern = isArrayValue ? "The array property %v of the model %v must have %s element, but %s given." : "The property %v of the model %v must have %s, but %s given.";
          const ctorName = getCtorName(propValue);
          const givenStr = ctorName != null ? ctorName : typeof propValue;
          return new InvalidArgumentError2(
            pattern,
            propName,
            modelName,
            expected,
            givenStr
          );
        }, "createError");
        switch (expectingType) {
          // STRING
          case DataType.STRING:
            if (typeof propValue !== "string") throw createError("a String");
            break;
          // NUMBER
          case DataType.NUMBER:
            if (typeof propValue !== "number") throw createError("a Number");
            break;
          // BOOLEAN
          case DataType.BOOLEAN:
            if (typeof propValue !== "boolean") throw createError("a Boolean");
            break;
          // ARRAY
          case DataType.ARRAY:
            if (!Array.isArray(propValue)) throw createError("an Array");
            propValue.forEach(
              (value) => this._validateValueByPropertyType(
                modelName,
                propName,
                propDef,
                value,
                true
              )
            );
            break;
          // OBJECT
          case DataType.OBJECT:
            if (!isPureObject(propValue)) throw createError("an Object");
            if (typeof propDef === "object" && propDef.model)
              this.validate(propDef.model, propValue);
            break;
        }
      }
      /**
       * Validate value by property validators.
       *
       * @param {string} modelName
       * @param {string} propName
       * @param {string|object} propDef
       * @param {*} propValue
       * @returns {undefined}
       */
      _validateValueByPropertyValidators(modelName, propName, propDef, propValue) {
        if (typeof propDef === "string" || propDef.validate == null) return;
        const validateDef = propDef.validate;
        const validatorRegistry = this.getService(PropertyValidatorRegistry);
        const createError = /* @__PURE__ */ __name((validatorName) => new InvalidArgumentError2(
          "The property %v of the model %v has an invalid value %v that caught by the validator %v.",
          propName,
          modelName,
          propValue,
          validatorName
        ), "createError");
        const validateBy = /* @__PURE__ */ __name((validatorName, validatorOptions = void 0) => {
          const validator = validatorRegistry.getValidator(validatorName);
          const context = { validatorName, modelName, propName };
          const valid = validator(propValue, validatorOptions, context);
          if (valid instanceof Promise) {
            throw new InvalidArgumentError2(
              "Asynchronous property validators are not supported, but the property validator %v returns a Promise.",
              validatorName
            );
          } else if (valid !== true) {
            throw createError(validatorName);
          }
        }, "validateBy");
        if (validateDef && typeof validateDef === "string") {
          validateBy(validateDef);
        } else if (Array.isArray(validateDef)) {
          validateDef.forEach((validatorName) => validateBy(validatorName));
        } else if (validateDef !== null && typeof validateDef === "object") {
          Object.keys(validateDef).forEach((validatorName) => {
            if (Object.prototype.hasOwnProperty.call(validateDef, validatorName)) {
              const validatorOptions = validateDef[validatorName];
              validateBy(validatorName, validatorOptions);
            }
          });
        } else {
          throw new InvalidArgumentError2(
            'The provided option "validate" of the property %v in the model %v should be a non-empty String, an Array of String or an Object, but %v given.',
            propName,
            modelName,
            validateDef
          );
        }
      }
    };
    __name(_ModelDataValidator, "ModelDataValidator");
    ModelDataValidator = _ModelDataValidator;
  }
});

// src/definition/model/model-data-sanitizer.js
var _ModelDataSanitizer, ModelDataSanitizer;
var init_model_data_sanitizer = __esm({
  "src/definition/model/model-data-sanitizer.js"() {
    "use strict";
    init_src2();
    init_errors2();
    init_model_definition_utils();
    _ModelDataSanitizer = class _ModelDataSanitizer extends Service {
      /**
       * Validate.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @returns {object}
       */
      sanitize(modelName, modelData) {
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            "The first argument of ModelDataSanitizer.sanitize should be a string, but %v given.",
            modelName
          );
        if (!modelData || typeof modelData !== "object")
          throw new InvalidArgumentError2(
            "The second argument of ModelDataSanitizer.sanitize should be an Object, but %v given.",
            modelData
          );
        return this.getService(
          ModelDefinitionUtils
        ).excludeObjectKeysByRelationNames(modelName, modelData);
      }
    };
    __name(_ModelDataSanitizer, "ModelDataSanitizer");
    ModelDataSanitizer = _ModelDataSanitizer;
  }
});

// src/definition/model/model-data-transformer.js
var _ModelDataTransformer, ModelDataTransformer;
var init_model_data_transformer = __esm({
  "src/definition/model/model-data-transformer.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_utils2();
    init_utils2();
    init_properties();
    init_errors2();
    init_model_definition_utils();
    init_properties();
    _ModelDataTransformer = class _ModelDataTransformer extends Service {
      /**
       * Transform.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {boolean} isPartial
       * @returns {object|Promise<object>}
       */
      transform(modelName, modelData, isPartial = false) {
        if (!isPureObject(modelData))
          throw new InvalidArgumentError2(
            "The data of the model %v should be an Object, but %v given.",
            modelName,
            modelData
          );
        const emptyValuesDefiner = this.getService(EmptyValuesDefiner);
        const modelDefinitionUtils = this.getService(ModelDefinitionUtils);
        const propDefs = modelDefinitionUtils.getPropertiesDefinitionInBaseModelHierarchy(
          modelName
        );
        const propNames = Object.keys(isPartial ? modelData : propDefs);
        const transformedData = cloneDeep(modelData);
        return propNames.reduce((transformedDataOrPromise, propName) => {
          const propDef = propDefs[propName];
          if (!propDef) return transformedDataOrPromise;
          const propType = modelDefinitionUtils.getDataTypeFromPropertyDefinition(propDef);
          const propValue = modelData[propName];
          const isEmpty = emptyValuesDefiner.isEmpty(propType, propValue);
          if (isEmpty) return transformedDataOrPromise;
          const newPropValueOrPromise = this._transformPropertyValue(
            modelName,
            propName,
            propDef,
            propValue
          );
          return transformPromise(newPropValueOrPromise, (newPropValue) => {
            return transformPromise(transformedDataOrPromise, (resolvedData) => {
              if (newPropValue !== propValue) resolvedData[propName] = newPropValue;
              return resolvedData;
            });
          });
        }, transformedData);
      }
      /**
       * Transform property value.
       *
       * @param {string} modelName
       * @param {string} propName
       * @param {string|object} propDef
       * @param {*} propValue
       * @returns {*}
       */
      _transformPropertyValue(modelName, propName, propDef, propValue) {
        if (typeof propDef === "string" || propDef.transform == null)
          return propValue;
        const transformDef = propDef.transform;
        const transformerRegistry = this.getService(PropertyTransformerRegistry);
        const transformFn = /* @__PURE__ */ __name((value, transformerName, transformerOptions = void 0) => {
          const transformer = transformerRegistry.getTransformer(transformerName);
          const context = { transformerName, modelName, propName };
          return transformer(value, transformerOptions, context);
        }, "transformFn");
        if (transformDef && typeof transformDef === "string") {
          return transformFn(propValue, transformDef);
        } else if (Array.isArray(transformDef)) {
          return transformDef.reduce((valueOrPromise, transformerName) => {
            return transformPromise(valueOrPromise, (value) => {
              return transformFn(value, transformerName);
            });
          }, propValue);
        } else if (transformDef !== null && typeof transformDef === "object") {
          return Object.keys(transformDef).reduce(
            (valueOrPromise, transformerName) => {
              const transformerOptions = transformDef[transformerName];
              return transformPromise(valueOrPromise, (value) => {
                return transformFn(value, transformerName, transformerOptions);
              });
            },
            propValue
          );
        } else {
          throw new InvalidArgumentError2(
            'The provided option "transform" of the property %v in the model %v should be a non-empty String, an Array of String or an Object, but %v given.',
            propName,
            modelName,
            transformDef
          );
        }
      }
    };
    __name(_ModelDataTransformer, "ModelDataTransformer");
    ModelDataTransformer = _ModelDataTransformer;
  }
});

// src/definition/model/model-definition-validator.js
var _ModelDefinitionValidator, ModelDefinitionValidator;
var init_model_definition_validator = __esm({
  "src/definition/model/model-definition-validator.js"() {
    "use strict";
    init_src2();
    init_errors2();
    init_relations();
    init_properties();
    _ModelDefinitionValidator = class _ModelDefinitionValidator extends Service {
      /**
       * Validate.
       *
       * @param {object} modelDef
       */
      validate(modelDef) {
        if (!modelDef || typeof modelDef !== "object" || Array.isArray(modelDef))
          throw new InvalidArgumentError2(
            "The model definition should be an Object, but %v given.",
            modelDef
          );
        if (!modelDef.name || typeof modelDef.name !== "string")
          throw new InvalidArgumentError2(
            'The model definition requires the option "name" as a non-empty String, but %v given.',
            modelDef.name
          );
        if (modelDef.datasource && typeof modelDef.datasource !== "string")
          throw new InvalidArgumentError2(
            'The provided option "datasource" of the model %v should be a String, but %v given.',
            modelDef.name,
            modelDef.datasource
          );
        if (modelDef.base && typeof modelDef.base !== "string")
          throw new InvalidArgumentError2(
            'The provided option "base" of the model %v should be a String, but %v given.',
            modelDef.name,
            modelDef.base
          );
        if (modelDef.tableName && typeof modelDef.tableName !== "string")
          throw new InvalidArgumentError2(
            'The provided option "tableName" of the model %v should be a String, but %v given.',
            modelDef.name,
            modelDef.tableName
          );
        if (modelDef.properties) {
          if (typeof modelDef.properties !== "object" || Array.isArray(modelDef.properties)) {
            throw new InvalidArgumentError2(
              'The provided option "properties" of the model %v should be an Object, but %v given.',
              modelDef.name,
              modelDef.properties
            );
          }
          this.getService(PropertiesDefinitionValidator).validate(
            modelDef.name,
            modelDef.properties
          );
        }
        if (modelDef.relations) {
          if (typeof modelDef.relations !== "object" || Array.isArray(modelDef.relations)) {
            throw new InvalidArgumentError2(
              'The provided option "relations" of the model %v should be an Object, but %v given.',
              modelDef.name,
              modelDef.relations
            );
          }
          this.getService(RelationsDefinitionValidator).validate(
            modelDef.name,
            modelDef.relations
          );
        }
      }
    };
    __name(_ModelDefinitionValidator, "ModelDefinitionValidator");
    ModelDefinitionValidator = _ModelDefinitionValidator;
  }
});

// src/definition/model/index.js
var init_model = __esm({
  "src/definition/model/index.js"() {
    "use strict";
    init_relations();
    init_properties();
    init_model_definition();
    init_model_data_validator();
    init_model_data_sanitizer();
    init_model_data_transformer();
    init_model_definition_utils();
    init_model_definition_validator();
  }
});

// src/definition/datasource/datasource-definition-validator.js
var _DatasourceDefinitionValidator, DatasourceDefinitionValidator;
var init_datasource_definition_validator = __esm({
  "src/definition/datasource/datasource-definition-validator.js"() {
    "use strict";
    init_src2();
    init_errors2();
    _DatasourceDefinitionValidator = class _DatasourceDefinitionValidator extends Service {
      /**
       * Validate.
       *
       * @param {object} datasourceDef
       */
      validate(datasourceDef) {
        if (!datasourceDef || typeof datasourceDef !== "object")
          throw new InvalidArgumentError2(
            "The datasource definition should be an Object, but %v given.",
            datasourceDef
          );
        if (!datasourceDef.name || typeof datasourceDef.name !== "string")
          throw new InvalidArgumentError2(
            'The datasource definition requires the option "name" as a non-empty String, but %v given.',
            datasourceDef.name
          );
        if (!datasourceDef.adapter || typeof datasourceDef.adapter !== "string")
          throw new InvalidArgumentError2(
            'The datasource %v requires the option "adapter" as a non-empty String, but %v given.',
            datasourceDef.name,
            datasourceDef.adapter
          );
      }
    };
    __name(_DatasourceDefinitionValidator, "DatasourceDefinitionValidator");
    DatasourceDefinitionValidator = _DatasourceDefinitionValidator;
  }
});

// src/definition/datasource/index.js
var init_datasource = __esm({
  "src/definition/datasource/index.js"() {
    "use strict";
    init_datasource_definition_validator();
  }
});

// src/definition/index.js
var init_definition = __esm({
  "src/definition/index.js"() {
    "use strict";
    init_model();
    init_datasource();
    init_definition_registry();
  }
});

// src/filter/fields-clause-tool.js
var _FieldsClauseTool, FieldsClauseTool;
var init_fields_clause_tool = __esm({
  "src/filter/fields-clause-tool.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_errors2();
    init_definition();
    _FieldsClauseTool = class _FieldsClauseTool extends Service {
      /**
       * Filter.
       *
       * @param {object|object[]} input
       * @param {string} modelName
       * @param {string|string[]|undefined} clause
       * @returns {object|object[]}
       */
      filter(input, modelName, clause) {
        const isArray = Array.isArray(input);
        let entities = isArray ? input : [input];
        entities.forEach((entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              "The first argument of FieldsClauseTool.filter should be an Object or an Array of Object, but %v given.",
              entity
            );
        });
        if (!modelName || typeof modelName !== "string")
          throw new InvalidArgumentError2(
            "The second argument of FieldsClauseTool.filter should be a non-empty String, but %v given.",
            modelName
          );
        if (clause == null) return input;
        const fields = Array.isArray(clause) ? clause.slice() : [clause];
        if (!fields.length) return input;
        fields.forEach((field) => {
          if (!field || typeof field !== "string")
            throw new InvalidArgumentError2(
              'The provided option "fields" should be a non-empty String or an Array of non-empty String, but %v given.',
              field
            );
        });
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        if (fields.indexOf(pkPropName) === -1) fields.push(pkPropName);
        entities = entities.map((entity) => selectObjectKeys(entity, fields));
        return isArray ? entities : entities[0];
      }
      /**
       * Validate fields clause.
       *
       * @param {string|string[]|undefined} clause
       */
      static validateFieldsClause(clause) {
        if (clause == null) return;
        const fields = Array.isArray(clause) ? clause : [clause];
        if (!fields.length) return;
        fields.forEach((field) => {
          if (!field || typeof field !== "string")
            throw new InvalidArgumentError2(
              'The provided option "fields" should be a non-empty String or an Array of non-empty String, but %v given.',
              field
            );
        });
      }
      /**
       * Normalize fields clause.
       *
       * @param {string|string[]|undefined} clause
       * @returns {string[]|undefined}
       */
      static normalizeFieldsClause(clause) {
        if (clause == null) return;
        const fields = Array.isArray(clause) ? clause : [clause];
        if (!fields.length) return;
        fields.forEach((field) => {
          if (!field || typeof field !== "string")
            throw new InvalidArgumentError2(
              'The provided option "fields" should be a non-empty String or an Array of non-empty String, but %v given.',
              field
            );
        });
        return fields;
      }
    };
    __name(_FieldsClauseTool, "FieldsClauseTool");
    FieldsClauseTool = _FieldsClauseTool;
  }
});

// src/relations/has-one-resolver.js
var _HasOneResolver, HasOneResolver;
var init_has_one_resolver = __esm({
  "src/relations/has-one-resolver.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_definition();
    init_errors2();
    init_repository2();
    init_definition();
    _HasOneResolver = class _HasOneResolver extends Service {
      /**
       * Include to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string} foreignKey
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includeTo(entities, sourceName, targetName, relationName, foreignKey, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of HasOneResolver.includeTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of HasOneResolver.includeTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of HasOneResolver.includeTo requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of HasOneResolver.includeTo requires a non-empty String, but %v given.',
            relationName
          );
        if (!foreignKey || typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The parameter "foreignKey" of HasOneResolver.includeTo requires a non-empty String, but %v given.',
            foreignKey
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of HasOneResolver.includeTo should be an Object, but %v given.',
            scope
          );
        const sourcePkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          sourceName
        );
        const sourceIds = [];
        entities.forEach((entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of HasOneResolver.includeTo requires an Array of Object, but %v given.',
              entity
            );
          const sourceId = entity[sourcePkPropName];
          if (sourceIds.includes(sourceId)) return;
          sourceIds.push(sourceId);
        });
        const promises = [];
        const targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
        scope = scope ? cloneDeep(scope) : {};
        const targetBySourceId = /* @__PURE__ */ new Map();
        sourceIds.forEach((sourceId) => {
          const filter = cloneDeep(scope);
          filter.where = {
            and: [{ [foreignKey]: sourceId }, ...scope.where ? [scope.where] : []]
          };
          filter.limit = 1;
          promises.push(
            targetRepository.find(filter).then((result) => {
              if (result.length) targetBySourceId.set(sourceId, result[0]);
            })
          );
        });
        await Promise.all(promises);
        Array.from(targetBySourceId.keys()).forEach((sourceId) => {
          const sources = entities.filter((v) => v[sourcePkPropName] === sourceId);
          sources.forEach((v) => v[relationName] = targetBySourceId.get(sourceId));
        });
      }
      /**
       * Include polymorphic to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string} foreignKey
       * @param {string} discriminator
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includePolymorphicTo(entities, sourceName, targetName, relationName, foreignKey, discriminator, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of HasOneResolver.includePolymorphicTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of HasOneResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of HasOneResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of HasOneResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            relationName
          );
        if (!foreignKey || typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The parameter "foreignKey" of HasOneResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            foreignKey
          );
        if (!discriminator || typeof discriminator !== "string")
          throw new InvalidArgumentError2(
            'The parameter "discriminator" of HasOneResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            discriminator
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of HasOneResolver.includePolymorphicTo should be an Object, but %v given.',
            scope
          );
        const sourcePkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          sourceName
        );
        const sourceIds = [];
        entities.forEach((entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of HasOneResolver.includePolymorphicTo requires an Array of Object, but %v given.',
              entity
            );
          const sourceId = entity[sourcePkPropName];
          if (sourceIds.includes(sourceId)) return;
          sourceIds.push(sourceId);
        });
        const promises = [];
        const targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
        scope = scope ? cloneDeep(scope) : {};
        const targetBySourceId = /* @__PURE__ */ new Map();
        sourceIds.forEach((sourceId) => {
          const filter = cloneDeep(scope);
          filter.where = {
            and: [
              { [foreignKey]: sourceId, [discriminator]: sourceName },
              ...scope.where ? [scope.where] : []
            ]
          };
          filter.limit = 1;
          promises.push(
            targetRepository.find(filter).then((result) => {
              if (result.length) targetBySourceId.set(sourceId, result[0]);
            })
          );
        });
        await Promise.all(promises);
        Array.from(targetBySourceId.keys()).forEach((sourceId) => {
          const sources = entities.filter((v) => v[sourcePkPropName] === sourceId);
          sources.forEach((v) => v[relationName] = targetBySourceId.get(sourceId));
        });
      }
      /**
       * Include polymorphic by relation name.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string} targetRelationName
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includePolymorphicByRelationName(entities, sourceName, targetName, relationName, targetRelationName, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of HasOneResolver.includePolymorphicByRelationName requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of HasOneResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of HasOneResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of HasOneResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            relationName
          );
        if (!targetRelationName || typeof targetRelationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetRelationName" of HasOneResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            targetRelationName
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of HasOneResolver.includePolymorphicByRelationName should be an Object, but %v given.',
            scope
          );
        const targetRelationDef = this.getService(
          ModelDefinitionUtils
        ).getRelationDefinitionByName(targetName, targetRelationName);
        if (targetRelationDef.type !== RelationType.BELONGS_TO)
          throw new InvalidArgumentError2(
            'The relation %v of the model %v is a polymorphic "hasOne" relation, so it requires the target relation %v to be a polymorphic "belongsTo", but %v type given.',
            relationName,
            sourceName,
            targetRelationName,
            targetRelationDef.type
          );
        if (!targetRelationDef.polymorphic)
          throw new InvalidArgumentError2(
            'The relation %v of the model %v is a polymorphic "hasOne" relation, so it requires the target relation %v to be a polymorphic too.',
            relationName,
            sourceName,
            targetRelationName
          );
        const foreignKey = targetRelationDef.foreignKey || `${targetRelationName}Id`;
        const discriminator = targetRelationDef.discriminator || `${targetRelationName}Type`;
        return this.includePolymorphicTo(
          entities,
          sourceName,
          targetName,
          relationName,
          foreignKey,
          discriminator,
          scope
        );
      }
    };
    __name(_HasOneResolver, "HasOneResolver");
    HasOneResolver = _HasOneResolver;
  }
});

// src/relations/has-many-resolver.js
var _HasManyResolver, HasManyResolver;
var init_has_many_resolver = __esm({
  "src/relations/has-many-resolver.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_definition();
    init_errors2();
    init_repository2();
    init_definition();
    _HasManyResolver = class _HasManyResolver extends Service {
      /**
       * Include to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string} foreignKey
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includeTo(entities, sourceName, targetName, relationName, foreignKey, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of HasManyResolver.includeTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of HasManyResolver.includeTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of HasManyResolver.includeTo requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of HasManyResolver.includeTo requires a non-empty String, but %v given.',
            relationName
          );
        if (!foreignKey || typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The parameter "foreignKey" of HasManyResolver.includeTo requires a non-empty String, but %v given.',
            foreignKey
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of HasManyResolver.includeTo should be an Object, but %v given.',
            scope
          );
        const sourcePkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          sourceName
        );
        const sourceIds = [];
        entities.forEach((entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of HasManyResolver.includeTo requires an Array of Object, but %v given.',
              entity
            );
          const sourceId = entity[sourcePkPropName];
          if (sourceIds.includes(sourceId)) return;
          sourceIds.push(sourceId);
        });
        const promises = [];
        const targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
        scope = scope ? cloneDeep(scope) : {};
        const targetsBySourceId = /* @__PURE__ */ new Map();
        sourceIds.forEach((sourceId) => {
          const filter = cloneDeep(scope);
          filter.where = {
            and: [{ [foreignKey]: sourceId }, ...scope.where ? [scope.where] : []]
          };
          promises.push(
            targetRepository.find(filter).then((result) => {
              var _a;
              if (result.length) {
                let targets = (_a = targetsBySourceId.get(sourceId)) != null ? _a : [];
                targets = [...targets, ...result];
                targetsBySourceId.set(sourceId, targets);
              }
            })
          );
        });
        await Promise.all(promises);
        entities.forEach((entity) => {
          var _a;
          const sourceId = entity[sourcePkPropName];
          entity[relationName] = (_a = targetsBySourceId.get(sourceId)) != null ? _a : [];
        });
      }
      /**
       * Include polymorphic to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string} foreignKey
       * @param {string} discriminator
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includePolymorphicTo(entities, sourceName, targetName, relationName, foreignKey, discriminator, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of HasManyResolver.includePolymorphicTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of HasManyResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of HasManyResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of HasManyResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            relationName
          );
        if (!foreignKey || typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The parameter "foreignKey" of HasManyResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            foreignKey
          );
        if (!discriminator || typeof discriminator !== "string")
          throw new InvalidArgumentError2(
            'The parameter "discriminator" of HasManyResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            discriminator
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of HasManyResolver.includePolymorphicTo should be an Object, but %v given.',
            scope
          );
        const sourcePkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          sourceName
        );
        const sourceIds = [];
        entities.forEach((entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of HasManyResolver.includePolymorphicTo requires an Array of Object, but %v given.',
              entity
            );
          const sourceId = entity[sourcePkPropName];
          if (sourceIds.includes(sourceId)) return;
          sourceIds.push(sourceId);
        });
        const promises = [];
        const targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
        scope = scope ? cloneDeep(scope) : {};
        const targetsBySourceId = /* @__PURE__ */ new Map();
        sourceIds.forEach((sourceId) => {
          const filter = cloneDeep(scope);
          filter.where = {
            and: [
              { [foreignKey]: sourceId, [discriminator]: sourceName },
              ...scope.where ? [scope.where] : []
            ]
          };
          promises.push(
            targetRepository.find(filter).then((result) => {
              var _a;
              if (result.length) {
                let targets = (_a = targetsBySourceId.get(sourceId)) != null ? _a : [];
                targets = [...targets, ...result];
                targetsBySourceId.set(sourceId, targets);
              }
            })
          );
        });
        await Promise.all(promises);
        entities.forEach((entity) => {
          var _a;
          const sourceId = entity[sourcePkPropName];
          entity[relationName] = (_a = targetsBySourceId.get(sourceId)) != null ? _a : [];
        });
      }
      /**
       * Include polymorphic by relation name.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string} targetRelationName
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includePolymorphicByRelationName(entities, sourceName, targetName, relationName, targetRelationName, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of HasManyResolver.includePolymorphicByRelationName requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of HasManyResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of HasManyResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of HasManyResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            relationName
          );
        if (!targetRelationName || typeof targetRelationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetRelationName" of HasManyResolver.includePolymorphicByRelationName requires a non-empty String, but %v given.',
            targetRelationName
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of HasManyResolver.includePolymorphicByRelationName should be an Object, but %v given.',
            scope
          );
        const targetRelationDef = this.getService(
          ModelDefinitionUtils
        ).getRelationDefinitionByName(targetName, targetRelationName);
        if (targetRelationDef.type !== RelationType.BELONGS_TO)
          throw new InvalidArgumentError2(
            'The relation %v of the model %v is a polymorphic "hasMany" relation, so it requires the target relation %v to be a polymorphic "belongsTo", but %v type given.',
            relationName,
            sourceName,
            targetRelationName,
            targetRelationDef.type
          );
        if (!targetRelationDef.polymorphic)
          throw new InvalidArgumentError2(
            'The relation %v of the model %v is a polymorphic "hasMany" relation, so it requires the target relation %v to be a polymorphic too.',
            relationName,
            sourceName,
            targetRelationName
          );
        const foreignKey = targetRelationDef.foreignKey || `${targetRelationName}Id`;
        const discriminator = targetRelationDef.discriminator || `${targetRelationName}Type`;
        return this.includePolymorphicTo(
          entities,
          sourceName,
          targetName,
          relationName,
          foreignKey,
          discriminator,
          scope
        );
      }
    };
    __name(_HasManyResolver, "HasManyResolver");
    HasManyResolver = _HasManyResolver;
  }
});

// src/relations/belongs-to-resolver.js
var _BelongsToResolver, BelongsToResolver;
var init_belongs_to_resolver = __esm({
  "src/relations/belongs-to-resolver.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_utils2();
    init_errors2();
    init_repository2();
    init_definition();
    _BelongsToResolver = class _BelongsToResolver extends Service {
      /**
       * Include to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string|undefined} foreignKey
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includeTo(entities, sourceName, targetName, relationName, foreignKey = void 0, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of BelongsToResolver.includeTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of BelongsToResolver.includeTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of BelongsToResolver.includeTo requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of BelongsToResolver.includeTo requires a non-empty String, but %v given.',
            relationName
          );
        if (foreignKey && typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The provided parameter "foreignKey" of BelongsToResolver.includeTo should be a String, but %v given.',
            foreignKey
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of BelongsToResolver.includeTo should be an Object, but %v given.',
            scope
          );
        if (foreignKey == null) foreignKey = `${relationName}Id`;
        const targetIds = entities.reduce((acc, entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of BelongsToResolver.includeTo requires an Array of Object, but %v given.',
              entity
            );
          const targetId = entity[foreignKey];
          return targetId != null ? [...acc, targetId] : acc;
        }, []);
        const targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
        const targetPkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          targetName
        );
        scope = scope ? cloneDeep(scope) : {};
        const filter = cloneDeep(scope);
        filter.where = {
          and: [
            { [targetPkPropName]: { inq: targetIds } },
            ...scope.where ? [scope.where] : []
          ]
        };
        const targets = await targetRepository.find(filter);
        entities.forEach((entity) => {
          const target = targets.find(
            (e) => e[targetPkPropName] === entity[foreignKey]
          );
          if (target) entity[relationName] = target;
        });
      }
      /**
       * Include polymorphic to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} relationName
       * @param {string|undefined} foreignKey
       * @param {string|undefined} discriminator
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includePolymorphicTo(entities, sourceName, relationName, foreignKey = void 0, discriminator = void 0, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of BelongsToResolver.includePolymorphicTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of BelongsToResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of BelongsToResolver.includePolymorphicTo requires a non-empty String, but %v given.',
            relationName
          );
        if (foreignKey && typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The provided parameter "foreignKey" of BelongsToResolver.includePolymorphicTo should be a String, but %v given.',
            foreignKey
          );
        if (discriminator && typeof discriminator !== "string")
          throw new InvalidArgumentError2(
            'The provided parameter "discriminator" of BelongsToResolver.includePolymorphicTo should be a String, but %v given.',
            discriminator
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of BelongsToResolver.includePolymorphicTo should be an Object, but %v given.',
            scope
          );
        if (foreignKey == null) {
          const singularRelationName = singularize(relationName);
          foreignKey = `${singularRelationName}Id`;
        }
        if (discriminator == null) {
          const singularRelationName = singularize(relationName);
          discriminator = `${singularRelationName}Type`;
        }
        const targetIdsByTargetName = {};
        entities.forEach((entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of BelongsToResolver.includePolymorphicTo requires an Array of Object, but %v given.',
              entity
            );
          const targetId = entity[foreignKey];
          const targetName = entity[discriminator];
          if (targetId == null || targetName == null) return;
          if (targetIdsByTargetName[targetName] == null)
            targetIdsByTargetName[targetName] = [];
          if (!targetIdsByTargetName[targetName].includes(targetId))
            targetIdsByTargetName[targetName].push(targetId);
        });
        const promises = [];
        const targetNames = Object.keys(targetIdsByTargetName);
        scope = scope ? cloneDeep(scope) : {};
        const targetEntitiesByTargetNames = {};
        targetNames.forEach((targetName) => {
          let targetRepository;
          try {
            targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
          } catch (error) {
            if (error instanceof InvalidArgumentError2) {
              if (error.message === `The model "${targetName}" is not defined.` || error.message === `The model "${targetName}" does not have a specified datasource.`) {
                return;
              }
            } else {
              throw error;
            }
          }
          const targetPkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
            targetName
          );
          const targetFilter = cloneDeep(scope);
          const targetIds = targetIdsByTargetName[targetName];
          targetFilter.where = {
            and: [
              { [targetPkPropName]: { inq: targetIds } },
              ...scope.where ? [scope.where] : []
            ]
          };
          const promise = targetRepository.find(targetFilter).then((result) => {
            var _a;
            targetEntitiesByTargetNames[targetName] = [
              ...(_a = targetEntitiesByTargetNames[targetName]) != null ? _a : [],
              ...result
            ];
          });
          promises.push(promise);
        });
        await Promise.all(promises);
        entities.forEach((entity) => {
          var _a;
          const targetId = entity[foreignKey];
          const targetName = entity[discriminator];
          if (targetId == null || targetName == null || targetEntitiesByTargetNames[targetName] == null) {
            return;
          }
          const targetEntities = (_a = targetEntitiesByTargetNames[targetName]) != null ? _a : [];
          const targetPkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
            targetName
          );
          const target = targetEntities.find((e) => e[targetPkPropName] === targetId);
          if (target) entity[relationName] = target;
        });
      }
    };
    __name(_BelongsToResolver, "BelongsToResolver");
    BelongsToResolver = _BelongsToResolver;
  }
});

// src/relations/references-many-resolver.js
var _ReferencesManyResolver, ReferencesManyResolver;
var init_references_many_resolver = __esm({
  "src/relations/references-many-resolver.js"() {
    "use strict";
    init_src2();
    init_utils2();
    init_utils2();
    init_errors2();
    init_repository2();
    init_definition();
    _ReferencesManyResolver = class _ReferencesManyResolver extends Service {
      /**
       * Include to.
       *
       * @param {object[]} entities
       * @param {string} sourceName
       * @param {string} targetName
       * @param {string} relationName
       * @param {string|undefined} foreignKey
       * @param {object|undefined} scope
       * @returns {Promise<void>}
       */
      async includeTo(entities, sourceName, targetName, relationName, foreignKey = void 0, scope = void 0) {
        if (!entities || !Array.isArray(entities))
          throw new InvalidArgumentError2(
            'The parameter "entities" of ReferencesManyResolver.includeTo requires an Array of Object, but %v given.',
            entities
          );
        if (!sourceName || typeof sourceName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "sourceName" of ReferencesManyResolver.includeTo requires a non-empty String, but %v given.',
            sourceName
          );
        if (!targetName || typeof targetName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "targetName" of ReferencesManyResolver.includeTo requires a non-empty String, but %v given.',
            targetName
          );
        if (!relationName || typeof relationName !== "string")
          throw new InvalidArgumentError2(
            'The parameter "relationName" of ReferencesManyResolver.includeTo requires a non-empty String, but %v given.',
            relationName
          );
        if (foreignKey && typeof foreignKey !== "string")
          throw new InvalidArgumentError2(
            'The provided parameter "foreignKey" of ReferencesManyResolver.includeTo should be a String, but %v given.',
            foreignKey
          );
        if (scope && (typeof scope !== "object" || Array.isArray(scope)))
          throw new InvalidArgumentError2(
            'The provided parameter "scope" of ReferencesManyResolver.includeTo should be an Object, but %v given.',
            scope
          );
        if (foreignKey == null) {
          const singularRelationName = singularize(relationName);
          foreignKey = `${singularRelationName}Ids`;
        }
        const targetIds = entities.reduce((acc, entity) => {
          if (!entity || typeof entity !== "object" || Array.isArray(entity))
            throw new InvalidArgumentError2(
              'The parameter "entities" of ReferencesManyResolver.includeTo requires an Array of Object, but %v given.',
              entity
            );
          const ids = entity[foreignKey];
          if (Array.isArray(ids))
            ids.forEach((id) => {
              if (id == null || acc.includes(id)) return;
              acc.push(id);
            });
          return acc;
        }, []);
        const targetRepository = this.getService(RepositoryRegistry).getRepository(targetName);
        const targetPkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          targetName
        );
        scope = scope ? cloneDeep(scope) : {};
        const filter = cloneDeep(scope);
        filter.where = {
          and: [
            { [targetPkPropName]: { inq: targetIds } },
            ...scope.where ? [scope.where] : []
          ]
        };
        const targets = await targetRepository.find(filter);
        entities.forEach((entity) => {
          const ids = entity[foreignKey];
          entity[relationName] = [];
          if (Array.isArray(ids))
            targets.forEach((target) => {
              const targetId = target[targetPkPropName];
              if (ids.includes(targetId)) entity[relationName].push(target);
            });
        });
      }
    };
    __name(_ReferencesManyResolver, "ReferencesManyResolver");
    ReferencesManyResolver = _ReferencesManyResolver;
  }
});

// src/relations/index.js
var init_relations2 = __esm({
  "src/relations/index.js"() {
    "use strict";
    init_has_one_resolver();
    init_has_many_resolver();
    init_belongs_to_resolver();
    init_references_many_resolver();
  }
});

// src/filter/include-clause-tool.js
var _IncludeClauseTool, IncludeClauseTool;
var init_include_clause_tool = __esm({
  "src/filter/include-clause-tool.js"() {
    "use strict";
    init_src2();
    init_definition();
    init_relations2();
    init_relations2();
    init_where_clause_tool();
    init_order_clause_tool();
    init_slice_clause_tool();
    init_errors2();
    init_relations2();
    init_fields_clause_tool();
    init_definition();
    init_relations2();
    _IncludeClauseTool = class _IncludeClauseTool extends Service {
      /**
       * Include to.
       *
       * @param {object[]} entities
       * @param {string} modelName
       * @param {IncludeClause|undefined} clause
       * @returns {Promise<void>}
       */
      async includeTo(entities, modelName, clause) {
        clause = _IncludeClauseTool.normalizeIncludeClause(clause);
        const promises = [];
        clause.forEach((inclusion) => {
          const relDef = this.getService(
            ModelDefinitionUtils
          ).getRelationDefinitionByName(modelName, inclusion.relation);
          switch (relDef.type) {
            // BELONGS_TO
            case RelationType.BELONGS_TO:
              if (relDef.polymorphic) {
                promises.push(
                  this.getService(BelongsToResolver).includePolymorphicTo(
                    entities,
                    modelName,
                    inclusion.relation,
                    relDef.foreignKey,
                    relDef.discriminator,
                    inclusion.scope
                  )
                );
              } else {
                promises.push(
                  this.getService(BelongsToResolver).includeTo(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.foreignKey,
                    inclusion.scope
                  )
                );
              }
              break;
            // HAS_ONE
            case RelationType.HAS_ONE:
              if (relDef.polymorphic && typeof relDef.polymorphic === "string") {
                promises.push(
                  this.getService(HasOneResolver).includePolymorphicByRelationName(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.polymorphic,
                    inclusion.scope
                  )
                );
              } else if (relDef.polymorphic) {
                promises.push(
                  this.getService(HasOneResolver).includePolymorphicTo(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.foreignKey,
                    relDef.discriminator,
                    inclusion.scope
                  )
                );
              } else {
                promises.push(
                  this.getService(HasOneResolver).includeTo(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.foreignKey,
                    inclusion.scope
                  )
                );
              }
              break;
            // HAS_MANY
            case RelationType.HAS_MANY:
              if (relDef.polymorphic && typeof relDef.polymorphic === "string") {
                promises.push(
                  this.getService(HasManyResolver).includePolymorphicByRelationName(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.polymorphic,
                    inclusion.scope
                  )
                );
              } else if (relDef.polymorphic) {
                promises.push(
                  this.getService(HasManyResolver).includePolymorphicTo(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.foreignKey,
                    relDef.discriminator,
                    inclusion.scope
                  )
                );
              } else {
                promises.push(
                  this.getService(HasManyResolver).includeTo(
                    entities,
                    modelName,
                    relDef.model,
                    inclusion.relation,
                    relDef.foreignKey,
                    inclusion.scope
                  )
                );
              }
              break;
            case RelationType.REFERENCES_MANY:
              promises.push(
                this.getService(ReferencesManyResolver).includeTo(
                  entities,
                  modelName,
                  relDef.model,
                  inclusion.relation,
                  relDef.foreignKey,
                  inclusion.scope
                )
              );
              break;
            default:
              throw new InvalidArgumentError2(
                "The relation type %v does not have an inclusion resolver.",
                relDef.type
              );
          }
        });
        await Promise.all(promises);
      }
      /**
       * Validate include clause.
       *
       * @param {IncludeClause|undefined} clause
       */
      static validateIncludeClause(clause) {
        if (clause == null) {
        } else if (clause && typeof clause === "string") {
        } else if (Array.isArray(clause)) {
          const relNames = [];
          clause.flat(Infinity).forEach((el) => {
            this.validateIncludeClause(el);
            if (typeof el === "string") {
              relNames.push(el);
            } else if (typeof el === "object") {
              Object.keys(el).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(el, key))
                  relNames.push(key);
              });
            }
          });
          const duplicateNames = relNames.filter(
            (name, i) => relNames.indexOf(name) !== i
          );
          if (duplicateNames.length)
            throw new InvalidArgumentError2(
              'The provided option "include" has duplicates of %v.',
              duplicateNames[0]
            );
        } else if (typeof clause === "object") {
          if ("relation" in clause) {
            if (!clause.relation || typeof clause.relation !== "string")
              throw new InvalidArgumentError2(
                'The provided option "relation" should be a non-empty String, but %v given.',
                clause.relation
              );
            if ("scope" in clause && clause) this.validateScopeClause(clause.scope);
          } else {
            Object.keys(clause).forEach((key) => {
              if (!Object.prototype.hasOwnProperty.call(clause, key)) return;
              this.validateIncludeClause(key);
              this.validateIncludeClause(clause[key]);
            });
          }
        } else {
          throw new InvalidArgumentError2(
            'The provided option "include" should have a non-empty String, an Object or an Array, but %v given.',
            clause
          );
        }
      }
      /**
       * Validate scope clause.
       *
       * @param {object|undefined} clause
       */
      static validateScopeClause(clause) {
        if (clause == null) return;
        if (typeof clause !== "object" || Array.isArray(clause))
          throw new InvalidArgumentError2(
            'The provided option "scope" should be an Object, but %v given.',
            clause
          );
        if (clause.where != null) {
          WhereClauseTool.validateWhereClause(clause.where);
        }
        if (clause.order != null) {
          OrderClauseTool.validateOrderClause(clause.order);
        }
        if (clause.skip != null) {
          SliceClauseTool.validateSkipClause(clause.skip);
        }
        if (clause.limit != null) {
          SliceClauseTool.validateLimitClause(clause.limit);
        }
        if (clause.fields != null) {
          FieldsClauseTool.validateFieldsClause(clause.fields);
        }
        if (clause.include != null) {
          _IncludeClauseTool.validateIncludeClause(clause.include);
        }
      }
      /**
       * Normalize include clause.
       *
       * @param {IncludeClause|undefined} clause
       * @returns {object[]}
       */
      static normalizeIncludeClause(clause) {
        let result = [];
        if (clause == null) {
          return result;
        } else if (clause && typeof clause === "string") {
          result.push({ relation: clause });
        } else if (Array.isArray(clause)) {
          clause.flat(Infinity).forEach((el) => {
            el = this.normalizeIncludeClause(el);
            result = [...result, ...el];
          });
          const relNames = result.map((v) => v.relation);
          const duplicateNames = relNames.filter(
            (name, i) => relNames.indexOf(name) !== i
          );
          if (duplicateNames.length)
            throw new InvalidArgumentError2(
              'The provided option "include" has duplicates of %v.',
              duplicateNames[0]
            );
        } else if (typeof clause === "object") {
          if ("relation" in clause) {
            if (!clause.relation || typeof clause.relation !== "string")
              throw new InvalidArgumentError2(
                'The provided option "relation" should be a non-empty String, but %v given.',
                clause.relation
              );
            const normalized = { relation: clause.relation };
            const scope = this.normalizeScopeClause(clause.scope);
            if (scope) normalized.scope = scope;
            result.push(normalized);
          } else {
            Object.keys(clause).forEach((key) => {
              if (!Object.prototype.hasOwnProperty.call(clause, key)) return;
              this.validateIncludeClause(key);
              const normalized = { relation: key };
              const include = this.normalizeIncludeClause(clause[key]);
              if (include.length) normalized.scope = { include };
              result.push(normalized);
            });
          }
        } else {
          throw new InvalidArgumentError2(
            'The provided option "include" should have a non-empty String, an Object or an Array, but %v given.',
            clause
          );
        }
        return result;
      }
      /**
       * Normalize scope clause.
       *
       * @param {object|undefined} clause
       * @returns {object|undefined}
       */
      static normalizeScopeClause(clause) {
        if (clause == null) return;
        if (typeof clause !== "object" || Array.isArray(clause))
          throw new InvalidArgumentError2(
            'The provided option "scope" should be an Object, but %v given.',
            clause
          );
        const result = {};
        if (clause.where != null) {
          WhereClauseTool.validateWhereClause(clause.where);
          result.where = clause.where;
        }
        if (clause.order != null) {
          OrderClauseTool.validateOrderClause(clause.order);
          result.order = clause.order;
        }
        if (clause.skip != null) {
          SliceClauseTool.validateSkipClause(clause.skip);
          result.skip = clause.skip;
        }
        if (clause.limit != null) {
          SliceClauseTool.validateLimitClause(clause.limit);
          result.limit = clause.limit;
        }
        if (clause.fields != null) {
          FieldsClauseTool.validateFieldsClause(clause.fields);
          result.fields = clause.fields;
        }
        if (clause.include != null) {
          result.include = this.normalizeIncludeClause(clause.include);
        }
        if (Object.keys(result).length) return result;
        return void 0;
      }
    };
    __name(_IncludeClauseTool, "IncludeClauseTool");
    IncludeClauseTool = _IncludeClauseTool;
  }
});

// src/filter/index.js
var init_filter = __esm({
  "src/filter/index.js"() {
    "use strict";
    init_slice_clause_tool();
    init_order_clause_tool();
    init_where_clause_tool();
    init_fields_clause_tool();
    init_include_clause_tool();
    init_operator_clause_tool();
  }
});

// src/adapter/decorator/inclusion-decorator.js
var _InclusionDecorator, InclusionDecorator;
var init_inclusion_decorator = __esm({
  "src/adapter/decorator/inclusion-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_filter();
    init_errors2();
    _InclusionDecorator = class _InclusionDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of InclusionDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const tool = adapter.getService(IncludeClauseTool);
        const includeTo = /* @__PURE__ */ __name((...args) => tool.includeTo(...args), "includeTo");
        const create = adapter.create;
        adapter.create = async function(modelName, modelData, filter) {
          const retvalData = await create.call(this, modelName, modelData, filter);
          if (filter && typeof filter === "object" && filter.include)
            await includeTo([retvalData], modelName, filter.include);
          return retvalData;
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = async function(modelName, id, modelData, filter) {
          const retvalData = await replaceById.call(
            this,
            modelName,
            id,
            modelData,
            filter
          );
          if (filter && typeof filter === "object" && filter.include)
            await includeTo([retvalData], modelName, filter.include);
          return retvalData;
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = async function(modelName, modelData, filter) {
          const retvalData = await replaceOrCreate.call(
            this,
            modelName,
            modelData,
            filter
          );
          if (filter && typeof filter === "object" && filter.include)
            await includeTo([retvalData], modelName, filter.include);
          return retvalData;
        };
        const patchById = adapter.patchById;
        adapter.patchById = async function(modelName, id, modelData, filter) {
          const retvalData = await patchById.call(
            this,
            modelName,
            id,
            modelData,
            filter
          );
          if (filter && typeof filter === "object" && filter.include)
            await includeTo([retvalData], modelName, filter.include);
          return retvalData;
        };
        const find = adapter.find;
        adapter.find = async function(modelName, filter) {
          const modelItems = await find.call(this, modelName, filter);
          if (filter && typeof filter === "object" && filter.include)
            await includeTo(modelItems, modelName, filter.include);
          return modelItems;
        };
        const findById = adapter.findById;
        adapter.findById = async function(modelName, id, filter) {
          const retvalData = await findById.call(this, modelName, id, filter);
          if (filter && typeof filter === "object" && filter.include)
            await includeTo([retvalData], modelName, filter.include);
          return retvalData;
        };
      }
    };
    __name(_InclusionDecorator, "InclusionDecorator");
    InclusionDecorator = _InclusionDecorator;
  }
});

// src/adapter/decorator/default-values-decorator.js
var _DefaultValuesDecorator, DefaultValuesDecorator;
var init_default_values_decorator = __esm({
  "src/adapter/decorator/default-values-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_errors2();
    init_definition();
    _DefaultValuesDecorator = class _DefaultValuesDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of DefaultValuesDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const utils = adapter.getService(ModelDefinitionUtils);
        const setDefaults = /* @__PURE__ */ __name((...args) => utils.setDefaultValuesToEmptyProperties(...args), "setDefaults");
        const create = adapter.create;
        adapter.create = function(modelName, modelData, filter) {
          modelData = setDefaults(modelName, modelData);
          return create.call(this, modelName, modelData, filter);
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = function(modelName, id, modelData, filter) {
          modelData = setDefaults(modelName, modelData);
          return replaceById.call(this, modelName, id, modelData, filter);
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = function(modelName, modelData, filter) {
          modelData = setDefaults(modelName, modelData);
          return replaceOrCreate.call(this, modelName, modelData, filter);
        };
        const patch = adapter.patch;
        adapter.patch = function(modelName, modelData, where) {
          modelData = setDefaults(modelName, modelData, true);
          return patch.call(this, modelName, modelData, where);
        };
        const patchById = adapter.patchById;
        adapter.patchById = function(modelName, id, modelData, filter) {
          modelData = setDefaults(modelName, modelData, true);
          return patchById.call(this, modelName, id, modelData, filter);
        };
        const find = adapter.find;
        adapter.find = async function(modelName, filter) {
          const modelItems = await find.call(this, modelName, filter);
          return modelItems.map((modelItem) => setDefaults(modelName, modelItem));
        };
        const findById = adapter.findById;
        adapter.findById = async function(modelName, id, filter) {
          const retvalData = await findById.call(this, modelName, id, filter);
          return setDefaults(modelName, retvalData);
        };
      }
    };
    __name(_DefaultValuesDecorator, "DefaultValuesDecorator");
    DefaultValuesDecorator = _DefaultValuesDecorator;
  }
});

// src/adapter/decorator/data-sanitizing-decorator.js
var _DataSanitizingDecorator, DataSanitizingDecorator;
var init_data_sanitizing_decorator = __esm({
  "src/adapter/decorator/data-sanitizing-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_errors2();
    init_definition();
    _DataSanitizingDecorator = class _DataSanitizingDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of DataSanitizingDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const sanitizer = adapter.getService(ModelDataSanitizer);
        const sanitize = /* @__PURE__ */ __name((...args) => sanitizer.sanitize(...args), "sanitize");
        const create = adapter.create;
        adapter.create = async function(modelName, modelData, filter) {
          modelData = sanitize(modelName, modelData);
          return create.call(this, modelName, modelData, filter);
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = async function(modelName, id, modelData, filter) {
          modelData = sanitize(modelName, modelData);
          return replaceById.call(this, modelName, id, modelData, filter);
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = async function(modelName, modelData, filter) {
          modelData = sanitize(modelName, modelData);
          return replaceOrCreate.call(this, modelName, modelData, filter);
        };
        const patch = adapter.patch;
        adapter.patch = async function(modelName, modelData, where) {
          modelData = sanitize(modelName, modelData);
          return patch.call(this, modelName, modelData, where);
        };
        const patchById = adapter.patchById;
        adapter.patchById = async function(modelName, id, modelData, filter) {
          modelData = sanitize(modelName, modelData);
          return patchById.call(this, modelName, id, modelData, filter);
        };
      }
    };
    __name(_DataSanitizingDecorator, "DataSanitizingDecorator");
    DataSanitizingDecorator = _DataSanitizingDecorator;
  }
});

// src/adapter/decorator/data-validation-decorator.js
var _DataValidationDecorator, DataValidationDecorator;
var init_data_validation_decorator = __esm({
  "src/adapter/decorator/data-validation-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_errors2();
    init_definition();
    _DataValidationDecorator = class _DataValidationDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of DataValidationDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const validator = this.getService(ModelDataValidator);
        const create = adapter.create;
        adapter.create = function(modelName, modelData, filter) {
          validator.validate(modelName, modelData);
          return create.call(this, modelName, modelData, filter);
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = function(modelName, id, modelData, filter) {
          validator.validate(modelName, modelData);
          return replaceById.call(this, modelName, id, modelData, filter);
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = function(modelName, modelData, filter) {
          validator.validate(modelName, modelData);
          return replaceOrCreate.call(this, modelName, modelData, filter);
        };
        const patch = adapter.patch;
        adapter.patch = function(modelName, modelData, where) {
          validator.validate(modelName, modelData, true);
          return patch.call(this, modelName, modelData, where);
        };
        const patchById = adapter.patchById;
        adapter.patchById = function(modelName, id, modelData, filter) {
          validator.validate(modelName, modelData, true);
          return patchById.call(this, modelName, id, modelData, filter);
        };
      }
    };
    __name(_DataValidationDecorator, "DataValidationDecorator");
    DataValidationDecorator = _DataValidationDecorator;
  }
});

// src/adapter/decorator/fields-filtering-decorator.js
var _FieldsFilteringDecorator, FieldsFilteringDecorator;
var init_fields_filtering_decorator = __esm({
  "src/adapter/decorator/fields-filtering-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_filter();
    init_errors2();
    _FieldsFilteringDecorator = class _FieldsFilteringDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of FieldsFilteringDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const tool = adapter.getService(FieldsClauseTool);
        const selectFields = /* @__PURE__ */ __name((...args) => tool.filter(...args), "selectFields");
        const create = adapter.create;
        adapter.create = async function(modelName, modelData, filter) {
          let result = await create.call(this, modelName, modelData, filter);
          if (filter && typeof filter === "object" && filter.fields)
            result = selectFields(result, modelName, filter.fields);
          return result;
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = async function(modelName, id, modelData, filter) {
          let result = await replaceById.call(
            this,
            modelName,
            id,
            modelData,
            filter
          );
          if (filter && typeof filter === "object" && filter.fields)
            result = selectFields(result, modelName, filter.fields);
          return result;
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = async function(modelName, modelData, filter) {
          let result = await replaceOrCreate.call(
            this,
            modelName,
            modelData,
            filter
          );
          if (filter && typeof filter === "object" && filter.fields)
            result = selectFields(result, modelName, filter.fields);
          return result;
        };
        const patchById = adapter.patchById;
        adapter.patchById = async function(modelName, id, modelData, filter) {
          let result = await patchById.call(this, modelName, id, modelData, filter);
          if (filter && typeof filter === "object" && filter.fields)
            result = selectFields(result, modelName, filter.fields);
          return result;
        };
        const find = adapter.find;
        adapter.find = async function(modelName, filter) {
          let result = await find.call(this, modelName, filter);
          if (filter && typeof filter === "object" && filter.fields)
            result = selectFields(result, modelName, filter.fields);
          return result;
        };
        const findById = adapter.findById;
        adapter.findById = async function(modelName, id, filter) {
          let result = await findById.call(this, modelName, id, filter);
          if (filter && typeof filter === "object" && filter.fields)
            result = selectFields(result, modelName, filter.fields);
          return result;
        };
      }
    };
    __name(_FieldsFilteringDecorator, "FieldsFilteringDecorator");
    FieldsFilteringDecorator = _FieldsFilteringDecorator;
  }
});

// src/adapter/decorator/data-transformation-decorator.js
var _DataTransformationDecorator, DataTransformationDecorator;
var init_data_transformation_decorator = __esm({
  "src/adapter/decorator/data-transformation-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_errors2();
    init_definition();
    _DataTransformationDecorator = class _DataTransformationDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of DataTransformerDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const transformer = this.getService(ModelDataTransformer);
        const create = adapter.create;
        adapter.create = async function(modelName, modelData, filter) {
          modelData = await transformer.transform(modelName, modelData);
          return create.call(this, modelName, modelData, filter);
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = async function(modelName, id, modelData, filter) {
          modelData = await transformer.transform(modelName, modelData);
          return replaceById.call(this, modelName, id, modelData, filter);
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = async function(modelName, modelData, filter) {
          modelData = await transformer.transform(modelName, modelData);
          return replaceOrCreate.call(this, modelName, modelData, filter);
        };
        const patch = adapter.patch;
        adapter.patch = async function(modelName, modelData, where) {
          modelData = await transformer.transform(modelName, modelData, true);
          return patch.call(this, modelName, modelData, where);
        };
        const patchById = adapter.patchById;
        adapter.patchById = async function(modelName, id, modelData, filter) {
          modelData = await transformer.transform(modelName, modelData, true);
          return patchById.call(this, modelName, id, modelData, filter);
        };
      }
    };
    __name(_DataTransformationDecorator, "DataTransformationDecorator");
    DataTransformationDecorator = _DataTransformationDecorator;
  }
});

// src/adapter/decorator/property-uniqueness-decorator.js
var _PropertyUniquenessDecorator, PropertyUniquenessDecorator;
var init_property_uniqueness_decorator = __esm({
  "src/adapter/decorator/property-uniqueness-decorator.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_errors2();
    init_definition();
    _PropertyUniquenessDecorator = class _PropertyUniquenessDecorator extends Service {
      /**
       * Decorate.
       *
       * @param {Adapter} adapter
       */
      decorate(adapter) {
        if (!adapter || !(adapter instanceof Adapter))
          throw new InvalidArgumentError2(
            "The first argument of PropertyUniquenessDecorator.decorate should be an Adapter instance, but %v given.",
            adapter
          );
        const validator = this.getService(PropertyUniquenessValidator);
        const create = adapter.create;
        adapter.create = async function(modelName, modelData, filter) {
          const countMethod = adapter.count.bind(adapter, modelName);
          await validator.validate(countMethod, "create", modelName, modelData);
          return create.call(this, modelName, modelData, filter);
        };
        const replaceById = adapter.replaceById;
        adapter.replaceById = async function(modelName, id, modelData, filter) {
          const countMethod = adapter.count.bind(adapter, modelName);
          await validator.validate(
            countMethod,
            "replaceById",
            modelName,
            modelData,
            id
          );
          return replaceById.call(this, modelName, id, modelData, filter);
        };
        const replaceOrCreate = adapter.replaceOrCreate;
        adapter.replaceOrCreate = async function(modelName, modelData, filter) {
          const countMethod = adapter.count.bind(adapter, modelName);
          await validator.validate(
            countMethod,
            "replaceOrCreate",
            modelName,
            modelData
          );
          return replaceOrCreate.call(this, modelName, modelData, filter);
        };
        const patch = adapter.patch;
        adapter.patch = async function(modelName, modelData, where) {
          const countMethod = adapter.count.bind(adapter, modelName);
          await validator.validate(countMethod, "patch", modelName, modelData);
          return patch.call(this, modelName, modelData, where);
        };
        const patchById = adapter.patchById;
        adapter.patchById = async function(modelName, id, modelData, filter) {
          const countMethod = adapter.count.bind(adapter, modelName);
          await validator.validate(
            countMethod,
            "patchById",
            modelName,
            modelData,
            id
          );
          return patchById.call(this, modelName, id, modelData, filter);
        };
      }
    };
    __name(_PropertyUniquenessDecorator, "PropertyUniquenessDecorator");
    PropertyUniquenessDecorator = _PropertyUniquenessDecorator;
  }
});

// src/adapter/decorator/index.js
var init_decorator = __esm({
  "src/adapter/decorator/index.js"() {
    "use strict";
    init_inclusion_decorator();
    init_default_values_decorator();
    init_data_sanitizing_decorator();
    init_data_validation_decorator();
    init_fields_filtering_decorator();
    init_data_transformation_decorator();
    init_property_uniqueness_decorator();
  }
});

// src/adapter/adapter.js
var _Adapter, Adapter;
var init_adapter = __esm({
  "src/adapter/adapter.js"() {
    "use strict";
    init_src2();
    init_errors2();
    init_decorator();
    init_decorator();
    init_decorator();
    init_decorator();
    init_decorator();
    init_decorator();
    init_decorator();
    _Adapter = class _Adapter extends Service {
      /**
       * Settings.
       *
       * @type {object|undefined}
       */
      _settings;
      /**
       * Settings.
       *
       * @returns {object|undefined}
       */
      get settings() {
        return this._settings;
      }
      /**
       * Constructor.
       *
       * @param {object|undefined} container
       * @param {object|undefined} settings
       */
      constructor(container = void 0, settings = void 0) {
        super(container);
        this._settings = settings;
        if (this.constructor !== _Adapter) {
          this.getService(DataSanitizingDecorator).decorate(this);
          this.getService(DefaultValuesDecorator).decorate(this);
          this.getService(DataTransformationDecorator).decorate(this);
          this.getService(DataValidationDecorator).decorate(this);
          this.getService(PropertyUniquenessDecorator).decorate(this);
          this.getService(FieldsFilteringDecorator).decorate(this);
          this.getService(InclusionDecorator).decorate(this);
        }
      }
      /**
       * Create.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      create(modelName, modelData, filter = void 0) {
        throw new NotImplementedError(
          "%s.create is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Replace by id.
       *
       * @param {string} modelName
       * @param {number|string} id
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      replaceById(modelName, id, modelData, filter = void 0) {
        throw new NotImplementedError(
          "%s.replaceById is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Replace or create.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      replaceOrCreate(modelName, modelData, filter = void 0) {
        throw new NotImplementedError(
          "%s.replaceOrCreate is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Patch.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      patch(modelName, modelData, where = void 0) {
        throw new NotImplementedError(
          "%s.patch is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Patch by id.
       *
       * @param {string} modelName
       * @param {number|string} id
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      patchById(modelName, id, modelData, filter = void 0) {
        throw new NotImplementedError(
          "%s.patchById is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Find.
       *
       * @param {string} modelName
       * @param {object|undefined} filter
       * @returns {Promise<object[]>}
       */
      find(modelName, filter = void 0) {
        throw new NotImplementedError(
          "%s.find is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Find by id.
       *
       * @param {string} modelName
       * @param {number|string} id
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      findById(modelName, id, filter = void 0) {
        throw new NotImplementedError(
          "%s.findById is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Delete.
       *
       * @param {string} modelName
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      delete(modelName, where = void 0) {
        throw new NotImplementedError(
          "%s.delete is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Delete by id.
       *
       * @param {string} modelName
       * @param {number|string} id
       * @returns {Promise<boolean>}
       */
      deleteById(modelName, id) {
        throw new NotImplementedError(
          "%s.deleteById is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Exists.
       *
       * @param {string} modelName
       * @param {number|string} id
       * @returns {Promise<boolean>}
       */
      exists(modelName, id) {
        throw new NotImplementedError(
          "%s.exists is not implemented.",
          this.constructor.name
        );
      }
      /**
       * Count.
       *
       * @param {string} modelName
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      count(modelName, where = void 0) {
        throw new NotImplementedError(
          "%s.count is not implemented.",
          this.constructor.name
        );
      }
    };
    __name(_Adapter, "Adapter");
    Adapter = _Adapter;
  }
});

// src/adapter/builtin/memory-adapter.js
var memory_adapter_exports = {};
__export(memory_adapter_exports, {
  MemoryAdapter: () => MemoryAdapter
});
var _MemoryAdapter, MemoryAdapter;
var init_memory_adapter = __esm({
  "src/adapter/builtin/memory-adapter.js"() {
    "use strict";
    init_adapter();
    init_utils2();
    init_utils2();
    init_definition();
    init_filter();
    init_filter();
    init_filter();
    init_errors2();
    init_definition();
    _MemoryAdapter = class _MemoryAdapter extends Adapter {
      /**
       * Tables.
       *
       * @type {Map<string, Map<number, Record<string, any>>>}
       */
      _tables = /* @__PURE__ */ new Map();
      /**
       * Last ids.
       *
       * @type {Map<string, number>}
       */
      _lastIds = /* @__PURE__ */ new Map();
      /**
       * Get table or create.
       *
       * @param {string} modelName
       * @returns {Map<number, object>}
       */
      _getTableOrCreate(modelName) {
        const tableName = this.getService(ModelDefinitionUtils).getTableNameByModelName(modelName);
        let table = this._tables.get(tableName);
        if (table) return table;
        table = /* @__PURE__ */ new Map();
        this._tables.set(tableName, table);
        return table;
      }
      /**
       * Gen next id value.
       *
       * @param {string} modelName
       * @param {string} propName
       * @returns {number}
       */
      _genNextIdValue(modelName, propName) {
        var _a;
        const propType = this.getService(
          ModelDefinitionUtils
        ).getDataTypeByPropertyName(modelName, propName);
        if (propType !== DataType.ANY && propType !== DataType.NUMBER)
          throw new InvalidArgumentError2(
            "The memory adapter able to generate only Number identifiers, but the primary key %v of the model %v is defined as %s. Do provide your own value for the %v property, or change the type in the primary key definition to a Number that will be generated automatically.",
            propName,
            modelName,
            capitalize(propType),
            propName
          );
        const tableName = this.getService(ModelDefinitionUtils).getTableNameByModelName(modelName);
        const lastId = (_a = this._lastIds.get(tableName)) != null ? _a : 0;
        const nextId = lastId + 1;
        this._lastIds.set(tableName, nextId);
        const table = this._getTableOrCreate(modelName);
        const existedIds = Array.from(table.keys());
        if (existedIds.includes(nextId))
          return this._genNextIdValue(modelName, propName);
        return nextId;
      }
      /**
       * Create
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      // eslint-disable-next-line no-unused-vars
      async create(modelName, modelData, filter = void 0) {
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        let idValue = modelData[pkPropName];
        if (idValue == null || idValue === "" || idValue === 0) {
          idValue = this._genNextIdValue(modelName, pkPropName);
        }
        const table = this._getTableOrCreate(modelName);
        if (table.has(idValue))
          throw new InvalidArgumentError2(
            "The value %v of the primary key %v already exists in the model %v.",
            idValue,
            pkPropName,
            modelName
          );
        modelData = cloneDeep(modelData);
        modelData[pkPropName] = idValue;
        const tableData = this.getService(
          ModelDefinitionUtils
        ).convertPropertyNamesToColumnNames(modelName, modelData);
        table.set(idValue, tableData);
        return this.getService(
          ModelDefinitionUtils
        ).convertColumnNamesToPropertyNames(modelName, tableData);
      }
      /**
       * Replace by id.
       *
       * @param {string} modelName
       * @param {string|number} id
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      // eslint-disable-next-line no-unused-vars
      async replaceById(modelName, id, modelData, filter = void 0) {
        const table = this._getTableOrCreate(modelName);
        const isExists = table.has(id);
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        if (!isExists)
          throw new InvalidArgumentError2(
            "The value %v of the primary key %v does not exist in the model %v.",
            id,
            pkPropName,
            modelName
          );
        modelData = cloneDeep(modelData);
        modelData[pkPropName] = id;
        const tableData = this.getService(
          ModelDefinitionUtils
        ).convertPropertyNamesToColumnNames(modelName, modelData);
        table.set(id, tableData);
        return this.getService(
          ModelDefinitionUtils
        ).convertColumnNamesToPropertyNames(modelName, tableData);
      }
      /**
       * Replace or create.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      // eslint-disable-next-line no-unused-vars
      async replaceOrCreate(modelName, modelData, filter = void 0) {
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        let idValue = modelData[pkPropName];
        if (idValue == null || idValue === "" || idValue === 0) {
          idValue = this._genNextIdValue(modelName, pkPropName);
        }
        const table = this._getTableOrCreate(modelName);
        modelData = cloneDeep(modelData);
        modelData[pkPropName] = idValue;
        const tableData = this.getService(
          ModelDefinitionUtils
        ).convertPropertyNamesToColumnNames(modelName, modelData);
        table.set(idValue, tableData);
        return this.getService(
          ModelDefinitionUtils
        ).convertColumnNamesToPropertyNames(modelName, tableData);
      }
      /**
       * Patch.
       *
       * @param {string} modelName
       * @param {object} modelData
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      async patch(modelName, modelData, where = void 0) {
        const table = this._getTableOrCreate(modelName);
        const tableItems = Array.from(table.values());
        if (!tableItems.length) return 0;
        let modelItems = tableItems.map(
          (tableItem) => this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
            modelName,
            tableItem
          )
        );
        if (where && typeof where === "object")
          modelItems = this.getService(WhereClauseTool).filter(modelItems, where);
        const size = modelItems.length;
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        modelData = cloneDeep(modelData);
        delete modelData[pkPropName];
        modelItems.forEach((existingModelData) => {
          const mergedModelData = Object.assign({}, existingModelData, modelData);
          const mergedTableData = this.getService(
            ModelDefinitionUtils
          ).convertPropertyNamesToColumnNames(modelName, mergedModelData);
          const idValue = existingModelData[pkPropName];
          table.set(idValue, mergedTableData);
        });
        return size;
      }
      /**
       * Patch by id.
       *
       * @param {string} modelName
       * @param {string|number} id
       * @param {object} modelData
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      // eslint-disable-next-line no-unused-vars
      async patchById(modelName, id, modelData, filter = void 0) {
        const table = this._getTableOrCreate(modelName);
        const existingTableData = table.get(id);
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        if (existingTableData == null)
          throw new InvalidArgumentError2(
            "The value %v of the primary key %v does not exist in the model %v.",
            id,
            pkPropName,
            modelName
          );
        modelData = cloneDeep(modelData);
        delete modelData[pkPropName];
        const existingModelData = this.getService(
          ModelDefinitionUtils
        ).convertColumnNamesToPropertyNames(modelName, existingTableData);
        const mergedModelData = Object.assign({}, existingModelData, modelData);
        const mergedTableData = this.getService(
          ModelDefinitionUtils
        ).convertPropertyNamesToColumnNames(modelName, mergedModelData);
        table.set(id, mergedTableData);
        return this.getService(
          ModelDefinitionUtils
        ).convertColumnNamesToPropertyNames(modelName, mergedTableData);
      }
      /**
       * Find.
       *
       * @param {string} modelName
       * @param {object|undefined} filter
       * @returns {Promise<object[]>}
       */
      async find(modelName, filter = void 0) {
        const table = this._getTableOrCreate(modelName);
        const tableItems = Array.from(table.values());
        let modelItems = tableItems.map(
          (tableItem) => this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
            modelName,
            tableItem
          )
        );
        if (filter && typeof filter === "object") {
          if (filter.where)
            modelItems = this.getService(WhereClauseTool).filter(
              modelItems,
              filter.where
            );
          if (filter.skip || filter.limit)
            modelItems = this.getService(SliceClauseTool).slice(
              modelItems,
              filter.skip,
              filter.limit
            );
          if (filter.order)
            this.getService(OrderClauseTool).sort(modelItems, filter.order);
        }
        return modelItems;
      }
      /**
       * Find by id.
       *
       * @param {string} modelName
       * @param {string|number} id
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      // eslint-disable-next-line no-unused-vars
      async findById(modelName, id, filter = void 0) {
        const table = this._getTableOrCreate(modelName);
        const tableData = table.get(id);
        const pkPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        if (!tableData)
          throw new InvalidArgumentError2(
            "The value %v of the primary key %v does not exist in the model %v.",
            id,
            pkPropName,
            modelName
          );
        return this.getService(
          ModelDefinitionUtils
        ).convertColumnNamesToPropertyNames(modelName, tableData);
      }
      /**
       * Delete.
       *
       * @param {string} modelName
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      async delete(modelName, where = void 0) {
        const table = this._getTableOrCreate(modelName);
        const tableItems = Array.from(table.values());
        if (!tableItems.length) return 0;
        let modelItems = tableItems.map(
          (tableItem) => this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
            modelName,
            tableItem
          )
        );
        if (where && typeof where === "object")
          modelItems = this.getService(WhereClauseTool).filter(modelItems, where);
        const size = modelItems.length;
        const idPropName = this.getService(ModelDefinitionUtils).getPrimaryKeyAsPropertyName(
          modelName
        );
        modelItems.forEach((modelData) => {
          const idValue = modelData[idPropName];
          table.delete(idValue);
        });
        return size;
      }
      /**
       * Delete by id.
       *
       * @param {string} modelName
       * @param {string|number} id
       * @returns {Promise<boolean>}
       */
      async deleteById(modelName, id) {
        const table = this._getTableOrCreate(modelName);
        const isExists = table.has(id);
        table.delete(id);
        return isExists;
      }
      /**
       * Exists.
       *
       * @param {string} modelName
       * @param {string|number} id
       * @returns {Promise<boolean>}
       */
      async exists(modelName, id) {
        const table = this._getTableOrCreate(modelName);
        return table.has(id);
      }
      /**
       * Count.
       *
       * @param {string} modelName
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      async count(modelName, where = void 0) {
        const table = this._getTableOrCreate(modelName);
        const tableItems = Array.from(table.values());
        let modelItems = tableItems.map(
          (tableItem) => this.getService(ModelDefinitionUtils).convertColumnNamesToPropertyNames(
            modelName,
            tableItem
          )
        );
        if (where && typeof where === "object")
          modelItems = this.getService(WhereClauseTool).filter(modelItems, where);
        return modelItems.length;
      }
    };
    __name(_MemoryAdapter, "MemoryAdapter");
    MemoryAdapter = _MemoryAdapter;
  }
});

// import("./builtin/**/*-adapter.js") in src/adapter/adapter-loader.js
var globImport_builtin_adapter_js;
var init_ = __esm({
  'import("./builtin/**/*-adapter.js") in src/adapter/adapter-loader.js'() {
    globImport_builtin_adapter_js = __glob({
      "./builtin/memory-adapter.js": () => Promise.resolve().then(() => (init_memory_adapter(), memory_adapter_exports))
    });
  }
});

// src/adapter/adapter-loader.js
function findAdapterCtorInModule(module2) {
  let adapterCtor;
  if (!module2 || typeof module2 !== "object" || Array.isArray(module2)) return;
  for (const ctor of Object.values(module2)) {
    if (typeof ctor === "function" && ctor.prototype instanceof Adapter) {
      adapterCtor = ctor;
      break;
    }
  }
  return adapterCtor;
}
var _AdapterLoader, AdapterLoader;
var init_adapter_loader = __esm({
  "src/adapter/adapter-loader.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_errors2();
    init_();
    _AdapterLoader = class _AdapterLoader extends Service {
      /**
       * Load by name.
       *
       * @param {string} adapterName
       * @param {object|undefined} settings
       * @returns {Promise<Adapter>}
       */
      async loadByName(adapterName, settings = void 0) {
        if (!adapterName || typeof adapterName !== "string")
          throw new InvalidArgumentError2(
            "The adapter name should be a non-empty String, but %v given.",
            adapterName
          );
        let adapterCtor;
        try {
          const module2 = await globImport_builtin_adapter_js(`./builtin/${adapterName}-adapter.js`);
          adapterCtor = findAdapterCtorInModule(module2);
        } catch (e) {
        }
        if (!adapterCtor)
          try {
            const module2 = await Promise.resolve().then(() => __toESM(require(`@e22m4u/js-repository-${adapterName}-adapter`)));
            adapterCtor = findAdapterCtorInModule(module2);
          } catch (e) {
          }
        if (!adapterCtor)
          throw new InvalidArgumentError2(
            "The adapter %v is not found.",
            adapterName
          );
        return new adapterCtor(this.container, settings);
      }
    };
    __name(_AdapterLoader, "AdapterLoader");
    AdapterLoader = _AdapterLoader;
    __name(findAdapterCtorInModule, "findAdapterCtorInModule");
  }
});

// src/adapter/adapter-registry.js
var _AdapterRegistry, AdapterRegistry;
var init_adapter_registry = __esm({
  "src/adapter/adapter-registry.js"() {
    "use strict";
    init_adapter();
    init_src2();
    init_adapter_loader();
    init_definition();
    _AdapterRegistry = class _AdapterRegistry extends Service {
      /**
       * Adapters.
       *
       * @type {object}
       */
      _adapters = {};
      /**
       * Get adapter.
       *
       * @param {string} datasourceName
       * @returns {Promise<Adapter>}
       */
      async getAdapter(datasourceName) {
        let adapter = this._adapters[datasourceName];
        if (adapter) return adapter;
        const datasource = this.getService(DefinitionRegistry).getDatasource(datasourceName);
        const adapterName = datasource.adapter;
        adapter = await this.getService(AdapterLoader).loadByName(
          adapterName,
          datasource
        );
        this._adapters[datasourceName] = adapter;
        return adapter;
      }
    };
    __name(_AdapterRegistry, "AdapterRegistry");
    AdapterRegistry = _AdapterRegistry;
  }
});

// src/adapter/index.js
var init_adapter2 = __esm({
  "src/adapter/index.js"() {
    "use strict";
    init_adapter();
    init_adapter_loader();
    init_adapter_registry();
  }
});

// src/repository/repository.js
var _Repository, Repository;
var init_repository = __esm({
  "src/repository/repository.js"() {
    "use strict";
    init_src2();
    init_adapter2();
    init_adapter2();
    init_errors2();
    init_definition();
    _Repository = class _Repository extends Service {
      /**
       * Model name.
       *
       * @type {string}
       */
      _modelName;
      /**
       * Model name.
       *
       * @returns {string}
       */
      get modelName() {
        return this._modelName;
      }
      /**
       * Datasource name.
       *
       * @type {string}
       */
      _datasourceName;
      /**
       * Datasource name.
       *
       * @returns {string}
       */
      get datasourceName() {
        return this._datasourceName;
      }
      /**
       * Constructor.
       *
       * @typedef {import('@e22m4u/js-service').ServiceContainer} ServiceContainer
       * @param {ServiceContainer} container
       * @param {string} modelName
       */
      constructor(container, modelName) {
        super(container);
        this._modelName = modelName;
        const modelDef = this.getService(DefinitionRegistry).getModel(modelName);
        const datasourceName = modelDef.datasource;
        if (!datasourceName)
          throw new InvalidArgumentError2(
            "The model %v does not have a specified datasource.",
            modelName
          );
        this._datasourceName = datasourceName;
      }
      /**
       * Get adapter.
       *
       * @returns {Adapter}
       */
      async getAdapter() {
        return this.getService(AdapterRegistry).getAdapter(this.datasourceName);
      }
      /**
       * Create.
       *
       * @param {object} data
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      async create(data, filter = void 0) {
        const adapter = await this.getAdapter();
        return adapter.create(this.modelName, data, filter);
      }
      /**
       * Replace by id.
       *
       * @param {number|string} id
       * @param {object} data
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      async replaceById(id, data, filter = void 0) {
        const adapter = await this.getAdapter();
        return adapter.replaceById(this.modelName, id, data, filter);
      }
      /**
       * Replace or create.
       *
       * @param {object} data
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      async replaceOrCreate(data, filter = void 0) {
        const adapter = await this.getAdapter();
        return adapter.replaceOrCreate(this.modelName, data, filter);
      }
      /**
       * Patch.
       *
       * @param {object} data
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      async patch(data, where = void 0) {
        const adapter = await this.getAdapter();
        return adapter.patch(this.modelName, data, where);
      }
      /**
       * Patch by id.
       *
       * @param {number|string} id
       * @param {object} data
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      async patchById(id, data, filter = void 0) {
        const adapter = await this.getAdapter();
        return adapter.patchById(this.modelName, id, data, filter);
      }
      /**
       * Find.
       *
       * @param {object|undefined} filter
       * @returns {Promise<object[]>}
       */
      async find(filter = void 0) {
        const adapter = await this.getAdapter();
        return adapter.find(this.modelName, filter);
      }
      /**
       * Find one.
       *
       * @param {object|undefined} filter
       * @returns {Promise<object|undefined>}
       */
      async findOne(filter = void 0) {
        const adapter = await this.getAdapter();
        filter = filter != null ? filter : {};
        filter.limit = 1;
        const result = await adapter.find(this.modelName, filter);
        return result.length ? result[0] : void 0;
      }
      /**
       * Find by id.
       *
       * @param {number|string} id
       * @param {object|undefined} filter
       * @returns {Promise<object>}
       */
      async findById(id, filter = void 0) {
        const adapter = await this.getAdapter();
        return adapter.findById(this.modelName, id, filter);
      }
      /**
       * Delete.
       *
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      async delete(where = void 0) {
        const adapter = await this.getAdapter();
        return adapter.delete(this.modelName, where);
      }
      /**
       * Delete by id.
       *
       * @param {number|string} id
       * @returns {Promise<boolean>}
       */
      async deleteById(id) {
        const adapter = await this.getAdapter();
        return adapter.deleteById(this.modelName, id);
      }
      /**
       * Exists.
       *
       * @param {number|string} id
       * @returns {Promise<boolean>}
       */
      async exists(id) {
        const adapter = await this.getAdapter();
        return adapter.exists(this.modelName, id);
      }
      /**
       * Count.
       *
       * @param {object|undefined} where
       * @returns {Promise<number>}
       */
      async count(where = void 0) {
        const adapter = await this.getAdapter();
        return adapter.count(this.modelName, where);
      }
    };
    __name(_Repository, "Repository");
    Repository = _Repository;
  }
});

// src/repository/repository-registry.js
var _RepositoryRegistry, RepositoryRegistry;
var init_repository_registry = __esm({
  "src/repository/repository-registry.js"() {
    "use strict";
    init_src2();
    init_repository();
    init_errors2();
    _RepositoryRegistry = class _RepositoryRegistry extends Service {
      /**
       * Repositories.
       *
       * @type {object}
       */
      _repositories = {};
      /**
       * Repository ctor.
       *
       * @type {typeof Repository}
       * @private
       */
      _repositoryCtor = Repository;
      /**
       * Set repository ctor.
       *
       * @param {typeof Repository} ctor
       */
      setRepositoryCtor(ctor) {
        if (!ctor || typeof ctor !== "function" || !(ctor.prototype instanceof Repository)) {
          throw new InvalidArgumentError2(
            "The first argument of RepositoryRegistry.setRepositoryCtor must inherit from Repository class, but %v given.",
            ctor
          );
        }
        this._repositoryCtor = ctor;
      }
      /**
       * Get repository.
       *
       * @param {string} modelName
       * @returns {Repository}
       */
      getRepository(modelName) {
        let repository = this._repositories[modelName];
        if (repository) return repository;
        repository = new this._repositoryCtor(this.container, modelName);
        this._repositories[modelName] = repository;
        return repository;
      }
    };
    __name(_RepositoryRegistry, "RepositoryRegistry");
    RepositoryRegistry = _RepositoryRegistry;
  }
});

// src/repository/index.js
var init_repository2 = __esm({
  "src/repository/index.js"() {
    "use strict";
    init_repository();
    init_repository_registry();
  }
});

// src/index.js
var src_exports = {};
__export(src_exports, {
  Adapter: () => Adapter,
  AdapterLoader: () => AdapterLoader,
  AdapterRegistry: () => AdapterRegistry,
  BelongsToResolver: () => BelongsToResolver,
  DEFAULT_PRIMARY_KEY_PROPERTY_NAME: () => DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
  DataType: () => DataType,
  DatasourceDefinitionValidator: () => DatasourceDefinitionValidator,
  DecoratorTargetType: () => DecoratorTargetType,
  DefinitionRegistry: () => DefinitionRegistry,
  EmptyValuesDefiner: () => EmptyValuesDefiner,
  FieldsClauseTool: () => FieldsClauseTool,
  HasManyResolver: () => HasManyResolver,
  HasOneResolver: () => HasOneResolver,
  IncludeClauseTool: () => IncludeClauseTool,
  InvalidArgumentError: () => InvalidArgumentError2,
  InvalidOperatorValueError: () => InvalidOperatorValueError,
  ModelDataSanitizer: () => ModelDataSanitizer,
  ModelDataTransformer: () => ModelDataTransformer,
  ModelDataValidator: () => ModelDataValidator,
  ModelDefinitionUtils: () => ModelDefinitionUtils,
  ModelDefinitionValidator: () => ModelDefinitionValidator,
  NotImplementedError: () => NotImplementedError,
  OperatorClauseTool: () => OperatorClauseTool,
  OrderClauseTool: () => OrderClauseTool,
  PrimaryKeysDefinitionValidator: () => PrimaryKeysDefinitionValidator,
  PropertiesDefinitionValidator: () => PropertiesDefinitionValidator,
  PropertyTransformerRegistry: () => PropertyTransformerRegistry,
  PropertyUniqueness: () => PropertyUniqueness,
  PropertyUniquenessValidator: () => PropertyUniquenessValidator,
  PropertyValidatorRegistry: () => PropertyValidatorRegistry,
  ReferencesManyResolver: () => ReferencesManyResolver,
  RelationType: () => RelationType,
  RelationsDefinitionValidator: () => RelationsDefinitionValidator,
  Repository: () => Repository,
  RepositoryRegistry: () => RepositoryRegistry,
  Schema: () => Schema,
  SliceClauseTool: () => SliceClauseTool,
  WhereClauseTool: () => WhereClauseTool,
  capitalize: () => capitalize,
  cloneDeep: () => cloneDeep,
  excludeObjectKeys: () => excludeObjectKeys,
  getCtorName: () => getCtorName,
  getDecoratorTargetType: () => getDecoratorTargetType,
  getValueByPath: () => getValueByPath,
  isCtor: () => isCtor,
  isDeepEqual: () => isDeepEqual,
  isPromise: () => isPromise,
  isPureObject: () => isPureObject,
  selectObjectKeys: () => selectObjectKeys,
  singularize: () => singularize,
  stringToRegexp: () => stringToRegexp,
  transformPromise: () => transformPromise
});
module.exports = __toCommonJS(src_exports);

// src/schema.js
init_src2();
init_repository2();
init_definition();
init_repository2();
var _Schema = class _Schema extends Service {
  /**
   * Define datasource.
   *
   * @param {object} datasourceDef
   * @returns {this}
   */
  defineDatasource(datasourceDef) {
    this.getService(DefinitionRegistry).addDatasource(datasourceDef);
    return this;
  }
  /**
   * Define model.
   *
   * @param {object} modelDef
   * @returns {this}
   */
  defineModel(modelDef) {
    this.getService(DefinitionRegistry).addModel(modelDef);
    return this;
  }
  /**
   * Get repository.
   *
   * @param {string} modelName
   * @returns {Repository}
   */
  getRepository(modelName) {
    return this.getService(RepositoryRegistry).getRepository(modelName);
  }
};
__name(_Schema, "Schema");
var Schema = _Schema;

// src/index.js
init_utils2();
init_errors2();
init_filter();
init_adapter2();
init_relations2();
init_definition();
init_repository2();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Adapter,
  AdapterLoader,
  AdapterRegistry,
  BelongsToResolver,
  DEFAULT_PRIMARY_KEY_PROPERTY_NAME,
  DataType,
  DatasourceDefinitionValidator,
  DecoratorTargetType,
  DefinitionRegistry,
  EmptyValuesDefiner,
  FieldsClauseTool,
  HasManyResolver,
  HasOneResolver,
  IncludeClauseTool,
  InvalidArgumentError,
  InvalidOperatorValueError,
  ModelDataSanitizer,
  ModelDataTransformer,
  ModelDataValidator,
  ModelDefinitionUtils,
  ModelDefinitionValidator,
  NotImplementedError,
  OperatorClauseTool,
  OrderClauseTool,
  PrimaryKeysDefinitionValidator,
  PropertiesDefinitionValidator,
  PropertyTransformerRegistry,
  PropertyUniqueness,
  PropertyUniquenessValidator,
  PropertyValidatorRegistry,
  ReferencesManyResolver,
  RelationType,
  RelationsDefinitionValidator,
  Repository,
  RepositoryRegistry,
  Schema,
  SliceClauseTool,
  WhereClauseTool,
  capitalize,
  cloneDeep,
  excludeObjectKeys,
  getCtorName,
  getDecoratorTargetType,
  getValueByPath,
  isCtor,
  isDeepEqual,
  isPromise,
  isPureObject,
  selectObjectKeys,
  singularize,
  stringToRegexp,
  transformPromise
});
