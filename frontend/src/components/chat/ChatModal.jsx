import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatModal = ({ itemId, sellerId, onClose }) => {
  const { user } = useAuth();
  const { socket } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Monitor socket connection status
  useEffect(() => {
    if (socket) {
      setSocketConnected(socket.connected);
      console.log('Initial socket connection status:', socket.connected);

      socket.on('connect', () => {
        console.log('Socket connected in ChatModal');
        setSocketConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected in ChatModal');
        setSocketConnected(false);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && chat?._id) {
      console.log('Setting up chat room:', chat._id);
      
      // Join the chat room
      socket.emit('join_chat', chat._id);
      
      // Listen for new messages
      const handleNewMessage = (data) => {
        console.log('Received new message:', data);
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
      };

      socket.on('new_message', handleNewMessage);

      return () => {
        console.log('Cleaning up chat room:', chat._id);
        socket.off('new_message', handleNewMessage);
        socket.emit('leave_chat', chat._id);
      };
    }
  }, [socket, chat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat?._id) return;

    try {
      console.log('Sending message to chat:', chat._id);
      console.log('Socket connected:', socketConnected);
      
      const response = await api.post(`/chats/${chat._id}/messages`, {
        content: newMessage
      });

      console.log('Message sent successfully:', response.data);

      // Only emit if socket is connected
      if (socket && socketConnected) {
        socket.emit('send_message', {
          chatId: chat._id,
          message: response.data
        });
        console.log('Message emitted through socket');
      } else {
        console.warn('Socket not connected, message saved but not emitted');
      }

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      scrollToBottom();
      toast.success('Message sent successfully');

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Start a Conversation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Write your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Send Message
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatModal; 