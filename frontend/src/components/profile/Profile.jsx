import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useItems } from '../../contexts/ItemContext.js';
import ItemCard from '../items/ItemCard.jsx';

const Profile = () => {
  const { user } = useAuth();
  const { items } = useItems();
  const [activeTab, setActiveTab] = useState('listings');

  const userItems = items.filter(item => item.owner === user?._id);
  const rentedItems = items.filter(item => 
    item.type === 'rent' && 
    item.rentals?.some(rental => rental.renter === user?._id)
  );
  const donatedItems = items.filter(
    item => item.type === 'donation' && item.owner === user?._id
  );

  const renderItems = () => {
    switch (activeTab) {
      case 'listings':
        return userItems.map(item => (
          <ItemCard key={item._id} item={item} isOwner={true} />
        ));
      case 'rented':
        return rentedItems.map(item => (
          <ItemCard key={item._id} item={item} isRental={true} />
        ));
      case 'donated':
        return donatedItems.map(item => (
          <ItemCard key={item._id} item={item} isDonation={true} />
        ));
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
            <img 
  src={user?.profileImage ? `${process.env.REACT_APP_API_URL}${user.profileImage}` : 'default-avatar.png'} 
  alt="Profile" 
  className="w-8 h-8 rounded-full"
/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="border-t border-gray-200">
          <nav className="-mb-px flex">
            <button
              className={`${
                activeTab === 'listings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('listings')}
            >
              My Listings
            </button>
            <button
              className={`${
                activeTab === 'rented'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('rented')}
            >
              Rented Items
            </button>
            <button
              className={`${
                activeTab === 'donated'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('donated')}
            >
              Donated Items
            </button>
          </nav>
        </div>
      </div>
<div>
<Link 
  to="/profile/edit" 
  className="text-blue-500 hover:text-blue-600"
>
  Edit Profile
</Link>
</div>
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderItems()}
      </div>
    </div>
  );
};

export default Profile; 