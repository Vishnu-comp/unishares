import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../../contexts/ItemContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import ChatModal from '../chat/ChatModal';
import { formatDistance } from 'date-fns';
import api from '../../services/api';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, toggleWishlist, refreshItems } = useItems();
  const { user } = useAuth();
  const { createChat } = useChat();
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const isOwner = user?._id === item?.owner._id;

  const getImageUrl = (imagePath) => {
    const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const cleanBaseUrl = baseURL.replace(/\/api\/?$/, '');
    return `${cleanBaseUrl}${imagePath}`;
  };
  

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await api.get(`/items/${id}`);
      console.log('Image URLs:', data.images.map(img => getImageUrl(img)));
      setItem(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Item not found</h2>
      </div>
    );
  }

  const handleChat = async () => {
    try {
      const chat = await createChat(item._id, item.owner);
      navigate(`/chats/${chat._id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleWishlist = async () => {
    try {
      await toggleWishlist(item._id);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await api.put(`/items/${item._id}/mark-sold`);
      setOpenDialog(false);
      fetchItem();
      refreshItems();
    } catch (error) {
      console.error('Error marking item as sold:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={getImageUrl(item.images[currentImageIndex])}
              alt={item.title}
              className="w-full max-h-[600px] object-contain rounded-lg"
            />
            {item.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${
                      currentImageIndex === index ? 'bg-indigo-600' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 rounded-md overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <p className="mt-2 text-xl text-indigo-600 font-semibold">
              {item.type === 'donation' ? 'Free' : `$${item.price}`}
              {item.negotiable && <span className="text-sm text-gray-500 ml-2">(Negotiable)</span>}
            </p>
          </div>

          <div className="prose max-w-none">
            <p>{item.description}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4">
            <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Condition</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.condition}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {item.location.building}, {item.location.campus}
                </dd>
              </div>
            </dl>
          </div>

          {item.type === 'rent' && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Rental Details</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Rate:</span>
                    <p className="text-sm font-medium text-gray-900">
                      Rs{item.rentalDetails.pricePerUnit} per {item.rentalDetails.durationType}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Minimum Duration:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {item.rentalDetails.minimumDuration} {item.rentalDetails.durationType}
                      {item.rentalDetails.minimumDuration > 1 ? 's' : ''}
                    </p>
                  </div>
                  {item.rentalDetails.deposit && (
                    <div>
                      <span className="text-sm text-gray-500">Security Deposit:</span>
                      <p className="text-sm font-medium text-gray-900">
                        Rs{item.rentalDetails.deposit}
                      </p>
                    </div>
                  )}
                </div>
                {item.rentalDetails.terms && (
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">Terms:</span>
                    <p className="text-sm text-gray-700 mt-1">
                      {item.rentalDetails.terms}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            {isOwner ? (
              <>
                {item.status === 'available' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                  >
                    Mark as Sold
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(`/items/${item._id}/edit`)}
                >
                  Edit Item
                </Button>
              </>
            ) : (
              <>
                {item.status === 'available' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleChat}
                  >
                    Chat with Seller
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color={item.wishlistedBy?.includes(user?._id) ? 'secondary' : 'primary'}
                  onClick={handleWishlist}
                >
                  {item.wishlistedBy?.includes(user?._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </>
            )}
          </Box>
        </div>
      </div>

      {showChatModal && (
        <ChatModal
          itemId={item._id}
          sellerId={item.owner}
          onClose={() => setShowChatModal(false)}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Mark Item as Sold</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this item as sold? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleMarkAsSold} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Badge */}
      {item.status === 'sold' && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'error.main',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          SOLD
        </Box>
      )}
    </div>
  );
};

export default ItemDetails;
