import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/nav-logo.png'; // Add logo import
import { useAuth } from '../../context/AuthContext/AuthContext';
import { 
  X, 
  LayoutDashboard, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  ArrowRightLeft, 
  Users, 
  Shield, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Settings,
  Settings as ManageIcon
} from 'lucide-react';
import { COLORS } from '../../constants/colors';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Mobile sidebar component for responsive navigation
 * Slides in from the left on mobile devices
 */
const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Accounts',
      icon: TrendingUp,
      submenu: [
        { name: 'My Accounts', href: '/dashboard/my-accounts', icon: ManageIcon },
        { name: 'Manage Accounts', href: '/dashboard/manage-accounts', icon: ManageIcon },
        { name: 'Live Accounts', href: '/dashboard/live-accounts', icon: TrendingUp },
      ]
    },
    { name: 'KYC Verification', href: '/dashboard/kyc', icon: FileText },
    { name: 'Deposits', href: '/dashboard/deposits', icon: CreditCard },
    { name: 'Internal Transfer', href: '/dashboard/internal-transfer', icon: ArrowRightLeft },
    { name: 'IB Request', href: '/dashboard/ib-request', icon: Users },
    { name: '2FA Settings', href: '/dashboard/2fa', icon: Shield },
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 lg:hidden">
  <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />
        
        {/* Sidebar */}
        <div 
          className="fixed inset-y-0 left-0 z-50 w-64"
          style={{
            background: 'linear-gradient(349deg, rgba(12, 247, 114, 1) 0%, rgba(87, 199, 133, 1) 26%, rgba(255, 240, 240, 1) 100%)'
          }}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            {/* Header with close button */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <img src={logo} alt="Billion InfoTech" className="h-12 w-auto object-contain" />
              <button
                type="button"
                className={`-m-2.5 p-2.5 text-${COLORS.SECONDARY_TEXT}`}
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
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
                              className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`}
                            >
                              <Icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-700" />
                              {item.name}
                              {isExpanded ? (
                                <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            
                            {/* Submenu items */}
                            {isExpanded && item.submenu && (
                              <ul className="mt-1 pl-6 space-y-1">
                                {item.submenu.map((subItem) => {
                                  const SubIcon = subItem.icon;
                                  const isActive = location.pathname === subItem.href;
                                  
                                  return (
                                    <li key={subItem.name}>
              <NavLink
                                        to={subItem.href}
                                        onClick={onClose}
                                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors ${
                                          isActive
                                            ? 'bg-green-50 text-green-700'
                : `text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`
                                        }`}
                                      >
                                        <SubIcon
                                          className={`h-4 w-4 shrink-0 ${
                                            isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700'
                                          }`}
                                        />
                                        {subItem.name}
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
                        const isActive = location.pathname === item.href;
                        
                        return (
                          <li key={item.name}>
            <NavLink
                              to={item.href!}
                              onClick={onClose}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                                isActive
                                  ? 'bg-green-50 text-green-700'
              : `text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`
                              }`}
                            >
                              <Icon
                                className={`h-5 w-5 shrink-0 ${
                                  isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-green-700'
                                }`}
                              />
                              {item.name}
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
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`}
                      >
                        <Settings className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-700" />
                        Settings
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                          onClose();
                        }}
                        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-red-700 hover:bg-red-50`}
                      >
                        <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-700" />
                        Sign out
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
