# 클라이언트 API에 대한 JSON 응답 
응답 JSON 데이터의 모든 값은 `String`이다.

## 오늘 날씨 JSON 응답 및 내일 날씨 JSON 응답 

오늘 날씨 및 내일 날씨에 대한 예보 정보는 같은 JSON 포맷을 공유한다. 

| 키        | 타입   | 값                                                           |
| --------- | ------ | ------------------------------------------------------------ |
| wind      | string | 풍속                                                         |
| rain      | string | 강수 현황 (비, 비/눈, 눈)                                    |
| sky       | string | 하늘 상태 정보<br />(맑음, 구름조금, 구름많음, 구름많고 비, 구름많고 눈, 구름많고 비 또는 눈, 흐림, 흐리고 비, 흐리고 비 또는 눈, 흐리고 낙뢰, 뇌우/비, 뇌우/눈, 뇌우/비 또는 눈) |
| c_current | string | 현재 온도                                                    |
| c_high    | string | 오늘 최고기온                                                |
| c_low     | string | 오늘 최저기온                                                |
| humidity  | string | 습도 (%)                                                     |

### 예시

```javascript
{
    wind: "12/ms",
    rain: "비/눈",
    sky: "구름많고 비",
    c_current: "10도",
    c_high: "17도",
    c_low: "5도",
    humidity: "33%"
}
```



## 주간 날씨 JSON 응답

주간 날씨는 오늘 이후의 향후 6일간의 데이터를 저장하고 있다. 각각의 데이터는 JSON의 한 노드로 표현된다.

문서의 지면을 줄이기 위해 1일 뒤의 날씨 정보에 대한 JSON 정보만 제공한다. 2일 뒤 이상 및 6일 뒤까지의 데이터 또한 같은 형태의 JSON 포맷을 유지하므로, 아래의 JSON 응답 표 및 예시 JSON 을 참조하길 바란다.

3일 뒤의 데이터 부터는 기상청 상황으로 인해 예측 정보가 존재 하지 않을 수 있으므로, `forecast != null && forecast[i] != null && forecast[i].code == 200`등의 코드를 통해 실제 데이터 존재하는지 확인해야 한다. 

| 키           | 타입   | 값                                |
| :----------- | ------ | --------------------------------- |
| **forecast** | node   | 일주일간의 날씨 정보를 담은 JSON 배열 |
| wind         | string | 풍속                              |
| rain      | string | 강수 현황 (비, 비/눈, 눈)                                    |
| sky       | string | 하늘 상태 정보<br />(맑음, 구름조금, 구름많음, 구름많고 비, 구름많고 눈, 구름많고 비 또는 눈, 흐림, 흐리고 비, 흐리고 비 또는 눈, 흐리고 낙뢰, 뇌우/비, 뇌우/눈, 뇌우/비 또는 눈) |
| c_current | string | 현재 온도                                                    |
| c_high    | string | 오늘 최고기온                                                |
| c_low     | string | 오늘 최저기온                                                |
| humidity  | string | 습도 (%)                                                     |
| code | string | 데이터 존재시 200, 아닐시 500 |

### 예시

```javascript
{
    forecast: [{
        wind: "12/ms",
        rain: "비/눈",
        sky: "구름많고 비",
        c_current: "10도",
        c_high: "17도",
        c_low: "5도",
        humidity: "33%",
        code: "200"
    }, {
        wind: "12/ms",
        rain: "비/눈",
        sky: "구름많고 비",
        c_current: "10도",
        c_high: "17도",
        c_low: "5도",
        humidity: "33%",
		code: "200"
    }, {
        wind: "12/ms",
        rain: "비/눈",
        sky: "구름많고 비",
        c_current: "10도",
        c_high: "17도",
        c_low: "5도",
        humidity: "33%"
        code: "200"
    }, {
        wind: "",
        rain: "",
        sky: "",
        c_current: "",
        c_high: "",
        c_low: "",
        humidity: ""
        code: "500"
    }]
}
```

