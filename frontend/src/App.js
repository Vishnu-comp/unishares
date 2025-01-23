import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Main Components
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Settings from './components/profile/Settings';

// Item Components
import ItemDetails from './components/items/ItemDetails';
import CreateItem from './components/items/CreateItem';
import MyListings from './components/items/MyListings';
import EditItem from './components/items/EditItem';

// Chat Components
import ChatList from './components/chat/ChatList';
import ChatRoom from './components/chat/ChatRoom';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import PendingItems from './components/admin/PendingItems';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Marketplace Component
import Marketplace from './components/marketplace/Marketplace';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ItemProvider>
          <ChatProvider>
            <NotificationProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/" 
                    element={<Marketplace />} 
                  />
                  <Route 
                    path="/login" 
                    element={<Login />} 
                  />
                  <Route 
                    path="/register" 
                    element={<Register />} 
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/items/create"
                    element={
                      <ProtectedRoute>
                        <CreateItem />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/items/:id"
                    element={
                      <ProtectedRoute>
                        <ItemDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chats"
                    element={
                      <ProtectedRoute>
                        <ChatList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chats/:id"
                    element={
                      <ProtectedRoute>
                        <ChatRoom />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <ProtectedRoute>
                        <MyListings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/items/:id/edit"
                    element={
                      <ProtectedRoute>
                        <EditItem />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/pending-items"
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <PendingItems />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <div className="flex flex-col items-center justify-center h-screen">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-gray-600 mb-4">Page not found</p>
                        <button
                          onClick={() => window.history.back()}
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Go back
                        </button>
                      </div>
                    }
                  />
                </Routes>
              </Layout>
            </NotificationProvider>
          </ChatProvider>
        </ItemProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
