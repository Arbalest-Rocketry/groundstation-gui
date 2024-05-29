import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Setting from './components/Setting';
import Navbar from './components/Navbar';
import DropdownMenu from './components/DropDownMenu';
import Telemetry from './components/Telemetry';
import Analysis from './components/analysis';


import { SocketProvider } from './SocketContext';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

const App = () => {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('sb-sidenav-toggled', isToggled);
  }, [isToggled]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <>
      <div className={`d-flex ${isToggled ? 'sb-sidenav-toggled' : ''}`} id="wrapper">
        <SocketProvider>
          <Router>
            <Navbar />
            <div id="page-content-wrapper">
              <DropdownMenu onToggle={handleToggle} />
              <div className="container-fluid">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Telemetry" element={<Telemetry />} />
                  <Route path="/setting" element={<Setting />} />
                  <Route path="/analysis" element={<Analysis />} />
                </Routes>
              </div>
            </div>
          </Router>
          
        </SocketProvider>
      </div>
    </>
  );
};

export default App;
