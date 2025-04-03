import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Google as GoogleIcon, 
  Apple as AppleIcon 
} from '@mui/icons-material';

const Footer = () => {
  const footerSections = {
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Press', path: '/press' },
        { name: 'Career', path: '/career' }
      ]
    },
    popularLocations: {
      title: 'Popular Locations',
      links: [
        { name: 'Central Campus', path: '/location/central' },
        { name: 'North Campus', path: '/location/north' },
        { name: 'South Campus', path: '/location/south' },
        { name: 'City Campus', path: '/location/city' }
      ]
    },
    sellersAndBuyers: {
      title: 'Sellers and Buyers',
      links: [
        { name: 'Seller Agreements', path: '/seller-agreements' },
        { name: 'Buyers Agreements', path: '/buyer-agreements' },
        { name: 'Terms of Services', path: '/terms' },
        { name: 'Data Policy', path: '/privacy' }
      ]
    },
    helpCenter: {
      title: 'Help Center',
      links: [
        { name: 'Live Chat', path: '/chat' },
        { name: 'Support', path: '/support' },
        { name: 'Emergency', path: '/emergency' },
        { name: 'Reports', path: '/reports' }
      ]
    }
  };

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-green-400">
                Uni<span className="text-green-600">share</span>.
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              University marketplace to buy and sell services, exclusively for students.
            </p>
            {/* App Store Buttons */}
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
              >
                <GoogleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Google Play</span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
              >
                <AppleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">App Store</span>
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {Object.values(footerSections).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-400 hover:text-gray-200 transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Unishare. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-gray-200">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-gray-200">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-gray-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 