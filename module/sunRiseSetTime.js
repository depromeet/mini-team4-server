const request = require('request');
const moment = require('moment');
const serviceKey = require('../config/wthServiceKey');
const urlEncode = require('urlencode');

/*
 example
 const test = require('sunRiseSetTime.js');
 test('서울', function(data) {
    console.log(data.sunrise);
 });
 */
module.exports = (locate, callback) => {
    let time = moment().format('YYYYMMDD');
    let url = 'http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo';
    let queryParams = '?location=' + urlEncode(locate) + '&locdate=' + time + '&ServiceKey=' + serviceKey.sunRiseSet +'&_type=json';

    let options = {
        method: "GET",
        url: url+queryParams
    };

    request(options, function (error, response, body) {
        let dataObj = JSON.parse(body).response.body.items.item;
        const obj = {
            sunrise: dataObj.sunrise,
            sunset: dataObj.sunset,
            moonrise: dataObj.moonrise,
            moonset: dataObj.moonset
        };
        callback(obj);
    });
};