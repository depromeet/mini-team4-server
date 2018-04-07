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

router.get('/forecast/today', getCurrentWeather);;

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
      return tomorrowWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
    case 'weekly':
      return weeklyWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
    default:
      return currentWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
  }
}
function parseCurrentWeather(data) {

}

function parseTomorrowWeather(data) {

}

function parseWeeklyWeather(data) {

}

var requestUrl;
function getWeather(req, response, next, callback) {
  request({
    'headers':headers,
    'uri': requestUrl,
    'method': 'get'
  }, function(err, res, body) {
    if (err) 
      response.send("Error");
    response.send(callback(JSON.parse(body)));
  });
}

function getCurrentWeather(req, res, next) {
  requestUrl = createUrl('today', req.query.lat, req.query.lon);
  getWeather(req, res, next, parseCurrentWeather);

}

function getTomorrowWeather(req, res, next) {
  requestUrl = createUrl('tomorrow', req.query.lat, req.query.lon);
  getWeather(req, res, next, parseTomorrowWeather);
  
}

function getWeeklyWeather(req, res, next) {
  requestUrl = createUrl('weekly', req.query.lat, req.query.lon);
  getWeather(req, res, next, parseWeeklyWeather);
}
module.exports = router;