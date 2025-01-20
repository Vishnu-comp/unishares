import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Statistics = ({ stats }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const itemTypeData = [
    { name: 'For Sale', value: stats.itemTypes.sale },
    { name: 'For Rent', value: stats.itemTypes.rent },
    { name: 'Donation', value: stats.itemTypes.donation }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalUsers}
          </p>
          <p className="mt-2 text-sm text-green-600">
            +{stats.newUsersThisMonth} this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.activeListings}
          </p>
          <p className="mt-2 text-sm text-green-600">
            +{stats.newListingsThisMonth} this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.totalTransactions}
          </p>
          <p className="mt-2 text-sm text-green-600">
            +{stats.transactionsThisMonth} this month
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Chats</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {stats.activeChats}
          </p>
          <p className="mt-2 text-sm text-green-600">
            +{stats.newChatsThisMonth} this month
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Activity Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#8884d8"
                  name="Active Users"
                />
                <Line
                  type="monotone"
                  dataKey="newListings"
                  stroke="#82ca9d"
                  name="New Listings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Item Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Item Types Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={itemTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {itemTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Average Response Time</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {stats.averageResponseTime} minutes
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Successful Transactions</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {stats.successRate}%
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Active Categories</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {stats.activeCategories}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 