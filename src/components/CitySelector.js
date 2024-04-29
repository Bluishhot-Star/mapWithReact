import { useState, useRef, useEffect } from 'react';
import "../styles/CitySelector.css"
import GU_geo from '../api/GU_geo.json';
import Dong_geo from '../api/DONG_geo.json';

import Selector from './Selector';

import { useSelector, useDispatch } from "react-redux"
import {setGu, setDong} from '../store.js'


const CitySelector = (props)=>{
  let point = useSelector((state) => state.point );
  let dispatch = useDispatch();

  let guList = GU_geo;
  let dongList = Dong_geo;

  // 탭 인덱스
  const [tabIdx, setTabIdx] = useState(-1);
  // 탭 클릭 처리 함수
  const tabClick = (idx)=>{
    if(tabIdx!==idx){
      setTabIdx(idx);
    }else{
      setTabIdx(-1);
    }
  }
  // map 클릭시 selector Off
  useEffect(()=>{
    if(!props.onOff){
      setTabIdx(-1);
    }
  },[props.onOff])
  useEffect(()=>{
    if(tabIdx !== -1){
      props.setOnOff(true);
    }
  },[tabIdx])

  // 선택된 구, 동 관리
  
  const [guContent, setGuContent] = useState("");
  const [dongContent, setDongContent] = useState("");

  useEffect(()=>{
    setTabIdx(-1);
  },[point])
  
  useEffect(()=>{
    dispatch(setDong(""));
  },[point.gu])

  return(
      <div className='city-selector-container'>
        <div className="city-selector-inner">
          <div className="city-container" onClick={(e)=>{e.preventDefault(); tabClick(0)}}>
            <p>서울특별시</p>
          </div>
          <div className="gu-container"onClick={(e)=>{e.preventDefault();tabClick(1)}}>
            <p>{point.gu}</p>
          </div>
          <div className="dong-container"onClick={(e)=>{e.preventDefault();tabClick(2)}}>
            <p>{point.dong}</p>
          </div>
        </div>
        <RenderTab idx={tabIdx} setTabIdx={setTabIdx}/>
      </div>
  );
}
export default CitySelector;

const RenderTab = (props)=>{
  switch(props.idx){
    case 0:
      break;
    case 1:
      return <Selector data={GU_geo} idx={1} setTabIdx={props.setTabIdx}/>;
      break;
    case 2:
      return <Selector data={Dong_geo} idx={2} setTabIdx={props.setTabIdx}/>;
      break;
    default:
      break;
  }
}

