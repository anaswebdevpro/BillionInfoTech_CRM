import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/nav-logo.png'; // Adjust the path as necessary
import {  LayoutDashboard,  TrendingUp,  CreditCard,  FileText,  ArrowRightLeft,  Users,
  Shield,  Settings,  LogOut,  ChevronDown,  ChevronRight,  Settings as ManageIcon, MessageCircle,} from 'lucide-react';
import { COLORS, GRADIENTS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext/AuthContext';

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

const NavLinkItem: React.FC<{
  item: NavigationItem | SubMenuItem;
  isSubItem?: boolean;
}> = ({ item, isSubItem = false }) => {
  const { name, href, icon: Icon } = item;
  const fontClass = isSubItem ? 'font-medium' : 'font-semibold';
  const iconSize = isSubItem ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <NavLink
      to={href!}
      className={({ isActive }) =>
        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 ${fontClass} transition-colors ${
          isActive
            ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
            : `text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`${iconSize} shrink-0 ${
              isActive ? `text-${COLORS.PRIMARY_TEXT}` : `text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`
            }`}
          />
          {name}
        </>
      )}
    </NavLink>
  );
};

const SubMenuItemComponent: React.FC<{
  item: NavigationItem;
  toggleSubmenu: (name: string) => void;
  isSubmenuExpanded: (name: string) => boolean;
}> = ({ item, toggleSubmenu, isSubmenuExpanded }) => {
  const { name, icon: Icon, submenu } = item;
  const isExpanded = isSubmenuExpanded(name);

  return (
    <li key={name}>
      <button
        onClick={() => toggleSubmenu(name)}
        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`}
      >
        <Icon className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`} />
        {name}
        {isExpanded ? (
          <ChevronDown className={`ml-auto h-4 w-4 text-${COLORS.GRAY}`} />
        ) : (
          <ChevronRight className={`ml-auto h-4 w-4 text-${COLORS.GRAY}`} />
        )}
      </button>
      {isExpanded && submenu && (
        <ul className="mt-1 pl-6 space-y-1">
          {submenu.map((subItem) => (
            <li key={subItem.name}>
              <NavLinkItem item={subItem} isSubItem />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Main sidebar navigation component
 * Displays navigation menu and company branding
 */
const Sidebar: React.FC = () => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    { name: 'Support', href: '/dashboard/support', icon: MessageCircle },
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

  return (
    <div
      className={`flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4
        ${GRADIENTS.SIDEBAR}
        shadow-sm`}
    >
      {/* Logo */}
      <div className="flex h-14 mt-2 shrink-0 items-center">
        <img src={logo} alt="Billion InfoTech" className="object-cover" />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) =>
                item.submenu ? (
                  <SubMenuItemComponent
                    key={item.name}
                    item={item}
                    toggleSubmenu={toggleSubmenu}
                    isSubmenuExpanded={isSubmenuExpanded}
                  />
                ) : (
                  <li key={item.name}>
                    <NavLinkItem item={item} />
                  </li>
                )
              )}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              <li>
                <a
                  href="#"
                  className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`}
                >
                  <Settings className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`} />
                  Settings
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-red-700 hover:bg-red-50`}
                >
                  <LogOut className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-red-700`} />
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

export default Sidebar;