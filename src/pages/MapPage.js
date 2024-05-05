import { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import "../styles/Map.css"
import "../styles/Detail.css"
import { IoPersonCircle } from "react-icons/io5";
import { GiTwinShell } from "react-icons/gi";
import { MdOutlineMenu, MdSearch, MdOutlineFlood, MdOutlineWbSunny, MdSevereCold, MdGpsFixed, MdFindReplace, MdOutlineClose, MdArrowRight, MdArrowLeft } from "react-icons/md";
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
  useEffect(()=>{
    if(map){
      // map.setZoom(15, false)
      map.updateBy(new navermaps.LatLng(point.longitude, point.latitude), 17);
      dispatch(setXY([0, 0]));
    }
  },[point.latitude, point.longitude]);

  // 데이터 받아오기
  const getData = async()=>{
    let center = map.getCenter();
    let lat = center.x;
    let lon = center.y;
    await axios.get(`/open-api/shelter/search/coordinate?lat=${lat}&lon=${lon}&ditc=ALL`,{
    }).then((res)=>{
      console.log(res);
      if(res.status == 200){
        enrollMarkers(res.data.body);
      }
    })
  }
  const deleteAllMarker = ()=>{
    console.log(markerList);
    markerList.forEach((el)=>{
      el.setMap(null);
    });
    setMarkerList([]);
  }



  // marker 리스트
  const [markerList, setMarkerList] = useState([]);
  // infoWindow 리스트
  const [infoWindowList, setInfoWindowList] = useState([]);

  // 마커등록 함수
  const enrollMarkers = async (data)=>{
    console.log(data);
    // 임시 마커 리스트
    let tMarkers = [];
    // 임시 정보창 리스트
    let tInfos = [];
    // 비동기로 마커, 정보창 생성 및 클릭이벤트리스너 등록
    for await (const it of data) {
      console.log(it);
      // 마커 생성
      let marker = createMarker(it.id, it.name, it.lon, it.lat, it.ditc, it.dtl_adres);
      // 정보창 생성
      let infoWindow = createInfoWindow(it.id, it.name,it.ditc);
      // 이벤트 등록
      navermaps.Event.addListener(marker, 'click', (e) =>{
        markerClickHandler(e, it.id, [...tMarkers,marker], [...tInfos,infoWindow]);
      });
      // 임시 리스트에 각 항목 추가
      tMarkers.push(marker);
      tInfos.push(infoWindow);
    }
    // state 저장
    setMarkerList([...tMarkers]);
    setInfoWindowList([...tInfos]);
  }

  // marker 생성
  const createMarker= (id, name, longitude, latitude, type, address)=>{
    let newMarker = new navermaps.Marker({
      position: new navermaps.LatLng(longitude, latitude),
      id: id,
      map: map,
      title: name,
      type: type.toLowerCase(),
      address : address,
      clickable: true,
      icon: {
         //html element를 반환하는 CustomMapMarker 컴포넌트 할당
        content: MarkerShape(type.toLowerCase()),
         //마커의 크기 지정
        size: new navermaps.Size(28, 28),
         //마커의 기준위치 지정
        anchor: new navermaps.Point(19, 58),
        },
    });
    return newMarker;
  }
  // infoWindow 생성
  const createInfoWindow = (id, name, type)=>{
    let infoWindow = new navermaps.InfoWindow({
      content: [
        '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
        `   <div style="font-weight: bold; margin-bottom: 5px;">${name}</div>`,
        `   <div style="font-size: 13px;">${type=="FLOOD"?"수해 대피소":type=="EARTHQUAKE"?"지진 대피소":type=="HOT"?"무더위 쉼터":type=="COLD"?"한파 쉼터":"-"}<div>`,
        "</div>",
      ].join(""),
      id: id,
      maxWidth: 300,
      anchorSize: {
        width: 12,
        height: 14,
      },
      borderColor: "#cecdc7",
    });
    return infoWindow;
  }

  // 마커 클릭 이벤트 핸들러
  const markerClickHandler= (e, id, markerList, infoWindowList)=>{
    map.panTo(new navermaps.LatLng(e.overlay.position.y, e.overlay.position.x));
    
    setDetailOnOff("on");
    setDetailData({"name":e.overlay.title, "type":e.overlay.type, "address":e.overlay.address});
    
    let infoWindowTarget = infoWindowList.filter(it=>it.id == id)[0];
    infoWindowTarget.open(map, markerList.filter(it=>it.id == id)[0]);
    let idx = infoWindowList.indexOf(infoWindowTarget);
    setInfoWindow(infoWindowTarget);
    setDetailClickIdx(idx);
    scrollRef.current[idx].scrollIntoView({ behavior: "smooth" });
  }
  // detail OnOff css
  const [detailOnOff, setDetailOnOff] = useState("off");

  // detail data
  const [detailData, setDetailData] = useState(null);
  
  // detail click idx
  const [detailClickIdx, setDetailClickIdx] = useState(null);
  const scrollRef = useRef([]);
  const handleScrollView = (event, idx) => {
    scrollRef.current[idx].scrollIntoView({ behavior: "smooth" });
  };
  const DetailContent = (props)=>{
    return(
      <>
        <div className={props.idx==detailClickIdx?"detail-content-container clicked":"detail-content-container" } onClick={async()=>{
          setDetailClickIdx(props.idx);
          map.panTo(new navermaps.LatLng(props.lon, props.lat));
          console.log(infoWindowList);
          console.log(props.id);
          let infoWindowTarget = infoWindowList.filter(it=>it.id == props.id)[0];
          infoWindowTarget.open(map, markerList.filter(it=>it.id == props.id)[0]);
          setInfoWindow(infoWindowTarget);
        }}>
          <div className={"detail-content-header "+props.type.toLowerCase()}>
            <p className='detail-content-name'>{props.name}</p>
            <div className={'detail-content-type '+props.type.toLowerCase()}>
              {
                props.type=="FLOOD"?
                  <>
                    <MdOutlineFlood className='flood-icon'/>
                    <p>수해 대피소</p>
                  </>
                :props.type=="EARTHQUAKE"?
                  <>
                    <RiEarthquakeLine className='earthquake-icon'/>
                    <p>지진 대피소</p>
                  </>
                :props.type=="HOT"?
                  <>
                    <MdOutlineWbSunny className='swelter-icon'/>
                    <p>무더위 쉼터</p>
                  </>
                :props.type=="COLD"?
                  <>
                    <MdSevereCold className='severeCold-icon'/>:"-"
                    <p>한파 쉼터</p>
                  </>
                : <><p>-</p></>
              }
            </div>
          </div>
          <div className={'detail-content '}>
            {props.address}
          </div>
        </div>
      </>
    );
  }

  // 마커 생성
  // TODO : 현재 지역 검색 버튼 누르면 데이터 필터링 후 반환된 데이터들에 대해서 생성하도록 변경/데이터 수만큼 createMarker() 호출
  useEffect(()=>{
    if(map){
      // createMarker(0, "천호2동주민센터", 37.5435257, 127.1254351, "flood");
      // createMarker(1, "양재2동주민센터", 37.470601, 127.041188, "hot");
      console.log(map);
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
        {
          detailOnOff ?
          <div className="detail-open-button-container" onClick={()=>{if(detailOnOff==="off"){setDetailOnOff("on")}}}>
            <MdArrowRight/>
          </div>
          :null
        }
        <div className={"detail-container "+detailOnOff}>
          <div className="detail-close-button-container" onClick={()=>{if(detailOnOff==="on"){setDetailOnOff("off")}}}>
            <MdArrowLeft/>
          </div>
          <div className="detail-header">
          </div>
          <div className='detail-body'>
          {
            markerList.length !== 0 ?
              markerList.map((el, idx)=>{
                return (
                  <div ref={(el) => (scrollRef.current[idx] = el)} >
                    <DetailContent idx={idx} type={el.type.toUpperCase()} name={el.title} lon={el.position.y} lat={el.position.x} address={el.address} id={el.id}/>
                  </div>
              )
              })
            :
              null
          }
          </div>
        </div>
        {
              resetBtnOnOff ?
              <div className='reset-button-container'>
                <div className="reset-button" 
                onClick={()=>{
                  setResetBtnOnOff(false);
                  deleteAllMarker();
                  getData();
                  setDetailOnOff("on");
                }
                  }>
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
              // console.log(markerList);
              // console.log(infoWindowList);
              // setDetailOnOff("on");
            }}>
              <div className="nav-logo-container">
                <MdOutlineMenu className='menu-icon'/>
                <GiTwinShell className='logo-icon'/>
                <p>천재지변</p>
              </div>
              <div className="nav-input-container">
                <input type="text" placeholder='주소, 대피소, 쉼터를 검색하세요' onClick={(e)=>{e.stopPropagation();}}/>
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
