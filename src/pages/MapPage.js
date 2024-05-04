import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import "../styles/Map.css"
import { IoPersonCircle } from "react-icons/io5";
import { GiTwinShell } from "react-icons/gi";
import { MdOutlineMenu, MdSearch, MdOutlineFlood, MdOutlineWbSunny, MdSevereCold, MdGpsFixed, MdFindReplace, MdOutlineClose } from "react-icons/md";
import { RiEarthquakeLine } from "react-icons/ri";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, GroundOverlay, InfoWindow } from 'react-naver-maps'
import CitySelector from '../components/CitySelector';
import MarkerShape from '../components/MarkerShape';
import { useSelector, useDispatch } from "react-redux"
import {setGu, setDong, setXY} from '../store.js'

const MapPage = ()=>{
  // redux/ selector 선택 후 지도 이동을 위한 좌표 객체
  let point = useSelector((state) => state.point );
  let dispatch = useDispatch();

  // 네이버 지도 객체
  const navermaps = useNavermaps();

  // 지도 ref
  const [map, setMap] = useState(null);
  const [infowindow, setInfoWindow] = useState(null);

  // 서울 전지역 디스플레이 좌표
  const seoul = new navermaps.LatLngBounds(
    new navermaps.LatLng(37.42829747263545, 126.76620435615891),
    new navermaps.LatLng(37.7010174173061, 127.18379493229875),
  )

  // selector OnOff 상태 state
  const [selectorOnOff, setSelectorOnOff] = useState(false);
  
  // right buttons on/off
  const [floodButtonOn, setFloodButtonOn] = useState(false);
  const [earthQuakeButtonOn, setEarthQuakeButtonOn] = useState(false);
  const [hotButtonOn, setHotButtonOn] = useState(false);
  const [coldButtonOn, setColdButtonOn] = useState(false);

  // 지역 selector 선택 시 해당 좌표로 이동 -> point.latitude, point.longitude 변화
  //! 현재 point는 지도의 중앙 위치 좌표를 담음.
  useEffect(()=>{
    if(map){
      // map.setZoom(15, false)
      map.updateBy(new navermaps.LatLng(point.longitude, point.latitude), 17);
      dispatch(setXY([0, 0]));
    }
  },[point.latitude, point.longitude]);

  // marker 리스트
  const createMarkerList = [];
  const createFloodMarkerList = [];
  const createSwelterMarkerList = [];
  const createColdMarkerList = [];
  const createEarthQuakeMarkerList = [];
  // infoWindow 리스트
  const floodInfoWindowList = [];
  const swelterInfoWindowList = [];
  const coldInfoWindowList = [];
  const earthQuakeInfoWindowList = [];
  const infoWindowList = [];

  // marker 생성
  // TODO : 데이터를 API로 부터 받아와서 생성하기
  const createMarker= (id, name, latitude, longitude, type)=>{
    let newMarker = new navermaps.Marker({
      position: new navermaps.LatLng(latitude, longitude),
      map,
      title: name,
      type: type,
      clickable: true,
      icon: {
         //html element를 반환하는 CustomMapMarker 컴포넌트 할당
        content: MarkerShape(type),
         //마커의 크기 지정
        size: new navermaps.Size(28, 28),
         //마커의 기준위치 지정
        anchor: new navermaps.Point(19, 58),
        },
    });
    // marker 리스트에 삽입
    createMarkerList.push(newMarker);
    console.log(createMarkerList);
    // marker click 이벤트 핸들러 등록
    navermaps.Event.addListener(newMarker, 'click', (e) =>
      markerClickHandler(e,id)
    );

    let infoWindow = new navermaps.InfoWindow({
      content: [
        '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
        `   <div style="font-weight: bold; margin-bottom: 5px;">${name}</div>`,
        `   <div style="font-size: 13px;">${type}<div>`,
        "</div>",
      ].join(""),
      maxWidth: 300,
      anchorSize: {
        width: 12,
        height: 14,
      },
      borderColor: "#cecdc7",
    });
    infoWindowList.push(infoWindow);
  }

  // 마커 클릭 이벤트 핸들러
  const markerClickHandler= (e,id)=>{
    console.log(e,id);
    map.panTo(new navermaps.LatLng(e.overlay.position.y, e.overlay.position.x));
    setDetailOnOff("on");
    infoWindowList[id].open(map, createMarkerList[id]);
    setInfoWindow(infoWindowList[id]);
  }
  // detail OnOff css
  const [detailOnOff, setDetailOnOff] = useState("off");
  

  // 마커 생성
  // TODO : 현재 지역 검색 버튼 누르면 데이터 필터링 후 반환된 데이터들에 대해서 생성하도록 변경/데이터 수만큼 createMarker() 호출
  useEffect(()=>{
    if(map){
      createMarker(0, "천호2동주민센터", 37.5435257, 127.1254351, "flood");
      createMarker(1, "양재2동주민센터", 37.470601, 127.041188, "hot");
    }
  },[map])

  

  // 리셋버튼 디스플레이
  const [resetBtnOnOff, setResetBtnOnOff] = useState(false);


  // 중심 위치 변경 이벤트 핸들러
  const changeCenter = (e)=>{
    setResetBtnOnOff(true);
    if(map){
      // 좌표 -> 주소 변환
      navermaps.Service.reverseGeocode({
        coords: new navermaps.LatLng(e.y, e.x),
      }, function(status, response) {
          if (status !== navermaps.Service.Status.OK) {
              return alert('Something wrong!');
          }
  
          let res = response.v2, // 검색 결과의 컨테이너
              address = res.address; // 검색 결과로 만든 주소
          console.log(e.y, e.x);
          console.log(address.jibunAddress.trim().split(' '));
          let result = address.jibunAddress.trim().split(' '); // 지도 중앙의 주소 배열 (시 / 구 / 동)
          // point.Gu, point.Dong 변화
          dispatch(setGu(result[1]))
          dispatch(setDong(""));
          dispatch(setDong(result[2]));
      });
    }
  }


  

  return(
    <>
      

      <div className='map-page-container'>
        <div className={"detail-container "+detailOnOff}>
          <div className="detail-close-button-container" onClick={()=>{if(detailOnOff==="on"){setDetailOnOff("off")}}}>
            <MdOutlineClose/>
          </div>
          <div className="detail-header">
            
          </div>
        </div>
        {
              resetBtnOnOff ?
              <div className='reset-button-container'>
                <div className="reset-button" 
                onClick={()=>{setResetBtnOnOff(false)}}>
                  <p>이 지역의</p>
                  {
                    !floodButtonOn&&!earthQuakeButtonOn&&!hotButtonOn&&!coldButtonOn ?
                    <>
                      <MdOutlineFlood className='flood-icon'/>
                      <RiEarthquakeLine className='earthquake-icon'/>
                      <MdOutlineWbSunny className='swelter-icon'/>
                      <MdSevereCold className='severeCold-icon'/>
                    </>
                    :
                    <>
                      {
                        floodButtonOn?<MdOutlineFlood className='flood-icon'/>:null
                      }
                      {
                        earthQuakeButtonOn?<RiEarthquakeLine className='earthquake-icon'/>:null
                      }
                      {
                        hotButtonOn?<MdOutlineWbSunny className='swelter-icon'/>:null
                      }
                      {
                        coldButtonOn?<MdSevereCold className='severeCold-icon'/>:null
                      }
                    </>
                  }
                  <p>검색하기</p>
                  {/* <MdFindReplace className='find-marker-icon'/> */}
                </div>
              </div>
              :<div></div>
            }
        <div className="nav-container">
          <div className="nav-left-container">

            <div className="nav-button" onClick={()=>{
              // console.log(point);
              // createMarker(2, "사당2동주민센터", 37.4887323, 126.9792598, "cold");
            }}>
              <div className="nav-logo-container">
                <MdOutlineMenu className='menu-icon'/>
                <GiTwinShell className='logo-icon'/>
                <p>천재지변</p>
              </div>
              <div className="nav-input-container">
                <input type="text" />
                <MdSearch className='search-icon'/>
              </div>
            </div>

          </div>
          <CitySelector onOff={selectorOnOff} setOnOff={setSelectorOnOff}/>
          <div className="nav-right-container">
            <div className={floodButtonOn?"on nav-button-text " :"nav-button-text"} onClick={()=>{setFloodButtonOn(!floodButtonOn)}}>
              <MdOutlineFlood className='flood-icon'/>
              <p>수해 대피소</p>
            </div>
            <div className={earthQuakeButtonOn?"on nav-button-text " :"nav-button-text"} onClick={()=>{setEarthQuakeButtonOn(!earthQuakeButtonOn)}}>
              <RiEarthquakeLine className='earthquake-icon'/>
              <p>지진 대피소</p>
            </div>
            <div className={hotButtonOn?"on nav-button-text " :"nav-button-text"} onClick={()=>{setHotButtonOn(!hotButtonOn)}}>
              <MdOutlineWbSunny className='swelter-icon'/>
              <p>무더위 쉼터</p>
            </div>
            <div className={coldButtonOn?"on nav-button-text " :"nav-button-text"} onClick={()=>{setColdButtonOn(!coldButtonOn)}}>
              <MdSevereCold className='severeCold-icon'/>
              <p>한파 쉼터</p>
            </div>
            <div className="nav-button-profile">
              <IoPersonCircle/>
            </div>
          </div>
        </div>

        <div className="right-map-button-container">
          <div className="right-map-button" onClick={(e) => {
            e.preventDefault()
            if (map) {
              map.panToBounds(seoul)
            }
          }}>
            <p>서울</p>
          </div>
          <div className="right-map-button">
            <MdGpsFixed/>
          </div>
        </div>
        <MapDiv className='map'>
          <NaverMap
            ref={setMap}
            onClick={()=>{
              if(selectorOnOff){setSelectorOnOff(false)}
              if(infowindow){infowindow.close()}
            }}
            defaultCenter={new navermaps.LatLng(37.5648117, 126.9750053)}
            defaultZoom={11}
            disableKineticPan={false}
            scaleControl={true}
            zoomControl={true}
            onCenterChanged={(e)=>{changeCenter(e)}}
            minZoom={7}
            maxZoom={21}
            zoomControlOptions={{
              style:navermaps.ZoomControlStyle.SMALL,
              position: 8,
            }}
          >
          </NaverMap>
        </MapDiv>

      </div>
    </>
  );
  
}

export default MapPage;
