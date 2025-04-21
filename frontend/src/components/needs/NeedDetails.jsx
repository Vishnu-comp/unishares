import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNeeds } from '../../contexts/NeedContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistance } from 'date-fns';
import { IoTimeOutline } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NeedDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { needs, addComment, updateNeedStatus } = useNeeds();
  const [need, setNeed] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentNeed = needs.find(n => n._id === id);
    if (currentNeed) {
      setNeed(currentNeed);
    }
  }, [id, needs]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setLoading(true);
      setError('');
      await addComment(id, comment.trim());
      setComment('');
      toast.success('Comment added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add comment');
      toast.error('Failed to add comment');
      console.error('Comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await updateNeedStatus(id, status);
      toast.success(`Need marked as ${status}!`);
    } catch (err) {
      setError('Failed to update status');
      toast.error('Failed to update status');
    }
  };

  if (!need) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{need.title}</h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span className="font-medium">
                Posted by {need.owner.name}
              </span>
              <span>•</span>
              <div className="flex items-center">
                <IoTimeOutline className="mr-1" />
                {formatDistance(new Date(need.createdAt), new Date(), { addSuffix: true })}
              </div>
            </div>
          </div>

          {need.owner._id === user?._id && need.status === 'active' && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusUpdate('fulfilled')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Mark as Fulfilled
              </button>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-8">
          <p>{need.description}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="mt-1 text-gray-700">{need.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="mt-1 text-gray-700">{need.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p className="mt-1 text-gray-700">{need.budget ? `$${need.budget}` : 'Not specified'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-gray-700 capitalize">{need.status}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-medium mb-4">Comments</h2>
          
          {need.status === 'active' && (
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 p-2"
                rows="3"
                placeholder="Add a comment..."
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {need.comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-2">
                  <img
                    src={comment.user.profileImage || '/default-avatar.png'}
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-medium">{comment.user.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistance(new Date(comment.createdAt), new Date(), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NeedDetails; 