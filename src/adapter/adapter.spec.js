import {expect} from 'chai';
import {chai} from '../chai.js';
import {Schema} from '../schema.js';
import {Adapter} from './adapter.js';
import {Service} from '@e22m4u/js-service';
import {ServiceContainer} from '@e22m4u/js-service';
import {InclusionDecorator} from './decorator/index.js';
import {DefaultValuesDecorator} from './decorator/index.js';
import {DataValidationDecorator} from './decorator/index.js';
import {DataSanitizingDecorator} from './decorator/index.js';
import {FieldsFilteringDecorator} from './decorator/index.js';
import {DataTransformationDecorator} from './decorator/index.js';
import {PropertyUniquenessDecorator} from './decorator/index.js';

const sandbox = chai.spy.sandbox();

describe('Adapter', function () {
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
      const schema = new Schema();
      const dec1 = schema.getService(DataSanitizingDecorator);
      const dec2 = schema.getService(DefaultValuesDecorator);
      const dec3 = schema.getService(DataTransformationDecorator);
      const dec4 = schema.getService(DataValidationDecorator);
      const dec5 = schema.getService(PropertyUniquenessDecorator);
      const dec6 = schema.getService(FieldsFilteringDecorator);
      const dec7 = schema.getService(InclusionDecorator);
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
      sandbox.on(dec6, 'decorate', decorate);
      sandbox.on(dec7, 'decorate', decorate);
      new Adapter(schema.container);
      expect(order).to.be.empty;
      expect(dec1.decorate).to.be.not.called;
      expect(dec2.decorate).to.be.not.called;
      expect(dec3.decorate).to.be.not.called;
      expect(dec4.decorate).to.be.not.called;
      expect(dec5.decorate).to.be.not.called;
      expect(dec6.decorate).to.be.not.called;
      expect(dec7.decorate).to.be.not.called;
      class ExtendedAdapter extends Adapter {}
      new ExtendedAdapter(schema.container);
      expect(order[0]).to.be.eql(dec1);
      expect(order[1]).to.be.eql(dec2);
      expect(order[2]).to.be.eql(dec3);
      expect(order[3]).to.be.eql(dec4);
      expect(order[4]).to.be.eql(dec5);
      expect(order[5]).to.be.eql(dec6);
      expect(order[6]).to.be.eql(dec7);
      expect(dec1.decorate).to.be.called.once;
      expect(dec2.decorate).to.be.called.once;
      expect(dec3.decorate).to.be.called.once;
      expect(dec4.decorate).to.be.called.once;
      expect(dec5.decorate).to.be.called.once;
      expect(dec6.decorate).to.be.called.once;
      expect(dec7.decorate).to.be.called.once;
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
