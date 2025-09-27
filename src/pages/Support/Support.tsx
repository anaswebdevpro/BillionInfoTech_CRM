/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import { ShimmerLoader } from '../../components/ui';
import { COLORS } from '../../constants/colors';
import { apiRequest } from '../../services/api';
import {  ALL_TICKETS,  SHOW_ALL_SPECIFIC_COMMENT, } from '../../../api/api-variable';
import { useAuth } from '@/context';

import { ChatInterface } from './components';
import TicketList from './components/TicketList';

// Types based on your actual API response
interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  department: string;
  created_on: string;
}



const Support: React.FC = () => {
  
  const navigate = useNavigate();
  const { token } = useAuth();



  // Simplified state management
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
 
  
  // message input now handled inside ChatInterface
  const [loading, setLoading] = useState(true);

  // Fetch tickets from API using the shared pattern
  const fetchTickets = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: ALL_TICKETS,
        method: 'POST',

        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        setLoading(false);
        setTickets(response.data || []);
        console.log('Tickets:', response);
      })
        .catch((error: any) => {
          console.error('Failed to fetch tickets:', error);
        });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } 
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Fetch messages for selected ticket using same pattern
  const fetchMessages = (ticketId: number) => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: `${SHOW_ALL_SPECIFIC_COMMENT}/${ticketId}`,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        // setMessages(response.ticket?.comments || []);
        console.log('Messages:', response);
      })
        .catch((error: any) => {
          console.error('Failed to fetch messages:', error);
        });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTicket) return;
    fetchMessages(selectedTicket);
  }, [selectedTicket]);

  // Sending of messages is handled inside ChatInterface component

  const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);


  if (loading) {
    return (
      <div className="space-y-6">
        <ShimmerLoader variant="dashboard" width={1200} height={200} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShimmerLoader variant="table" width={600} height={400} />
          <ShimmerLoader variant="card" width={600} height={400} />
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
        {/* Left Side - Ticket List */}
        <TicketList 
          tickets={tickets}
          selectedTicket={selectedTicket}
          onTicketSelect={setSelectedTicket}
          loading={loading}
        />

        {/* Right Side - Chat Interface */}
        <div className="lg:col-span-2">
         <ChatInterface ticket={selectedTicketData} />
        </div>
      </div>
    </div>
  );
};

export default Support;

                                                      







