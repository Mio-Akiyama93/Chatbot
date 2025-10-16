import React from 'react';
import { ChatSession } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
  isOpen,
}) => {
  return (
    <aside className={`absolute md:relative z-20 flex flex-col h-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <h1 className="text-lg font-semibold">Yui RPG</h1>
        <button onClick={onNewSession} className="p-1 rounded-md hover:bg-gray-700" aria-label="New Chat">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          {sessions.map((session) => (
            <li key={session.id} className="mb-1">
              <div
                onClick={() => onSelectSession(session.id)}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  activeSessionId === session.id ? 'bg-violet-600' : 'hover:bg-gray-700'
                }`}
              >
                <span className="truncate flex-1">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm('Are you sure you want to delete this story?')){
                      onDeleteSession(session.id);
                    }
                  }}
                  className="p-1 rounded-md hover:bg-gray-600 text-gray-400 hover:text-white ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Delete ${session.title}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <p className="text-xs text-gray-400">Powered by OpenRouter</p>
      </div>
    </aside>
  );
};