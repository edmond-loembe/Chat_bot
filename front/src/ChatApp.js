import React, { useState } from 'react';
import axios from 'axios';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages([...messages, { role: 'user', message: input }]);
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/chat', {
        history: [
          ...messages,
          { role: 'user', message: input }
        ]
      });
      setMessages([...messages, { role: 'user', message: input }, { role: 'agent', message: response.data.reply }]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="space-y-4 h-96 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-xs p-3 bg-gray-300 rounded-lg animate-pulse">...</div>
            </div>
          )}
        </div>

        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border rounded-l-lg"
            placeholder="Type your message"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
