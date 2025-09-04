import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Users,
  HeadphonesIcon,
  CreditCard,
  Settings as SettingsIcon,
  FileText
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { COLORS } from '../constants/colors';

// Support types
interface Department {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  responseTime: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SupportTicket {
  id: string;
  userId: string;
  departmentId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastActivity: string;
  assignedAgent?: string;
}

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

/**
 * Support Center Component
 * Multi-department ticket system with real-time chat
 */
const Support: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [departments] = useState<Department[]>([
    {
      id: '1',
      name: 'Technical Support',
      description: 'Technical issues, platform bugs, API problems',
      status: 'online',
      responseTime: '< 2 hours',
      icon: SettingsIcon
    },
    {
      id: '2', 
      name: 'Account Management',
      description: 'Account verification, profile issues, security',
      status: 'online',
      responseTime: '< 1 hour',
      icon: Users
    },
    {
      id: '3',
      name: 'Trading Support', 
      description: 'Trading questions, platform guidance, orders',
      status: 'online',
      responseTime: '< 30 minutes',
      icon: HeadphonesIcon
    },
    {
      id: '4',
      name: 'Financial Services',
      description: 'Deposits, withdrawals, payment issues',
      status: 'online',
      responseTime: '< 4 hours',
      icon: CreditCard
    },
    {
      id: '5',
      name: 'Documentation',
      description: 'KYC, compliance, document verification',
      status: 'offline',
      responseTime: '< 24 hours',
      icon: FileText
    }
  ]);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      userId: 'user123',
      departmentId: '1',
      subject: 'Cannot access trading platform',
      status: 'open',
      priority: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      lastActivity: new Date(Date.now() - 1800000).toISOString(),
      assignedAgent: 'Sarah Johnson'
    },
    {
      id: 'TKT-002',
      userId: 'user123',
      departmentId: '2',
      subject: 'Account verification pending',
      status: 'in-progress',
      priority: 'medium',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      lastActivity: new Date(Date.now() - 3600000).toISOString(),
      assignedAgent: 'Mike Chen'
    },
    {
      id: 'TKT-003',
      userId: 'user123',
      departmentId: '4',
      subject: 'Withdrawal not processed',
      status: 'closed',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      lastActivity: new Date(Date.now() - 86400000).toISOString(),
      assignedAgent: 'Jessica Wong'
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      ticketId: 'TKT-001',
      userId: 'user123',
      sender: 'user',
      message: 'Hi, I\'m having trouble accessing the trading platform. It keeps showing a login error.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'delivered'
    },
    {
      id: '2',
      ticketId: 'TKT-001',
      userId: 'user123',
      sender: 'agent',
      agentName: 'Sarah Johnson',
      message: 'Hello! I\'m sorry to hear you\'re experiencing login issues. Can you please tell me what browser you\'re using and if you\'ve tried clearing your cache?',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      status: 'delivered'
    },
    {
      id: '3',
      ticketId: 'TKT-001',
      userId: 'user123',
      sender: 'user',
      message: 'I\'m using Chrome. Let me try clearing the cache now.',
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      status: 'delivered'
    },
    {
      id: '4',
      ticketId: 'TKT-001',
      userId: 'user123',
      sender: 'agent',
      agentName: 'Sarah Johnson',
      message: 'Great! Please also try disabling any browser extensions temporarily. If the issue persists, I can generate a fresh login token for you.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: 'delivered'
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<string>('TKT-001');
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      ticketId: selectedTicket,
      userId: 'user123',
      sender: 'user',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update ticket last activity
    setTickets(prev => prev.map(ticket =>
      ticket.id === selectedTicket
        ? { ...ticket, lastActivity: new Date().toISOString() }
        : ticket
    ));
  };

 

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };



  const getDepartmentName = (departmentId: string) => {
    return departments.find(dept => dept.id === departmentId)?.name || 'Unknown';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);
  const ticketMessages = messages.filter(msg => msg.ticketId === selectedTicket);

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const departmentMatch = filterDepartment === 'all' || ticket.departmentId === filterDepartment;
    return statusMatch && departmentMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>Support Center</h1>
          <p className={`mt-2 text-${COLORS.SECONDARY_TEXT}`}>Get help from our expert support team</p>
        </div>
        <Button 
          onClick={() => navigate('/dashboard/support/create-ticket')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      {/* Department Status Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <Card key={dept.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${dept.status === 'online' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <IconComponent className={`h-5 w-5 ${dept.status === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm text-${COLORS.SECONDARY} truncate`}>{dept.name}</h3>
                  <p className={`text-xs text-${COLORS.SECONDARY_TEXT} mt-1 line-clamp-2`}>{dept.description}</p>
                  <div className="flex items-center mt-2">
                    <div className={`w-2 h-2 rounded-full mr-2 ${dept.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                    <span className={`text-xs ${dept.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                      {dept.status === 'online' ? `Online • ${dept.responseTime}` : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div> */}

      {/* Main Support Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tickets Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="mb-4">
              <h3 className={`font-semibold text-${COLORS.SECONDARY} mb-3`}>My Tickets</h3>
              <div className="space-y-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`w-full text-sm border border-${COLORS.BORDER} rounded-lg px-3 py-2 focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className={`w-full text-sm border border-${COLORS.BORDER} rounded-lg px-3 py-2 focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
                >
                  <option value="all">All Departments</option>
                  <option value="1">Technical</option>
                  <option value="2">Account</option>
                  <option value="3">Trading</option>
                  <option value="4">Financial</option>
                  <option value="5">Documentation</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedTicket === ticket.id
                      ? `border-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT} shadow-sm`
                      : `border-${COLORS.BORDER} hover:border-${COLORS.GRAY_BORDER} hover:bg-${COLORS.SECONDARY_BG}`
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className={`font-medium text-sm text-${COLORS.SECONDARY} line-clamp-2 pr-2`}>
                      {ticket.subject}
                    </h4>
                    {getStatusIcon(ticket.status)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono text-${COLORS.SECONDARY_TEXT} bg-${COLORS.SECONDARY_BG} px-2 py-1 rounded`}>
                      {ticket.id}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs text-${COLORS.SECONDARY_TEXT} font-medium`}>
                      {getDepartmentName(ticket.departmentId)}
                    </span>
                    <span className={`text-xs text-${COLORS.SECONDARY_TEXT}`}>
                      {new Date(ticket.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {ticket.assignedAgent && (
                    <div className={`text-xs text-${COLORS.PRIMARY_TEXT} mt-2 bg-${COLORS.PRIMARY_BG_LIGHT} px-2 py-1 rounded`}>
                      👤 {ticket.assignedAgent}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Interface */}
         <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {selectedTicketData ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedTicketData.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ticket {selectedTicketData.id}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedTicketData.status)}
                      <span className="text-sm font-medium capitalize">
                        {selectedTicketData.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {ticketMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.sender === 'agent' && (
                          <p className="text-xs font-medium mb-1">
                            {message.agentName || 'Support Agent'}
                          </p>
                        )}
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a ticket to start chatting
                  </h3>
                  <p className="text-gray-600">
                    Choose an existing ticket or create a new one
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
