import React, { useEffect, useState } from 'react';
import axios from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul>
        <li>Total Users: {stats.totalUsers}</li>
        <li>Total Items: {stats.totalItems}</li>
        <li>Total Transactions: {stats.totalTransactions}</li>
        <li>Active Listings: {stats.activeListings}</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
