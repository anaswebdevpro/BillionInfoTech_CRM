import React, { useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { COLORS } from '../../../constants/colors';

interface ChatMessage {
  id: string;
  ticketId: string;
  userId: string;
  sender: 'user' | 'agent';
  agentName?: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatInterfaceProps {
  selectedTicket: string | null;
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  ticketData: any;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  selectedTicket,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage,
  ticketData,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const ticketMessages = messages.filter(msg => msg.ticketId === selectedTicket);

  if (!selectedTicket) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Ticket</h3>
          <p className="text-gray-500">Choose a support ticket to view the conversation</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium text-${COLORS.SECONDARY}`}>
              {ticketData?.subject || 'Support Ticket'}
            </h3>
            <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
              Ticket #{selectedTicket}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-600">Agent Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ticketMessages.length > 0 ? (
          ticketMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? `bg-${COLORS.PRIMARY} text-white`
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === 'agent' && message.agentName && (
                    <span className={`text-xs ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      - {message.agentName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type your message..."
            className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
          />
          <Button
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;
