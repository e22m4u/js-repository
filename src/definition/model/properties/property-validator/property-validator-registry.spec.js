import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {regexpValidator} from './builtin/index.js';
import {maxLengthValidator} from './builtin/index.js';
import {minLengthValidator} from './builtin/index.js';
import {PropertyValidatorRegistry} from './property-validator-registry.js';

describe('PropertyValidatorRegistry', function () {
  it('has builtin validators', function () {
    const S = new PropertyValidatorRegistry();
    expect(S['_validators']).to.be.eql({
      maxLength: maxLengthValidator,
      minLength: minLengthValidator,
      regexp: regexpValidator,
    });
  });

  describe('addValidator', function () {
    it('adds a given validator with the name', function () {
      const S = new PropertyValidatorRegistry();
      const myValidator = () => undefined;
      const res = S.addValidator('myValidator', myValidator);
      expect(res).to.be.eq(S);
      expect(S['_validators']['myValidator']).to.be.eq(myValidator);
    });

    it('requires the given name to be a non-empty string', function () {
      const S = new PropertyValidatorRegistry();
      const throwable = v => () => S.addValidator(v, () => undefined);
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
      const S = new PropertyValidatorRegistry();
      S.addValidator('test', () => undefined);
      const throwable = () => S.addValidator('test', () => undefined);
      expect(throwable).to.throw(
        'The property validator "test" is already defined.',
      );
    });

    it('requires the given validator to be a function', function () {
      const S = new PropertyValidatorRegistry();
      const throwable = v => () => S.addValidator('test', v);
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
      const S = new PropertyValidatorRegistry();
      expect(S.hasValidator('str')).to.be.false;
      expect(S.hasValidator('')).to.be.false;
      expect(S.hasValidator(10)).to.be.false;
      expect(S.hasValidator(0)).to.be.false;
      expect(S.hasValidator(true)).to.be.false;
      expect(S.hasValidator(false)).to.be.false;
      expect(S.hasValidator(null)).to.be.false;
      expect(S.hasValidator(undefined)).to.be.false;
      expect(S.hasValidator({})).to.be.false;
      expect(S.hasValidator([])).to.be.false;
      expect(S.hasValidator(() => undefined)).to.be.false;
    });

    it('returns true for an existing name', function () {
      const S = new PropertyValidatorRegistry();
      expect(S.hasValidator('test')).to.be.false;
      S.addValidator('test', () => undefined);
      expect(S.hasValidator('test')).to.be.true;
    });
  });

  describe('getValidator', function () {
    it('returns validator by its name', function () {
      const S = new PropertyValidatorRegistry();
      const myValidator1 = () => undefined;
      const myValidator2 = () => undefined;
      S.addValidator('foo', myValidator1);
      S.addValidator('bar', myValidator2);
      const res1 = S.getValidator('foo');
      const res2 = S.getValidator('bar');
      expect(res1).to.be.eq(myValidator1);
      expect(res2).to.be.eq(myValidator2);
    });

    it('throws an error for a not existed name', function () {
      const S = new PropertyValidatorRegistry();
      const throwable = v => () => S.getValidator(v);
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
