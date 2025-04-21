import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNeeds } from '../../contexts/NeedContext';
import { IoDocumentText, IoPricetag, IoAlarm, IoCalendar } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateNeed = () => {
  const navigate = useNavigate();
  const { createNeed } = useNeeds();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'item',
    category: '',
    budget: '',
    urgency: 'medium',
    duration: '7' // Default 7 days
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createNeed(formData);
      toast.success('Need created successfully!');
      navigate('/needs');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating need');
      toast.error('Error creating need');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Post a Need</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoDocumentText className="mr-2 text-gray-500" />
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the title of your need"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoDocumentText className="mr-2 text-gray-500" />
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
            >
              <option value="item">Item</option>
              <option value="service">Service</option>
              <option value="rental">Rental</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoPricetag className="mr-2 text-gray-500" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
              required
            >
              <option value="">Select a category</option>
              <option value="textbooks">Textbooks</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="tutoring">Tutoring</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoDocumentText className="mr-2 text-gray-500" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your need in detail"
              rows={4}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoPricetag className="mr-2 text-gray-500" />
              Budget (optional)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter your budget"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoAlarm className="mr-2 text-gray-500" />
              Urgency
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <IoCalendar className="mr-2 text-gray-500" />
              Duration (days)
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
            >
              <option value="3">3 days</option>
              <option value="7">1 week</option>
              <option value="14">2 weeks</option>
              <option value="30">1 month</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition duration-200 
              ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {loading ? 'Posting...' : 'Post Need'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateNeed; 