import fs from 'fs';
import path from 'path';
import request from 'request';
import CryptoJS from 'crypto-js';

const decryptText = function _decryptKey(text, cipher) {
  const textDecryptedBytes = CryptoJS.AES.decrypt(text, cipher);
  return textDecryptedBytes.toString(CryptoJS.enc.Utf8);
};

export default class Caller {
  constructor(cipher) {
    const apikeys = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../.apikeys.json')));
    this.keys = {
      openweather: decryptText(apikeys.openweather, cipher),
      googletimezone: decryptText(apikeys.googletimezone, cipher),
      googleelevation: decryptText(apikeys.googleelevation, cipher),
    };
  }

  getWeather(zip) {
    return new Promise((resolve, reject) => {
        const options = {
          uri: 'http://api.openweathermap.org/data/2.5/weather',
          qs: {
            APPID: this.keys.openweather,
            units: 'imperial',
            zip,
          },
        };

        request(options, (error, response, body) => {
          const bodyParsed = JSON.parse(body);
          resolve({
            city: bodyParsed.name,
            temp: bodyParsed.main.temp,
            lat: bodyParsed.coord.lat,
            lon: bodyParsed.coord.lon,
          });
        });
      });
  }

  getTimezone(lat, lon) {
    return new Promise((resolve, reject) => {
      const options = {
        uri: 'https://maps.googleapis.com/maps/api/timezone/json',
        qs: {
          location: `${lat},${lon}`,
          timestamp: (new Date().getTime() / 1000),
          key: this.keys.googletimezone,
        },
      };
      request(options, (error, response, body) => {
        resolve(JSON.parse(body).timeZoneName);
      });
    });
  }

  getElevation(lat, lon) {
    return new Promise((resolve, reject) => {
      const options = {
        uri: 'https://maps.googleapis.com/maps/api/elevation/json',
        qs: {
          locations: `${lat},${lon}`,
          key: this.keys.googleelevation,
        },
      };
      request(options, (error, response, body) => {
        resolve((JSON.parse(body).results[0].elevation * 3.28084).toFixed(2));
      });
    });
  }

  doAll(zip) {
    const weather = this.getWeather(zip);
    return weather.then((result) => {
      const timezone = this.getTimezone(result.lat, result.lon);
      const elevation = this.getElevation(result.lat, result.lon);
      const allPromise = Promise.all([timezone, elevation]);
      return allPromise.then((promises) => {
        return {
          city: result.city,
          temp: result.temp,
          timezone: promises[0],
          elevation: promises[1],
        };
      });
    });
  }
};
