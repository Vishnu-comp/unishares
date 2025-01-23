import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import api from '../services/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      // Make sure we're using the correct URL
      const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      console.log('Attempting to connect to socket at:', SOCKET_URL);

      const socketInstance = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token')
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socketInstance.on('connect', () => {
        console.log('Socket connected successfully with ID:', socketInstance.id);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      socketInstance.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socketInstance.on('new_message', (data) => {
        if (currentChat && data.chatId === currentChat._id) {
          setMessages(prev => [...prev, data.message]);
        }
      });

      setSocket(socketInstance);

      return () => {
        if (socketInstance) {
          console.log('Cleaning up socket connection');
          socketInstance.disconnect();
        }
      };
    }
  }, [user]);

  // Join chat room when currentChat changes
  useEffect(() => {
    if (socket && currentChat) {
      socket.emit('join_chat', currentChat._id);
      return () => socket.emit('leave_chat', currentChat._id);
    }
  }, [socket, currentChat]);

  const sendMessage = async (chatId, content) => {
    try {
      const response = await api.post(`/chats/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const value = {
    currentChat,
    setCurrentChat,
    messages,
    setMessages,
    chats,
    setChats,
    sendMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};