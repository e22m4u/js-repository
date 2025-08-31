import {expect} from 'chai';
import {Adapter} from './adapter.js';
import {AdapterLoader} from './adapter-loader.js';

const S = new AdapterLoader();

describe('AdapterLoader', function () {
  describe('loadByName', function () {
    it('requires an adapter name as a non-empty string', async function () {
      const promise = S.loadByName('');
      await expect(promise).to.be.rejectedWith(
        'The adapter name should be a non-empty String, but "" was given.',
      );
    });

    it('throws an error if a given adapter name is not found', async function () {
      const promise = S.loadByName('unknown');
      await expect(promise).to.be.rejectedWith(
        'The adapter "unknown" is not found.',
      );
    });

    it('returns an adapter instance that is loaded from "builtin" folder', async function () {
      const settings = {};
      const adapter = await S.loadByName('memory', settings);
      expect(adapter).to.be.instanceof(Adapter);
      expect(adapter.container).to.be.eq(S.container);
      expect(adapter.settings).to.be.eq(settings);
    });
  });
});
