import React, { useState } from 'react';
import './ChatBot.scss';
// import logo from '../../assets/logo/logo.svg'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatBot}>
        <box-icon name='message-dots'></box-icon>
      </button>
      {isOpen && (
        <div className="chatbot-iframe">
          <iframe
            src="https://api.chatlab.com/aichat/iframe?apiKey=9f5d7181-028c-480b-a6eb-294b6785aa1e&iFrameMode=true&aichatbotProviderId=f9e9c5e4-6d1a-4b8c-8d3f-3f9e9c5e46d1"
            width="100%"
            height="400px"
            title="ChatBot"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
