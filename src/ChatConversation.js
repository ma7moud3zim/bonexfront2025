import React, { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';

function ChatConversation({ conversation, currentUserId, updateConversation }) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [connection, setConnection] = useState(null);

  const partnerId = conversation.partnerId;

  // Fetch conversation messages when conversation changes
  useEffect(() => {
    if (conversation.conversationId) {
      fetch(`http://chatservice.runasp.net/api/Conversations/${conversation.conversationId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.chatMessages || []))
        .catch((err) => console.error('Error fetching conversation:', err));
    } else {
      setMessages([]);
    }
  }, [conversation.conversationId]);

  // Establish SignalR connection with userId
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://chatservice.runasp.net/chathub?userId=${currentUserId}`)
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, [currentUserId]);

  // Start SignalR connection
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => console.log('ChatConversation connected'))
        .catch((error) => console.error('SignalR connection error:', error));
    }
  }, [connection]);

  // Register "ReceiveMessage" handler
  useEffect(() => {
    if (connection) {
      const messageHandler = (sender, message, type, convId) => {
        if (conversation.conversationId === null || convId === conversation.conversationId) {
          const newMessage = {
            senderId: sender,
            messageContent: message,
            messageType: type,
            conversationId: convId,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, newMessage]);
          if (conversation.conversationId === null) {
            updateConversation({ ...conversation, conversationId: convId });
          }
        }
      };

      connection.on('ReceiveMessage', messageHandler);

      return () => {
        connection.off('ReceiveMessage', messageHandler);
      };
    }
  }, [connection, conversation, updateConversation]);

  // Auto-scroll chat box to the latest message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (connection && messageInput.trim() !== '') {
      connection
        .invoke('SendMessage', currentUserId, partnerId, messageInput, 'text')
        .catch((err) => console.error('Error sending message:', err));
      setMessageInput('');
      setShowEmojiPicker(false); // Close emoji picker after sending
    }
  };

  // Handle emoji selection and insertion
  const onEmojiClick = (emojiObject) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newValue =
        messageInput.slice(0, start) +
        emojiObject.emoji +
        messageInput.slice(end);
      setMessageInput(newValue);
      // Maintain cursor position after inserting emoji
      setTimeout(() => {
        input.selectionStart = input.selectionEnd = start + emojiObject.emoji.length;
      }, 0);
    } else {
      setMessageInput((prev) => prev + emojiObject.emoji);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex justify-between items-center bg-white border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Partner Avatar"
            className="w-11 h-11 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-base font-medium">{partnerId}</span>
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
      </div>

      {/* Scrollable messages area */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'items-start'} mb-4`}
          >
            {msg.senderId !== currentUserId && (
              <img
                className="w-9 h-9 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Avatar"
              />
            )}
            <div
              className={`max-w-[75%] p-3 ${
                msg.senderId === currentUserId
                  ? 'bg-gradient-to-r from-[#008CBA] to-[#00A5E0] text-white rounded-2xl shadow-md mr-3'
                  : 'bg-white rounded-2xl shadow-sm ml-3'
              }`}
            >
              <p className="text-sm">{msg.messageContent}</p>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
              </div>
            </div>
            {msg.senderId === currentUserId && (
              <img
                className="w-9 h-9 rounded-full object-cover"
                src="https://randomuser.me/api/portraits/men/86.jpg"
                alt="Avatar"
              />
            )}
          </div>
        ))}
      </div>

      {/* Fixed input area with emoji picker */}
      <div className="relative">
        <div className="bg-white border-t border-gray-200 p-3 flex items-center gap-3">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-500 hover:text-gray-700"
          >
            <BsEmojiSmile size={24} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-full outline-none text-sm"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            ref={inputRef}
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#008CBA] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#005F7A] transition-colors"
            style={{borderRadius: "50px"}}
          >
            Send
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-full left-0 mb-2">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatConversation;