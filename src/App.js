import logo from './logo.svg';
import './App.css';
import MapPage  from './pages/MapPage.js';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { NavermapsProvider } from 'react-naver-maps';

function App() {
  return (
    <NavermapsProvider 
      ncpClientId={process.env.REACT_APP_MAP_CLIENT_ID}
    >
    <div className="App">
      <Routes>
        <Route path="/" element={ <MapPage/> } />
      </Routes>
    </div>
    </NavermapsProvider>
  );
}

export default App;
