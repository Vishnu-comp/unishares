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
    if (user && token) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('new_message', (data) => {
        if (currentChat && data.chatId === currentChat._id) {
          setMessages(prev => [...prev, data.message]);
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user, token]);

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