import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../../contexts/ItemContext';

const CreateItem = () => {
  const navigate = useNavigate();
  const { createItem } = useItems();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('sale');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState({
    campus: '',
    building: '',
    room: '',
    details: ''
  });
  const [negotiable, setNegotiable] = useState(false);
  const [rentalDetails, setRentalDetails] = useState({
    durationType: 'day',
    pricePerUnit: '',
    minimumDuration: 1,
    deposit: '',
    terms: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLocation(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      if (name === 'type') {
        setType(value);
      } else if (name === 'category') {
        setCategory(value);
      } else if (name === 'condition') {
        setCondition(value);
      } else if (name === 'price') {
        setPrice(value);
      } else if (name === 'negotiable') {
        setNegotiable(checked);
      } else {
        setLocation(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Preview images
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...previews]);
    
    // Add to form data
    setLocation(prev => ({
      ...prev,
      images: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    const formData = new FormData();
    
    try {
      // Debug logs to check values
      console.log('Form Values:', {
        title,
        description,
        category,
        condition,
        location,
        type,
        rentalDetails
      });

      // Validate required fields with more explicit checks
      if (!title || typeof title !== 'string' || title.trim() === '') {
        setError('Title is required');
        return;
      }
      if (!description || typeof description !== 'string' || description.trim() === '') {
        setError('Description is required');
        return;
      }
      if (!category || typeof category !== 'string' || category.trim() === '') {
        setError('Category is required');
        return;
      }
      if (!condition || typeof condition !== 'string' || condition.trim() === '') {
        setError('Condition is required');
        return;
      }
      if (!location || !location.campus || !location.building || 
          location.campus.trim() === '' || location.building.trim() === '') {
        setError('Location (campus and building) is required');
        return;
      }

      // Add basic item details with explicit string conversion
      formData.append('title', String(title).trim());
      formData.append('description', String(description).trim());
      formData.append('price', String(price || '0'));
      formData.append('type', String(type || 'sale'));
      formData.append('category', String(category).trim());
      formData.append('condition', String(condition).trim());
      
      // Properly structure location object
      const locationData = {
        campus: String(location.campus).trim(),
        building: String(location.building).trim(),
        room: location.room ? String(location.room).trim() : '',
        details: location.details ? String(location.details).trim() : ''
      };
      formData.append('location', JSON.stringify(locationData));
      formData.append('negotiable', String(Boolean(negotiable)));

      // Add rental details if item type is rent
      if (type === 'rent') {
        if (!rentalDetails?.pricePerUnit) {
          setError('Rental price is required');
          return;
        }
        
        const rentalData = {
          durationType: String(rentalDetails.durationType || 'day'),
          pricePerUnit: Number(rentalDetails.pricePerUnit),
          minimumDuration: Number(rentalDetails.minimumDuration || 1),
          deposit: Number(rentalDetails.deposit || 0),
          terms: rentalDetails.terms ? String(rentalDetails.terms).trim() : ''
        };
        formData.append('rentalDetails', JSON.stringify(rentalData));
      }

      // Append images with validation
      if (location.images && location.images.length > 0) {
        location.images.forEach(image => {
          if (image) {
            formData.append('images', image);
          }
        });
      }

      // Debug log to check formData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await createItem(formData);
      navigate('/items');
    } catch (error) {
      console.error('Error creating item:', error);
      setError(error.response?.data?.message || 'Error creating item');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Create New Listing</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Enter item title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Describe your item"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              <option value="books">Books</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imagePreview.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 text-white bg-red-500 rounded-full text-xs p-1"
                  onClick={() => setImagePreview(prev => prev.filter((_, i) => i !== index))}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={negotiable}
            onChange={(e) => setNegotiable(e.target.checked)}
            className="h-5 w-5 text-indigo-600 border-gray-300 rounded"
          />
          <label className="text-sm text-gray-900">Price is negotiable</label>
        </div>

        {type === 'rent' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration Type</label>
                <select
                  value={rentalDetails.durationType}
                  onChange={(e) =>
                    setRentalDetails({ ...rentalDetails, durationType: e.target.value })
                  }
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price Per Unit</label>
                <input
                  type="number"
                  value={rentalDetails.pricePerUnit}
                  onChange={(e) =>
                    setRentalDetails({ ...rentalDetails, pricePerUnit: e.target.value })
                  }
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter rental price"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Duration (days)</label>
                <input
                  type="number"
                  value={rentalDetails.minimumDuration}
                  onChange={(e) =>
                    setRentalDetails({
                      ...rentalDetails,
                      minimumDuration: e.target.value
                    })
                  }
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Deposit</label>
                <input
                  type="number"
                  value={rentalDetails.deposit}
                  onChange={(e) =>
                    setRentalDetails({
                      ...rentalDetails,
                      deposit: e.target.value
                    })
                  }
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
              <textarea
                value={rentalDetails.terms}
                onChange={(e) =>
                  setRentalDetails({
                    ...rentalDetails,
                    terms: e.target.value
                  })
                }
                rows={4}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Enter terms and conditions"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-darkGreen text-white py-2 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateItem;
