import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';
import EditProfile from './components/EditProfile';
import { NeedProvider } from './contexts/NeedContext';
import NeedsList from './components/needs/NeedsList';
import CreateNeed from './components/needs/CreateNeed';
import NeedDetails from './components/needs/NeedDetails';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/home/HomePage';
// Main Components
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import Settings from './components/profile/Settings';

// Item Components
import ItemDetails from './components/items/ItemDetails';
import CreateItem from './components/items/CreateItem';
import MyListings from './components/items/MyListings';
import EditItem from './components/items/EditItem';
import ItemForm from './components/items/ItemForm';

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
// import Marketplace from './components/marketplace/Marketplace';
// import HomePage from './components/home/HomePage';

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
    return <Navigate to="/dashboard" />; // Redirect non-admins
  }

  return children; // Render the protected component
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
              <NeedProvider>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/" 
                      element={<HomePage />} 
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

                    {/* Edit Profile Route */}
                    <Route
                      path="/profile/edit"
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Needs Routes */}
                    <Route path="/needs" element={<NeedsList />} />
                    <Route path="/needs/create" element={<CreateNeed />} />
                    <Route path="/needs/:id" element={<NeedDetails />} />

                    {/* New route for ItemForm */}
                    <Route path="/items/new" element={<CreateItem />} />

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
              </NeedProvider>
            </NotificationProvider>
          </ChatProvider>
        </ItemProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
