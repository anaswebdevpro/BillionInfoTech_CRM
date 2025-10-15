import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { X, ChevronDown, ChevronRight, UserCog, Target, Briefcase, Gift, Building } from "lucide-react";
import logo from "../../assets/admin.png";
import { COLORS, GRADIENTS } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext/AuthContext";
import {
  LayoutDashboard,
  Users,
  // CreditCard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  MessageCircle,
  // Shield,
  // UserCheck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Database,
  // Bell,
} from "lucide-react";

interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const NavLinkItem: React.FC<{
  item: NavigationItem | SubMenuItem;
  onClose: () => void;
  isSubItem?: boolean;
}> = ({ item, onClose, isSubItem = false }) => {
  const { name, href, icon: Icon, badge } = item;
  const fontClass = isSubItem ? "font-medium" : "font-semibold";
  const iconSize = isSubItem ? "h-4 w-4" : "h-5 w-5";

  return (
    <NavLink
      to={href!}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 ${fontClass} transition-colors ${
          isActive
            ? `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
            : `text-${COLORS.GRAY} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`${iconSize} shrink-0 ${
              isActive
                ? `text-${COLORS.WHITE}`
                : `text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`
            }`}
          />
          <span className="flex-1">{name}</span>
          {badge && (
            <span
              className={`text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center ${
                isActive
                  ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.WHITE}`
                  : `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

const SubMenuItemComponent: React.FC<{
  item: NavigationItem;
  onClose: () => void;
  toggleSubmenu: (name: string) => void;
  isSubmenuExpanded: (name: string) => boolean;
}> = ({ item, onClose, toggleSubmenu, isSubmenuExpanded }) => {
  const { name, icon: Icon, submenu, badge } = item;
  const isExpanded = isSubmenuExpanded(name);

  return (
    <li key={name}>
      <button
        onClick={() => toggleSubmenu(name)}
        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`}
        />
        <span className="flex-1 text-left">{name}</span>
        {badge && (
          <span
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center`}
          >
            {badge}
          </span>
        )}
        {isExpanded ? (
          <ChevronDown className={`h-4 w-4 text-${COLORS.GRAY}`} />
        ) : (
          <ChevronRight className={`h-4 w-4 text-${COLORS.GRAY}`} />
        )}
      </button>
      {isExpanded && submenu && (
        <ul className="mt-1 pl-6 space-y-1">
          {submenu.map((subItem) => (
            <li key={subItem.name}>
              <NavLinkItem item={subItem} onClose={onClose} isSubItem />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Admin mobile sidebar component
 * Provides mobile navigation for admin panel
 */
const AdminMobileSidebar: React.FC<AdminMobileSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/afxadmin/dashboard", icon: LayoutDashboard },
    {
      name: "Client Management",
      icon: Users,
      submenu: [
        {
          name: "Clients & Leads",
          href: "/afxadmin/clients-leads",
          icon: Target,
        },
        { name: "Leads Management", href: "/afxadmin/leads", icon: Target },
        {
          name: "KYC Management",
          href: "/afxadmin/kyc",
          icon: FileText,
          badge: "15",
        },
      ],
    },
   
    {
      name: "Transactions",
      icon: DollarSign,
      submenu: [
        {
          name: "All Transactions",
          href: "/afxadmin/transactions",
          icon: DollarSign,
        },
        {
          name: "Pending Approvals",
          href: "/afxadmin/transactions/pending",
          icon: AlertTriangle,
          badge: "3",
        },
        {
          name: "Deposits",
          href: "/afxadmin/transactions/deposits",
          icon: TrendingUp,
        },
        {
          name: "Withdrawals",
          href: "/afxadmin/transactions/withdrawals",
          icon: TrendingUp,
        },
        {
          name: "Financial Management",
          href: "/afxadmin/financial",
          icon: DollarSign,
        },
        { name: "IB Partners", href: "/afxadmin/ib-partners", icon: Briefcase },
      ],
    },
    {
      name: "Reports & Analytics",
      icon: BarChart3,
      submenu: [
        {
          name: "Financial Reports",
          href: "/afxadmin/reports/financial",
          icon: BarChart3,
        },
        {
          name: "User Analytics",
          href: "/afxadmin/reports/users",
          icon: Users,
        },
        { name: "System Logs", href: "/afxadmin/reports/logs", icon: Database },
      ],
    },
    
    {
      name: "Configurations",
      href: "/afxadmin/configurations",
      icon: Settings,
    },
    {
      name: "Marketing",
      icon: Gift,
      submenu: [
        {
          name: "Bonus & Promotion",
          href: "/afxadmin/bonus-promotion",
          icon: Gift,
        },
        {
          name: "Promotional Banners",
          href: "/afxadmin/promotional-banners",
          icon: Settings,
        },
      ],
    },
    {
      name: "Manage Franchise",
      href: "/afxadmin/manage-franchise",
      icon: Building ,
    },
    { name: "Sales Managers", href: "/afxadmin/sales-managers", icon: UserCog },
     {
      name: "Support",
      href: "/afxadmin/support",
      icon: MessageCircle,
      badge: "12",
    },
  ];
  

  const toggleSubmenu = (menuName: string) => {
    const lowerMenuName = menuName.toLowerCase();
    setExpandedMenus((prev) =>
      prev.includes(lowerMenuName)
        ? prev.filter((name) => name !== lowerMenuName)
        : [...prev, lowerMenuName]
    );
  };

  const isSubmenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName.toLowerCase());
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay  */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 ${GRADIENTS.SIDEBAR}`}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            {/* Header with close button */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={logo}
                  alt="Admin Panel"
                  className="h-8 w-8 object-cover"
                />
                <div className={`text-${COLORS.SECONDARY}`}>
                  <h1 className="text-lg font-bold">Admin Panel</h1>
                  <p className={`text-xs text-${COLORS.SECONDARY_TEXT}`}>
                    Management System
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`-m-2.5 p-2.5 text-${COLORS.GRAY}`}
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
                    {navigation.map((item) =>
                      item.submenu ? (
                        <SubMenuItemComponent
                          key={item.name}
                          item={item}
                          onClose={onClose}
                          toggleSubmenu={toggleSubmenu}
                          isSubmenuExpanded={isSubmenuExpanded}
                        />
                      ) : (
                        <li key={item.name}>
                          <NavLinkItem item={item} onClose={onClose} />
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
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.GRAY} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                      >
                        <Settings
                          className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`}
                        />
                        System Settings
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/afxadmin/login");
                          onClose();
                        }}
                        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.GRAY} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                      >
                        <LogOut
                          className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`}
                        />
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

export default AdminMobileSidebar;
