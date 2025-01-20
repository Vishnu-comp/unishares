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
    return <div className="w-2/3 flex items-center justify-center">Select a chat to start messaging</div>;
  }

  return (
    <div className="w-2/3 flex flex-col">
      <div className="flex-1 overflow-y-auto border-b p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
            <p className="bg-gray-200 inline-block p-2 rounded">{message.content}</p>
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
