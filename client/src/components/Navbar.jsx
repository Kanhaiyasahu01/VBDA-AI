import { useState } from 'react';
import { FiMenu, FiX, FiBell, FiUser, FiUpload, FiEdit, FiBarChart2, FiCalendar } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const mobileLinks = [
    { to: '/', label: 'Upload', icon: <FiUpload className="mr-3" /> },
    { to: '/preview-edit', label: 'Preview & Edit', icon: <FiEdit className="mr-3" /> },
    { to: '/schedule-bulk', label: 'Schedule', icon: <FiCalendar className="mr-3" /> },
    { to: '/analytics', label: 'Analytics', icon: <FiBarChart2 className="mr-3" /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu button (mobile) and Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className="md:hidden ml-2 font-bold text-indigo-600">EmailPro</div>
          </div>
          
          {/* Right: User menu and notifications */}
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <FiBell size={20} />
            </button>
            
            <div className="relative">
              <button className="flex items-center text-sm rounded-full focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <FiUser />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mobileLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;