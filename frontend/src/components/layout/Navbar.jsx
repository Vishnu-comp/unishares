import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { Button } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Marketplace</span>
            </Link>
          </div>

          <div className="flex items-center">
            <NotificationBell />
            <Link
              to="/chats"
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              Messages
            </Link>
            <Link
              to="/profile"
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              Profile
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="ml-4 text-gray-500 hover:text-gray-700"
              >
                Admin
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Button
                component={Link}
                to="/admin/pending-items"
                color="inherit"
              >
                Pending Items
              </Button>
            )}
            <button
              onClick={handleLogout}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;