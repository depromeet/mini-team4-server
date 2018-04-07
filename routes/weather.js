var express = require('express');
var request = require('request');
var router = express.Router();

// this code is for testing in local
// you should remove this when you are using this server.
var myKey = require('../localtest/weatherKey')();

/* GET weathers listing. */
router.get('/', function(req, res, next) {
  res.send("<a href='https://github.com/depromeet/mini-team4-server'>Refer to a github</a>")
} );

router.get('/chatbot',  function (req, res, next) {

  switch (parseInt(req.query.chat)) {
    case 0:
      getCurrentWeather(req, res, next);
      break;
    case 1:
      getTomorrowWeather(req, res, next);
      break;
    case 2:
      getWeeklyWeather(req, res, next);
      break;
    default:
      res.send("Bad request");
  }
})

router.get('/forecast/today', getCurrentWeather);

router.get('/forecast/tomorrow', getTomorrowWeather);

router.get('/forecast/weekly', getWeeklyWeather);;

var headers  = {
  'Accept': "application/json",
  'Content-Type': "application/json; charset=UTF-8",
  'appKey': myKey, 
};

var currentWeatherUrl = "https://api2.sktelecom.com/weather/current/minutely";
var tomorrowWeatherUrl = "https://api2.sktelecom.com/weather/forecast/3days"
var weeklyWeatherUrl = "https://api2.sktelecom.com/weather/forecast/6days";

function createUrl(query, lat, lon) {
  switch (query) {
    case 'today':
      return currentWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
    case 'tomorrow':
    case 'weekly':
      return weeklyWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
    default:
      return currentWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
  }
}

function createUrlWithCity(query, city, county, village) {
  switch (query) {
    case 'today':
      return currentWeatherUrl + "?version=1&city=" + city + "&county=" + county + "&village=" + village;
    case 'tomorrow':
    case 'weekly':
      return weeklyWeatherUrl + "?version=1&city=" + city + "&county=" + county + "&village=" + village;
    default:
      return currentWeatherUrl + "?version=1&city=" + city + "&county=" + county + "&village=" + village;
  }
}

function getRainInfo(rain) {
  switch(rain) {
    case "0":
      return '비안옴';
    case "1":
      return '비';
    case "2":
      return '비/눈';
    case "3":
      return '눈';
    default:
      return "강수정보 알수없음";
  }
}
function parseCurrentWeather(data) {
  var response = {};
  if (!data.weather || !data.weather.minutely)
    return "Bad Request";
  var forecast = data.weather.minutely[0];
  response.wind = forecast.wind.wspd;
  response.sky = forecast.sky.name;
  response.rain = getRainInfo(forecast.precipitation.type);
  response.c_current = forecast.temperature.tc;
  response.c_high = forecast.temperature.tmax;
  response.c_low = forecast.temperature.tmin;
  response.humidity = forecast.humidity;
  return JSON.stringify(response);
}

function parseTomorrowWeather(data) {
  var response = {};
  var weeklyData = parseWeeklyWeather(data);
  response.forecast = JSON.parse(weeklyData).forecast[0];
  return JSON.stringify(response);
}

function parseWeeklyWeather(data) {
  var response = {'forecast':[]};

  if (!data.weather || !data.weather.forecast6days)
    return "Bad Request";

  var forecast = data.weather.forecast6days[0];
  for (i = 0 ;i < 6;i++) {
    response.forecast.push({
      'c_high': forecast.temperature['tmax' + (i + 2) + 'day'],
      'c_low': forecast.temperature['tmin' + (i + 2) + 'day'],
      'sky': forecast.sky['amName' + (i + 2) + 'day']
    })
  }
  return JSON.stringify(response);
}

var requestUrl;
function getWeather(req, response, next, callback) {
  console.log(requestUrl);
  request({
    'headers':headers,
    'uri': requestUrl,
    'method': 'get'
  }, function(err, res, body) {
    if (err) {
      response.send("Error");
    }
    response.send(callback(JSON.parse(body)));
  });
}

function getCurrentWeather(req, res, next) {
  if (!req.query.version || req.query.version == 1) {
    requestUrl = createUrl('today', req.query.lat, req.query.lon);
  } else {
    requestUrl = createUrlWithCity('today', req.query.city, req.query.county, req.query.village);
  }
  getWeather(req, res, next, parseCurrentWeather);

}

function getTomorrowWeather(req, res, next) {
  if (!req.query.version || req.query.version == 1) {
    requestUrl = createUrl('tomorrow', req.query.lat, req.query.lon);
  } else {
    requestUrl = createUrlWithCity('tomorrow', req.query.city, req.query.county, req.query.village);
  }
  getWeather(req, res, next, parseTomorrowWeather);
  
}

function getWeeklyWeather(req, res, next) {
  if (!req.query.version || req.query.version == 1) {
    requestUrl = createUrl('weekly', req.query.lat, req.query.lon); 
  } else {
    requestUrl = createUrlWithCity('weekly', req.query.city, req.query.county, req.query.village);
  }
  getWeather(req, res, next, parseWeeklyWeather);
}
module.exports = router;