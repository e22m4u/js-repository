import {expect} from 'chai';
import {Service} from './service.js';

describe('Service', function () {
  describe('constructor', function () {
    it('sets an empty service map by default', function () {
      const service = new Service();
      expect(service._services).to.be.instanceof(Map);
      expect(service._services).to.be.empty;
    });

    it('sets a given service map', function () {
      const map = new Map();
      const service = new Service(map);
      expect(service._services).to.be.eq(map);
    });
  });

  describe('get', function () {
    it('returns a new service from a given constructor as a singleton', function () {
      let executed = 0;
      class MyService extends Service {
        constructor() {
          super();
          ++executed;
        }
      }
      const service = new Service();
      const myService1 = service.get(MyService);
      const myService2 = service.get(MyService);
      expect(myService1).to.be.instanceof(MyService);
      expect(myService2).to.be.instanceof(MyService);
      expect(myService1).to.be.eq(myService2);
      expect(executed).to.be.eq(1);
    });
  });
});
