import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSocketContext } from '../SocketContext';
import Chart from './Chart.js';
import '../css/Telemetry.css';

import Box from '../Box';
import { Canvas } from '@react-three/fiber';

const Telemetry = () => {
  const [serverIp, setServerIp] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [quaternion, setQuaternion] = useState({ q_r: 1, q_i: 1, q_j: 1, q_k: 1 });
  const [highlightedKey, setHighlightedKey] = useState(null);
  const { socket, isConnected, connectToServer } = useSocketContext();
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

//   // Generatae random quanternion data
//   const generateRandomQuaternion = () => {
//     return {
//       qr: Math.random() * 2 - 1,
//       qi: Math.random() * 2 - 1,
//       qj: Math.random() * 2 - 1,
//       qk: Math.random() * 2 - 1,
//     };
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setQuaternion(generateRandomQuaternion());
//     }, 1000); // generate every 1second

//     return () => clearInterval(interval); // clear Interval when the component is unmounted
//   }, []);

  useEffect(() => {
    if (socket) {
      socket.on('graph_update', handleGraphUpdate);

      return () => {
        socket.off('graph_update', handleGraphUpdate);
      };
    }
  }, [socket, handleGraphUpdate]);

  const handleIpChange = useCallback((e) => {
    setServerIp(e.target.value);
  }, []);

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

  const toggleConnection = useCallback(() => {
    if (isConnected) {
      if (socket) {
        socket.disconnect();
        socket.close();
      }
    } else {
      connectToServer(serverIp);
    }
  }, [isConnected, socket, serverIp, connectToServer]);

  const toggleUpdate = useCallback(() => {
    setIsUpdating((prevUpdating) => !prevUpdating);
  }, []);

  useEffect(() => {
    if (isConnected && socket) {
      if (isUpdating) {
        socket.emit('graph_update_request');
      } else {
        socket.emit('graph_update_stop');
      }
    }
  }, [isConnected, socket, isUpdating]);

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
    <div onClick={handleContainerClick}>
      <h1>Real-time Data Chart</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div>
        <input
          type="text"
          value={serverIp}
          onChange={handleIpChange}
          placeholder="Enter server IP"
        />
        <button className="ip-connection-button" onClick={toggleConnection}>
          {isConnected ? 'Disconnect' : 'Connect'}
        </button>
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
  );
};

export default Telemetry;
