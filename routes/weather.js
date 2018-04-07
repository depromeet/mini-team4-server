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

function createUrl(query, lat, lon) {
  return currentWeatherUrl + "?version=1&lat=" + lat + "&lon=" + lon;
}

function getCurrentWeather(req, _res, next) {
  var requestUrl = createUrl(req.query.lat, req.query.lon);
  console.log(`my url is ${requestUrl}`);
  request({
    'headers':headers,
    'uri': requestUrl,
    'method': 'get'
  }, function(err, res, body) {
    if (err) 
      _res.send("Error");
    _res.send(body);
  });
}

function getTomorrowWeather(req, res, next) {

}

function getWeeklyWeather(req, res, next) {

}
module.exports = router;