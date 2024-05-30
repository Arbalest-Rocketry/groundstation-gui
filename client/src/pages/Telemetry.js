import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSocketContext } from '../SocketContext.js';
import Chart from '../components/Chart.js';
import '../css/Telemetry.css';

import Dropdown from '../components/DropDownMenu.js'

import Box from '../Box.js';
import { Canvas } from '@react-three/fiber';

const Telemetry = () => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [quaternion, setQuaternion] = useState({ q_r: 1, q_i: 1, q_j: 1, q_k: 1 });
  const [highlightedKey, setHighlightedKey] = useState(null);
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
  const chartRefs = useRef({});


  const handleChartClick = useCallback((key) => {
    setHighlightedKey(key);
  }, []);

  const handleGraphUpdate = useCallback((message) => {
    const timestamp = new Date(message.timestamp);
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    const newDataPoint = { x: timeString, ...message };
    setData((prevData) => [...prevData, newDataPoint]);
    const messageKeys = Object.keys(message).filter(key => key !== 'timestamp' && !key.includes('q_'));

    setKeys((prevKeys) => {
      const newKeys = new Set([...prevKeys, ...messageKeys]);
      return Array.from(newKeys);
    });

    if (message.q_r !== undefined 
        && message.q_i !== undefined
         && message.q_j !== undefined
          && message.q_k !== undefined) {
      setQuaternion({
        q_r: message.q_r,
        q_i: message.q_i,
        q_j: message.q_j,
        q_k: message.q_k
      });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('graph_update', handleGraphUpdate);

      return () => {
        socket.off('graph_update', handleGraphUpdate);
      };
    }
  }, [socket, handleGraphUpdate]);


  const scrollToChart = useCallback((key) => {
    if (chartRefs.current[key]) {
      chartRefs.current[key].scrollIntoView({ behavior: 'smooth' });
    }
    handleChartClick(key);
  }, [handleChartClick]);

  const handleContainerClick = useCallback((e) => {
    if (e.target.className === 'chart-container') {
      setHighlightedKey(null);
    }
  }, []);




  const renderedKeys = useMemo(() => keys.map((key, index) => (
    <div
      key={index}
      ref={(el) => (chartRefs.current[key] = el)}
      onClick={() => handleChartClick(key)}
      className={highlightedKey === key ? 'highlighted' : ''}
      style={{ marginBottom: '20px', position: 'relative', zIndex: 1 }}
    >
      <Chart data={data} dataKey={key} />
    </div>
  )), [keys, data, handleChartClick, highlightedKey]);

  return (
    <>
    <Dropdown/>
    <div className='Home'>

    <div onClick={handleContainerClick}>
      <h1>Real-time Data Chart</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div>

        {isConnected && (
          <button className="update-button" onClick={toggleUpdate}>
            {isUpdating ? 'Stop Updates' : 'Start Updates'}
          </button>
        )}
      </div>
      <div className="chart-links">
        {keys.map((key) => (
          <button key={key} onClick={() => scrollToChart(key)}>
            {key}
          </button>
        ))}
      </div>
      <div className="chart-container" style={{ position: 'relative' }}>
        {renderedKeys}
        {keys.length > 0 && (
          <div style={{ height: '400px', position: 'relative', marginTop: '20px' }}>
            <Canvas style={{ position: 'relative', width: '100%', height: '100%', zIndex: 0 }}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Box quaternionData={quaternion} position={[0, 0, 0]} />
            </Canvas>
          </div>
        )}
      </div>
    </div>
    </div>
</>
  );
};

export default Telemetry;
