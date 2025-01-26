import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Chip, Card, Typography, CardMedia, IconButton } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoIcon from '@mui/icons-material/Info';
import { FavoriteBorder as FavoriteIcon } from '@mui/icons-material';

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const { _id, title, images, price, condition, type, owner, category, location, views } = item;
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
      <Card sx={{ width: 300, height: 420, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 3 }}>
        {getStatusBadge()}
        <CardMedia
          component="img"
          sx={{ width: '100%', height: 200, objectFit: 'contain', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
          image={imageUrl}
          alt={item.title}
        />
        <div className="bg-white p-4 rounded-b-lg">
          <Typography variant="h6" gutterBottom noWrap>{title}</Typography>
          <div className="mt-2 flex justify-between items-center">
            <Typography variant="body2" color="textSecondary">
              {type === 'sale' ? 'For Sale' : type === 'rent' ? 'For Rent' : 'Donation'}
            </Typography>
            {type !== 'donation' && (
              <Typography variant="h6" color="textPrimary">
                <MonetizationOnIcon fontSize="small" style={{ marginRight: 4 }} />
                Rs{typeof price === 'number' ? price.toFixed(2) : price}
              </Typography>
            )}
          </div>

          <div className="mt-2 flex justify-between items-center">
            <Typography variant="body2" color="textSecondary">
              <InfoIcon fontSize="small" style={{ marginRight: 4 }} />
              <strong>Condition:</strong> {condition}
            </Typography>
            {isOwner && (
              <Typography variant="caption" color="primary">Your listing</Typography>
            )}
          </div>

          <div className="mt-2 flex items-center">
            <CategoryIcon fontSize="small" style={{ marginRight: 4 }} />
            <Typography variant="body2" color="textSecondary" className="capitalize">{category}</Typography>
          </div>
          <div className="mt-2 flex items-center">
            <LocationOnIcon fontSize="small" style={{ marginRight: 4 }} />
            <Typography variant="body2" color="textSecondary">{location.campus} - {location.building}</Typography>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center">
              <VisibilityIcon fontSize="small" style={{ marginRight: 4 }} />
              <Typography variant="body2" color="textSecondary">{views} views</Typography>
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
