import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} College Marketplace. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="/about" className="text-gray-400 hover:text-gray-500">
              About
            </a>
            <a href="/terms" className="text-gray-400 hover:text-gray-500">
              Terms
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 