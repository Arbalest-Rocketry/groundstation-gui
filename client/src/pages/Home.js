import React from 'react';
import logo from '../assets/AB_logo.png';
import alpsLogo from '../assets/arbSponsor/alpsLogo.png';
import epoxyLogo from '../assets/arbSponsor/epoxyLogo.png';
import grtLogo from '../assets/arbSponsor/grtLogo.png';
import humberValleyLogo from '../assets/arbSponsor/humberValleyLogo.png';
import lassondeLogo from '../assets/arbSponsor/lassondeLogo.png';
import lclogo from '../assets/arbSponsor/lclogo.png';
import bethune from '../assets/arbSponsor/bethune.png';
import nordSpacelogo from '../assets/arbSponsor/nordSpacelogo.png';

import { useNavigate } from "react-router-dom";
import { useSocketContext } from '../SocketContext.js';
import '../css/Home.css';


export default function Home() {
  const navigate = useNavigate();
  const {
    isConnected,
    serverIp,
    handleIpChange,
    prevServerIp,
    connectToServer,
    disconnectToServer
  } = useSocketContext();

  const items = [
    { id: 'Telemetry', name: 'Telemetry' },
  ];

  return (
    <>
    <div className='Home'>
      <div className='upper'>
        <img className='logo' src={logo} />
        <h1>Arbalest Rocketry Ground Station</h1>

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
            onClick={isConnected ? disconnectToServer: connectToServer}
            >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
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
    <div className='sponsor'>
    <img className='banner' src = {alpsLogo}/>
    <img className='banner' src = {epoxyLogo}/>
    <img className='banner' src = {grtLogo}/>
    <img className='bethune' src = {bethune}/>
    <img className='banner' src = {nordSpacelogo}/>
    <img className='banner' src = {lassondeLogo}/>
    <img className='banner' src = {humberValleyLogo}/>
    <img className='banner' src = {lclogo}/>


    </div>
        </>
  );
}
