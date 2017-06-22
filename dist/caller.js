'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var decryptText = function _decryptKey(text, cipher) {
  var textDecryptedBytes = _cryptoJs2.default.AES.decrypt(text, cipher);
  return textDecryptedBytes.toString(_cryptoJs2.default.enc.Utf8);
};

var Caller = function () {
  function Caller(cipher) {
    _classCallCheck(this, Caller);

    var apikeys = JSON.parse(_fs2.default.readFileSync(_path2.default.resolve(__dirname, '../.apikeys.json')));
    this.keys = {
      openweather: decryptText(apikeys.openweather, cipher),
      googletimezone: decryptText(apikeys.googletimezone, cipher),
      googleelevation: decryptText(apikeys.googleelevation, cipher)
    };
  }

  _createClass(Caller, [{
    key: 'getWeather',
    value: function getWeather(zip) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var options = {
          uri: 'http://api.openweathermap.org/data/2.5/weather',
          qs: {
            APPID: _this.keys.openweather,
            units: 'imperial',
            zip: zip
          }
        };

        (0, _request2.default)(options, function (error, response, body) {
          var bodyParsed = JSON.parse(body);
          resolve({
            city: bodyParsed.name,
            temp: bodyParsed.main.temp,
            lat: bodyParsed.coord.lat,
            lon: bodyParsed.coord.lon
          });
        });
      });
    }
  }, {
    key: 'getTimezone',
    value: function getTimezone(lat, lon) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var options = {
          uri: 'https://maps.googleapis.com/maps/api/timezone/json',
          qs: {
            location: lat + ',' + lon,
            timestamp: new Date().getTime() / 1000,
            key: _this2.keys.googletimezone
          }
        };
        (0, _request2.default)(options, function (error, response, body) {
          resolve(JSON.parse(body).timeZoneName);
        });
      });
    }
  }, {
    key: 'getElevation',
    value: function getElevation(lat, lon) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        var options = {
          uri: 'https://maps.googleapis.com/maps/api/elevation/json',
          qs: {
            locations: lat + ',' + lon,
            key: _this3.keys.googleelevation
          }
        };
        (0, _request2.default)(options, function (error, response, body) {
          resolve((JSON.parse(body).results[0].elevation * 3.28084).toFixed(2));
        });
      });
    }
  }, {
    key: 'doAll',
    value: function doAll(zip) {
      var _this4 = this;

      var weather = this.getWeather(zip);
      return weather.then(function (result) {
        var timezone = _this4.getTimezone(result.lat, result.lon);
        var elevation = _this4.getElevation(result.lat, result.lon);
        var allPromise = Promise.all([timezone, elevation]);
        return allPromise.then(function (promises) {
          return {
            city: result.city,
            temp: result.temp,
            timezone: promises[0],
            elevation: promises[1]
          };
        });
      });
    }
  }]);

  return Caller;
}();

exports.default = Caller;
;