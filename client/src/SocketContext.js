import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [serverIp, setServerIp] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
/**
 * handle connect
 * set IsConnected to true
 */
  const handleConnect = useCallback(() => {
    console.log('connected to socket.io server');
    setIsConnected(true);
  }, []);
/**
 * handle Disconnection
 * set isConnected to false
 */
  const handleDisconnect = useCallback(() => {
    console.log('disconnected from socket.io server');
    setIsUpdating(false);
    setIsConnected(false);
  }, []);
  /**
   * handle connection error
   * if error occurs, set is Connect to false
  */
 const handleError = useCallback((error) => {
   console.error('connection error:', error);
   setIsUpdating(false);
    setIsConnected(false);
  }, []);
  /**
   * 
   */
  const connectToServer = useCallback((serverIp, defaultPort = '5000') => {
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
  }, [socket]);

  const handleIpChange = useCallback((e) => {
    setServerIp(e.target.value);
  }, []);

  const toggleConnection = useCallback(() => {
    if (isConnected) {
      if (socket) {
        socket.disconnect();
        socket.close();
        setIsConnected(false);
      }
    } else {
      connectToServer(serverIp);
    }
  }, [isConnected, socket, serverIp, connectToServer]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleError);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleError);
      };
    }
  }, [socket, handleConnect, handleDisconnect, handleError]);

  useEffect(() => {
    if (isConnected && socket) {
      if (isUpdating) {
        socket.emit('graph_update_request');
      } else {
        socket.emit('graph_update_stop');
      }
    }
  }, [isUpdating, isConnected, socket]);

  const toggleUpdate = useCallback(() => {
    setIsUpdating((prevUpdating) => !prevUpdating);
  }, []);

  const value = {
    socket,
    isConnected,
    connectToServer,
    serverIp,
    setServerIp,
    toggleUpdate,
    handleIpChange,
    toggleConnection,
    isUpdating
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
