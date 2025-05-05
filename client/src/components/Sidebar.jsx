import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/', label: 'Upload' },
    { to: '/preview-edit', label: 'Preview & Edit' },
    { to: '/analytics', label: 'View Analytics' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4 h-full shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-wide">My Dashboard</h2>
      </div>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded transition duration-200 ease-in-out hover:bg-gray-700 mb-1 ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-300'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
