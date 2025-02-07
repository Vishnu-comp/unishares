import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Chip } from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { 
  //BsCar, 
  BsPhone, 
  BsHouse, 
  BsLaptop, 
  // BsChair,
  BsBicycle 
} from 'react-icons/bs';
import { GiWashingMachine } from 'react-icons/gi';

const OfferSaleHome = () => {
  const categories = [
    { name: "Vehicles", icon: <BsPhone size={24} />, link: "#" },
    { name: "Smartphones", icon: <BsPhone size={24} />, link: "#" },
    { name: "Home Appliances", icon: <GiWashingMachine size={24} />, link: "#" },
    { name: "Houses and Apartments", icon: <BsHouse size={24} />, link: "#" },
    { name: "Electronics", icon: <BsLaptop size={24} />, link: "#" },
    { name: "Furniture", icon: <BsLaptop size={24} />, link: "#" },
    { name: "Bikes", icon: <BsBicycle size={24} />, link: "#" },
  ];

  return (
    <div className="min-h-screen relative bg-darkGreen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.collegedunia.com/public/college_data/images/og_images/news/1667572835-pasted-image-0---2022-11-04T200455.849.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3) blur(2px)',
          opacity: 0.8,
        }}
      />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-darkGreen/70 to-green-900/70"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {/* <header className="py-4 px-6">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-white text-2xl font-bold">
              offer<span className="text-green-400">sale</span>.
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-gray-300 flex items-center space-x-1 cursor-pointer hover:text-white">
                <span>Explore</span>
                <MdOutlineKeyboardArrowDown size={20} />
              </div>
              <div className="text-gray-300 flex items-center space-x-1 cursor-pointer hover:text-white">
                <span>Today's Deals</span>
                <MdOutlineKeyboardArrowDown size={20} />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="px-6 py-2 bg-green-50 text-darkGreen rounded-full hover:bg-green-100 transition-colors">
                Get Started
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center">
                + Post Ad
              </button>
            </div>
          </nav>
        </header> */}

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-white text-6xl font-bold mb-6">
              Sell your items extra products
            </h1>
            <p className="text-gray-300 text-xl mb-8 max-w-3xl mx-auto">
              Do you have any extra products lying around your home that you're not using? 
              Why not sell them to make some extra cash?
            </p>
            <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center mx-auto">
              + Post Ad Now
            </button>
          </div>

          {/* Search Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-6 justify-center">
              <div className="flex items-center space-x-2 text-white cursor-pointer">
                <IoLocationOutline size={24} />
                <span>Bangalore </span>
                <MdOutlineKeyboardArrowDown size={20} />
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search to buy"
                className="w-full px-6 py-4 pr-16 rounded-full text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                <FiSearch size={24} />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-16">
            <div className="grid grid-cols-7 gap-4 justify-items-center">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={category.link}
                  className="flex flex-col items-center group"
                >
                  <div className="text-white mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    {category.icon}
                  </div>
                  <span className="text-white text-sm text-center opacity-70 group-hover:opacity-100 transition-opacity">
                    {category.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const FeaturedAds = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${baseURL}/items`);
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [baseURL]);

  const getStatusBadge = (status) => {
    switch (status) {
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
  const categories = [
    "All Products",
    "Vehicles",
    "Smartphones",
    "Home Appliances",
    "Houses and Apartments",
    "Electronics",
    "Furniture",
  ];

 

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-darkGreen">Featured Ads</h1>
        <p className="text-lg text-gray-600 mt-2">Explore What's New</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-semibold text-darkGreen bg-white rounded-md shadow hover:bg-green-100 ${
              index === 0 ? "border-2 border-green-600" : ""
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-12">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Link key={item._id} to={`/items/${item._id}`} className="group">
                <Card>
                  {getStatusBadge(item.status)}
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.images && item.images[0] 
                      ? `${baseURL.replace('/api', '')}${item.images[0]}`
                      : '/fallback-image.png'}
                    alt={item.title}
                  />
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {item.type === 'sale' ? 'For Sale' : item.type === 'rent' ? 'For Rent' : 'Donation'}
                        </div>
                        {item.type !== 'donation' && (
                          <div className="font-medium text-gray-900">
                            Rs{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500 capitalize">{item.condition}</span>
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
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-md hover:bg-green-700">
          View More
        </button>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      message:
        "Selling my old car was so easy with Offersale. I'm so glad I found Offersale! I was trying to sell my old car, and I had no idea where to start.",
      rating: 5.0,
      name: "Owasim Akbar",
      role: "Marketer",
      image: "https://picsum.photos/200",
    },
    {
      message:
        "Selling my old car was so easy with Offersale. I'm so glad I found Offersale! I was trying to sell my old car, and I had no idea where to start.",
      rating: 5.0,
      name: "Tanim Hasan",
      role: "Developer",
      image: "https://picsum.photos/201",
    },
    {
      message:
        "Selling my old car was so easy with Offersale. I'm so glad I found Offersale! I was trying to sell my old car, and I had no idea where to start.",
      rating: 5.0,
      name: "Mahdi Hosen",
      role: "Designer",
      image: "https://picsum.photos/202",
    },
  ];

  return (
    <div className="bg-gray-100 py-12 px-6 mt-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-darkGreen">
          What people are saying about us
        </h2>
        <h1 className="text-4xl font-bold mt-2">Testimonials</h1>
      </div>
      <div className="flex justify-center space-x-4">
        <button className="w-10 h-10 flex items-center justify-center bg-lightGreen text-darkGreen font-bold rounded-full">
          &#8592;
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <p className="text-gray-700 mb-4">{testimonial.message}</p>
              <div className="flex justify-center items-center mb-4">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-6.928 4.071 2.643-7.213-6.715-5.065 8.482-.3L10 0l2.518 6.493 8.482.3-6.715 5.065 2.643 7.213z" />
                  </svg>
                ))}
              </div>
              <h3 className="text-lg font-bold text-darkGreen">
                {testimonial.name}
              </h3>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
        <button className="w-10 h-10 flex items-center justify-center bg-lightGreen text-darkGreen font-bold rounded-full">
          &#8594;
        </button>
      </div>
    </div>
  );
};

const OffersalePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-darkGreen">
      

      {/* Main Sections */}
      <OfferSaleHome />
      <FeaturedAds />
      <Testimonials />
    </div>
  );
};

export default OffersalePage;
