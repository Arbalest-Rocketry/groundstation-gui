import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useFetcher } from 'react-router-dom';
import io from 'socket.io-client';

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
   const [serverIp, setServerIp] = useState('');
   const [prevServerIp, setPrevServerIp] = useState('');
   const [socket, setSocket] = useState(null);
   const [isConnected, setIsConnected] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);
   const defaultPort = '5000'

   const handleDisconnect = useCallback(() => {
      console.log('disconnected from socket.io server');
      setIsConnected(false);
      setIsUpdating(false);
   }, []);

   const handleReconnect = useCallback(() => {
      console.log('reconnecting to socket.io server...');
   },[]);

   const handleConnect = useCallback(() => {
      console.log('connected to socket.io server');
      setIsConnected(true);
   }, []);

   const handleError = useCallback((error) => {
      console.error('connection error:', error);
      setIsConnected(false);
      setIsUpdating(false);
   }, []);

   const connectToServer = useCallback(() => {

      const serverUrl = `http://${serverIp}:${defaultPort}/client`;
      const newSocket = io(serverUrl, {
         transports: ['websocket', 'polling'],
         reconnection: true, 
         reconnectionAttempts: 5,
         reconnectionDelay: 1000
      });

      setPrevServerIp(serverIp);
      setSocket(newSocket);
      
   }, [socket, prevServerIp, isConnected, serverIp]);
useEffect(() => {
  if (socket) {
    console.log('socket has changed');
    console.log(socket.serverUrl);
    console.log('current server ip : '+ serverIp);
  }
}, [socket])

   const disconnectToServer = useCallback(() => {
    console.log('disconnection running');
      if (socket) {
         socket.disconnect();
         socket.close();
         console.log('Manually disconnected from socket.io server');
      }
   }, [socket]);

   const toggleUpdate = useCallback(() => {
      setIsUpdating((prevUpdating) => !prevUpdating);
   },[isUpdating]);
   const handleIpChange = (e) => {
    setServerIp(e.target.value);
  };


   useEffect(() => {
      if (socket) {
         socket.on('connect', handleConnect);
         socket.on('disconnect', handleDisconnect);
         socket.on('reconnect_attempt', handleReconnect); 
         socket.on('connect_error', handleError);
      }

      return () => {
         if (socket) {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('reconnect_attempt', handleReconnect);
            socket.off('connect_error', handleError);
         }
      };
   }, [socket]);

   useEffect(() => {
      if (isConnected && socket) {
         if (isUpdating) {
            socket.emit('graph_update_request');
         } else {
            socket.emit('graph_update_stop');
         }
      }
   }, [isUpdating, isConnected, socket]);

   const value = {
      socket,
      serverIp,
      isConnected,
      isUpdating,
      prevServerIp,
      connectToServer,
      disconnectToServer,
      toggleUpdate,
      handleIpChange
   };

   return (
      <SocketContext.Provider value={value}>
         {children}
      </SocketContext.Provider>
   );
};
