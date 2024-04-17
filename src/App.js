import logo from './logo.svg';
import './App.css';
import MapPage  from './pages/MapPage.js';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <MapPage/> } />
      </Routes>
    </div>
  );
}

export default App;
