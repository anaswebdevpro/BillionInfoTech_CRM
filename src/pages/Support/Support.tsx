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
import { Card } from '@/components';

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

interface NewMessage {
  message: string;
  image: string;
}

const Support: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  // State management
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [newMessages, setNewMessages] = useState<NewMessage>()
  // Fetch tickets from API
  const fetchTickets = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: ALL_TICKETS,
        method: 'POST',

        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        // setIsLoading(false);
        setTickets(response.data);
        console.log(response);
      })
        .catch((error: any) => {
          console.error("Login failed:", error);
        });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTicketsmessage = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: `${SHOW_ALL_SPECIFIC_COMMENT}/${selectedTicket}`,
        method: 'POST',

        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        // setIsLoading(false);
setMessages(response.ticket.comment)
        console.log(response);
      })
        .catch((error: any) => {
          console.error("Login failed:", error);
        });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(selectedTicket)
    fetchTicketsmessage();
  }, [selectedTicket]);

const handleSendMessage =()=>{
  
}


  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
            <Card title="Support Tickets" subtitle="Your recent support requests">
      <div className="space-y-3">
          {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedTicket === ticket.id
                  ? `border-${COLORS.PRIMARY} bg-${COLORS.PRIMARY}50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {ticket.status}
                    <h3 className={`font-medium text-${COLORS.SECONDARY} truncate`}>
                      {ticket.subject}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mb-2`}>
                    {ticket.departmentId}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>Last activity {formatTime(ticket.lastActivity)}</span>
                    {ticket.assignedAgent && (
                      <span>Assigned to {ticket.assignedAgent}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            {/* <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" /> */}
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {filterStatus !== 'all' || filterDepartment !== 'all'
                ? 'No tickets match your current filters.'
                : 'You haven\'t created any support tickets yet.'}
            </p>
          </div>
        )}
        </div>
        </Card>
        </div>

        {/* Right Side - Chat Interface Only */}
        <div className="lg:col-span-2">
          <ChatInterface
            selectedTicket={selectedTicket}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            ticketData={selectedTicket}
          />
        </div>
      </div>
    </div>
   
  );
};

export default Support;