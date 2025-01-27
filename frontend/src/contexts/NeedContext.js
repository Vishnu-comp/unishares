import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const NeedContext = createContext();

export const useNeeds = () => useContext(NeedContext);

export const NeedProvider = ({ children }) => {
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNeeds = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await api.get('/needs', { params: filters });
      setNeeds(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNeed = async (needData) => {
    try {
      setLoading(true);
      const response = await api.post('/needs', needData);
      setNeeds([response.data, ...needs]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (needId, content) => {
    try {
      const response = await api.post(`/api/needs/${needId}/comments`, { content });
      
      // Update the needs state with the new comment
      setNeeds(prevNeeds => 
        prevNeeds.map(need => 
          need._id === needId ? response.data : need
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw new Error(error.response?.data?.error || 'Failed to add comment');
    }
  };

  const updateNeedStatus = async (needId, status) => {
    try {
      const response = await api.put(`/needs/${needId}/status`, { status });
      setNeeds(needs.map(need => 
        need._id === needId ? response.data : need
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <NeedContext.Provider
      value={{
        needs,
        loading,
        error,
        fetchNeeds,
        createNeed,
        addComment,
        updateNeedStatus
      }}
    >
      {children}
    </NeedContext.Provider>
  );
}; 