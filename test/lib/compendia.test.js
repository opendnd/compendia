const expect = require('chai').expect;
const path = require('path');
const rootDir = path.join(__dirname, '..', '..');
const libDir = path.join(rootDir, 'lib');
const Compendia = require(path.join(libDir, 'compendia'));

describe('Compendia', function () {
  it('exists', function () {
    expect(Compendia).to.be.an('object');
  });
});