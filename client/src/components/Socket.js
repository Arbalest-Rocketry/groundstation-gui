import io from 'socket.io-client';
const socket = io("IPv4:5000/client", {
  transports: ['websocket', 'polling'],
});
export default socket;
