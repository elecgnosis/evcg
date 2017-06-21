'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var zip = process.argv.slice(2)[0];

var weather = new Promise(function (resolve, reject) {
  var options = {
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
      zip: zip,
      APPID: '14fd4bddba4bb686aa932f4e034649df'
    }
  };

  (0, _request2.default)(options, function (error, response, body) {
    var bodyParsed = JSON.parse(body);
    resolve({
      cityName: bodyParsed.name,
      temp: bodyParsed.main.temp,
      lat: bodyParsed.coord.lat,
      long: bodyParsed.coord.lon
    });
  });
});

var timezone = new Promise(function (resolve, reject) {
  weather.then(function (result) {
    var timeNow = new Date().getTime() / 1000;
    var options = {
      uri: 'https://maps.googleapis.com/maps/api/timezone/json',
      qs: {
        location: result.lat + ',' + result.long,
        timestamp: timeNow,
        key: 'AIzaSyBuHkLcJlxiAYBWVJWoX5zlSw27zxLSm9w'
      }
    };
    (0, _request2.default)(options, function (error, response, body) {
      resolve({
        timeZone: JSON.parse(body).timeZoneName
      });
    });
  });
});

var elevation = new Promise(function (resolve, reject) {
  weather.then(function (result) {
    var options = {
      uri: 'https://maps.googleapis.com/maps/api/elevation/json',
      qs: {
        locations: result.lat + ',' + result.long,
        key: 'AIzaSyANwjqtWWCiPpDBBTUXGT3Jp0JHbgMe9Ps'
      }
    };
    (0, _request2.default)(options, function (error, response, body) {
      // console.log(JSON.parse(body));
      resolve({
        elevation: JSON.parse(body).results[0].elevation
      });
    });
  });
});

var allPromise = Promise.all([weather, timezone, elevation]);

allPromise.then(function (promises) {
  console.log(promises[0]);
  console.log(promises[1]);
  console.log(promises[2]);
});