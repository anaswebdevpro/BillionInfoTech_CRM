import React, { useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { COLORS } from '../../../constants/colors';
import { CommentItem } from './types';
import { groupMessagesByDate, formatDateForSeparator } from './utils';
import MessageBubble from './MessageBubble';
import bgImage from '../../../assets/chatwallpapper.jpg';

interface MessageListProps {
  messages: CommentItem[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages.length]);

  return (
    <div 
      ref={scrollerRef} 
      className={`flex-1 p-4 space-y-4 overflow-y-scroll max-h-[calc(100vh-400px)]`} 
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
    >
      {messages.length === 0 ? (
        <div className={`text-center py-8 text-${COLORS.SECONDARY_TEXT}`}>
          <MessageCircle className="mx-auto mb-2" />
         Select a ticket to view conversation
        </div>
      ) : (
        (() => {
          const groupedMessages = groupMessagesByDate(messages);
          const sortedDates = Object.keys(groupedMessages).sort((a, b) => 
            new Date(a).getTime() - new Date(b).getTime()
          );
          
          return sortedDates.map(dateKey => {
            const dayMessages = groupedMessages[dateKey];
            const firstMessage = dayMessages[0];
            
            return (
              <div key={dateKey}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className={`bg-${COLORS.GRAY_LIGHT} text-${COLORS.SECONDARY_TEXT} text-xs px-3 py-1 rounded-full`}>
                    {formatDateForSeparator(firstMessage.created_on || '')}
                  </div>
                </div>
                
                {/* Messages for this date */}
                {dayMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            );
          });
        })()
      )}
    </div>
  );
};

export default MessageList;
