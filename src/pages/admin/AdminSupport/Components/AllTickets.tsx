import React from "react";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components";
import { COLORS } from "@/constants/colors";

// Types
interface SupportTicket {
  id: number;
  subject: string;
  status: number; // 0 = closed, 1 = open
  priority: string;
  department_name: string;
  first_name: string;
  last_name: string;
}

interface TicketListProps {
  tickets: SupportTicket[];
  selectedTicket: number | null;
  onTicketSelect: (ticketId: number) => void;
  loading?: boolean;
}

const AllTickets: React.FC<TicketListProps> = ({
  tickets,
  selectedTicket,
  onTicketSelect,
  loading = false,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // const getStatusIcon = (status: string) => {
  //   switch (status?.toLowerCase()) {
  //     case 'open':
  //       return <AlertCircle className="w-4 h-4 text-green-500" />;
  //     case 'closed':
  //       return <CheckCircle className="w-4 h-4 text-gray-500" />;
  //     default:
  //       return <Clock className="w-4 h-4 text-yellow-500" />;
  //   }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 0:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="lg:col-span-1">
        <Card title="Support Tickets" subtitle="Loading tickets...">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="overflow-y-scroll max-w-300 max-h-[calc(100vh-200px)]">
      <Card title="Support Tickets" subtitle="Your recent support requests">
        <div className="space-y-3">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onTicketSelect(ticket.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedTicket === ticket.id
                    ? `border-${COLORS.PRIMARY} bg-blue-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(ticket.status)}
                      <h3
                        className={`font-medium text-${COLORS.SECONDARY} truncate`}
                      >
                        {ticket.subject}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mb-2`}>
                      {ticket.department_name} - {ticket.first_name}{" "}
                      {ticket.last_name}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Ticket ID: #{ticket.id}</span>
                      <span>
                        Status: {ticket.status === 1 ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-500">
                You haven't created any support tickets yet.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AllTickets;
