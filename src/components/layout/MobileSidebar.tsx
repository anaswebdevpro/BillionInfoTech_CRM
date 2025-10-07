import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/nav-logo.png"; // Add logo import
import { useAuth } from "../../context/AuthContext/AuthContext";
import {
  X,
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Users,
  // Shield,
  LogOut,
  ChevronDown,
  ChevronRight,
  Settings,
  Settings as ManageIcon,
  MessageCircle,
  Gift,
  DollarSign,
  List,
  GitBranch,
  Building,
  BarChart3,
  FileText,
  User,
} from "lucide-react";
import { COLORS } from "../../constants/colors";

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

const NavLinkItem: React.FC<{
  item: NavigationItem | SubMenuItem;
  onClose: () => void;
  isSubItem?: boolean;
}> = ({ item, onClose, isSubItem = false }) => {
  const { name, href, icon: Icon } = item;
  const fontClass = isSubItem ? "font-medium" : "font-semibold";
  const iconSize = isSubItem ? "h-4 w-4" : "h-5 w-5";

  return (
    <NavLink
      to={href!}
      onClick={onClose}
      className={({ isActive }) =>
        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 ${fontClass} transition-colors ${
          isActive
            ? "bg-green-50 text-green-700"
            : `text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`${iconSize} shrink-0 ${
              isActive
                ? "text-green-700"
                : "text-gray-400 group-hover:text-green-700"
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
  onClose: () => void;
  toggleSubmenu: (name: string) => void;
  isSubmenuExpanded: (name: string) => boolean;
}> = ({ item, onClose, toggleSubmenu, isSubmenuExpanded }) => {
  const { name, icon: Icon, submenu } = item;
  const isExpanded = isSubmenuExpanded(name);

  return (
    <li key={name}>
      <button
        onClick={() => toggleSubmenu(name)}
        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`}
      >
        <Icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-700" />
        {name}
        {isExpanded ? (
          <ChevronDown className="ml-auto h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
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
 * Mobile sidebar component for responsive navigation
 * Slides in from the left on mobile devices
 */
const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const navigation: NavigationItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Accounts",
      icon: TrendingUp,
      submenu: [
        {
          name: "My Accounts",
          href: "/dashboard/my-accounts",
          icon: ManageIcon,
        },
        {
          name: "Manage Accounts",
          href: "/dashboard/manage-accounts",
          icon: ManageIcon,
        },
        // { name: 'Live Accounts', href: '/dashboard/live-accounts', icon: TrendingUp },
      ],
    },

    {
      name: "Bonus & Promotion",
      href: "/dashboard/bonus-promotion",
      icon: Gift,
    },

    {
      name: "IB MENU",
      icon: Users,
      submenu: [
        {
          name: "Set Commission",
          href: "/dashboard/set-commission",
          icon: DollarSign,
        },
        { name: "Accordion", href: "/dashboard/accordian", icon: List },
        {
          name: "Request Tree",
          href: "/dashboard/request-tree",
          icon: GitBranch,
        },
        {
          name: "Trade History",
          href: "/dashboard/trade-history",
          icon: TrendingUp,
        },
        {
          name: "Transaction",
          href: "/dashboard/transaction",
          icon: CreditCard,
        },
        { name: "Business", href: "/dashboard/business", icon: Building },
        {
          name: "Sub IB Summary",
          href: "/dashboard/sub-ib-summary",
          icon: BarChart3,
        },
        {
          name: "Commission Report",
          href: "/dashboard/commission-report",
          icon: FileText,
        },
      ],
    },
    { name: "Support", href: "/dashboard/support", icon: MessageCircle },
    // { name: '2FA Settings', href: '/dashboard/2fa', icon: Shield },
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
      {/* Overlay */}
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-gray-900/80" onClick={onClose} />

        {/* Sidebar */}
        <div
          className="fixed inset-y-0 left-0 z-50 w-64"
          style={{
            background:
              "linear-gradient(349deg, rgba(12, 247, 114, 1) 0%, rgba(87, 199, 133, 1) 26%, rgba(255, 240, 240, 1) 100%)",
          }}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            {/* Header with close button */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <img
                src={logo}
                alt="Billion InfoTech"
                className="h-12 w-auto object-contain"
              />
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
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-green-700 hover:bg-green-50`}
                      >
                        <Settings className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-green-700" />
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                      href="profile"
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`}
                      >
                        <User
                          className={`h-5 w-5 shrink-0 text-${COLORS.GRAY} group-hover:text-${COLORS.PRIMARY_TEXT}`}
                        />
                        Profile
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
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
