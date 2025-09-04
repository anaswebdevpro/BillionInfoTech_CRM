import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/admin.png'; // Admin logo
import { useAuth } from '../../context/AuthContext/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Shield,
  UserCheck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Database,
  Bell,
  Target,
  Briefcase,
  Gift,
  Image,
  Building,
  UserCog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS, GRADIENTS } from '../../constants/colors';

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: SubMenuItem[];
  badge?: string | number;
}

interface SubMenuItem {
  name: string;
    href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

/**
 * Admin sidebar navigation component
 * Displays admin navigation menu and branding
 */
const AdminSidebar: React.FC = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Support', href: '/admin/support', icon: MessageCircle, badge: '12' },
    {
      name: 'User Management',
      icon: Users,
      submenu: [
        { name: 'All Users', href: '/admin/users', icon: Users },
        { name: 'User Verification', href: '/admin/users/verification', icon: UserCheck, badge: '8' },
        { name: 'User Roles', href: '/admin/users/roles', icon: Shield },
      ]
    },
    {
      name: 'Account Management',
      icon: CreditCard,
      submenu: [
        { name: 'All Accounts', href: '/admin/accounts', icon: CreditCard },
        { name: 'Account Approval', href: '/admin/accounts/approval', icon: UserCheck, badge: '5' },
        { name: 'Account Types', href: '/admin/accounts/types', icon: Settings },
      ]
    },
    {
      name: 'Transactions',
      icon: DollarSign,
      submenu: [
        { name: 'All Transactions', href: '/admin/transactions', icon: DollarSign },
        { name: 'Pending Approvals', href: '/admin/transactions/pending', icon: AlertTriangle, badge: '3' },
        { name: 'Deposits', href: '/admin/transactions/deposits', icon: TrendingUp },
        { name: 'Withdrawals', href: '/admin/transactions/withdrawals', icon: TrendingUp },
      ]
    },
    { name: 'KYC Management', href: '/admin/kyc', icon: FileText, badge: '15' },
    {
      name: 'Reports & Analytics',
      icon: BarChart3,
      submenu: [
        { name: 'Financial Reports', href: '/admin/reports/financial', icon: BarChart3 },
        { name: 'User Analytics', href: '/admin/reports/users', icon: Users },
        { name: 'System Logs', href: '/admin/reports/logs', icon: Database },
      ]
    },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: '7' },
    {
      name: 'Client Management',
      icon: Users,
      submenu: [
        { name: 'Clients & Leads', href: '/admin/clients-leads', icon: Target },
        { name: 'Leads Management', href: '/admin/leads', icon: Target },
      ]
    },
    { name: 'Financial Management', href: '/admin/financial', icon: DollarSign },
    { name: 'IB Partners', href: '/admin/ib-partners', icon: Briefcase },
    { name: 'Configurations', href: '/admin/configurations', icon: Settings },
    {
      name: 'Marketing',
      icon: Gift,
      submenu: [
        { name: 'Bonus & Promotion', href: '/admin/bonus-promotion', icon: Gift },
        { name: 'Promotional Banners', href: '/admin/promotional-banners', icon: Image },
      ]
    },
    { name: 'Manage Franchise', href: '/admin/manage-franchise', icon: Building },
    { name: 'Sales Managers', href: '/admin/sales-managers', icon: UserCog },
  ];

  const toggleSubmenu = (menuName: string) => {
    const lowerMenuName = menuName.toLowerCase();
    setExpandedMenus(prev => 
      prev.includes(lowerMenuName) 
        ? prev.filter(name => name !== lowerMenuName)
        : [...prev, lowerMenuName]
    );
  };

  const isSubmenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName.toLowerCase());
  };

  return (
    <div 
      className={`flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 
        ${GRADIENTS.SIDEBAR}
        shadow-sm`}
    >
      {/* Logo */}
      <div className="flex h-14 mt-2 shrink-0 items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Admin Panel" className="h-8 w-8 object-cover" />
          <div className={`text-${COLORS.SECONDARY}`}>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className={`text-xs text-${COLORS.SECONDARY_TEXT}`}>Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const hasSubmenu = 'submenu' in item && item.submenu;
                const isExpanded = hasSubmenu && isSubmenuExpanded(item.name);
                
                if (hasSubmenu) {
                  return (
                    <li key={item.name}>
                      {/* Parent menu item with submenu */}
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`} />
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <span className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center`}>
                            {item.badge}
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronDown className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
                        ) : (
                          <ChevronRight className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
                        )}
                      </button>
                      
                      {/* Submenu items */}
                      {isExpanded && item.submenu && (
                        <ul className="mt-1 pl-6 space-y-1">
                          {item.submenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            
                            return (
                              <li key={subItem.name}>
                                <NavLink
                                  to={subItem.href}
                                  className={({ isActive }) => `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors ${
                                    isActive
                                      ? `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
                                      : `text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`
                                  }`}
                                >
                                  {({ isActive }) => (
                                    <>
                                      <SubIcon
                                        className={`h-4 w-4 shrink-0 ${
                                          isActive ? `text-${COLORS.WHITE}` : `text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`
                                        }`}
                                      />
                                      <span className="flex-1">{subItem.name}</span>
                                      {subItem.badge && (
                                        <span className={`text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center ${
                                          isActive 
                                            ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.WHITE}` 
                                            : `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
                                        }`}>
                                          {subItem.badge}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                } else {
                  // Regular menu item without submenu
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href!}
                        className={({ isActive }) => `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                          isActive
                            ? `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
                            : `text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`
                        }`}
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`h-5 w-5 shrink-0 ${
                                isActive ? `text-${COLORS.WHITE}` : `text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`
                              }`}
                            />
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <span className={`text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center ${
                                isActive 
                                  ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.WHITE}` 
                                  : `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                }
              })}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <a
                  href="#"
                  className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                >
                  <Settings className={`h-5 w-5 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`} />
                  System Settings
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                >
                  <LogOut className={`h-5 w-5 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`} />
                  Sign out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
