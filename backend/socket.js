import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Socket authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Join user's personal room
    socket.join(`user_${socket.userId}`);

    socket.on('join_chat', (chatId) => {
      console.log(`User ${socket.userId} joined chat ${chatId}`);
      socket.join(`chat_${chatId}`);
    });

    socket.on('leave_chat', (chatId) => {
      console.log(`User ${socket.userId} left chat ${chatId}`);
      socket.leave(`chat_${chatId}`);
    });

    socket.on('send_message', async (data) => {
      console.log('Message received:', data);
      // Broadcast the message to all users in the chat room except the sender
      socket.to(`chat_${data.chatId}`).emit('new_message', {
        chatId: data.chatId,
        message: data.message
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};

export default setupSocket; 