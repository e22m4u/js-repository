import {expect} from 'chai';
import {createSandbox} from '@e22m4u/js-spy';
import {DatabaseSchema} from '../database-schema.js';
import {Adapter, ADAPTER_CLASS_NAME} from './adapter.js';
import {Service, ServiceContainer} from '@e22m4u/js-service';

import {
  InclusionDecorator,
  DefaultValuesDecorator,
  DataSanitizingDecorator,
  FieldsFilteringDecorator,
  RequiredPropertyDecorator,
  PropertyUniquenessDecorator,
} from './decorator/index.js';

const sandbox = createSandbox();

describe('Adapter', function () {
  it('should expose the static property "kinds"', function () {
    const kinds = [...Service.kinds, ADAPTER_CLASS_NAME];
    expect(Adapter.kinds).to.be.eql(kinds);
    const MyAdapter = class extends Adapter {};
    expect(MyAdapter.kinds).to.be.eql(kinds);
  });

  describe('constructor', function () {
    afterEach(function () {
      sandbox.restore();
    });

    it('should extend the Service class', function () {
      const adapter = new Adapter();
      expect(adapter).to.be.instanceof(Service);
    });

    it('should set given service container and settings', function () {
      const container = new ServiceContainer();
      const settings = {};
      const adapter = new Adapter(container, settings);
      expect(adapter.container).to.be.eq(container);
      expect(adapter._settings).to.be.eq(settings);
    });

    it('should decorate only when the instance inherits the Adapter class', function () {
      const decCtors = [
        DataSanitizingDecorator,
        DefaultValuesDecorator,
        RequiredPropertyDecorator,
        PropertyUniquenessDecorator,
        FieldsFilteringDecorator,
        InclusionDecorator,
      ];
      const dbs = new DatabaseSchema();
      const decs = decCtors.map(ctor => dbs.getService(ctor));
      const order = [];
      const decorate = function (...args) {
        expect(args[0]).to.be.instanceof(Adapter);
        expect(args).to.have.length(1);
        order.push(this);
      };
      decs.forEach(dec => sandbox.on(dec, 'decorate', decorate));
      new Adapter(dbs.container);
      expect(order).to.be.empty;
      decs.forEach(dec => expect(dec.decorate).to.be.not.called);
      class ExtendedAdapter extends Adapter {}
      new ExtendedAdapter(dbs.container);
      decs.forEach((dec, index) => expect(order[index]).to.be.eq(dec));
      decs.forEach(dec => expect(dec.decorate).to.be.called.once);
    });
  });

  describe('create', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.create();
      expect(throwable).to.throw('Adapter.create is not implemented.');
    });
  });

  describe('replaceById', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.replaceById();
      expect(throwable).to.throw('Adapter.replaceById is not implemented.');
    });
  });

  describe('replaceOrCreate', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.replaceOrCreate();
      expect(throwable).to.throw('Adapter.replaceOrCreate is not implemented.');
    });
  });

  describe('patch', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.patch();
      expect(throwable).to.throw('Adapter.patch is not implemented.');
    });
  });

  describe('patchById', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.patchById();
      expect(throwable).to.throw('Adapter.patchById is not implemented.');
    });
  });

  describe('find', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.find();
      expect(throwable).to.throw('Adapter.find is not implemented.');
    });
  });

  describe('findById', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.findById();
      expect(throwable).to.throw('Adapter.findById is not implemented.');
    });
  });

  describe('delete', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.delete();
      expect(throwable).to.throw('Adapter.delete is not implemented.');
    });
  });

  describe('deleteById', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.deleteById();
      expect(throwable).to.throw('Adapter.deleteById is not implemented.');
    });
  });

  describe('exists', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.exists();
      expect(throwable).to.throw('Adapter.exists is not implemented.');
    });
  });

  describe('count', function () {
    it('should throw the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.count();
      expect(throwable).to.throw('Adapter.count is not implemented.');
    });
  });
});
