import React, { useEffect, useState } from 'react';

import Telemetry from './Telemetry.js';


import { Link } from 'react-router-dom';

const Home = () => {
  const items = [
    { id: '', name: 'home' },
    { id: 'Telemetry', name: 'Telemetry' },
    { id: 'analysis', name: 'Analysis' }
  ];

  return (

    <div class="container-fluid">
      <h1>Home</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <Link to={`/${item.id}`} className='homeButtons' >{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
