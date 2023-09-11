import {expect} from 'chai';
import {format} from '@e22m4u/format';
import {DatasourceDefinitionValidator} from './datasource-definition-validator.js';

const S = new DatasourceDefinitionValidator();

describe('DatasourceDefinitionValidator', function () {
  describe('validate', function () {
    it('requires a given definition to be an object', function () {
      const validate = v => () => S.validate(v);
      const error = v =>
        format(
          'The datasource definition should be an Object, but %s given.',
          v,
        );
      expect(validate('str')).to.throw(error('"str"'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate({name: 'datasource', adapter: 'adapter'})();
    });

    it('requires the option "name" as a non-empty string', function () {
      const validate = v => () => S.validate({name: v, adapter: 'adapter'});
      const error = v =>
        format(
          'The datasource definition requires the option "name" ' +
            'as a non-empty String, but %s given.',
          v,
        );
      expect(validate('')).to.throw(error('""'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate('datasource')();
    });

    it('requires the option "adapter" to be a non-empty string', function () {
      const validate = v => () => S.validate({name: 'datasource', adapter: v});
      const error = v =>
        format(
          'The datasource "datasource" requires the option "adapter" ' +
            'as a non-empty String, but %s given.',
          v,
        );
      expect(validate('')).to.throw(error('""'));
      expect(validate(10)).to.throw(error('10'));
      expect(validate(true)).to.throw(error('true'));
      expect(validate(false)).to.throw(error('false'));
      expect(validate([])).to.throw(error('Array'));
      expect(validate({})).to.throw(error('Object'));
      expect(validate(undefined)).to.throw(error('undefined'));
      expect(validate(null)).to.throw(error('null'));
      validate('adapter')();
    });
  });
});
