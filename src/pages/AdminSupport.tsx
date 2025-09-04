import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { COLORS } from '../constants/colors';

import { 
  MessageCircle, 
  Clock, 
  Send, 
  Filter,
  CheckCircle,
  AlertCircle,
  Inbox,
  UserCheck,
  Users,
  HeadphonesIcon,
  CreditCard,
  Settings as SettingsIcon,
  FileText,
  TrendingUp,
  Star,
  BarChart3,
  Search,
  Plus,
  Download,
  Calendar,
  Zap
} from 'lucide-react';

// Types for admin support functionality
interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in-progress' | 'closed' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  departmentId: string;
  assignedAgent?: string;
  lastActivity: string;
  createdAt: string;
  userEmail: string;
  userName: string;
  category: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline';
  responseTime: string;
  icon: React.ComponentType<{ className?: string }>;
  ticketCount: number;
  avgResponseTime: string;
  agents: number;
}

interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  sender: 'user' | 'agent';
  agentName?: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedToday: number;
  avgResponseTime: string;
  customerSatisfaction: number;
  totalAgents: number;
  onlineAgents: number;
  todayTickets: number;
  resolvedToday: number;
  avgResolutionTime: string;
  escalatedTickets: number;
}

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [agentName] = useState('Admin Support Agent');
  const [supportStats, setSupportStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedToday: 0,
    avgResponseTime: '2.5 hours',
    customerSatisfaction: 4.2,
    totalAgents: 8,
    onlineAgents: 6,
    todayTickets: 0,
    resolvedToday: 0,
    avgResolutionTime: '4.2 hours',
    escalatedTickets: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchData = async () => {
    try {
      // Enhanced mock data with more tickets
      const mockTickets: SupportTicket[] = [
        {
          id: 'TKT-001',
          userId: '1',
          subject: 'Cannot access trading platform',
          status: 'open',
          priority: 'high',
          departmentId: '1',
          assignedAgent: 'Sarah Johnson',
          lastActivity: new Date(Date.now() - 1800000).toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          userEmail: 'john.doe@email.com',
          userName: 'John Doe',
          category: 'Technical'
        },
        {
          id: 'TKT-002',
          userId: '2',
          subject: 'Account verification pending',
          status: 'in-progress',
          priority: 'medium',
          departmentId: '2',
          assignedAgent: 'Mike Chen',
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          userEmail: 'jane.smith@email.com',
          userName: 'Jane Smith',
          category: 'Account'
        },
        {
          id: 'TKT-003',
          userId: '3',
          subject: 'Withdrawal not processed',
          status: 'closed',
          priority: 'urgent',
          departmentId: '4',
          assignedAgent: 'Jessica Wong',
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          userEmail: 'alex.brown@email.com',
          userName: 'Alex Brown',
          category: 'Financial'
        },
        {
          id: 'TKT-004',
          userId: '4',
          subject: 'Trading platform errors',
          status: 'open',
          priority: 'high',
          departmentId: '3',
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          userEmail: 'emma.wilson@email.com',
          userName: 'Emma Wilson',
          category: 'Technical'
        },
        {
          id: 'TKT-005',
          userId: '5',
          subject: 'KYC document upload issue',
          status: 'in-progress',
          priority: 'low',
          departmentId: '5',
          assignedAgent: 'David Lee',
          lastActivity: new Date(Date.now() - 14400000).toISOString(),
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          userEmail: 'robert.davis@email.com',
          userName: 'Robert Davis',
          category: 'Documentation'
        },
        {
          id: 'TKT-006',
          userId: '6',
          subject: 'Unable to reset password',
          status: 'open',
          priority: 'medium',
          departmentId: '1',
          lastActivity: new Date(Date.now() - 5400000).toISOString(),
          createdAt: new Date(Date.now() - 5400000).toISOString(),
          userEmail: 'michael.clark@email.com',
          userName: 'Michael Clark',
          category: 'Account'
        },
        {
          id: 'TKT-007',
          userId: '7',
          subject: 'Deposit not reflected in account',
          status: 'urgent',
          priority: 'urgent',
          departmentId: '4',
          assignedAgent: 'Sarah Johnson',
          lastActivity: new Date(Date.now() - 900000).toISOString(),
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          userEmail: 'lisa.martinez@email.com',
          userName: 'Lisa Martinez',
          category: 'Financial'
        }
      ];
      
      const mockDepartments: Department[] = [
        { 
          id: '1', 
          name: 'Technical Support',
          description: 'Technical assistance and troubleshooting',
          status: 'online',
          responseTime: '< 2 hours',
          icon: SettingsIcon,
          ticketCount: 18,
          avgResponseTime: '1.5 hours',
          agents: 4
        },
        { 
          id: '2', 
          name: 'Account Management',
          description: 'Account-related inquiries',
          status: 'online',
          responseTime: '< 1 hour',
          icon: Users,
          ticketCount: 25,
          avgResponseTime: '45 minutes',
          agents: 3
        },
        { 
          id: '3', 
          name: 'Trading Support',
          description: 'Trading platform assistance',
          status: 'online',
          responseTime: '< 30 minutes',
          icon: HeadphonesIcon,
          ticketCount: 12,
          avgResponseTime: '20 minutes',
          agents: 2
        },
        { 
          id: '4', 
          name: 'Financial Services',
          description: 'Payment and withdrawal support',
          status: 'online',
          responseTime: '< 4 hours',
          icon: CreditCard,
          ticketCount: 15,
          avgResponseTime: '3.2 hours',
          agents: 3
        },
        { 
          id: '5', 
          name: 'Documentation',
          description: 'KYC and compliance support',
          status: 'offline',
          responseTime: '< 24 hours',
          icon: FileText,
          ticketCount: 8,
          avgResponseTime: '18 hours',
          agents: 2
        }
      ];
      
      setTickets(mockTickets);
      setDepartments(mockDepartments);
      
      // Update stats
      setSupportStats({
        totalTickets: mockTickets.length,
        openTickets: mockTickets.filter(t => t.status === 'open').length,
        inProgressTickets: mockTickets.filter(t => t.status === 'in-progress').length,
        closedToday: mockTickets.filter(t => 
          t.status === 'closed' && 
          new Date(t.lastActivity).toDateString() === new Date().toDateString()
        ).length,
        avgResponseTime: '2.5 hours',
        customerSatisfaction: 4.2,
        totalAgents: 14,
        onlineAgents: 12,
        todayTickets: mockTickets.filter(t => 
          new Date(t.createdAt).toDateString() === new Date().toDateString()
        ).length,
        resolvedToday: mockTickets.filter(t => 
          t.status === 'closed' && 
          new Date(t.lastActivity).toDateString() === new Date().toDateString()
        ).length,
        avgResolutionTime: '4.2 hours',
        escalatedTickets: mockTickets.filter(t => t.priority === 'urgent').length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      // Enhanced mock messages data
      const mockMessages: SupportMessage[] = [
        {
          id: '1',
          ticketId: ticketId,
          userId: '1',
          sender: 'user',
          message: 'Hi, I\'m having trouble accessing the trading platform. It keeps showing a login error.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'delivered'
        },
        {
          id: '2',
          ticketId: ticketId,
          userId: '1',
          sender: 'agent',
          agentName: 'Sarah Johnson',
          message: 'Hello! I\'m sorry to hear you\'re experiencing login issues. Can you please tell me what browser you\'re using and if you\'ve tried clearing your cache?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          status: 'delivered'
        },
        {
          id: '3',
          ticketId: ticketId,
          userId: '1',
          sender: 'user',
          message: 'I\'m using Chrome. Let me try clearing the cache now.',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          status: 'delivered'
        },
        {
          id: '4',
          ticketId: ticketId,
          userId: '1',
          sender: 'agent',
          agentName: 'Sarah Johnson',
          message: 'Great! Please also try disabling any browser extensions temporarily. If the issue persists, I can generate a fresh login token for you.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          status: 'delivered'
        }
      ];
      
      setTicketMessages(mockMessages.sort((a: SupportMessage, b: SupportMessage) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const messageData = {
      id: Date.now().toString(),
      ticketId: selectedTicket.id,
      userId: selectedTicket.userId,
      departmentId: selectedTicket.departmentId,
      sender: 'agent',
      agentName: agentName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'delivered'
    };

    try {
      console.log('Sending message:', messageData);
      await new Promise(resolve => setTimeout(resolve, 500));

      setNewMessage('');
      fetchTicketMessages(selectedTicket.id);
      fetchData();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      console.log('Updating ticket status:', ticketId, status);
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchData();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const assignTicket = async (ticketId: string, agent: string) => {
    try {
      console.log('Assigning ticket:', ticketId, 'to', agent);
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    const departmentMatch = filterDepartment === 'all' || ticket.departmentId === filterDepartment;
    const priorityMatch = filterPriority === 'all' || ticket.priority === filterPriority;
    const searchMatch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && departmentMatch && priorityMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return `text-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT}`;
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return `text-${COLORS.GRAY} bg-gray-100`;
      case 'urgent': return 'text-red-600 bg-red-100';
      default: return `text-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT}`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return `text-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT} border-${COLORS.PRIMARY_BG}`;
      default: return `text-${COLORS.GRAY} bg-gray-100 border-gray-200`;
    }
  };

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return 'No Department';
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${COLORS.PRIMARY} mx-auto mb-4`}></div>
          <p className="text-gray-600">Loading admin support dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>Admin Support Center</h1>
          <p className={`mt-2 text-${COLORS.SECONDARY_TEXT}`}>Comprehensive customer support management and analytics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className={`text-${COLORS.PRIMARY} border-${COLORS.PRIMARY_BG} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button
            variant="outline"
            className={`text-${COLORS.PRIMARY} border-${COLORS.PRIMARY_BG} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button className={`bg-${COLORS.PRIMARY} hover:bg-${COLORS.PRIMARY_BG}`}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-${COLORS.PRIMARY}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{supportStats.totalTickets}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">+{supportStats.todayTickets} today</span>
              </div>
            </div>
            <div className={`p-3 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-full`}>
              <Inbox className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{supportStats.openTickets}</p>
              <div className="flex items-center mt-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
                <span className="text-xs text-yellow-600">Requires attention</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{supportStats.inProgressTickets}</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-orange-600 mr-1" />
                <span className="text-xs text-orange-600">Being resolved</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{supportStats.resolvedToday}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-xs text-green-600">Great progress!</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Avg Response</span>
          </div>
          <p className="text-xl font-bold text-blue-600">{supportStats.avgResponseTime}</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Satisfaction</span>
          </div>
          <p className="text-xl font-bold text-yellow-600">{supportStats.customerSatisfaction}/5.0</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <UserCheck className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Online Agents</span>
          </div>
          <p className="text-xl font-bold text-green-600">{supportStats.onlineAgents}/{supportStats.totalAgents}</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Escalated</span>
          </div>
          <p className="text-xl font-bold text-red-600">{supportStats.escalatedTickets}</p>
        </Card>
      </div>

      {/* Departments Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <div key={dept.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${dept.status === 'online' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`h-5 w-5 ${dept.status === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div className={`w-2 h-2 rounded-full ${dept.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                </div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">{dept.name}</h4>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{dept.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Tickets</span>
                    <span className="text-xs font-medium text-gray-900">{dept.ticketCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Agents</span>
                    <span className="text-xs font-medium text-gray-900">{dept.agents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Response</span>
                    <span className="text-xs font-medium text-gray-900">{dept.avgResponseTime}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Support Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Tickets List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-red-600" />
              Support Tickets ({filteredTickets.length})
            </h2>
            <Filter className="h-4 w-4 text-gray-400" />
          </div>

          {/* Enhanced Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets, users, or ticket IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
                <option value="urgent">Urgent</option>
              </select>
              
              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTickets.map(ticket => (
              <button 
                key={ticket.id}
                className={`w-full text-left p-4 border rounded-lg transition-all ${
                  selectedTicket?.id === ticket.id 
                    ? 'border-red-500 bg-red-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 pr-3">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                      {ticket.subject}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      From: {ticket.userName} ({ticket.userEmail})
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.toUpperCase().replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {ticket.id}
                  </span>
                  <span className="text-xs text-gray-600">
                    {getDepartmentName(ticket.departmentId)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-600">
                    Updated: {new Date(ticket.lastActivity).toLocaleDateString()}
                  </span>
                </div>
                
                {ticket.assignedAgent && (
                  <div className="text-xs text-red-700 mt-2 bg-red-100 px-2 py-1 rounded flex items-center">
                    <UserCheck className="h-3 w-3 mr-1" />
                    {ticket.assignedAgent}
                  </div>
                )}
              </button>
            ))}
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No tickets found matching your filters</p>
              </div>
            )}
          </div>
        </Card>

        {/* Enhanced Chat Interface */}
        <Card className="p-6">
          {selectedTicket ? (
            <>
              {/* Enhanced Chat Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{selectedTicket.subject}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedTicket.userName} • {selectedTicket.userEmail}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedTicket.id} • {getDepartmentName(selectedTicket.departmentId)} • {selectedTicket.category}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.toUpperCase().replace('-', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded border text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'in-progress' ? 'primary' : 'outline'}
                    onClick={() => updateTicketStatus(selectedTicket.id, 'in-progress')}
                    className="text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedTicket.status === 'closed' ? 'primary' : 'outline'}
                    onClick={() => updateTicketStatus(selectedTicket.id, 'closed')}
                    className="text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Close
                  </Button>
                  {!selectedTicket.assignedAgent && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => assignTicket(selectedTicket.id, agentName)}
                      className="text-xs"
                    >
                      <UserCheck className="h-3 w-3 mr-1" />
                      Assign to Me
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Escalate
                  </Button>
                </div>
                
                {selectedTicket.assignedAgent && (
                  <div className="text-sm text-red-700 mt-3 flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assigned to: {selectedTicket.assignedAgent}
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto mb-4 space-y-4">
                {ticketMessages.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      message.sender === 'agent' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.sender === 'agent' && message.agentName && (
                        <div className={`text-xs font-medium mb-1 ${
                          message.sender === 'agent' ? 'text-red-100' : 'text-red-700'
                        }`}>
                          {message.agentName}
                        </div>
                      )}
                      <p className="text-sm">{message.message}</p>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'agent' ? 'text-red-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {ticketMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>No messages yet</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              {selectedTicket.status !== 'closed' && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your response..."
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim()}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a ticket to view conversation
                </h3>
                <p className="text-gray-600">
                  Choose a ticket from the list to start managing the conversation
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminSupport;
