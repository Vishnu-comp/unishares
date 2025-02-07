import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import UsersList from './UsersList';
import PendingItems from './PendingItems';
import ItemModeration from './ItemModeration';
import Statistics from './Statistics';
import { 
  Box, 
  Typography, 
  Tab, 
  Tabs, 
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme
} from '@mui/material';
import {
  People as UsersIcon,
  ShoppingCart as ItemsIcon,
  PendingActions as PendingIcon,
  Assessment as StatsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!user?.role === 'admin') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Access denied. Admin privileges required.</Typography>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '12px',
              p: 1,
              mr: 2
            }}
          >
            <Icon sx={{ color: color, fontSize: 28 }} />
          </Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {value || 0}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <IconButton onClick={fetchStats} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers}
            icon={UsersIcon}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Listings"
            value={stats?.activeListings}
            icon={ItemsIcon}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Items"
            value={stats?.pendingApprovals}
            icon={PendingIcon}
            color={theme.palette.warning.main}
          />
        </Grid>
   
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }} elevation={0}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              minHeight: 48,
              px: 3,
            }
          }}
        >
          <Tab 
            icon={<PendingIcon sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="Pending Approvals" 
          />
          <Tab 
            icon={<ItemsIcon sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="All Items" 
          />
          <Tab 
            icon={<UsersIcon sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="Users" 
          />
          <Tab 
            icon={<StatsIcon sx={{ mb: 0.5 }} />} 
            iconPosition="start" 
            label="Statistics" 
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Paper 
        sx={{ 
          p: 0, 
          bgcolor: 'background.default',
          boxShadow: 'none'
        }}
      >
        {activeTab === 0 && <PendingItems />}
        {activeTab === 1 && <ItemModeration />}
        {activeTab === 2 && <UsersList />}
        {activeTab === 3 && <Statistics stats={stats} />}
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 