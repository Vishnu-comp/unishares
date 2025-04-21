import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Button } from '@mui/material';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items'); // Adjust the endpoint as necessary
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleOpen = (image) => {
    console.log('Opening image:', image); // Log the image URL
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
  };

  const getImageUrl = (imagePath) => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const cleanBaseUrl = baseURL.replace(/\/api\/?$/, '');
    return `${cleanBaseUrl}${imagePath}`;
  };

  const handleDelete = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Error deleting item');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">All Items</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.owner.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.images && item.images.length > 0 && (
                    <Box 
                      component="img" 
                      src={getImageUrl(item.images[0])} // Use the getImageUrl function
                      alt={item.title} 
                      sx={{ 
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        cursor: 'pointer' 
                      }} 
                      onClick={() => handleOpen(getImageUrl(item.images[0]))} // Open modal on click
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleDelete(item._id)} // Delete button
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box 
          component="img" 
          src={selectedImage} 
          alt="Full Size" 
          sx={{ 
            maxWidth: '90%', 
            maxHeight: '90%', 
            borderRadius: '8px' 
          }} 
        />
      </Modal>
      <ToastContainer />
    </Box>
  );
};

export default AllItems;
