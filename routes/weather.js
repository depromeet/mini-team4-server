var express = require('express');
var router = express.Router();
var forecast = require(/*민호소스코드*/);
/* GET weathers listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/forecast/today', function(req, res, next) {
  var todayWeather = 111/* 민호 interface */;
  res.send(todayWeather);
});

router.get('/forecast/tomorrow', function(req, res, next) {
  var tomorrowWeather = 111;
  res.send(tomorrowWeather); 
});

router.get('/forecast/weekly', function(req, res, next) {
  var weeklyWeather = 111;
  res.send(weeklyWeather);
});

module.exports = router;