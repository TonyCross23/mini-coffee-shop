import { useState } from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar bg-amber-900 text-white shadow-md px-4">
      {/* Logo / Brand */}
      <div className="flex-1">
        <a className="btn btn-ghost text-xl sm:text-2xl normal-case">
          Admin Panel
        </a>
      </div>

      {/* Menu Links */}
      <div className="flex-none">
        <div className="hidden md:flex space-x-2">
          <Link to="/admin/noallow" className="btn btn-ghost text-white hover:bg-amber-700">Home</Link>
          <Link to="/admin/noallow/menu/create" className="btn btn-ghost text-white hover:bg-amber-700">Menu</Link>
          <Link to="/admin/noallow/orders" className="btn btn-ghost text-white hover:bg-amber-700">Orders</Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden dropdown dropdown-end">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-square btn-ghost"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {menuOpen && (
            <ul className="menu dropdown-content mt-2 p-2 shadow bg-amber-900 rounded-box w-40 text-white space-y-2">
              <li><a href="/admin">Home</a></li>
              <li><a href="/admin/menu">Menu</a></li>
              <li><a href="/admin/orders">Orders</a></li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
