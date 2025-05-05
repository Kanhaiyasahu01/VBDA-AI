import { NavLink } from 'react-router-dom';
import { FiUpload, FiEdit, FiBarChart2, FiCalendar, FiPower } from 'react-icons/fi';

const Sidebar = () => {
  const links = [
    { to: '/', label: 'Upload', icon: <FiUpload className="mr-3" /> },
    { to: '/preview-edit', label: 'Preview & Edit', icon: <FiEdit className="mr-3" /> },
    // { to: '/schedule-bulk', label: 'Schedule', icon: <FiCalendar className="mr-3" /> },
    { to: '/analytics', label: 'Analytics', icon: <FiBarChart2 className="mr-3" /> },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-600">EmailPro</h2>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Log out button */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
          <FiPower className="mr-3 text-gray-400" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;