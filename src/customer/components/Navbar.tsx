import { useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import CartDropdown from "./CartDropdown";

const NavBar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useOrderStore(state => state.items);

  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-amber-900 shadow-sm px-2 sm:px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl sm:text-2xl">
          Mini Coffee Shop
        </a>
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
      </div>
    </div>
  );
};

export default NavBar;
