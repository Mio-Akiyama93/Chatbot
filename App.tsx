import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from './types';
import { SYSTEM_PROMPT } from './constants';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { fetchChatCompletion } from './services/api';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
      { role: 'assistant', content: "H-hello... I'm Yui! It's nice to meet you! What's your name? owo" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: 'user', content: userInput };
    // Use a functional update to ensure we have the latest state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // Create the payload from the *next* state, not the current one
    const newMessages = [...messages, userMessage];

    const apiMessages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...newMessages.slice(1) // Exclude Yui's initial greeting from API history
    ];

    try {
        const aiResponse = await fetchChatCompletion(apiMessages);
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: "Uwaah... something went wrong. I'm sorry! >.<" }]);
    } finally {
        setIsLoading(false);
    }
  }, [messages]);

  const startNewChat = () => {
      setMessages([
          { role: 'assistant', content: "H-hello... I'm Yui! Let's chat again! :3" }
      ]);
  }

  return (
    <div className="flex flex-col h-screen bg-pink-50 font-sans">
      <header className="bg-white shadow-md p-3 flex justify-between items-center z-10 flex-shrink-0">
        <div className="flex items-center">
            <img src="https://picsum.photos/seed/yui-avatar/40/40" alt="Yui's avatar" className="w-10 h-10 rounded-full mr-3" />
            <div>
                <h1 className="text-lg font-bold text-gray-800">Yui</h1>
                <p className="text-xs text-green-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online
                </p>
            </div>
        </div>
        <button 
            onClick={startNewChat} 
            className="text-sm text-violet-600 hover:text-violet-800 font-semibold px-3 py-1 rounded-md hover:bg-violet-50 transition-colors"
        >
            New Chat
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
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
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
};

export default App;
