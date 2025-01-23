import React from 'react';
import { Box, Card, Typography, Grid } from '@mui/material';

const Statistics = ({ stats }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Platform Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" color="text.secondary">
              User Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Total Users: {stats.totalUsers}
              </Typography>
              <Typography variant="body1">
                Active Users: {stats.activeUsers}
              </Typography>
              <Typography variant="body1">
                Suspended Users: {stats.suspendedUsers}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Item Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                Total Items: {stats.totalItems}
              </Typography>
              <Typography variant="body1">
                Active Listings: {stats.activeListings}
              </Typography>
              <Typography variant="body1">
                Pending Approvals: {stats.pendingApprovals}
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" color="text.secondary">
              Category Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                For Sale Items: {stats.forSaleItems || 0}
              </Typography>
              <Typography variant="body1">
                Rental Items: {stats.rentalItems || 0}
              </Typography>
              <Typography variant="body1">
                Donation Items: {stats.donationItems || 0}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics; 