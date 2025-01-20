import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ItemModeration = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    try {
      const { data } = await api.get(`/admin/items?status=${filter}`);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (itemId, status) => {
    try {
      await api.put(`/admin/items/${itemId}/moderate`, { status });
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error moderating item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Item Moderation</h2>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No items to moderate
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 flex items-start space-x-4"
              >
                <img
                  src={item.images[0] || '/placeholder.png'}
                  alt={item.title}
                  className="h-24 w-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-4">Price: ${item.price}</span>
                    <span className="mr-4">Type: {item.type}</span>
                    <span>Condition: {item.condition}</span>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    {filter === 'pending' && (
                      <>
                        <button
                          onClick={() => handleModeration(item._id, 'approved')}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleModeration(item._id, 'rejected')}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemModeration; 