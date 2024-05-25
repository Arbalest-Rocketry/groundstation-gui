import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Setting from './components/Setting'
import Navbar from './components/Navbar';
import DropdownMenu from './components/DropDownMenu';
import RealTimeChart from './components/RealTimeChart';
import Analysis from './components/analysis';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css'
const App = () => {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('sb-sidenav-toggled', isToggled);
  }, [isToggled]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div className={`d-flex ${isToggled ? 'sb-sidenav-toggled' : ''}`} id="wrapper">

      <Router>
      <Navbar />
        <div id="page-content-wrapper">
        <DropdownMenu onToggle={handleToggle} />
 
                <div class="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realTimeChart" element={<RealTimeChart />} />
          <Route path="/setting" element={<Setting/>}></Route>
          <Route path="/analysis" element={<Analysis/>}></Route>
        </Routes>
                </div>
            </div>

      </Router>

    </div>


  );
};

export default App;
