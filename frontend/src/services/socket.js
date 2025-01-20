import { io } from 'socket.io-client';

export const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('token'),
  },
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});
