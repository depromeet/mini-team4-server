# 클라이언트 사이드 API

프론트 엔드 개발자 및 클라이언트 개발자를 위한 API 가이드이다. 

본 API를 사용하여 챗봇에 원하는 명령을 보낼 수 있다.

## API 명세서

### API 종류별 URL

| 기능                                 | URL                       | Method |
| ------------------------------------ | ------------------------- | ------ |
| 오늘 날씨 정보         | /weather/forecast/today | GET  |
| 내일 날씨 정보    | /weather/forecast/tomorrow | GET    |
| 주간 날씨 정보 | /weather/forecast/weekly| GET|

### 쿼리 파라미터

모든 API에 동일한 쿼리 파라미터를 사용한다. 

| 파라미터 네임 | 파라미터 밸류         |
| ------------- | --------------------- |
| lat           | 사용자 위치 위도 정보 |
| lon           | 사용자 위치 경도 정보 |

### Response

#### Success

클라이언트 요청 처리 완료시 응답데이터는 `JSON` 형태로 전달된다.

각 API에 대한 JSON 데이터는 아래의 링크를 참조하길 바란다.

- [오늘 날씨](./response.md#오늘-날씨-JSON-응답-및-내일-날씨-JSON-응답)
- [내일  날씨](./response.md#오늘-날씨-JSON-응답-및-내일-날씨-JSON-응답)
- [주간 날씨](./response.md#주간-날씨-JSON-응답)



#### Fail

잘못된 쿼리 파라미터 및 서버 측 오류로 인해 요청 처리 실패시 전달 되는 HTTP 응답 코드이다.

| 값   | 의미               |
| ---- | ------------------ |
| 400  | 파라미터가 부족함  |
| 420  | 제공하지 않는 지역 |
| 500  | 서버 내부 오류     |
| 502  | 서버 시스템 점검중 |

### 예시

```javascript
// javascript 를 통한 request
const requestUrl = "http://{domain}/weather/forecast/today"
function createUrl(lat, lon) {
    requestUrl += "?lat=" + lat + "&lon=" + lon;
}
jQeury.ajax(
    method: "get",
    url: createUrl(30,120),
    sucess: function(result) {
        // result는 json string
        var jsonResult = JSON.parse(result);
        // 이후 원하는 처리 하면 됨. 
    }
)
```

result로 전달 되는 JSON 포맷은 [응답 포맷](./response.md)을 참조