import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';
import { apiRequest } from '../../services/api';
import { 
  ALL_TICKETS, 
  NEW_COMMENTS, 
  SHOW_ALL_SPECIFIC_COMMENT 
} from '../../../api/api-variable';

// Import Support Components
import {
  TicketList,
  ChatInterface,
  SupportFilters
} from './components';
import { useAuth } from '@/context';

// Support types
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
  const { token } = useAuth();
  
  // State management
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');


  // Fetch tickets from API
  const fetchTickets = useCallback(async () => {
    try {
      const response = await apiRequest<{
        success: boolean;
        data: SupportTicket[];
      }>({
        endpoint: ALL_TICKETS,
        method: 'POST',
        data: {},
        headers: {
          Authorization: `Bearer ${token}`,
        },

      });

      if (response && response.success && response.data) {
        setTickets(response.data);
        // Select first ticket if available
        if (response.data.length > 0) {
          setSelectedTicket(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setError('Failed to load tickets');
    }
  }, [token]);

  // Fetch messages for a specific ticket
  const fetchTicketMessages = useCallback(async (ticketId: string) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        data: ChatMessage[];
      }>({
        endpoint: SHOW_ALL_SPECIFIC_COMMENT,
        method: 'POST',
        data: { ticketId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.success && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [token]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchTickets();
      setLoading(false);
    };
    loadData();
  }, [fetchTickets]);

  // Fetch messages when ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      fetchTicketMessages(selectedTicket);
    }
  }, [selectedTicket, fetchTicketMessages]);

  // Message handling
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const response = await apiRequest<{
        success: boolean;
        data: ChatMessage;
      }>({
        endpoint: NEW_COMMENTS,
        method: 'POST',
        data: {
          ticketId: selectedTicket,
          message: newMessage.trim()
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.success && response.data) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
        
        // Update ticket last activity
        setTickets(prev => prev.map(ticket =>
          ticket.id === selectedTicket
            ? { ...ticket, lastActivity: new Date().toISOString() }
            : ticket
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={`text-${COLORS.SECONDARY_TEXT}`}>Loading support data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className={`text-red-600 mb-4`}>{error}</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Filters and Tickets */}
        <div className="lg:col-span-1 space-y-6">
          {/* Filters Card */}
          <SupportFilters
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDepartment={filterDepartment}
            setFilterDepartment={setFilterDepartment}
            departments={[]}
          />

          {/* Ticket List */}
          <TicketList
            tickets={tickets}
            selectedTicket={selectedTicket}
            onSelectTicket={setSelectedTicket}
            filterStatus={filterStatus}
            filterDepartment={filterDepartment}
            departments={[]}
          />
        </div>

        {/* Right Side - Chat Interface Only */}
        <div className="lg:col-span-2">
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