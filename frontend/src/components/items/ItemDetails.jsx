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
import { BsHeartFill, BsHeart, BsShare } from 'react-icons/bs';
import { IoLocationOutline, IoTimeOutline, IoEyeOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin, FaPinterest } from 'react-icons/fa';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, toggleWishlist, refreshItems } = useItems();
  const { user } = useAuth();
  const { createChat } = useChat();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [otherAds, setOtherAds] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
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
      setIsWishlisted(data.wishlistedBy?.includes(user?._id));
      
      // Fetch other ads from the same seller
      if (data.owner?._id) {
        const { data: sellerAds } = await api.get(`/items/seller/${data.owner._id}`, {
          params: {
            excludeId: id // Exclude current item
          }
        });
        setOtherAds(sellerAds);
      }
      
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

  const handleShare = () => {
    // Implementation of handleShare function
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="relative mb-4">
            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <img
                src={getImageUrl(item.images[currentImageIndex])}
                alt={item.title}
                className="w-full h-full object-contain bg-gray-100"
              />
              
              {/* Navigation Arrows */}
              {item.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : item.images.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => prev < item.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {item.images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 
                      ${currentImageIndex === index ? 'border-darkGreen' : 'border-transparent'}`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-semibold mb-2">{item.title}</h1>
                <div className="text-3xl font-bold text-darkGreen">
                  Rs. {item.price?.toLocaleString()}
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleWishlist}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {item.wishlistedBy?.includes(user?._id) ? 
                    <BsHeartFill className="text-red-500 text-xl" /> : 
                    <BsHeart className="text-xl" />
                  }
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <BsShare className="text-xl" />
                </button>
              </div>
            </div>

            {/* Item Meta Info */}
            <div className="flex flex-col gap-3 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <IoLocationOutline className="text-xl" />
                {item.location?.building}, {item.location?.campus}
              </div>
              <div className="flex items-center gap-2">
                <IoTimeOutline className="text-xl" />
                Posted {formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true })}
              </div>
              <div className="flex items-center gap-2">
                <IoEyeOutline className="text-xl" />
                {item.views || 0} views
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t border-b py-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition</span>
                  <span className="font-medium">{item.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium capitalize">{item.type}</span>
                </div>
                {item.type === 'rent' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate</span>
                      <span className="font-medium">
                        Rs{item.rentalDetails?.pricePerUnit} per {item.rentalDetails?.durationType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Minimum Duration</span>
                      <span className="font-medium">
                        {item.rentalDetails?.minimumDuration} {item.rentalDetails?.durationType}(s)
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                {item.owner?.avatar && (
                  <img 
                    src={getImageUrl(item.owner.avatar)} 
                    alt={item.owner?.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{item.owner?.name}</h3>
                  {item.owner?.verified && (
                    <MdVerified className="text-darkGreen text-xl" />
                  )}
                </div>
                <p className="text-gray-600">
                  Member since {new Date(item.owner?.createdAt).getFullYear()}
                </p>
              </div>
            </div>

            {/* Contact Buttons */}
            {!isOwner && (
              <div className="space-y-3">
                <button 
                  onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                  className="w-full py-3 bg-darkGreen text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {showPhoneNumber ? item.owner?.phone : 'Show Phone Number'}
                </button>
                <button 
                  onClick={handleChat}
                  className="w-full py-3 bg-green-50 text-darkGreen rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-xl" />
                  Chat with Seller
                </button>
              </div>
            )}
          </div>

          {/* Social Share */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Share this Ad</h3>
            <div className="flex gap-4">
              <FaFacebook className="text-2xl text-blue-600 cursor-pointer" />
              <FaTwitter className="text-2xl text-blue-400 cursor-pointer" />
              <FaLinkedin className="text-2xl text-blue-700 cursor-pointer" />
              <FaPinterest className="text-2xl text-red-600 cursor-pointer" />
            </div>
          </div>

          {/* Other Ads from Seller */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Ads from same seller</h3>
            <div className="space-y-4">
              {otherAds.length > 0 ? (
                otherAds.map(ad => (
                  <div key={ad._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex gap-3">
                      {/* Image and Details */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={getImageUrl(ad.images?.[0])} 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        {/* Category */}
                        <span className="text-sm text-gray-500">
                          {ad.category || 'Mobile'}
                        </span>
                        {/* Title */}
                        <h4 className="font-medium text-gray-900">
                          {ad.title}
                        </h4>
                        {/* Location */}
                        <div className="flex items-center text-sm text-gray-500">
                          <IoLocationOutline className="text-base mr-1" />
                          <span>
                            {ad.location?.building || 'Dhanmondi'}, {ad.location?.campus || 'Bangladesh'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Chat */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-semibold text-gray-900">
                        Rs. {ad.price?.toLocaleString()}
                      </span>
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => handleChat(ad._id)}
                      >
                        <svg 
                          className="w-5 h-5 text-darkGreen" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No other ads from this seller
                </div>
              )}
            </div>
          </div>
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
