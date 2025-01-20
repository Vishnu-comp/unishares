import React, { useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationList = () => {
  const { notifications, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className="p-4 border-b">
              <p>{notification.content}</p>
              <small className="text-gray-500">{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No notifications available.</p>
      )}
    </div>
  );
};

export default NotificationList;
