import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/items');
      console.log('Fetched marketplace items:', data);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyListings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/items/mylistings');
      console.log('Fetched my listings:', data);
      setMyListings(data);
    } catch (error) {
      console.error('Error fetching my listings:', error);
      setError('Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      // Check if itemData is already FormData
      if (itemData instanceof FormData) {
        console.log('ItemData is already FormData');
        // Use the existing FormData
        const formData = itemData;
        
        // Log all FormData entries
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], typeof pair[1], pair[1]);
        }

        const response = await api.post('/items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data) => data,
        });
        
        console.log('Server response:', response);
        
        setItems(prevItems => [...prevItems, response.data]);
        setMyListings(prevListings => [...prevListings, response.data]);
        await Promise.all([fetchItems(), fetchMyListings()]);
        return response.data;
      } else {
        // Create new FormData if itemData is a regular object
        const formData = new FormData();
        
        // Log the raw data
        console.log('Raw item data before processing:', itemData);
        
        // Append all fields explicitly
        formData.append('title', itemData.title);
        formData.append('description', itemData.description);
        formData.append('price', itemData.price);
        formData.append('type', itemData.type);
        formData.append('category', itemData.category);
        formData.append('condition', itemData.condition);
        formData.append('negotiable', itemData.negotiable.toString());
        formData.append('location', JSON.stringify(itemData.location));

        // Handle images separately
        if (itemData.images && itemData.images.length > 0) {
          Array.from(itemData.images).forEach(image => {
            formData.append('images', image);
          });
        }

        // Log all FormData entries
        for (let pair of formData.entries()) {
          console.log('FormData entry:', pair[0], typeof pair[1], pair[1]);
        }

        const response = await api.post('/items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data) => data,
        });
        
        console.log('Server response:', response);
        
        setItems(prevItems => [...prevItems, response.data]);
        setMyListings(prevListings => [...prevListings, response.data]);
        await Promise.all([fetchItems(), fetchMyListings()]);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const { data } = await api.put(`/items/${id}`, itemData);
      setItems(prevItems =>
        prevItems.map(item => (item._id === id ? data : item))
      );
      setMyListings(prevListings =>
        prevListings.map(item => (item._id === id ? data : item))
      );
      return data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(prevItems => prevItems.filter(item => item._id !== id));
      setMyListings(prevListings => prevListings.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const toggleWishlist = async (itemId) => {
    try {
      const { data } = await api.post(`/items/${itemId}/wishlist`);
      setItems(prevItems =>
        prevItems.map(item => (item._id === itemId ? data : item))
      );
      return data;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchItems(),
          user ? fetchMyListings() : Promise.resolve()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Add error handling for context usage
  const value = {
    items,
    myListings,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    toggleWishlist,
    fetchItems,
    fetchMyListings,
    refreshItems: fetchItems
  };

  return (
    <ItemContext.Provider value={value}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};

export default ItemContext;
