import React from 'react';
import logo from '../assets/AB_logo.png';
import { useNavigate } from "react-router-dom";
import { useSocketContext } from '../SocketContext.js';
import '../css/Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const {
    socket,
    isConnected,
    connectToServer,
    serverIp,
    setServerIp,
    toggleUpdate,
    handleIpChange,
    toggleConnection,
    isUpdating
  } = useSocketContext();

  const items = [
    { id: 'Telemetry', name: 'Telemetry' },
    { id: 'analysis', name: 'Analysis' }
  ];

  return (
    <div className='Home'>
      <div className='upper'>
        <img className='logo' src={logo} />
        <h1>Arbalest Rocketry Ground Station</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control custom-margin-top"
            value={serverIp}
            onChange={handleIpChange}
            placeholder="Enter server IP"
            aria-label="Search"
            aria-describedby="button-addon2"
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={toggleConnection}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
        {items.map((item) => (
          <button
            key={item.id}
            className='btn btn-light'
            onClick={() => navigate(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
