process.env['NODE_ENV'] = 'test';

// ts loader
import {register} from 'node:module';
import {pathToFileURL} from 'node:url';
register('ts-node/esm', pathToFileURL('./'));

// chai
import chai from 'chai';
import chaiSpies from 'chai-spies';
import chaiSubset from 'chai-subset';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiSpies);
chai.use(chaiSubset);
chai.use(chaiAsPromised);
