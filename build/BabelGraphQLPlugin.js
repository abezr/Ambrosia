var fs = require('fs');
var getBabelRelayPlugin = require('babel-relay-plugin');
var path = require('path');

console.log('build relay');

var SCHEMA_PATH = path.resolve(__dirname, '../src/server/schema.json');

var schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));

module.exports = getBabelRelayPlugin(schema.data);
