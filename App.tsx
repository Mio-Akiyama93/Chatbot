import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { Bars3Icon, XMarkIcon } from './components/Icons';
import { ChatSession, Message } from './types';
import { fetchChatCompletion } from './services/api';
import { SYSTEM_PROMPT } from './constants';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      title: 'New Story',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  }, []);

  // Initialize with a default session from localStorage or create a new one
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('chatSessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        if (Array.isArray(parsedSessions) && parsedSessions.length > 0) {
          setSessions(parsedSessions);
          setActiveSessionId(parsedSessions[0].id);
          return;
        }
      }
    } catch (error) {
        console.error("Failed to parse sessions from localStorage", error);
        localStorage.removeItem('chatSessions'); // Clear corrupted data
    }
    handleNewSession();
  }, [handleNewSession]);

  // Save sessions to local storage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
    } else {
        localStorage.removeItem('chatSessions');
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleDeleteSession = (id: string) => {
    const remainingSessions = sessions.filter(s => s.id !== id);
    setSessions(remainingSessions);

    if (activeSessionId === id) {
        if (remainingSessions.length > 0) {
            setActiveSessionId(remainingSessions[0].id);
        } else {
            handleNewSession();
        }
    }
  };

  const handleSendMessage = async (userInput: string) => {
    if (!activeSession) return;

    const userMessage: Message = { role: 'user', content: userInput };
    const updatedMessages = [...activeSession.messages, userMessage];

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId ? { ...s, messages: updatedMessages } : s
      )
    );
    setIsLoading(true);

    try {
      const assistantResponse = await fetchChatCompletion(updatedMessages);
      const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
      
      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            const isNewChat = s.title === 'New Story' && s.messages.length === 2; // System + 1st user message
            const newTitle = isNewChat
                ? userInput.substring(0, 25) + (userInput.length > 25 ? '...' : '') 
                : s.title;
            return {
              ...s,
              title: newTitle,
              messages: [...updatedMessages, assistantMessage],
            };
          }
          return s;
        })
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
      };
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, messages: [...updatedMessages, errorMessage] }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-pink-50 font-sans">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSelectSession={setActiveSessionId}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
      />
      <div className="flex-1 flex flex-col relative">
        <header className="p-2 md:hidden bg-white border-b border-gray-200 flex items-center justify-between">
           <span className="font-semibold text-gray-700 truncate pr-2">{activeSession?.title}</span>
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 flex-shrink-0">
            {isSidebarOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </header>
        {activeSession ? (
          <ChatView
            messages={activeSession.messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        ) : (
           <div className="flex-1 flex items-center justify-center text-gray-500">
              <button onClick={handleNewSession} className="p-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors">Start a New Story</button>
           </div>
        )}
      </div>
    </div>
  );
};

export default App;
