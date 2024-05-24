import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/AB_logo.png';
import { Collapse } from 'react-bootstrap';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const handleRepo = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className={`border-end bg-white `} id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">
        <span className='AB_logo'></span>
        <img src={logo} alt="Arbalest Rocketry Logo" />
      </div>
      <div className="list-group list-group-flush">
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/">Home</Link>
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/realTimeChart">Real-Time-Chart</Link>
        
        <button className='list-group-item list-group-item-action list-group-item-light p-3'
          onClick={handleRepo}
        >
          Repository
        </button>
        <Collapse in={!isCollapsed}>
          <div id="navbarSupportedContent">
            <a
              className="list-group-item list-group-item-action list-group-item-light p-3"
              href="https://github.com/Arbalest-Rocketry/flightcomputer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Flight Computer
            </a>
            <a
              className="list-group-item list-group-item-action list-group-item-light p-3"
              href="https://github.com/Arbalest-Rocketry/Ground-Station-GUI"
              target="_blank"
              rel="noopener noreferrer"
            >
              GUI
            </a>

          </div>
        </Collapse>
      </div>
    </div>
  );
}

export default Navbar;
