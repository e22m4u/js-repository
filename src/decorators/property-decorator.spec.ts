import {expect} from 'chai';
import {DataType} from '../definition/index.js';
import {property} from './property-decorator.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

describe('@property', function () {
  it('uses the given DataType as the property definition', function () {
    class Target {
      @property(DataType.STRING)
      prop;
    }
    const res =
      Reflect.getOwnMetadata(ModelDecoratorKeys.PROPERTY_DEFS, Target);
    expect(res).to.be.eql({prop: DataType.STRING});
  });

  it('uses the given object as the property definition', function () {
    class Target {
      @property({type: DataType.STRING})
      prop;
    }
    const res =
      Reflect.getOwnMetadata(ModelDecoratorKeys.PROPERTY_DEFS, Target);
    expect(res).to.be.eql({prop: {type: DataType.STRING}});
  });

  it('allows to set multiple properties to the same model', function () {
    class Target {
      @property(DataType.STRING)
      prop1;
      @property(DataType.NUMBER)
      prop2;
    }
    const res =
      Reflect.getOwnMetadata(ModelDecoratorKeys.PROPERTY_DEFS, Target);
    expect(res).to.be.eql({
      prop1: DataType.STRING,
      prop2: DataType.NUMBER,
    });
  });


});
