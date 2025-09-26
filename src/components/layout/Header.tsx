import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constants/colors';
import type { ExtendedUser } from '../../types';

interface HeaderProps {
  title: string;
  onMobileMenuClick: () => void;
  isAdmin?: boolean;
}

const ProfileButton: React.FC<{
  user: ExtendedUser | null;
  isAdmin: boolean;
  onClick: () => void;
}> = ({ user, isAdmin, onClick }) => {
  const profileImageBorder = isAdmin ? 'border-red-600' : `border-${COLORS.PRIMARY}`;
  const textColor = isAdmin ? 'text-red-800' : `text-${COLORS.SECONDARY}`;

  return (
    <button
      type="button"
      className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
      onClick={onClick}
    >
        
      <span className="sr-only">Open user menu</span>
      <div className={`h-8 w-8 rounded-full overflow-hidden flex items-center justify-center border-1 ${profileImageBorder}`}>
    
        {user?.profile_picture ? (
          <img
          src={`https://amf.billioninfotech.com/${user?.profile_picture}`}
            alt={user?.first_name+' '+user?.last_name || 'Profile'}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-6 w-6 text-gray-400" />
        )}
      </div>
      <span className="hidden lg:flex lg:items-center">
        <span className={`ml-2 text-sm font-semibold leading-6 ${textColor}`}>
          {user?.first_name+' '+user?.last_name || 'User'}
        </span>
      </span>
    </button>
  );
};

/**
 * Header component for the dashboard
 * Contains page title, notifications, and user menu
 */
const Header: React.FC<HeaderProps> = ({ title, onMobileMenuClick, isAdmin = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();


  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const headerClasses = isAdmin ? 'border-red-200 bg-white' : `border-${COLORS.BORDER} bg-${COLORS.WHITE}`;
  const mobileMenuButtonClasses = isAdmin ? 'text-red-600' : `text-${COLORS.SECONDARY_TEXT}`;
  const separatorClasses = isAdmin ? 'bg-red-200' : `bg-${COLORS.BORDER}`;
  const titleClasses = isAdmin ? 'text-red-800' : `text-${COLORS.SECONDARY}`;
  const lgSeparatorClasses = isAdmin ? 'lg:bg-red-200' : `lg:bg-${COLORS.BORDER}`;

  return (
    <div className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b ${headerClasses} px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8`}>
      {/* Mobile menu button */}
      <button
        type="button"
        className={`-m-2.5 p-2.5 ${mobileMenuButtonClasses} lg:hidden`}
        onClick={onMobileMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className={`h-6 w-px ${separatorClasses} lg:hidden`} />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className={`text-xl font-semibold ${titleClasses}`}>
            {title}
          </h1>
          {isAdmin && (
            <span className="ml-3 px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              Admin Panel
            </span>
          )}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className={`hidden lg:block lg:h-6 lg:w-px ${lgSeparatorClasses}`} />

          {/* Profile dropdown */}
          <div className="relative">
            <ProfileButton user={user} isAdmin={isAdmin} onClick={handleProfileClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
