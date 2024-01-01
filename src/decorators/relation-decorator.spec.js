import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {relation} from './relation-decorator.js';
import {RelationType} from '../definition/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

describe('@relation', function () {
  it('requires the first argument to be an object', function () {
    class Target {
      prop;
    }
    const throwable = v => () => relation(v)(Target.prototype, 'prop');
    const error = v =>
      format(
        'The first argument of the @relation decorator must be ' +
          'the relation definition object, but %s given.',
        v,
      );
    expect(throwable('')).to.throw(error('""'));
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable({})();
  });

  it('sets the "type" option', function () {
    class Target {
      prop;
    }
    relation({type: RelationType.HAS_ONE})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {type: RelationType.HAS_ONE}});
  });

  describe('the "model" option', function () {
    it('sets a model name', function () {
      class Target {
        prop;
      }
      relation({model: 'model'})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'model'}});
    });

    it('converts the model class to its name', function () {
      class Target {
        prop;
      }
      relation({model: Target})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'Target'}});
    });

    it('resolves the factory value of a string', function () {
      class Target {
        prop;
      }
      relation({model: () => 'model'})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'model'}});
    });

    it('resolves the factory value of a model class', function () {
      class Target {
        prop;
      }
      relation({model: () => Target})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {model: 'Target'}});
    });
  });

  it('sets the "foreignKey" option', function () {
    class Target {
      prop;
    }
    relation({foreignKey: 'foreignKey'})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {foreignKey: 'foreignKey'}});
  });

  describe('the "polymorphic" option', function () {
    it('sets a boolean value', function () {
      class Target {
        prop;
      }
      relation({polymorphic: true})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {polymorphic: true}});
    });

    it('sets a string value', function () {
      class Target {
        prop;
      }
      relation({polymorphic: 'polymorphic'})(Target.prototype, 'prop');
      const res = Reflect.getOwnMetadata(
        ModelDecoratorKeys.RELATION_DEFS,
        Target,
      );
      expect(res).to.be.eql({prop: {polymorphic: 'polymorphic'}});
    });
  });

  it('sets the "discriminator" option', function () {
    class Target {
      prop;
    }
    relation({discriminator: 'discriminator'})(Target.prototype, 'prop');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      Target,
    );
    expect(res).to.be.eql({prop: {discriminator: 'discriminator'}});
  });

  it('allows to set multiple relations to the same model', function () {
    class Target {
      prop1;
      prop2;
    }
    relation({type: RelationType.HAS_ONE})(Target.prototype, 'prop1');
    relation({type: RelationType.HAS_MANY})(Target.prototype, 'prop2');
    const res = Reflect.getOwnMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      Target,
    );
    expect(res).to.be.eql({
      prop1: {type: RelationType.HAS_ONE},
      prop2: {type: RelationType.HAS_MANY},
    });
  });

  describe('decorator target', function () {
    const error =
      'The @relation decorator is only supported for an instance property.';
    const throwable =
      (...args) =>
      () =>
        relation({})(...args);

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
      relation({})(Target.prototype, 'prop');
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

  it('requires the relations definition to be an object', function () {
    class Target {
      prop;
    }
    const throwable = v => () => {
      Reflect.defineMetadata(ModelDecoratorKeys.RELATION_DEFS, v, Target);
      relation({type: RelationType.HAS_ONE})(Target.prototype, 'prop');
    };
    const error = v =>
      format(
        'The relations definition metadata of the model ' +
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
