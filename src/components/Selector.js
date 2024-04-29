import { useState, useRef, useEffect } from 'react';
import React from 'react'
import '../styles/Selector.css'
import { useSelector, useDispatch } from "react-redux"
import {setGu, setDong, setXY} from '../store.js'

const Selector = (props) => {
  let point = useSelector((state) => state.point );
  let dispatch = useDispatch();

  // selector 위치
  const [pos, setPos] = useState("");
  
  // selector 위치 지정
  useEffect(()=>{
    if(props.idx == 1){
      setPos("middle");
    }
    else if(props.idx == 2){
      setPos("right");
    }
    else{
      setPos("")
    }
  },[props.idx])



  return (
    <>
      <div className={'selector-container '+pos}>
        {
          props.idx == 1 ?
            props.data.map((item, idx)=>{
              return(
                <div key={item.gu} className='selector-item' onClick={()=>{dispatch(setGu(""));dispatch(setGu(item.gu));dispatch(setXY([item.longitude, item.latitude])); props.setTabIdx(-1);}}>
                  {item.gu}
                </div>              
              );
            })
          :
            props.idx == 2 ?
              props.data.map((item, idx)=>{
                if(item.gu == point.gu){
                  return(
                    <div key={item.dong} className='selector-item' onClick={()=>{dispatch(setDong(""));dispatch(setDong(item.dong));dispatch(setXY([item.latitude, item.longitude]));props.setTabIdx(-1);}}>
                      {item.dong}
                    </div>              
                  );
                }
              })
            :
              null
        }
      </div>
    </>
  );
}

export default Selector