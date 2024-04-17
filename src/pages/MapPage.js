import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { IoPersonCircle } from "react-icons/io5";
import { GiTwinShell } from "react-icons/gi";
import { MdOutlineMenu, MdSearch, MdOutlineFlood, MdOutlineWbSunny, MdSevereCold } from "react-icons/md";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

import MyMap from '../components/Map';

const MapPage = ()=>{
  return(
    <>
      <div className='map-page-container'>
        <div className="nav-container">
          <div className="nav-left-container">

            <div className="nav-button">
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
          <div className="nav-right-container">
            <div className="nav-button-text">
              <MdOutlineFlood className='flood-icon'/>
              <p>수해 대피소</p>
            </div>
            <div className="nav-button-text">
              <MdOutlineWbSunny className='swelter-icon'/>
              <p>무더위 쉼터</p>
            </div>
            <div className="nav-button-text">
              <MdSevereCold className='severeCold-icon'/>
              <p>한파 쉼터</p>
            </div>
            <div className="nav-button-profile">
              <IoPersonCircle/>
            </div>
          </div>
        </div>
        <MapDiv className='map'
          style={{
            width: '100vw',
            height: '100vh',
          }}
        >
          <MyMap />
        </MapDiv>
      </div>
    </>
  );
  
}

export default MapPage;
