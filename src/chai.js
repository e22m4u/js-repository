import * as chaiModule from 'chai';
import chaiSpies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';
const chai = {...chaiModule};

chaiSpies(chai, chai.util);
chaiAsPromised(chai, chai.util);

export {chai};
