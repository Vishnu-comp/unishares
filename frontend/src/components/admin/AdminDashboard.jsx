import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import UsersList from './UsersList';
import PendingItems from './PendingItems';
import ItemModeration from './ItemModeration';
import Statistics from './Statistics';
import { Box, Typography, Tab, Tabs, Paper } from '@mui/material';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!user?.role === 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Access denied. Admin privileges required.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper sx={{ mb: 3, py: 2, px: 3 }} elevation={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
          <Paper sx={{ p: 2 }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ml: 2 }}>
                <Typography color="textSecondary" variant="subtitle2">
                  Total Users
                </Typography>
                <Typography variant="h4">{stats?.totalUsers || 0}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ml: 2 }}>
                <Typography color="textSecondary" variant="subtitle2">
                  Active Listings
                </Typography>
                <Typography variant="h4">{stats?.activeListings || 0}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }} elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ ml: 2 }}>
                <Typography color="textSecondary" variant="subtitle2">
                  Pending Approvals
                </Typography>
                <Typography variant="h4">{stats?.pendingApprovals || 0}</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 3 }}>
        <Paper sx={{ mb: 3 }} elevation={1}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.9rem',
                fontWeight: 'medium',
                textTransform: 'none',
              }
            }}
          >
            <Tab label="Pending Approvals" />
            <Tab label="All Items" />
            <Tab label="Users" />
            <Tab label="Statistics" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Paper sx={{ p: 0, mb: 3 }} elevation={1}>
          {activeTab === 0 && <PendingItems />}
          {activeTab === 1 && <ItemModeration />}
          {activeTab === 2 && <UsersList />}
          {activeTab === 3 && <Statistics stats={stats} />}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 