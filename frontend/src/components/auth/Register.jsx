import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        return;
      }
      setIsOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (err) {
      setError('Failed to register');
      toast.error('Failed to register');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaUser className="text-gray-400 ml-2" />
              <input
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaEnvelope className="text-gray-400 ml-2" />
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaLock className="text-gray-400 ml-2" />
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center border border-gray-300 rounded-md">
              <FaLock className="text-gray-400 ml-2" />
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border-0 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>

        {isOtpSent && (
          <div className="mt-4">
            <h3 className="text-center">Enter OTP sent to your email:</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border rounded p-2 w-full"
            />
            <button onClick={handleVerifyOtp} className="mt-2 w-full bg-blue-500 text-white p-2 rounded">
              Verify OTP
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
