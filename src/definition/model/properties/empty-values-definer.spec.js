import {expect} from 'chai';
import {DataType} from './data-type.js';
import {format} from '@e22m4u/js-format';
import {Schema} from '../../../schema.js';
import {EmptyValuesDefiner} from './empty-values-definer.js';

const getEmptyValues = (definer, dataType) => {
  return definer['_emptyValuesMap'].get(dataType);
};

describe('EmptyValuesDefiner', function () {
  describe('_emptyValuesMap', function () {
    it('has default values', function () {
      const schema = new Schema();
      const S = schema.getService(EmptyValuesDefiner);
      expect(Array.from(S['_emptyValuesMap'])).to.be.eql([
        [DataType.ANY, [undefined, null]],
        [DataType.STRING, [undefined, null, '']],
        [DataType.NUMBER, [undefined, null, 0]],
        [DataType.BOOLEAN, [undefined, null]],
        [DataType.ARRAY, [undefined, null, []]],
        [DataType.OBJECT, [undefined, null, {}]],
      ]);
    });
  });

  describe('setEmptyValuesOf', function () {
    it('requires the parameter "dataType" to be a DataType enum', function () {
      const schema = new Schema();
      const S = schema.getService(EmptyValuesDefiner);
      const throwable = v => () => S.setEmptyValuesOf(v, []);
      const error = v =>
        format(
          'The argument "dataType" of the EmptyValuesDefiner.setEmptyValuesOf ' +
            'must be one of data types: %l, but %s given.',
          Object.values(DataType),
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      throwable(DataType.ANY)();
    });

    it('requires the parameter "emptyValues" to be an Array', function () {
      const schema = new Schema();
      const S = schema.getService(EmptyValuesDefiner);
      const throwable = v => () => S.setEmptyValuesOf(DataType.ANY, v);
      const error = v =>
        format(
          'The argument "emptyValues" of the EmptyValuesDefiner.setEmptyValuesOf ' +
            'must be an Array, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      throwable([])();
      throwable([1, 2, 3])();
    });

    it('overrides default values of the given data type', function () {
      const schema = new Schema();
      const S = schema.getService(EmptyValuesDefiner);
      expect(getEmptyValues(S, DataType.ANY)).eql([undefined, null]);
      S.setEmptyValuesOf(DataType.ANY, [1, 2, 3]);
      expect(getEmptyValues(S, DataType.ANY)).eql([1, 2, 3]);
    });
  });

  describe('isEmpty', function () {
    it('returns true if the given value exists in the given type', function () {
      const schema = new Schema();
      const S = schema.getService(EmptyValuesDefiner);
      S.setEmptyValuesOf(DataType.ANY, []);
      expect(S.isEmpty(DataType.ANY, 'foo')).to.be.false;
      S.setEmptyValuesOf(DataType.ANY, ['bar']);
      expect(S.isEmpty(DataType.ANY, 'foo')).to.be.false;
      S.setEmptyValuesOf(DataType.ANY, ['bar', 'foo']);
      expect(S.isEmpty(DataType.ANY, 'foo')).to.be.true;
    });
  });
});
