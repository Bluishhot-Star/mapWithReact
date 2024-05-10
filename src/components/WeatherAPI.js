import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/Weather.css';
import { MdOutlinePinDrop } from "react-icons/md";
import { WiDaySunny, WiDayCloudy, WiNightClear, WiNightAltCloudy, WiCloud, WiRain, WiRainMix, WiRainWind, WiSnow, WiNa, WiCelsius } from "react-icons/wi";
function WeatherAPI(props) {
  const [weatherByDateTime, setWeatherByDateTime] = useState({});
  const [temperatures, setTemperatures] = useState({});
  const [currentTime, setCurrentTime] = useState("");
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    if (props.XY.lat !== "" && props.XY.lon !== "") {
        async function fetchData(lon, lat) {
            const map = new LamcParameter(
                6371.00877, // 지도반경
                5.0, // 격자간격 (km)
                30.0, // 표준위도 1
                60.0, // 표준위도 2
                126.0, // 기준점 경도
                38.0, // 기준점 위도
                210 / 5.0, // 기준점 X좌표
                675 / 5.0 // 기준점 Y좌표
            );

            const { x, y } = await lamcProj(lon, lat, 0, map);
            return { x, y };
        }

        fetchData(props.XY.lon, props.XY.lat)
            .then((res) => {
                setTarget(res);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
}, [props.XY.lat, props.XY.lon]);

const [target, setTarget] = useState(null);
const [url, setUrl] = useState(null);

useEffect(() => {
    if (target && !isNaN(target.x) && !isNaN(target.y)) {
        // 오늘 날짜 데이터 받아오는 시간
        const baseDate = now.getFullYear()+(now.getUTCMonth()+1).toString().padStart(2,'0')+(now.getDate()-1).toString()
        const baseTime = "0200";
        const serviceKey =
            "xFeFi4zAr3VGnUFGSTeQudJv8FQK0MCN38s8vk4v3uJ6xHmFsELBZNnEZauD0SfNfZczCV0rNZKwrw%2BoFZ%2BW5A%3D%3D";
        setUrl(`http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=3&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${target.x}&ny=${target.y}`);
    }
}, [target]);



  useEffect(()=>{
    if(url){
      fetchWeather(url);
    }
  },[url]);

let date = new Date();
console.log(date.getFullYear()+(date.getUTCMonth()+1).toString().padStart(2,'0')+date.getDate().toString())
let now = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));

console.log(now)
  // 지도 관련 클래스
  class LamcParameter {
    constructor(Re, grid, slat1, slat2, olon, olat, xo, yo) {
        this.Re = Re; // 사용할 지구반경 [ km ]
        this.grid = grid; // 격자간격 [ km ]
        this.slat1 = slat1; // 표준위도 [degree]
        this.slat2 = slat2; // 표준위도 [degree]
        this.olon = olon; // 기준점의 경도 [degree]
        this.olat = olat; // 기준점의 위도 [degree]
        this.xo = xo; // 기준점의 X좌표 [격자거리]
        this.yo = yo; // 기준점의 Y좌표 [격자거리]
        this.first = 0; // 시작여부 (0 = 시작)
    }
  }
  // 람베르트 좌표계 변환 함수
  function lamcProj(lon, lat, code, map) {
    let PI, DEGRAD, RADDEG;
    let re, olon, olat, sn, sf, ro;
    let slat1, slat2, alon, alat, xn, yn, ra, theta;

    // 초기화
    if (map.first === 0) {
        PI = Math.asin(1.0) * 2.0;
        DEGRAD = PI / 180.0;
        RADDEG = 180.0 / PI;

        re = map.Re / map.grid;
        slat1 = map.slat1 * DEGRAD;
        slat2 = map.slat2 * DEGRAD;
        olon = map.olon * DEGRAD;
        olat = map.olat * DEGRAD;

        sn = Math.tan(PI * 0.25 + slat2 * 0.5) / Math.tan(PI * 0.25 + slat1 * 0.5);
        sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
        sf = Math.tan(PI * 0.25 + slat1 * 0.5);
        sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
        ro = Math.tan(PI * 0.25 + olat * 0.5);
        ro = re * sf / Math.pow(ro, sn);
        map.first = 1;
    }

    // 위경도 -> (X,Y) 변환
    if (code === 0) {
        ra = Math.tan(PI * 0.25 + lat * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        theta = lon * DEGRAD - olon;
        if (theta > PI) theta -= 2.0 * PI;
        if (theta < -PI) theta += 2.0 * PI;
        theta *= sn;
        const x = ra * Math.sin(theta) + map.xo;
        const y = ro - ra * Math.cos(theta) + map.yo;
        return { x: Math.floor(x + 1.5), y: Math.floor(y + 1.5) };
    }
  }
  // console.log(url)
  const fetchWeather = async (url) => {
      
    // 현재 날짜 시간
    
    const currentTime = (() => {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // 분이 30분 이상이면 한 시간을 올림
      const roundedHour = minutes >= 30 ? (hours + 1) % 24 : hours; // 23시 다음은 0시
      return roundedHour.toString().padStart(2, "0") + "00";
    })();
    let currentDate;
    if( now.getHours() == 23 && now.getMinutes() >= 30 ){
      currentDate = date.getFullYear()+(date.getUTCMonth()+1).toString().padStart(2,'0')+(date.getDate()+1).toString();
    }else{
      currentDate = date.getFullYear()+(date.getUTCMonth()+1).toString().padStart(2,'0')+date.getDate().toString();
    }
    // 현재 날짜 시간 키값
    const key = `${currentDate}${currentTime}`;

    
    
    
    // 3일 날씨데이터 및 최저/최고기온 객체로 정리
    try {
      const response = await axios.get(url);
      console.log(response);
      const items = response.data.response.body.items.item;
      console.log(items);
      const isTemperatures = {};
      const isWeatherByDateTime = items.reduce((map, item) => {
        const dateTimeKey = `${item.fcstDate}${item.fcstTime}`;
        if (!map[dateTimeKey]) {
          map[dateTimeKey] = [];
        }
        map[dateTimeKey].push({
          category: item.category,
          value: item.fcstValue,
        });

        // Extracting temperature data for each forecast date
        if (!isTemperatures[item.fcstDate]) {
          isTemperatures[item.fcstDate] = { min: null, max: null };
        }
        if (item.category === 'TMN') {
          isTemperatures[item.fcstDate].min = item.fcstValue;
        }
        if (item.category === 'TMX') {
          isTemperatures[item.fcstDate].max = item.fcstValue;
        }

        return map;
      }, {});
      console.log(key)
      setWeatherByDateTime(isWeatherByDateTime);
      setTemperatures(isTemperatures);
      console.log("3일 시간별 날씨 정보:", isWeatherByDateTime);
      console.log("3일 최저/최고기온:", isTemperatures);
      // 기온
      console.log('기온',isWeatherByDateTime[key][0].value);
      // 구름
      console.log(translateSkyValue(isWeatherByDateTime[key][5].value));
      // 풍향
      console.log(translateVecValue(isWeatherByDateTime[key][3].value));
      // 풍속
      console.log('풍속',isWeatherByDateTime[key][4].value);
      // 금일 최대 최소 기온
      console.log(isTemperatures[key.toString().substr(0, 8)])
      // 습도
      console.log('습도',isWeatherByDateTime[key][10].value);
      // 강수확률
      console.log('강수확률',isWeatherByDateTime[key][7].value);
      // 강수량
      console.log('강수량',isWeatherByDateTime[key][9].value);
      // 산적설
      console.log('적설량',isWeatherByDateTime[key][11].value);
      // 강수형태
      console.log('강수형태',translatePtyValue(isWeatherByDateTime[key][6].value))
      console.log(props.point);
      
      setCurrentTime(key.toString().substr(8));
      setWeatherData({
        "tmp": isWeatherByDateTime[key][0].value,
        "tmpMaxMin" : isTemperatures[key.toString().substr(0, 8)],
        "cloud" : translateSkyValue(isWeatherByDateTime[key][5].value),
        "rainType" : translatePtyValue(isWeatherByDateTime[key][6].value),
        "windVec" : translateVecValue(isWeatherByDateTime[key][3].value),
        "windVol" : ('풍속',isWeatherByDateTime[key][4].value),
        "hum" : isWeatherByDateTime[key][10].value,
        "rainPer" : isWeatherByDateTime[key][7].value,
        "rainVol" : isWeatherByDateTime[key][9].value,
        "snowVol" : isWeatherByDateTime[key][11].value,
      })
    } catch (error) {
      console.error("Failed to fetch weather", error);
    }
  };
  // 현재 시간을 기준으로 날씨 정보 출력
  const displayCurrentWeather = () => {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0].replace(/-/g, "");
    const currentTime = (() => {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      // 분이 30분 이상이면 한 시간을 올림
      const roundedHour = minutes >= 30 ? (hours + 1) % 24 : hours; // 23시 다음은 0시
      return roundedHour.toString().padStart(2, "0") + "00";
    })();
    const key = `${currentDate}${currentTime}`;
    console.log(currentDate + " " + currentTime);
    if (weatherByDateTime[key]) {
      return weatherByDateTime[key].map((data, index) => (
        <p key={index}>{`${translateCategoryToKorean(data.category)}: ${data.value}`}</p>
      ));
    }
    return <p>No weather data available for the current time.</p>;
  };


  // 원하는 날짜와 시간 날씨 데이터 받아오기
  /*
  function getWeatherInfoByDateAndTime(isWeatherByDateTime, date, time) {
    const key = `${date}${time}`;
    if (isWeatherByDateTime[key]) {
      console.log(`Weather data for ${date} at ${time}:`);
      isWeatherByDateTime[key].forEach((data, index) => {
        console.log(`${index + 1}. ${translateCategoryToKorean(data.category)}: ${data.value}`);
      });
    } else {
      console.log("No weather data available for the specified date and time.");
    }
  }
  */

  // 날씨 정보 한국어로 매핑하기
  function translateCategoryToKorean(category) {
    const categoryMap = {
      POP: "강수확률",
      PTY: "강수형태", //없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
      PCP: "강수량",
      REH: "습도",
      SNO: "1시간 신적설",
      SKY: "하늘 상태",
      TMP: "1시간 기온",
      TMN: "최저 온도",
      TMX: "최고 온도",
      UUU: "풍속(동서성분)",
      VVV: "풍속(남북성분)",
      WAV: "파고",
      VEC: "풍향",
      WSD: "풍속",
    };
    return categoryMap[category] || "미정의 카테고리";
  }

  // sky value 값 하늘 상태 출력
  function translateSkyValue(value) {
    const numValue = parseInt(value);
    if (numValue <= 3) {
      return "맑음";
    } else if (numValue <= 8) {
      return "구름 많음";
    } else if (numValue <= 10) {
      return "흐림";
    } else {
      return "데이터 범위 초과";
    }
  }

  // vec value 값 바람 방향 출력
  function translateVecValue(value) {
    const numValue = parseInt(value);
    if (numValue >= 337.5 || numValue < 22.5) {
      return "북";
    } else if (numValue >= 22.5 && numValue < 67.5) {
      return "북동";
    } else if (numValue >= 67.5 && numValue < 112.5) {
      return "동";
    } else if (numValue >= 112.5 && numValue < 157.5) {
      return "남동";
    } else if (numValue >= 157.5 && numValue < 202.5) {
      return "남";
    } else if (numValue >= 202.5 && numValue < 247.5) {
      return "남서";
    } else if (numValue >= 247.5 && numValue < 292.5) {
      return "서";
    } else if (numValue >= 292.5 && numValue < 337.5) {
      return "북서";
    } else {
      return "데이터 범위 초과"; // 혹시 모를 예외 상황 처리
    }//없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) 
  }
  function translatePtyValue(value) {
    const numValue = parseInt(value);
    switch (numValue) {
      case 0:
        return "-";
      case 1:
        return '비';
      case 2:
        return '비/눈';
      case 3:
        return '눈';
      case 4:
        return '소나기';
      
      default:
        return "";
    }
  }

  const getCloudImage = (val)=>{
    switch (val) {  
      case '맑음':
        return <WiDaySunny/>
      case '구름 많음':
        return <WiDayCloudy/>;
      case '흐림':
          return <WiCloud/>
      default:
        return <WiNa/>
    }
  }
  const getRainSnowImage = (val)=>{
    switch (val) {  
      case '비':
        return <WiRain/>;
      case '비/눈':
        return <WiRainMix/>;
      case '눈':
          return <WiSnow/>
      case '소나기':
          return <WiRainWind/>
      default:
        return <WiNa/>
    }
  }
  const getRainSnowData = (val)=>{
    switch (val) {  
      case '비':
        return weatherData.rainVol+"mm";
      case '비/눈':
        return weatherData.rainVol+"mm";
      case '눈':
          return weatherData.snowVol+"cm";
      case '소나기':
          return weatherData.rainVol+"mm";
      default:
        return "-";
    }
  }



  return (
    <div className="weather-container">
      <div className="weather-inner">
        <div className="weather-header">
          <div className="weather-location">
            <MdOutlinePinDrop/>
            <p>{props.point.gu}</p>
            <p>{props.point.dong}</p>
          </div>
          <div className="weather-time">
            <p>{now.getHours()}시 날씨</p>
          </div>
        </div>
        <div className="weather-content">
          <div className="weather-main">
            <div className="weather-main-image-container">
              {
                weatherData ?
                  weatherData.rainType === '-'  ?
                    // 비, 눈 제외 나머지
                    getCloudImage(weatherData.cloud)
                  :
                    // 비 or 눈
                    getRainSnowImage(weatherData.rainType)
                : <WiNa/>
              }
              <div className="weather-main-tmp">
                <p>{weatherData.tmp}</p>
                <WiCelsius/>
              </div>
            </div>
            <div className="weather-main-title">
              <p>{weatherData.cloud}</p>
            </div>
            <div className="weather-main-info">
              <div className="weather-tmpMaxMin-info">
                {weatherData.tmpMaxMin ?
                <>
                  <p className="weather-tmpMax">
                    {weatherData.tmpMaxMin.min} /
                  </p>
                  <p>
                    {weatherData.tmpMaxMin.max}
                  </p>
                </>
                :null
                }
              </div>
              <div className="weather-wind-info">
                <p>
                  {weatherData.windVec}풍
                </p>
                <p>
                  {weatherData.windVol}m/s
                </p>
              </div>
            </div>
          </div>
          <div className="weather-three-block">
            <div className="weather-three-block-item humid">
              <p className="weather-three-block-item-title">습도</p>
              <div className="weather-three-block-content">
                <p>{weatherData.hum}</p>
                <p>%</p>
              </div>
            </div>
            <div className="weather-three-block-item rainPer">
              <p className="weather-three-block-item-title">강수확률</p>
              <div className="weather-three-block-content">
                <p>{weatherData.rainPer}</p>
                <p>%</p>
              </div>
            </div>
            <div className="weather-three-block-item rainVol">
              <p className="weather-three-block-item-title">
                {weatherData.rainType == 4 ? "산적설량":"강수량"}
              </p>
              <div className="weather-three-block-content">
                {
                  weatherData ?
                    weatherData.rainType === '-'  ?
                      // 비, 눈 제외 나머지
                      "-"
                    :
                      // 비 or 눈
                      getRainSnowData(weatherData.rainType)
                  : "-"
                }
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherAPI;
