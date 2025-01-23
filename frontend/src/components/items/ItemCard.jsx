import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Chip, Card, Typography, CardMedia } from '@mui/material';

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const { _id, title, images, price, condition, type, owner } = item;
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
  const imageUrl = item.images && item.images[0] 
    ? `${baseURL.replace('/api', '')}${item.images[0]}`
    : 'default-image-url.jpg';

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
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={item.title}
        />
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {type === 'sale' ? 'For Sale' : type === 'rent' ? 'For Rent' : 'Donation'}
              </div>
              {type !== 'donation' && (
                <div className="font-medium text-gray-900">
                  Rs{typeof price === 'number' ? price.toFixed(2) : price}
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
