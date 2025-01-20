import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, TextField, Grid } from '@mui/material';
import api from '../../services/api';
const PendingItems = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      const response = await api.get('/admin/items/pending');
      setPendingItems(response.data);
    } catch (error) {
      console.error('Error fetching pending items:', error);
    }
  };

  const handleModeration = async (itemId, status) => {
    try {
      await api.put(`/admin/items/${itemId}/moderate`, {
        status,
        reason: moderationReason
      });
      fetchPendingItems(); // Refresh the list
      setModerationReason('');
    } catch (error) {
      console.error('Error moderating item:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Items
      </Typography>
      <Grid container spacing={3}>
        {pendingItems.map((item) => (
          <Grid item xs={12} md={6} key={item._id}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">{item.title}</Typography>
              <Typography>Posted by: {item.owner.name}</Typography>
              <Typography>Price: ${item.price}</Typography>
              <TextField
                fullWidth
                label="Moderation Reason"
                variant="outlined"
                margin="normal"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleModeration(item._id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleModeration(item._id, 'rejected')}
                >
                  Reject
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PendingItems;