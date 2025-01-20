import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Chip, Card, Typography } from '@mui/material';

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const { _id, title, images, price, condition, type, owner } = item;

  const isOwner = user && owner._id === user._id;

  const getStatusBadge = () => {
    switch (item.status) {
      case 'pending':
        return (
          <Chip
            label="Pending Approval"
            color="warning"
            size="small"
            sx={{ position: 'absolute', top: 10, right: 10 }}
          />
        );
      case 'rejected':
        return (
          <Chip
            label="Rejected"
            color="error"
            size="small"
            sx={{ position: 'absolute', top: 10, right: 10 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Link to={`/items/${_id}`} className="group">
      <Card>
        {getStatusBadge()}
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
            {images && images[0] ? (
              <img
                src={images[0]}
                alt={title}
                className="h-48 w-full object-cover object-center"
              />
            ) : (
              <div className="h-48 w-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {type === 'sale' ? 'For Sale' : type === 'rent' ? 'For Rent' : 'Donation'}
              </div>
              {type !== 'donation' && (
                <div className="font-medium text-gray-900">
                  ${typeof price === 'number' ? price.toFixed(2) : price}
                </div>
              )}
            </div>

            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500 capitalize">{condition}</span>
              {isOwner && (
                <span className="text-xs text-indigo-600 font-medium">Your listing</span>
              )}
            </div>

            {item.moderationReason && item.status === 'rejected' && (
              <Typography color="error" sx={{ mt: 1 }}>
                Reason: {item.moderationReason}
              </Typography>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ItemCard;
