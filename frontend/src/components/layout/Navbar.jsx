import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { Button } from '@mui/material';
import { 
  ChatBubbleOutline as MessageIcon,
  PersonOutline as ProfileIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  HandshakeOutlined as NeedsIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-darkGreen shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
            <div className="text-white text-2xl font-bold">
              Uni<span className="text-green-400">share</span>.
            </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationBell />
            
            <Link
              to="/needs"
              className="flex items-center text-white hover:text-green-100 transition-colors"
            >
              <NeedsIcon className="h-5 w-5 mr-1" />
              <span>Needs</span>
            </Link>

            <Link
              to="/chats"
              className="flex items-center text-white hover:text-green-100 transition-colors"
            >
              <MessageIcon className="h-5 w-5 mr-1" />
              <span>Messages</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center text-white hover:text-green-100 transition-colors"
            >
              <ProfileIcon className="h-5 w-5 mr-1" />
              <span>Profile</span>
            </Link>

            {user?.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center text-white hover:text-green-100 transition-colors"
                >
                  <AdminIcon className="h-5 w-5 mr-1" />
                  <span>Admin</span>
                </Link>
                <Link
                  to="/admin/pending-items"
                  className="flex items-center text-white hover:text-green-100 transition-colors"
                >
                  <span>Pending Items</span>
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center text-white hover:text-green-100 transition-colors"
            >
              <LogoutIcon className="h-5 w-5 mr-1" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;