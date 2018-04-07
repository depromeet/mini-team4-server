var request = require('request');
var moment = require('moment');

// weather config
var wthServiceKey = require("../config/wthServiceKey");

var exec = require('child_process').exec,
    child;

function baseTime(time) {
    var result = 0;

    if (time < 210)
        result = 2300;
    else if (time < 510)
        result = 200;
    else if (time < 810)
        result = 500;
    else if (time < 1110)
        result = 800;
    else if (time < 1410)
        result = 1100;
    else if(time < 1710)
        result = 1400;
    else if(time < 2010)
        result = 1700;
    else if(time < 2310)
        result = 2000;
    else
        result = 2300;

    return result;
}

function translateSKY(src, dst) {
    if(src.fcstValue === 1) dst.SKY = "맑음";
    else if(src.fcstValue === 2) dst.SKY = "구름 조금";
    else if(src.fcstValue === 3) dst.SKY = "구름 많음";
    else dst.SKY = "흐림"
}
function translatePTY(src, dst) {
    if(src.fcstValue === 0) dst.PTY = "없음";
    else if(src.fcstValue === 1) dst.PTY = "비";
    else if(src.fcstValue === 2) dst.PTY = "비/눈";
    else dst.fcstValue = "눈"
}
function translateWSD(src, dst) {
    var val = Number(src.fcstValue);
    if(val < 4) dst.WSD = "바람 없음";
    else if(val < 9) dst.WSD = "거의 조금";
    else if(val === 3) dst.WSD = "조금 있음";
    else dst.WSD = "매우 강함"
}


function insertWeatherData(src, dst) {
    if(src.category.indexOf('POP') >= 0) {
        dst.POP = src.fcstValue;
    } else if(src.category.indexOf('SKY') >= 0) {
        translateSKY(src, dst);
    } else if(src.category.indexOf('PTY') >= 0) {
        translatePTY(src, dst);
    } else if(src.category.indexOf('T3H') >= 0) {
        dst.T3H = src.fcstValue;
    } else if(src.category.indexOf('WSD') >= 0) {
        translateWSD(src, dst);
    }
}

module.exports = function(lat, lon) {
    var key = wthServiceKey.localArea;
    var lastModifiedTime = moment().format();
    var dateArr = lastModifiedTime.split('T')[0].split('-');
    var timeArr = lastModifiedTime.split('T')[1].split(':');

    var date = dateArr[0] + dateArr[1] + dateArr[2];
    var time = Number(timeArr[0] + timeArr[1]);

    console.log("Full time : ", lastModifiedTime);
    console.log("date : ", date);
    console.log("time : ", time, " baseTime : ", baseTime(time));

    child = exec(__dirname, "../findXYLocate.out 0 " + lon + " " + lat, function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        var nx = stdout.split(' = ')[1].split(',')[0]; // '62, Y'
        var ny = stdout.split(' = ')[2].split('\n')[0];
        console.log("nx : " + nx + " ny : " + ny);

        var GETuri = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastSpaceData?';
        GETuri += 'ServiceKey=' + key;
        GETuri += '&base_date=' + date;
        GETuri += '&base_time=' + baseTime(time);
        GETuri += '&nx=' + 43;
        GETuri += '&ny=' + 590;
        GETuri += '&numOfRows=50';
        GETuri += '&pageNo=1';
        GETuri += '&_type=json';
        var options = {
            url: GETuri,
            method: 'GET',
        };
        request(options, function(error, response, body) {
            if (response.statusCode == 200) {
                var _data = (JSON.parse(body).response.body.items.item);
                var firstFcstTime = (Number(_data[0].baseTime) + 400) % 2400;
                var secondFcstTime = (Number(firstFcstTime) + 300) % 2400;
                var thirdFcstTime = (Number(secondFcstTime) + 300) % 2400;
                var firstForecastObj = {
                    "fcstTime" : firstFcstTime
                };
                var secondForecastObj = {
                    "fcstTime" : secondFcstTime
                };
                var thirdForecastObj = {
                    "fcstTime" : thirdFcstTime
                };

                console.log('fcstTime : ', firstFcstTime, secondFcstTime, thirdFcstTime);
                console.log(_data);
                for(var i = 0; i < _data.length; i++) {
                    if(Number(_data[i].fcstTime) === firstFcstTime) {
                        insertWeatherData(_data[i], firstForecastObj)
                    } else if(Number(_data[i].fcstTime) === secondFcstTime) {
                        insertWeatherData(_data[i], secondForecastObj)
                    } else if(Number(_data[i].fcstTime) === thirdFcstTime) {
                        insertWeatherData(_data[i], thirdForecastObj)
                    }
                }
                console.log("예측 값: ", firstForecastObj, secondForecastObj, thirdForecastObj)
            } else {
                console.log(body);
            }
        });
    })
};