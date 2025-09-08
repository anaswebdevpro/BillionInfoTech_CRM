import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { COLORS } from '../../../constants/colors';

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

interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicket: string | null;
  onSelectTicket: (ticketId: string) => void;
  filterStatus: string;
  filterDepartment: string;
  departments: Array<{ id: string; name: string }>;
}

const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onSelectTicket,
  filterStatus,
  filterDepartment,
  departments,
}) => {
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

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const departmentMatch = filterDepartment === 'all' || ticket.departmentId === filterDepartment;
    return statusMatch && departmentMatch;
  });

  return (
    <Card title="Support Tickets" subtitle="Your recent support requests">
      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedTicket === ticket.id
                  ? `border-${COLORS.PRIMARY} bg-${COLORS.PRIMARY}50`
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
                    {getDepartmentName(ticket.departmentId)}
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
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
  );
};

export default TicketList;
