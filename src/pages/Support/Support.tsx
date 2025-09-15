/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { ShimmerText, ShimmerCard, ShimmerList, ShimmerButton } from '../../components/ui/Shimmer';
import { COLORS } from '../../constants/colors';
import { apiRequest } from '../../services/api';
import {
  ALL_TICKETS,
  SHOW_ALL_SPECIFIC_COMMENT,
  // NEW_COMMENTS
} from '../../../api/api-variable';
import { useAuth } from '@/context';
import { Card } from '@/components';
import { ChatInterface } from './components';

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
        // setIsLoading(false);
        setTickets(response.data || []);
        console.log('Tickets:', response);
      })
        .catch((error: any) => {
          console.error('Failed to fetch tickets:', error);
        });
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const selectedTicketData = tickets.find(ticket => ticket.id === selectedTicket);


  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Shimmer */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <ShimmerText width="300px" height={36} />
            <ShimmerText width="400px" height={20} />
          </div>
          <ShimmerButton width="140px" height={40} />
        </div>

        {/* Main Content Grid Shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Ticket List Shimmer */}
          <div className="lg:col-span-1">
            <ShimmerCard height={400}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <ShimmerText width="150px" height={20} />
                  <ShimmerText width="200px" height={16} />
                </div>
                <div className="space-y-3">
                  <ShimmerList items={5} />
                </div>
              </div>
            </ShimmerCard>
          </div>

          {/* Right Side - Chat Interface Shimmer */}
          <div className="lg:col-span-2">
            <ShimmerCard height={400}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <ShimmerText width="200px" height={20} />
                  <ShimmerText width="300px" height={16} />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <ShimmerText width="80%" height={16} />
                        <ShimmerText width="60%" height={14} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <ShimmerText width="100%" height={40} />
                  <ShimmerButton width="80px" height={40} />
                </div>
              </div>
            </ShimmerCard>
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
        {/* Left Side - Ticket List */}
        <div className="lg:col-span-1">
          <Card title="Support Tickets" subtitle="Your recent support requests">
            <div className="space-y-3">
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedTicket === ticket.id
                        ? `border-${COLORS.PRIMARY} bg-blue-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className={`font-medium text-${COLORS.SECONDARY} truncate`}>
                            {ticket.subject}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mb-2`}>
                          {ticket.department}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Created {new Date(ticket.created_on).toLocaleDateString()}</span>
                          <span>Status: {ticket.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                  <p className="text-gray-500">
                    You haven't created any support tickets yet.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Side - Chat Interface */}
        <div className="lg:col-span-2">
         <ChatInterface ticket={selectedTicketData} />
        </div>
      </div>
    </div>
  );
};

export default Support;

                                                      







