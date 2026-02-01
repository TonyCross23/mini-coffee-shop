import { useState } from "react";
import CartDropdown from "./CartDropdown";
import { useNav } from "../../hooks/customer/useNav";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
 const {handleLogout, items} = useNav()

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-amber-900 shadow-sm px-2 sm:px-4">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl sm:text-2xl">
          Mini Coffee Shop
        </Link>
      </div>

      <div className="flex-none relative">
        <button
          onClick={() => setIsCartOpen(prev => !prev)}
          className="btn btn-ghost btn-circle"
        >
          <div className="indicator">
            🛒
            <span className="badge badge-sm indicator-item text-red-400">
              {items.length}
            </span>
          </div>
        </button>

        {isCartOpen && (
          <CartDropdown onClose={() => setIsCartOpen(false)} />
        )}
        <div>
          <button onClick={handleLogout}>signOUt</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
