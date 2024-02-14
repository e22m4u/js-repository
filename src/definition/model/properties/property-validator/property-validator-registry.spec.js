import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {PropertyValidatorRegistry} from './property-validator-registry.js';

describe('PropertyValidatorRegistry', function () {
  describe('addValidator', function () {
    it('adds a given validator with the name', function () {
      const s = new PropertyValidatorRegistry();
      const myValidator = () => {};
      const res = s.addValidator('myValidator', myValidator);
      expect(res).to.be.eq(s);
      expect(s['_validators']['myValidator']).to.be.eq(myValidator);
    });

    it('requires the given name to be a non-empty string', function () {
      const s = new PropertyValidatorRegistry();
      const throwable = v => () => s.addValidator(v, () => undefined);
      const error = v =>
        format(
          'A name of the property validator must ' +
            'be a non-empty String, but %s given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable('str')();
    });

    it('throws an error if the given name already exists', function () {
      const s = new PropertyValidatorRegistry();
      s.addValidator('test', () => undefined);
      const throwable = () => s.addValidator('test', () => undefined);
      expect(throwable).to.throw(
        'The property validator "test" is already defined.',
      );
    });

    it('requires the given validator to be a function', function () {
      const s = new PropertyValidatorRegistry();
      const throwable = v => () => s.addValidator('test', v);
      const error = v =>
        format(
          'The property validator "test" must be a Function, but %s given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      throwable(() => undefined)();
    });
  });

  describe('hasValidator', function () {
    it('returns false for a not existing name', function () {
      const s = new PropertyValidatorRegistry();
      expect(s.hasValidator('str')).to.be.false;
      expect(s.hasValidator('')).to.be.false;
      expect(s.hasValidator(10)).to.be.false;
      expect(s.hasValidator(0)).to.be.false;
      expect(s.hasValidator(true)).to.be.false;
      expect(s.hasValidator(false)).to.be.false;
      expect(s.hasValidator(null)).to.be.false;
      expect(s.hasValidator(undefined)).to.be.false;
      expect(s.hasValidator({})).to.be.false;
      expect(s.hasValidator([])).to.be.false;
      expect(s.hasValidator(() => undefined)).to.be.false;
    });

    it('returns true for an existing name', function () {
      const s = new PropertyValidatorRegistry();
      expect(s.hasValidator('test')).to.be.false;
      s.addValidator('test', () => undefined);
      expect(s.hasValidator('test')).to.be.true;
    });
  });

  describe('getValidator', function () {
    it('returns validator by its name', function () {
      const s = new PropertyValidatorRegistry();
      const validator1 = () => undefined;
      const validator2 = () => undefined;
      s.addValidator('foo', validator1);
      s.addValidator('bar', validator2);
      const res1 = s.getValidator('foo');
      const res2 = s.getValidator('bar');
      expect(res1).to.be.eq(validator1);
      expect(res2).to.be.eq(validator2);
    });

    it('throws an error for a not existed name', function () {
      const s = new PropertyValidatorRegistry();
      const throwable = v => () => s.getValidator(v);
      const error = v => format('The property validator %s is not defined.', v);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
    });
  });
});
