import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOutUser } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await signOutUser();
      navigate('/auth/signin');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 sm:px-4 bg-amber-900 text-white shadow-md px-4">
      {/* Logo / Brand */}
      <div className="flex-1">
        <Link to="/admin/noallow" className="text-xl sm:text-2xl normal-case">
          Admin Panel
        </Link>
      </div>

      {/* Menu Links */}
      <div className="flex-none">
        <div className="hidden md:flex space-x-2">
          <Link to="/admin/noallow" className="btn btn-ghost text-white hover:bg-amber-700">Home</Link>
          <Link to="/admin/noallow/menu/create" className="btn btn-ghost text-white hover:bg-amber-700">Menu</Link>
          <Link to="/admin/noallow/orders" className="btn btn-ghost text-white hover:bg-amber-700">Orders</Link>
          <div className="btn btn-ghost text-white hover:bg-amber-700">
            <button onClick={handleLogout}>logout</button>
          </div>
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
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <ul className="menu dropdown-content mt-2 p-2 shadow bg-amber-900 rounded-box w-40 text-white space-y-2">
              <li><Link to="/admin/noallow">Home</Link></li>
              <li><Link to="/admin/noallow/menu/create">Menu</Link></li>
              <li><Link to="/admin/noallow/orders">Orders</Link></li>
              <li className="bg-amber-800 rounded-md ms-2">
                <button onClick={handleLogout} className="pt-1 px-2">logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
