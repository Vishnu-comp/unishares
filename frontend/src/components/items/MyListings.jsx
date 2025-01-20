import React from 'react';
import { useItems } from '../../contexts/ItemContext';
import ItemCard from './ItemCard';

const MyListings = () => {
  const { myListings } = useItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Listings</h2>
      {myListings.length === 0 ? (
        <p className="text-gray-500">You haven't listed any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((item) => (
            <ItemCard 
              key={item._id} 
              item={item} 
              isOwner={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings; 