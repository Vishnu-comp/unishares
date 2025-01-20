import React, { useEffect } from 'react';
import { useItems } from '../contexts/ItemContext';
import ItemCard from '../components/Items/ItemCard';

const Home = () => {
  const { items, fetchItems } = useItems();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
