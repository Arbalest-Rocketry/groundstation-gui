import React, { useState, useEffect, useCallback, useRef } from 'react';
import useSocket from '../Socket';
import Chart from './Chart.js';
import '../css/RealTimeChart.css';

const RealTimeChart = () => {
  const [serverIp, setServerIp] = useState('');
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [highlightedKey, setHighlightedKey] = useState(null);
  const { socket, isConnected, connectToServer, setIsConnected } = useSocket(serverIp);
  const chartRefs = useRef({});
  const [isUpdating, setIsUpdating] = useState(false); // 상태 추가: 업데이트 중인지 여부

  const handleGraphUpdate = useCallback((message) => {
    const timestamp = new Date(message.timestamp);
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    const newDataPoint = { x: timeString, ...message };
    setData((prevData) => [...prevData, newDataPoint]);

    const messageKeys = Object.keys(message).filter(key => key !== 'timestamp');
    setKeys((prevKeys) => {
      const newKeys = new Set([...prevKeys, ...messageKeys]);
      return Array.from(newKeys);
    });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('graph_update', handleGraphUpdate);

      return () => {
        socket.off('graph_update', handleGraphUpdate);
      };
    }
  }, [socket, handleGraphUpdate]);

  const handleIpChange = (e) => {
    setServerIp(e.target.value);
  };

  const scrollToChart = (key) => {
    if (chartRefs.current[key]) {
      chartRefs.current[key].scrollIntoView({ behavior: 'smooth' });
    }
    handleChartClick(key);
  };

  const handleChartClick = (key) => {
    setHighlightedKey(key);
  };

  const handleContainerClick = (e) => {
    if (e.target.className === 'chart-container') {
      setHighlightedKey(null);
    }
  };

  const toggleConnection = () => {
    if (isConnected) {
      if (socket) {
        socket.disconnect();
        socket.close();
      }
      setIsConnected(false);
    } else {
      connectToServer();
    }
  };

  const toggleUpdate = () => {
    if (isUpdating) {
      if (socket) {
        socket.emit('graph_update_stop');
      }
      setIsUpdating(false);
    } else {
      if (socket) {
        socket.emit('graph_update_request');
      }
      setIsUpdating(true);
    }
  };

  useEffect(() => {
    if (isConnected && socket) {
      socket.emit('graph_update_request');
      setIsUpdating(true);
    }
  }, [isConnected, socket]);

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
      <div className="chart-container">
        {keys.map((key, index) => (
          <div
            key={index}
            ref={(el) => (chartRefs.current[key] = el)}
            onClick={() => handleChartClick(key)}
            className={highlightedKey === key ? 'highlighted' : ''}
          >
            <Chart data={data} dataKey={key} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeChart;
