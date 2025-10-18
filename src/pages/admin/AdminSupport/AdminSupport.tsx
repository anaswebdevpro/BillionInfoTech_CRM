/* eslint-disable @typescript-eslint/no-explicit-any */

import { COLORS } from "@/constants";
import { UserPlus } from "lucide-react";
import HeaderState from "./Components/HeaderState";
import { useEffect, useState } from "react";
import { apiRequest } from "@/services";
import {
  ADMIN_FETCH_ALL_MESSAGES,
  ADMIN_VIEW_ALL_TICKETS,
} from "../../../../api/api-variable";
import useAdminAuth from "@/Hook/useAdminAuth";
import AllTickets from "./Components/AllTickets";
import AdminChatInterFace from "./Components/AdminChatInterFace";

interface Ticket {
  id: number;
  subject: string;
  status: number; // 0 = closed, 1 = open
  priority: string;
  department_name: string;
  first_name: string;
  last_name: string;
  [key: string]: any;
}

const AdminSupport = () => {
  const { adminToken } = useAdminAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTickets = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: ADMIN_VIEW_ALL_TICKETS,
        method: "POST",

        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((response: any) => {
          setLoading(false);
          setTickets(response.data);
          console.log(response);
        })
        .catch((error: any) => {
          console.error("Login failed:", error);
        });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch messages for selected ticket using same pattern
  const fetchMessages = (ticketId: number) => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: `${ADMIN_FETCH_ALL_MESSAGES}/${ticketId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      })
        .then((response: any) => {
          setMessages(response.threads || []);
          console.log("Messages:", response);
        })
        .catch((error: any) => {
          console.error("Failed to fetch messages:", error);
        });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedTicket) return;
    fetchMessages(selectedTicket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicket]);

  // Sending of messages is handled inside ChatInterface component

  // const selectedTicketData = tickets.find(
  //   (ticket) => ticket.id === selectedTicket
  // );
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Admin Chat Support System
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Comprehensive customer support management and analytics
            </p>
          </div>
          <button
            // onClick={() => setIsModalOpen(true)}
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
          >
            <UserPlus className="h-4 w-4" />
            Create Ticket
          </button>
        </div>
      </div>

      {/* header grids  */}
      <HeaderState />

      {/* Departments Overview */}
      {/* <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Performance
          </h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div
                key={dept.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      dept.status === "online" ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${
                        dept.status === "online"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      dept.status === "online" ? "bg-green-400" : "bg-gray-400"
                    }`}
                  />
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">
                  {dept.name}
                </h4>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {dept.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Tickets</span>
                    <span className="text-xs font-medium text-gray-900">
                      {dept.ticketCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Agents</span>
                    <span className="text-xs font-medium text-gray-900">
                      {dept.agents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Response</span>
                    <span className="text-xs font-medium text-gray-900">
                      {dept.avgResponseTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card> */}

      {/* Main Content Grid */}
      <div className="border-3 mt-3">
        {/* Left Side - Ticket List */}
        <div>
          <AllTickets
            tickets={tickets}
            selectedTicket={selectedTicket}
            onTicketSelect={setSelectedTicket}
            loading={loading}
          />
        </div>

        {/* Right Side - Chat Interface */}
        <div className="lg:col-span-2">
          <AdminChatInterFace messages={messages} />
        </div>
      </div>
    </>
  );
};

export default AdminSupport;
