import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chart from './Chart.js';

const RealTimeChart = () => {
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(true);
  const [keys, setKeys] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [serverIp, setServerIp] = useState('');

  const defaultPort = '5000'; // 기본 포트 설정

  const handleGraphUpdate = (message) => {
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

  useEffect(() => {
    let isMounted = true;

    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleError);
      socket.on('graph_update', handleGraphUpdate);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
        socket.off('graph_update', handleGraphUpdate);
        if (isMounted) {
          socket.close();
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, [socket]);

  const handleIpChange = (e) => {
    setServerIp(e.target.value);
  };

  const connectToServer = () => {
    if (socket) {
      socket.disconnect();
      socket.close();
    }
    const serverUrl = `http://${serverIp}:${defaultPort}/client`;
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);
    setData([]);
    setKeys([]);
    setIsConnected(false);
  };

  return (
    <div>
      <h1>Real-time Data Chart</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <div>
        <input
          type="text"
          value={serverIp}
          onChange={handleIpChange}
          placeholder="Enter server IP"
        />
        <button onClick={connectToServer}>Connect</button>
      </div>
      <button onClick={() => setIsUpdating(!isUpdating)}>
        {isUpdating ? 'Stop Updates' : 'Start Updates'}
      </button>
      {keys.map((key, index) => (
        <Chart key={index} data={data} dataKey={key}></Chart>
      ))}
    </div>
  );
};

export default RealTimeChart;
