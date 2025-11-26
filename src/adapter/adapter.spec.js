import {expect} from 'chai';
import {chai} from '../chai.js';
import {Adapter} from './adapter.js';
import {Service} from '@e22m4u/js-service';
import {ADAPTER_CLASS_NAME} from './adapter.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {DatabaseSchema} from '../database-schema.js';
import {InclusionDecorator} from './decorator/index.js';
import {DefaultValuesDecorator} from './decorator/index.js';
import {DataSanitizingDecorator} from './decorator/index.js';
import {FieldsFilteringDecorator} from './decorator/index.js';
import {PropertyUniquenessDecorator} from './decorator/index.js';

const sandbox = chai.spy.sandbox();

describe('Adapter', function () {
  it('exposes static property "kinds"', function () {
    const kinds = [...Service.kinds, ADAPTER_CLASS_NAME];
    expect(Adapter.kinds).to.be.eql(kinds);
    const MyAdapter = class extends Adapter {};
    expect(MyAdapter.kinds).to.be.eql(kinds);
  });

  describe('constructor', function () {
    afterEach(function () {
      sandbox.restore();
    });

    it('inherits from the Service class', function () {
      const adapter = new Adapter();
      expect(adapter).to.be.instanceof(Service);
    });

    it('sets given service container and settings', function () {
      const container = new ServiceContainer();
      const settings = {};
      const adapter = new Adapter(container, settings);
      expect(adapter.container).to.be.eq(container);
      expect(adapter._settings).to.be.eq(settings);
    });

    it('decorates only extended adapter', function () {
      const dbs = new DatabaseSchema();
      const dec1 = dbs.getService(DataSanitizingDecorator);
      const dec2 = dbs.getService(DefaultValuesDecorator);
      const dec3 = dbs.getService(PropertyUniquenessDecorator);
      const dec4 = dbs.getService(FieldsFilteringDecorator);
      const dec5 = dbs.getService(InclusionDecorator);
      const order = [];
      const decorate = function (ctx) {
        expect(ctx).to.be.instanceof(Adapter);
        order.push(this);
      };
      sandbox.on(dec1, 'decorate', decorate);
      sandbox.on(dec2, 'decorate', decorate);
      sandbox.on(dec3, 'decorate', decorate);
      sandbox.on(dec4, 'decorate', decorate);
      sandbox.on(dec5, 'decorate', decorate);
      new Adapter(dbs.container);
      expect(order).to.be.empty;
      expect(dec1.decorate).to.be.not.called;
      expect(dec2.decorate).to.be.not.called;
      expect(dec3.decorate).to.be.not.called;
      expect(dec4.decorate).to.be.not.called;
      expect(dec5.decorate).to.be.not.called;
      class ExtendedAdapter extends Adapter {}
      new ExtendedAdapter(dbs.container);
      expect(order[0]).to.be.eql(dec1);
      expect(order[1]).to.be.eql(dec2);
      expect(order[2]).to.be.eql(dec3);
      expect(order[3]).to.be.eql(dec4);
      expect(order[4]).to.be.eql(dec5);
      expect(dec1.decorate).to.be.called.once;
      expect(dec2.decorate).to.be.called.once;
      expect(dec3.decorate).to.be.called.once;
      expect(dec4.decorate).to.be.called.once;
      expect(dec5.decorate).to.be.called.once;
    });
  });

  describe('create', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.create();
      expect(throwable).to.throw('Adapter.create is not implemented.');
    });
  });

  describe('replaceById', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.replaceById();
      expect(throwable).to.throw('Adapter.replaceById is not implemented.');
    });
  });

  describe('replaceOrCreate', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.replaceOrCreate();
      expect(throwable).to.throw('Adapter.replaceOrCreate is not implemented.');
    });
  });

  describe('patchById', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.patchById();
      expect(throwable).to.throw('Adapter.patchById is not implemented.');
    });
  });

  describe('find', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.find();
      expect(throwable).to.throw('Adapter.find is not implemented.');
    });
  });

  describe('findById', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.findById();
      expect(throwable).to.throw('Adapter.findById is not implemented.');
    });
  });

  describe('delete', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.delete();
      expect(throwable).to.throw('Adapter.delete is not implemented.');
    });
  });

  describe('deleteById', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.deleteById();
      expect(throwable).to.throw('Adapter.deleteById is not implemented.');
    });
  });

  describe('exists', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.exists();
      expect(throwable).to.throw('Adapter.exists is not implemented.');
    });
  });

  describe('count', function () {
    it('throws the "Not implemented"', function () {
      const adapter = new Adapter();
      const throwable = () => adapter.count();
      expect(throwable).to.throw('Adapter.count is not implemented.');
    });
  });
});
