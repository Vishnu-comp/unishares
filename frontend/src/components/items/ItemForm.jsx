import React, { useState } from 'react';
import axios from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/items', formData);
      toast.success('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Error creating item');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Item</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 mb-4 border"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 mb-4 border"
        required
      ></textarea>
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="w-full p-2 mb-4 border"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2">
        Submit
      </button>
      <ToastContainer />
    </form>
  );
};

export default ItemForm;
