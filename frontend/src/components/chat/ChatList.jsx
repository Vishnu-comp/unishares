import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../contexts/ChatContext.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { formatDistance } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatList = () => {
  const { chats } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getLastMessage = (chat) => {
    if (chat.messages.length === 0) return 'No messages yet';
    return chat.messages[chat.messages.length - 1].content;
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p._id !== user?._id);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          chats.map(chat => {
            const otherParticipant = getOtherParticipant(chat);
            const lastMessage = getLastMessage(chat);
            const lastMessageTime = chat.messages.length > 0 
              ? chat.messages[chat.messages.length - 1].createdAt 
              : chat.createdAt;

            return (
              <div
                key={chat._id}
                onClick={() => navigate(`/chats/${chat._id}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {otherParticipant?.avatar ? (
                      <img
                        className="h-12 w-12 rounded-full"
                        src={otherParticipant.avatar}
                        alt={otherParticipant.name}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                        {otherParticipant?.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {otherParticipant?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-400">
                    {formatDistance(new Date(lastMessageTime), new Date(), { addSuffix: true })}
                  </div>
                </div>
                {chat.item && (
                  <div className="mt-2 flex items-center space-x-2">
                    <img
                      src={chat.item.images[0] || '/placeholder.png'}
                      alt={chat.item.title}
                      className="h-8 w-8 object-cover rounded"
                    />
                    <span className="text-sm text-gray-600 truncate">
                      {chat.item.title}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChatList;
