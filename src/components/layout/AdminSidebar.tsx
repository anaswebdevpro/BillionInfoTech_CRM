import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/admin.png"; // Admin logo
import { useAuth } from "../../context/AuthContext/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Database,
  Target,
  Briefcase,
  Gift,
  Image,
  Building,
  UserCog,
} from "lucide-react";
import { COLORS, GRADIENTS } from "../../constants/colors";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  submenu?: SubMenuItem[];
  badge?: string | number;
}

interface SubMenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  submenu?: NestedSubMenuItem[];
}

interface NestedSubMenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const NavLinkItem: React.FC<{
  item: NavigationItem | SubMenuItem;
  isSubItem?: boolean;
  isNestedItem?: boolean;
}> = ({ item, isSubItem = false, isNestedItem = false }) => {
  const { name, href, icon: Icon, badge } = item;
  const fontClass = isSubItem ? "font-medium" : "font-semibold";
  const iconSize = isSubItem ? "h-4 w-4" : "h-5 w-5";

  return (
    <NavLink
      to={href!}
      className={({ isActive }) =>
        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 ${fontClass} transition-colors ${
          isActive
            ? `bg-${COLORS.PRIMARY} text-${COLORS.WHITE}`
            : `text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT}`
        }`
      }
    >
      {({ isActive }) => (
        <>
          {!isNestedItem && (
            <Icon
              className={`${iconSize} shrink-0 ${
                isActive
                  ? `text-${COLORS.WHITE}`
                  : `text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`
              }`}
            />
          )}
          <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {name}
          </span>
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

const NestedSubMenuItem: React.FC<{
  item: SubMenuItem;
  toggleSubmenu: (name: string) => void;
  isSubmenuExpanded: (name: string) => boolean;
}> = ({ item, toggleSubmenu, isSubmenuExpanded }) => {
  const { name, icon: Icon, submenu, badge } = item;
  const isExpanded = isSubmenuExpanded(name);

  if (!submenu) {
    return (
      <NavLinkItem
        item={item as SubMenuItem & { href: string }}
        isSubItem
        isNestedItem
      />
    );
  }

  return (
    <li key={name}>
      <button
        onClick={() => toggleSubmenu(name)}
        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`}
        />
        <span className="flex-1 text-left whitespace-nowrap">{name}</span>
        {badge && (
          <span
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center`}
          >
            {badge}
          </span>
        )}
        {isExpanded ? (
          <ChevronDown className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
        ) : (
          <ChevronRight className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
        )}
      </button>
      {isExpanded && submenu && (
        <ul className="mt-1 pl-6 space-y-1">
          {submenu.map((nestedItem) => (
            <li key={nestedItem.name}>
              <NavLinkItem item={nestedItem} isSubItem isNestedItem />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const SubMenuItemComponent: React.FC<{
  item: NavigationItem;
  toggleSubmenu: (name: string) => void;
  isSubmenuExpanded: (name: string) => boolean;
}> = ({ item, toggleSubmenu, isSubmenuExpanded }) => {
  const { name, icon: Icon, submenu, badge } = item;
  const isExpanded = isSubmenuExpanded(name);

  return (
    <li key={name}>
      <button
        onClick={() => toggleSubmenu(name)}
        className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`}
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
          <ChevronDown className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
        ) : (
          <ChevronRight className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
        )}
      </button>
      {isExpanded && submenu && (
        <ul className="mt-1 pl-6 space-y-1">
          {submenu.map((subItem) => (
            <NestedSubMenuItem
              key={subItem.name}
              item={subItem}
              toggleSubmenu={toggleSubmenu}
              isSubmenuExpanded={isSubmenuExpanded}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/**
 * Admin sidebar navigation component
 * Displays admin navigation menu and branding
 */
const AdminSidebar: React.FC = () => {
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
          name: "All Clients ",
          href: "/afxadmin/clients-leads",
          icon: Target,
        },
        {
          name: "KYC Management",
          href: "/afxadmin/kyc",
          icon: UserCog,
          badge: "15",
        },
         {
          name: "Trading History",
          href: "/afxadmin/trading-history",
          icon: Target,
        },
         {
          name: "Trading Accounts",
          href: "/afxadmin/all-accounts",
          icon: Target,
        },
        
      ],
    },
    {
      name: "Financial",
      icon: DollarSign,
      submenu: [
        {
          name: "Deposits",
          icon: TrendingUp,
          submenu: [
            {
              name: "Deposit Requests",
              href: "/afxadmin/financial/deposit-requests",
              icon: AlertTriangle,
            },
            {
              name: "All Deposits",
              href: "/afxadmin/financial/all-deposits",
              icon: TrendingUp,
            },
            {
              name: "Deposit History",
              href: "/afxadmin/financial/deposit-history",
              icon: FileText,
            },
            {
              name: "Gateway Txns",
              href: "/afxadmin/financial/gateway-txns",
              icon: Database,
            },
          ],
        },
        {
          name: "Withdrawals",
          icon: TrendingUp,
          submenu: [
            {
              name: "Withdrawal Requests",
              href: "/afxadmin/financial/withdrawal-requests",
              icon: AlertTriangle,
            },
            {
              name: "Withdrawal History",
              href: "/afxadmin/financial/withdrawal-history",
              icon: FileText,
            },
          ],
        },
        {
          name: "Transfers",
          href: "/afxadmin/financial/transfers",
          icon: DollarSign,
        },
        {
          name: "IB Commission",
          href: "/afxadmin/financial/ib-commission",
          icon: Briefcase,
        },
        {
          name: "Client Wise IB Commission",
          href: "/afxadmin/financial/client-wise-ib-commission",
          icon: Users,
        },
        {
          name: "All Transactions",
          href: "/afxadmin/financial/all-transactions",
          icon: FileText,
        },
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
      name: "Manage IB Partners",
      icon: Briefcase,
      submenu: [
        {
          name: "Partner Requests",
          href: "/afxadmin/ib-partners/partner-requests",
          icon: AlertTriangle,
        },
        {
          name: "IBs",
          href: "/afxadmin/ib-partners/ibs",
          icon: Users,
        },
      ],
    },
    {
      name: "Configurations",
      icon: Settings,
      submenu: [
        {
          name: "Bank Settings",
          href: "/afxadmin/configurations/bank-settings",
          icon: Database,
        },
        {
          name: "Manage Groups",
          href: "/afxadmin/configurations/manage-groups",
          icon: Users,
        },
        {
          name: "Group Settings",
          href: "/afxadmin/configurations/group-settings",
          icon: Settings,
        },
        {
          name: "Trading Symbols",
          href: "/afxadmin/configurations/trading-symbols",
          icon: TrendingUp,
        },
        {
          name: "Trading Categories",
          href: "/afxadmin/configurations/trading-categories",
          icon: FileText,
        },
        {
          name: "Manage Subadmins",
          href: "/afxadmin/configurations/manage-subadmins",
          icon: UserCog,
        },
        {
          name: "All Admins",
          href: "/afxadmin/configurations/all-admins",
          icon: Users,
        },
      ],
    },
    // {
    //   name: "Marketing",
    //   icon: Gift,
    //   submenu: [
        {
          name: "Bonus & Promotion",
          href: "/afxadmin/bonus-promotion",
          icon: Gift,
        },
        {
          name: "Promotional Banners",
          href: "/afxadmin/promotional-banners",
          icon: Image,
        },
    //   ],
    // },
    {
      name: "Manage Franchise",
      icon: Building,
      submenu: [
        {
          name: "Countries",
          href: "/afxadmin/manage-franchise/countries",
          icon: Building,
        },
        {
          name: "Cities",
          href: "/afxadmin/manage-franchise/cities",
          icon: Target,
        },
      ],
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
          <h1 className={`text-lg font-bold text-${COLORS.SECONDARY}`}>
            Admin Panel
          </h1>
        </div>
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
                  className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                >
                  <Settings
                    className={`h-5 w-5 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`}
                  />
                  System Settings
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    logout();
                    navigate("/afxadmin/login");
                  }}
                  className={`group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.PRIMARY_TEXT} hover:bg-${COLORS.PRIMARY_BG_LIGHT} transition-colors`}
                >
                  <LogOut
                    className={`h-5 w-5 shrink-0 text-${COLORS.SECONDARY_TEXT} group-hover:text-${COLORS.PRIMARY_TEXT}`}
                  />
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
