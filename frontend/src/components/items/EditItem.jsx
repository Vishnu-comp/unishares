import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  FormHelperText,
} from '@mui/material';
import api from '../../services/api';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    type: '',
    category: '',
    rentalDetails: {
      pricePerUnit: '',
      durationType: 'day',
      minimumDuration: '',
      deposit: '',
      terms: ''
    }
  });

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await api.get(`/items/${id}`);
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price,
        condition: data.condition,
        type: data.type,
        category: data.category,
        rentalDetails: data.rentalDetails || {
          pricePerUnit: '',
          durationType: 'day',
          minimumDuration: '',
          deposit: '',
          terms: ''
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to fetch item details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('rental.')) {
      const rentalField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        rentalDetails: {
          ...prev.rentalDetails,
          [rentalField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      
      // If not a rental item, remove rental details
      if (submitData.type !== 'rent') {
        delete submitData.rentalDetails;
      }

      // Send the update request
      const { data } = await api.put(`/items/${id}`, submitData);
      
      // Navigate back to item details on success
      navigate(`/items/${id}`);
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.response?.data?.message || 'Failed to update item');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Item
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Condition</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="like-new">Like New</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="fair">Fair</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="sale">For Sale</MenuItem>
                  <MenuItem value="rent">For Rent</MenuItem>
                  <MenuItem value="donation">Donation</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.type === 'rent' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price Per Unit"
                    name="rental.pricePerUnit"
                    type="number"
                    value={formData.rentalDetails.pricePerUnit}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Duration Type</InputLabel>
                    <Select
                      name="rental.durationType"
                      value={formData.rentalDetails.durationType}
                      onChange={handleChange}
                    >
                      <MenuItem value="hour">Hour</MenuItem>
                      <MenuItem value="day">Day</MenuItem>
                      <MenuItem value="week">Week</MenuItem>
                      <MenuItem value="month">Month</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Minimum Duration"
                    name="rental.minimumDuration"
                    type="number"
                    value={formData.rentalDetails.minimumDuration}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Security Deposit"
                    name="rental.deposit"
                    type="number"
                    value={formData.rentalDetails.deposit}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Rental Terms"
                    name="rental.terms"
                    multiline
                    rows={3}
                    value={formData.rentalDetails.terms}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/items/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditItem; 