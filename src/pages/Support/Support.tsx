import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings as SettingsIcon, Users, HeadphonesIcon, CreditCard, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';

// Import Support Components
import {
  DepartmentCards,
  TicketList,
  ChatInterface,
  SupportFilters
} from './components';

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

const Support: React.FC = () => {
  const navigate = useNavigate();
  
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
      message: 'Hello! I\'m sorry to hear you\'re having trouble logging in. Let me help you troubleshoot this issue. Can you tell me what specific error message you\'re seeing?',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      status: 'read'
    },
    {
      id: '3',
      ticketId: 'TKT-001',
      userId: 'user123',
      sender: 'user',
      message: 'It says "Invalid credentials" but I\'m sure my password is correct.',
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      status: 'delivered'
    },
    {
      id: '4',
      ticketId: 'TKT-001',
      userId: 'user123',
      sender: 'agent',
      agentName: 'Sarah Johnson',
      message: 'I see. This could be due to a few reasons. Let me check your account status and reset your password. I\'ll send you a password reset link via email.',
      timestamp: new Date(Date.now() - 3300000).toISOString(),
      status: 'read'
    }
  ]);

  const [selectedTicket, setSelectedTicket] = useState<string | null>('TKT-001');
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Message handling
  const handleSendMessage = () => {
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

  const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);

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
      <DepartmentCards departments={departments} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SupportFilters
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDepartment={filterDepartment}
            setFilterDepartment={setFilterDepartment}
            departments={departments}
          />
        </div>

        {/* Tickets and Chat */}
        <div className="lg:col-span-3 space-y-6">
          {/* Ticket List */}
          <TicketList
            tickets={tickets}
            selectedTicket={selectedTicket}
            onSelectTicket={setSelectedTicket}
            filterStatus={filterStatus}
            filterDepartment={filterDepartment}
            departments={departments}
          />

          {/* Chat Interface */}
          <ChatInterface
            selectedTicket={selectedTicket}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            ticketData={selectedTicketData}
          />
        </div>
      </div>
    </div>
  );
};

export default Support;