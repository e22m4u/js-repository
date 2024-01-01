const path = require('path');

module.exports = {
  extension: ['js', 'ts'],
  spec: 'src/**/*.spec.{js,ts}',
  require: [path.join(__dirname, 'mocha.setup.js')],
}
