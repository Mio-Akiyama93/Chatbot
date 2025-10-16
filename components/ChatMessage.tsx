import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ItalicParser: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/\*(.*?)\*/g);
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1 ? <em key={i}>{part}</em> : <React.Fragment key={i}>{part}</React.Fragment>
            )}
        </>
    );
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isYui = message.role === 'assistant';

  const bubbleClasses = isYui
    ? 'bg-white text-gray-800 rounded-bl-none'
    : 'bg-violet-400 text-white rounded-br-none';
  
  const wrapperClasses = isYui ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex w-full mb-4 ${wrapperClasses}`}>
      <div className="flex items-end max-w-[85%]">
        {isYui && (
          <img src="https://picsum.photos/seed/yui-avatar/40/40" alt="Yui's avatar" className="w-8 h-8 rounded-full mr-2 self-start flex-shrink-0" />
        )}
        <div
          className={`px-4 py-2 rounded-lg shadow-sm ${bubbleClasses}`}
          style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
        >
          <p className="text-sm">
            <ItalicParser text={message.content} />
          </p>
        </div>
      </div>
    </div>
  );
};
