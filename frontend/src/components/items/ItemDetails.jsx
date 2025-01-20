import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItems } from '../../contexts/ItemContext';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import ChatModal from '../chat/ChatModal';
import { formatDistance } from 'date-fns';
import api from '../../services/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, toggleWishlist } = useItems();
  const { user } = useAuth();
  const { createChat } = useChat();
  const [showChatModal, setShowChatModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/items/${id}`);
        setItem(data);
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9 relative">
            <img
              src={`${process.env.REACT_APP_API_URL}${item.images[currentImageIndex]}`}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            {item.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {item.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full ${
                      currentImageIndex === index ? 'bg-white' : 'bg-gray-400'
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
                  className={`relative aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-center object-cover"
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
                      ${item.rentalDetails.pricePerUnit} per {item.rentalDetails.durationType}
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
                        ${item.rentalDetails.deposit}
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

          {user?._id !== item.owner && (
            <div className="flex space-x-4">
              <button
                onClick={handleChat}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Chat with Seller
              </button>
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-md border ${
                  item.wishlistedBy?.includes(user?._id)
                    ? 'bg-red-50 border-red-200'
                    : 'border-gray-300'
                }`}
              >
                <svg
                  className={`h-6 w-6 ${
                    item.wishlistedBy?.includes(user?._id)
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {showChatModal && (
        <ChatModal
          itemId={item._id}
          sellerId={item.owner}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};

export default ItemDetails;
