import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    toast.warn('You need to log in to access this page');
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default ProtectedRoute;
