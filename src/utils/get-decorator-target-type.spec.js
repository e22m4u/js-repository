import {expect} from 'chai';
import {getDecoratorTargetType} from './get-decorator-target-type.js';
import {DecoratorTargetType as DTT} from './get-decorator-target-type.js';

describe('getDecoratorTargetType', function () {
  const validate = function (value) {
    return function (target, propertyKey, descriptorOrIndex) {
      const type = getDecoratorTargetType(
        target,
        propertyKey,
        descriptorOrIndex,
      );
      expect(value).to.be.eq(type);
    };
  };

  it('returns CONSTRUCTOR', function () {
    class Target {}
    validate(DTT.CONSTRUCTOR)(Target);
  });

  it('returns INSTANCE', function () {
    class Target {}
    validate(DTT.INSTANCE)(Target.prototype);
  });

  it('returns STATIC_METHOD', function () {
    class Target {
      static method() {}
    }
    const desc = Object.getOwnPropertyDescriptor(Target, 'method');
    validate(DTT.STATIC_METHOD)(Target, 'method', desc);
  });

  it('returns INSTANCE_METHOD', function () {
    class Target {
      method() {}
    }
    const desc = Object.getOwnPropertyDescriptor(Target.prototype, 'method');
    validate(DTT.INSTANCE_METHOD)(Target.prototype, 'method', desc);
  });

  it('returns STATIC_PROPERTY', function () {
    class Target {
      static prop;
    }
    validate(DTT.STATIC_PROPERTY)(Target, 'prop');
  });

  it('returns INSTANCE_PROPERTY', function () {
    class Target {
      prop;
    }
    validate(DTT.INSTANCE_PROPERTY)(Target.prototype, 'prop');
  });

  it('returns CONSTRUCTOR_PARAMETER', function () {
    class Target {
      // eslint-disable-next-line no-unused-vars
      constructor(param) {}
    }
    validate(DTT.CONSTRUCTOR_PARAMETER)(Target, undefined, 0);
  });

  it('returns STATIC_METHOD_PARAMETER', function () {
    class Target {
      // eslint-disable-next-line no-unused-vars
      static method(param) {}
    }
    validate(DTT.STATIC_METHOD_PARAMETER)(Target, 'method', 0);
  });

  it('returns INSTANCE_METHOD_PARAMETER', function () {
    class Target {
      // eslint-disable-next-line no-unused-vars
      method(param) {}
    }
    validate(DTT.INSTANCE_METHOD_PARAMETER)(Target.prototype, 'method', 0);
  });
});
