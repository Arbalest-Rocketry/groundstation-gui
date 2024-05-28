// useSocket.js
import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const useSocket = (serverIp, defaultPort = '5000') => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConnect = useCallback(() => {
    console.log('connected to socket.io server');
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log('disconnected from socket.io server');
    setIsConnected(false);
  }, []);

  const handleError = useCallback((error) => {
    console.error('connection error:', error);
    setIsConnected(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleError);
      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
        if (isMounted) {
          socket.close();
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, [socket, handleConnect, handleDisconnect, handleError]);

  const connectToServer = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket.close();
      setIsConnected(false);
    }
    const serverUrl = `http://${serverIp}:${defaultPort}/client`;
    const newSocket = io(serverUrl, {
        transports: ['websocket', 'polling'],
    });
    
    setSocket(newSocket);
    setIsConnected(true);
  }, [serverIp, defaultPort, socket]);

  return {
    socket,
    isConnected,
    isUpdating,
    connectToServer,
    setIsConnected, // 추가된 부분
    setIsUpdating
  };
};

export default useSocket;
