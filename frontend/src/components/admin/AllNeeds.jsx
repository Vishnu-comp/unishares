import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const AllNeeds = () => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNeeds = async () => {
    try {
      const { data } = await api.get('/needs/all'); // Fetch all needs
      setNeeds(data);
    } catch (error) {
      console.error('Error fetching needs:', error);
      toast.error('Error fetching needs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this need?')) {
      try {
        await api.delete(`/needs/${id}`); // Call delete API
        setNeeds(needs.filter(need => need._id !== id)); // Update state
        toast.success('Need deleted successfully');
      } catch (error) {
        console.error('Error deleting need:', error);
        toast.error('Error deleting need');
      }
    }
  };

  useEffect(() => {
    fetchNeeds();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Needs</Typography>
      <Grid container spacing={3}>
        {needs.map((need) => (
          <Grid item xs={12} sm={6} md={4} key={need._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{need.title}</Typography>
                <Typography variant="body2">{need.description}</Typography>
                <Typography variant="body2">Category: {need.category}</Typography>
                <Typography variant="body2">Budget: Rs{need.budget || 0}</Typography>
                <Typography variant="body2">Urgency: {need.urgency}</Typography>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleDelete(need._id)} // Delete button
                  sx={{ mt: 2 }} // Margin top for spacing
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ToastContainer />
    </Box>
  );
};

export default AllNeeds;