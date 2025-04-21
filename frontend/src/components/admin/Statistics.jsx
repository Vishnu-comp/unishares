import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  ButtonGroup,
  Button,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp as TrendingIcon,
  ShowChart as ChartIcon,
  PieChart as PieChartIcon,
  DateRange as DateIcon
} from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Statistics = ({ stats }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('week');
  
  // Sample data - replace with actual API data
  const activityData = [
    { name: 'Mon', items: 4, users: 2, needs: 3 },
    { name: 'Tue', items: 3, users: 4, needs: 2 },
    { name: 'Wed', items: 7, users: 3, needs: 5 },
    { name: 'Thu', items: 5, users: 6, needs: 4 },
    { name: 'Fri', items: 6, users: 4, needs: 6 },
    { name: 'Sat', items: 8, users: 5, needs: 3 },
    { name: 'Sun', items: 9, users: 7, needs: 7 }
  ];

  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Books', value: 25 },
    { name: 'Furniture', value: 20 },
    { name: 'Clothing', value: 15 },
    { name: 'Others', value: 5 }
  ];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography color="text.secondary" variant="h6">
            {title}
          </Typography>
          <Icon color="primary" />
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingIcon 
              color={trend >= 0 ? 'success' : 'error'} 
              sx={{ fontSize: '1rem' }}
            />
            <Typography 
              variant="body2" 
              color={trend >= 0 ? 'success.main' : 'error.main'}
            >
              {trend}% from last {timeRange}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const fetchData = async () => {
    try {
      // Fetch your data here
      toast.success('Data fetched successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    }
  };

  return (
    <Box>
      {/* Time Range Selector */}
      <Box sx={{ mb: 4 }}>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => setTimeRange('week')}
            variant={timeRange === 'week' ? 'contained' : 'outlined'}
          >
            Week
          </Button>
          <Button 
            onClick={() => setTimeRange('month')}
            variant={timeRange === 'month' ? 'contained' : 'outlined'}
          >
            Month
          </Button>
          <Button 
            onClick={() => setTimeRange('year')}
            variant={timeRange === 'year' ? 'contained' : 'outlined'}
          >
            Year
          </Button>
        </ButtonGroup>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={ChartIcon}
            trend={5.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Listings"
            value={stats?.activeListings || 0}
            icon={ChartIcon}
            trend={-2.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Needs"
            value={stats?.totalNeeds || 0}
            icon={ChartIcon}
            trend={8.4}
          />
        </Grid>
        
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Activity Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Activity Overview
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="items" 
                      stroke={theme.palette.primary.main} 
                      name="Items"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke={theme.palette.secondary.main} 
                      name="Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="needs" 
                      stroke={theme.palette.success.main} 
                      name="Needs"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Category Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default Statistics; 