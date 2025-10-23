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
  const [ticketInfo, setTicketInfo] = useState<any>(null);
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
          setTicketInfo(response.ticketInfo || null);
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
        {/* Left Side - Ticket List */}
        <div className="lg:col-span-1">
          <AllTickets
            tickets={tickets}
            selectedTicket={selectedTicket}
            onTicketSelect={setSelectedTicket}
            loading={loading}
          />
        </div>

        {/* Right Side - Chat Interface */}
        <div className="lg:col-span-2">
          <AdminChatInterFace
            messages={selectedTicket ? messages : []}
            ticketId={selectedTicket}
            ticketInfo={selectedTicket ? ticketInfo : undefined}
            onMessageSent={() =>
              selectedTicket && fetchMessages(selectedTicket)
            }
          />
        </div>
      </div>
    </>
  );
};

export default AdminSupport;
