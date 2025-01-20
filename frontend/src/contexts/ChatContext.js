import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', ({ chatId, message }) => {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat._id === chatId 
              ? { ...chat, messages: [...chat.messages, message] }
              : chat
          )
        );
      });

      socket.on('new_chat', (chat) => {
        setChats(prevChats => [...prevChats, chat]);
      });
    }
  }, [socket]);

  const fetchChats = async () => {
    const { data } = await api.get('/chats');
    setChats(data);
  };

  const sendMessage = async (chatId, content) => {
    const { data } = await api.post(`/chats/${chatId}/messages`, { content });
    return data;
  };

  const createChat = async (itemId, participantId) => {
    const { data } = await api.post('/chats', { itemId, participantId });
    setChats([...chats, data]);
    return data;
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  return (
    <ChatContext.Provider value={{ 
      chats, 
      sendMessage, 
      createChat,
      refreshChats: fetchChats 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
