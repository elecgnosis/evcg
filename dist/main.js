'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _caller = require('./caller');

var _caller2 = _interopRequireDefault(_caller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.argv.length < 3) {
  console.error('Provide cipher.');
  process.exit(1);
}

var caller = new _caller2.default(process.argv[2]);
// short-circuit for backend-only execution
if (process.argv.length > 3) {
  caller.doAll(process.argv[3]).then(function (result) {
    console.log('In the city of ' + result.city + ',\nit\'s ' + result.temp + '\xB0F,\nthe timezone is ' + result.timezone + ',\nand the general elevation is ' + result.elevation + ' ft.\nHave a nice day!');
    process.exit(0);
  });
}

var app = new _express2.default();
app.use(_express2.default.static('./dist/web'));

app.get('/demo', function (req, res) {
  var zip = req.query.zip;
  if (zip && zip.length === 5) {
    caller.doAll(req.query.zip).then(function (result) {
      return res.status(200).send(result);
    }).catch(function (error) {
      return res.status(500).send(error);
    });
  } else {
    res.status(400).end();
  }
});

app.listen(3000, function () {
  console.log('Server started at localhost on port 3000');
});