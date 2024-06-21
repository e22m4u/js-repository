import * as chaiTools from 'chai';
import chaiSpies from 'chai-spies';
import chaiSubset from 'chai-subset';
import chaiAsPromised from 'chai-as-promised';
const chai = {...chaiTools};

chaiSpies(chai, chai.util);
chaiSubset(chai, chai.util);
chaiAsPromised(chai, chai.util);

export {chai};
