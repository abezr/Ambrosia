require('babel/register');
// var babel = require('babel');
var plugin = require('../../build/BabelGraphQLPlugin');
var path = require('path');
// var SERVER_PATH = path.resolve(__dirname, './server.js');
// var options = {
//   plugins: [plugin]
// };
// babel.transformFile(SERVER_PATH, options, function (err, result) {
//   if(err) console.log('ERROOOORR', err);
//   console.log(result.code, result.map, result.ast);
//   result.code; // => { code, map, ast }
// });
require('./server');
