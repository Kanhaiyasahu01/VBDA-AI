import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { to: '/', label: 'Upload' },
    { to: '/preview-edit', label: 'Preview & Edit' },
    { to: '/analytics', label: 'View Analytics' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold mb-6">My Dashboard</h2>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
