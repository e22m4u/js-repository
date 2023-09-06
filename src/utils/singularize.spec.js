import {expect} from 'chai';
import {singularize} from './singularize.js';

describe('singularize', function () {
  it('returns a singular noun', function () {
    expect(singularize('papers')).to.be.eq('paper');
    expect(singularize('strategies')).to.be.eq('strategy');
    expect(singularize('lives')).to.be.eq('life');
    expect(singularize('games')).to.be.eq('game');
    expect(singularize('cacti')).to.be.eq('cactus');
    expect(singularize('dozes')).to.be.eq('doze');
  });

  it('returns non-string values as is', function () {
    expect(singularize(10)).to.be.eq(10);
    expect(singularize([])).to.be.eql([]);
    expect(singularize({})).to.be.eql({});
    expect(singularize(true)).to.be.eq(true);
    expect(singularize(false)).to.be.eq(false);
    expect(singularize(undefined)).to.be.eq(undefined);
    expect(singularize(null)).to.be.eq(null);
  });
});
