import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useItems } from '../../contexts/ItemContext';
import ItemCard from '../items/ItemCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { items, myListings, loading, error } = useItems();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItems = () => {
    switch(activeTab) {
      case 'marketplace':
        const marketplaceItems = filteredItems.filter(item => item.owner._id !== user?._id);
        return marketplaceItems.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-500 text-lg">No items available in the marketplace.</p>
          </div>
        ) : (
          marketplaceItems.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))
        );
      case 'myListings':
        return myListings.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-500 text-lg">You haven't listed any items yet.</p>
          </div>
        ) : (
          myListings.map((item) => (
            <ItemCard key={item._id} item={item} isOwner={true} />
          ))
        );
      case 'wishlist':
        const wishlistedItems = filteredItems.filter(item => item.wishlistedBy?.includes(user?._id));
        return wishlistedItems.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-500 text-lg">No items in your wishlist.</p>
          </div>
        ) : (
          wishlistedItems.map(item => (
            <ItemCard key={item._id} item={item} />
          ))
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {activeTab === 'marketplace' ? 'Marketplace' : `Welcome, ${user?.name}`}
        </h1>
        <button
          onClick={() => navigate('/items/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Item
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
      />

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'marketplace'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('marketplace')}
            >
              Marketplace
            </button>
            <button
              className={`${
                activeTab === 'myListings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('myListings')}
            >
              My Listings
            </button>
            <button
              className={`${
                activeTab === 'wishlist'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('wishlist')}
            >
              Wishlist
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {renderItems()}
      </div>
    </div>
  );
};

export default Dashboard;
