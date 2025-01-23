import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, TextField, Grid, CardMedia } from '@mui/material';
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

  const getImageUrl = (imagePath) => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const cleanBaseUrl = baseURL.replace(/\/api\/?$/, '');
    return `${cleanBaseUrl}${imagePath}`;
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
      <Grid container spacing={2}>
        {pendingItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
              {item.images && item.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={getImageUrl(item.images[0])}
                  alt={item.title}
                  sx={{ 
                    objectFit: 'contain',
                    borderRadius: 1,
                    mb: 1
                  }}
                />
              )}
              <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5 }}>{item.title}</Typography>
              <Typography variant="body2">By: {item.owner.name}</Typography>
              <Typography variant="body2">Price: ${item.price}</Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {item.description}
              </Typography>
              <TextField
                size="small"
                label="Moderation Reason"
                variant="outlined"
                margin="normal"
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                multiline
                rows={2}
                sx={{ mt: 1, mb: 1 }}
              />
              <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleModeration(item._id, 'approved')}
                  fullWidth
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => handleModeration(item._id, 'rejected')}
                  fullWidth
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