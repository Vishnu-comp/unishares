import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationBadge = () => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button className="relative p-2">
        <span className="material-icons">notifications</span>
      </button>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-2 py-1">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
