import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNeeds } from '../../contexts/NeedContext';
import { formatDistance } from 'date-fns';
import { IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NeedsList = () => {
  const { needs, loading, fetchNeeds } = useNeeds();
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    fetchNeeds(filters);
  }, [filters]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="item">Items</option>
          <option value="service">Services</option>
          <option value="rental">Rentals</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          <option value="textbooks">Textbooks</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="tutoring">Tutoring</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Create Need Button */}
      <div className="mb-6">
        <Link
          to="/needs/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200"
        >
          Post a Need
        </Link>
      </div>

      {/* Needs List */}
      <div className="space-y-4">
        {needs.map((need) => (
          <Link
            key={need._id}
            to={`/needs/${need._id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{need.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{need.description}</p>
                
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span className={`font-medium ${getUrgencyColor(need.urgency)}`}>
                    {need.urgency.charAt(0).toUpperCase() + need.urgency.slice(1)} Priority
                  </span>
                  <span>•</span>
                  <span>{need.type.charAt(0).toUpperCase() + need.type.slice(1)}</span>
                  <span>•</span>
                  <span>{need.category}</span>
                </div>

                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <IoTimeOutline className="mr-1" />
                    {formatDistance(new Date(need.createdAt), new Date(), { addSuffix: true })}
                  </div>
                  {need.budget > 0 && (
                    <div>
                      <span className="font-medium">Budget: ${need.budget}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm text-gray-500">
                  {need.comments.length} comments
                </div>
                {need.status !== 'active' && (
                  <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {need.status.charAt(0).toUpperCase() + need.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}

        {needs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No needs found matching your criteria</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default NeedsList; 