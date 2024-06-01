import React, { useRef, useState} from 'react';
import logo from '../assets/AB_logo.png';
import '../css/DropDownMenu.css';
import { useNavigate } from "react-router-dom";
import { Collapse} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSocketContext } from '../SocketContext.js';

const DropdownMenu = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {
    isConnected,
    serverIp,
    handleIpChange,
    toggleConnection
  } = useSocketContext();


  const handleRepo = () => {
    setIsCollapsed(!isCollapsed);
  };


  const navigate = useNavigate();

  return (
    <>
    <div className='banner d-flex justify-content-center align-items-center'>
      <img
          className='img-fluid'
          src={logo}
          alt="Logo"
          onClick={() => navigate('/')}
        />
    </div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid ">
    <Link className="navbar-brand" to='/Telemetry'>Telemetry</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0" >

        {/* <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li> */}
        <li className="nav-item">
            <button
              className='list-group-item list-group-item-action list-group-item-light p-3'
              onClick={handleRepo}
            >
              Repository
            </button>
          </li>
        <li class="nav-item dropdown" >
        <Collapse in={!isCollapsed} dimension="width">
              <div className="collapsible-content" style={{ display: isCollapsed ? 'none' : 'flex' }}>
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
                  href="https://github.com/Arbalest-Rocketry/groundstation-gui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GUI
                </a>
              </div>
            </Collapse>
        </li>
      </ul>

    </div>
    
    <input type="text" class="form-control" value={serverIp}
          onChange={handleIpChange}
          placeholder="Enter server IP"
          aria-label="Search" aria-describedby="button-addon2"/>
  <button class="btn btn-outline-secondary"
    type="button"
      id="button-addon2"
      onClick={toggleConnection}>{isConnected ? 'Disconnect' : 'Connect'}</button>
  </div>
</nav>

    </>
  );
}

export default DropdownMenu;
