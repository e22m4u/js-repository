import 'reflect-metadata';
import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {DataType} from '../definition/index.js';
import {property} from './property-decorator.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

describe('@property', function () {
  it('requires the first argument to be a non-empty string or an object', function () {
    class Target {
      prop;
    }
    const throwable = v => () => property(v)(Target.prototype, 'prop');
    const error = v =>
      format(
        'The first argument of the @property decorator must be a name' +
          'of the data type or the property definition object, but %s given.',
        v,
      );
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
    throwable({})();
  });

  it('sets the given DataType as the property definition', function () {
    class Target {
      prop;
    }
    property(DataType.STRING)(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: DataType.STRING});
  });

  it('sets the "type" option', function () {
    class Target {
      prop;
    }
    property({type: DataType.STRING})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {type: DataType.STRING}});
  });

  it('sets the "itemType" option', function () {
    class Target {
      prop;
    }
    property({itemType: DataType.STRING})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {itemType: DataType.STRING}});
  });

  describe('the "model" option', function () {
    it('sets a model name', function () {
      class Target {
        prop;
      }
      property({model: 'model'})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.PROPERTY_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'model'}});
    });

    it('converts the model class to its name', function () {
      class Target {
        prop;
      }
      property({model: Target})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.PROPERTY_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'Target'}});
    });

    it('resolves the factory value of a string', function () {
      class Target {
        prop;
      }
      property({model: () => 'model'})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.PROPERTY_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'model'}});
    });

    it('resolves the factory value of a model class', function () {
      class Target {
        prop;
      }
      property({model: () => Target})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.PROPERTY_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'Target'}});
    });
  });

  it('sets the "primaryKey" option', function () {
    class Target {
      prop;
    }
    property({primaryKey: 'primaryKey'})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {primaryKey: 'primaryKey'}});
  });

  it('sets the "columnName" option', function () {
    class Target {
      prop;
    }
    property({columnName: 'columnName'})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {columnName: 'columnName'}});
  });

  it('sets the "columnType" option', function () {
    class Target {
      prop;
    }
    property({columnType: 'columnType'})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {columnType: 'columnType'}});
  });

  it('sets the "required" option', function () {
    class Target {
      prop;
    }
    property({required: true})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {required: true}});
  });

  it('sets the "default" option', function () {
    class Target {
      prop;
    }
    property({default: 'default'})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {default: 'default'}});
  });

  it('allows to set multiple properties to the same model', function () {
    class Target {
      prop1;
      prop2;
    }
    property(DataType.STRING)(Target.prototype, 'prop1');
    property(DataType.NUMBER)(Target.prototype, 'prop2');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      Target,
    );
    expect(res).to.be.eql({
      prop1: DataType.STRING,
      prop2: DataType.NUMBER,
    });
  });

  describe('decorator target', function () {
    const error =
      'The @property decorator is only supported for an instance property.';
    const throwable =
      (...args) =>
      () =>
        property(DataType.STRING)(...args);

    it('throws an error if the target is a constructor', function () {
      class Target {}
      expect(throwable(Target)).to.throw(error);
    });

    it('throws an error if the target is an instance', function () {
      class Target {}
      expect(throwable(Target.prototype)).to.throw(error);
    });

    it('throws an error if the target is a static method', function () {
      class Target {
        static method() {}
      }
      const desc = Object.getOwnPropertyDescriptor(Target, 'method');
      expect(throwable(Target, 'method', desc)).to.throw(error);
    });

    it('throws an error if the target is an instance method', function () {
      class Target {
        method() {}
      }
      const desc = Object.getOwnPropertyDescriptor(Target.prototype, 'method');
      expect(throwable(Target.prototype, 'method', desc)).to.throw(error);
    });

    it('throws an error if the target is a static property', function () {
      class Target {
        static prop;
      }
      expect(throwable(Target, 'prop')).to.throw(error);
    });

    it('does not throw an error if the target is an instance property', function () {
      class Target {
        prop;
      }
      throwable(Target.prototype, 'prop')();
    });

    it('throws an error if the target is a constructor parameter', function () {
      class Target {}
      expect(throwable(Target, undefined, 0)).to.throw(error);
    });

    it('throws an error if the target is a static method parameter', function () {
      class Target {
        static method() {}
      }
      expect(throwable(Target, 'method', 0)).to.throw(error);
    });

    it('throws an error if the target is an instance method parameter', function () {
      class Target {
        method() {}
      }
      expect(throwable(Target.prototype, 'method', 0)).to.throw(error);
    });
  });

  it('requires the properties definition to be an object', function () {
    class Target {
      prop;
    }
    const throwable = v => () => {
      Reflect.defineMetadata(ModelDecoratorKeys.PROPERTY_DEFS, v, Target);
      property(DataType.STRING)(Target.prototype, 'prop');
    };
    const error = v =>
      format(
        'The properties definition metadata of the model ' +
          'class Target must be an Object, but %s given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    throwable({})();
    throwable(undefined)();
    throwable(null)();
  });
});
