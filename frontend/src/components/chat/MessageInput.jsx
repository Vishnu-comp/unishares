import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 bg-white shadow-lg rounded-lg">
      <input
        type="text"
        placeholder="Type your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 ease-in-out"
      />
      <button
        type="submit"
        className="ml-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
