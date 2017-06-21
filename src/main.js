import request from 'request';

const zip = process.argv.slice(2)[0];

const weather = new Promise((resolve, reject) => {
  const options = {
    uri: 'http://api.openweathermap.org/data/2.5/weather',
    qs: {
      zip: zip,
      APPID: '14fd4bddba4bb686aa932f4e034649df',
    },
  };

  request(options, (error, response, body) => {
    const bodyParsed = JSON.parse(body);
    resolve({
      cityName: bodyParsed.name,
      temp: bodyParsed.main.temp,
      lat: bodyParsed.coord.lat,
      long: bodyParsed.coord.lon,
    });
  });
});

const timezone = new Promise((resolve, reject) => {
  weather.then((result) => {
    const timeNow = new Date().getTime() / 1000;
    const options = {
      uri: 'https://maps.googleapis.com/maps/api/timezone/json',
      qs: {
        location: `${result.lat},${result.long}`,
        timestamp: timeNow,
        key: 'AIzaSyBuHkLcJlxiAYBWVJWoX5zlSw27zxLSm9w',
      },
    };
    request(options, (error, response, body) => {
      resolve({
        timeZone: JSON.parse(body).timeZoneName
      });
    });
  });
});

const elevation = new Promise((resolve, reject) => {
  weather.then((result) => {
    const options = {
      uri: 'https://maps.googleapis.com/maps/api/elevation/json',
      qs: {
        locations: `${result.lat},${result.long}`,
        key: 'AIzaSyANwjqtWWCiPpDBBTUXGT3Jp0JHbgMe9Ps',
      },
    };
    request(options, (error, response, body) => {
      // console.log(JSON.parse(body));
      resolve({
        elevation: JSON.parse(body).results[0].elevation,
      });
    });
  });
});

const allPromise = Promise.all([weather, timezone, elevation]);

allPromise.then((promises) => {
  console.log(promises[0]);
  console.log(promises[1]);
  console.log(promises[2]);
});
