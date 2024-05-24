
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chart from './Chart.js';
import Socket from './Socket.js'

// Use the correct ngrok URL
const socket = io("http://IPv4:5000/client", {
  transports: ['websocket', 'polling'],
});
// const socket = io("http://localhost:5000/client");

const RealTimeChart = () => {
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(true); // state to control updates
  const [keys, setKeys] = useState([]); // keep track of data keys
  const [isConnected, setIsConnected] = useState(false); // state to track connection status

  useEffect(() => {
    const handleGraphUpdate = (message) => {
      const timestamp = new Date(message.timestamp);
      const hours = timestamp.getHours();
      const minutes = timestamp.getMinutes();
      const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`; // format as HH:MM

      const newDataPoint = { x: timeString, ...message };
      setData((prevData) => [...prevData, newDataPoint]);

      const messageKeys = Object.keys(message).filter(key => key !== 'timestamp');
      setKeys((prevKeys) => {
        const newKeys = new Set([...prevKeys, ...messageKeys]);
        return Array.from(newKeys);
      });
    };

    const handleConnect = () => {
      console.log('connected to socket.io server');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('disconnected from socket.io server');
      setIsConnected(false);
    };

    const handleError = (error) => {
      console.error('connection error:', error);
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    if (isUpdating) {
      socket.on('graph_update', handleGraphUpdate);
    } else {
      socket.off('graph_update', handleGraphUpdate);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
      socket.off('graph_update', handleGraphUpdate);
    };
  }, [isUpdating]);

  return (
    <div>
      <h1>Real-time Data Chart</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={() => setIsUpdating(!isUpdating)}>
        {isUpdating ? 'Stop Updates' : 'Start Updates'}
      </button>
      {keys.map((key, index) => (
        <Chart key={index} data={data} dataKey={key}></Chart>
      ))}
    </div>
  );
};

export default RealTimeChart
