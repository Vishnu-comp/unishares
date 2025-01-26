import React, { useEffect, useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import MessageInput from './MessageInput';

const ChatWindow = ({ selectedChat }) => {
  const { sendMessage } = useChat();
  const [messages, setMessages] = useState(selectedChat?.messages || []);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  const handleSendMessage = (content) => {
    sendMessage(selectedChat._id, content);
    setMessages((prev) => [...prev, { content, sender: 'You' }]);
  };

  if (!selectedChat) {
    return (
      <div className="w-2/3 flex items-center justify-center h-full text-gray-600">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
          {selectedChat.participants[0]?.name?.charAt(0)}
        </div>
        <h2 className="font-semibold text-xl text-gray-800">{selectedChat.participants[0]?.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs sm:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'You'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm'
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 border-t">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
