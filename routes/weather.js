var express = require('express');
var request = require('request');
var router = express.Router();
var weather = require('../module/wthForecastLocalArea');

/* GET weathers listing. */
router.get('/', function(req, res, next) {
  res.send("<a href='https://github.com/depromeet/mini-team4-server'>Refer to a github</a>")
} );

var weatherMethod = [
  sendCurrentWeather,
  sendTomorrowWeather,
  sendWeeklyWeather
];

router.get('/chatbot', function(req, res, next) {
  classifyAndGetData(req, res, next, 3);
});

router.get('/forecast/today', function(req, res, next) {
  classifyAndGetData(req, res, next, 0);
});

router.get('/forecast/tomorrow', function(req, res, next) {
  classifyAndGetData(req, res, next, 1);
});

router.get('/forecast/weekly', function(req, res, next) {
  classifyAndGetData(req, res, next, 2);
});

function validateRequest(req, res, next) {
  if (req.query.lat && req.query.lon) {
    return true;
  }
  return false;
}

function classifyAndGetData(req, res, next, index = 3) {
  if (validateRequest(req)) {
    if (index == 3) {
      index = req.query.chat;
    } else if (index > 3 && index < 0){
      res.send({success:404, message: "Bad request: undefined routes"});
      return;
    }
    var data = weather(req.query.lat, req.query.lon);
    weatherMethod[index](res, data);
  } else {
    res.send({success:401, message: "필수 파라미터가 존재하지 않습니다."});
  }
}

function sendCurrentWeather(res, data) {
  console.log(data)
  res.send({success:401, message:"current chat 파라미터가 잘못 되었습니다."});
}

function sendTomorrowWeather(res, data) {
  res.send({success:401, message:"tomorrow chat 파라미터가 잘못 되었습니다."});
}

function sendWeeklyWeather(res, data) {
  res.send({success:401, message:"weekly chat 파라미터가 잘못 되었습니다."});
}
module.exports = router;