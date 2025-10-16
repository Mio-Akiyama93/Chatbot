import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          msg.role !== 'system' && <ChatMessage key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end max-w-[85%]">
              <img src="https://picsum.photos/seed/yui-avatar/40/40" alt="Yui's avatar" className="w-8 h-8 rounded-full mr-2 self-start flex-shrink-0" />
              <div className="px-4 py-3 rounded-lg shadow-sm bg-white text-gray-500 rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="sticky bottom-0 bg-pink-50">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </footer>
    </>
  );
};
