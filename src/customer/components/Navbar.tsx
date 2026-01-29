import { useState } from "react";

const initialCart = [
  { id: 1, name: "Latte", price: 5, quantity: 1 },
  { id: 2, name: "Cappuccino", price: 6, quantity: 2 },
  { id: 3, name: "Espresso", price: 4, quantity: 1 },
  { id: 4, name: "Mocha", price: 7, quantity: 1 },
];

const NavBar = () => {
  const [cart, setCart] = useState(initialCart);

  const increment = (id: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decrement = (id: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl sm:text-2xl">Mini Coffee Shop</a>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="badge badge-sm indicator-item text-red-400 font-medium">{cart.length}</span>
            </div>
          </div>

          {/* Dropdown Content */}
          <div className="dropdown-content z-50 mt-4 w-80 sm:w-96 max-w-xs sm:max-w-md rounded-lg shadow-lg bg-base-100">
            {/* Scrollable Items */}
            <div className="max-h-64 overflow-y-auto px-4 py-2">
              {cart.length === 0 && <p className="text-center py-4">Your cart is empty.</p>}
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                  <div>
                    <span className="font-medium">{item.name}</span> <br />
                    <span className="text-sm text-gray-500">${item.price} each</span>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <button className="btn btn-xs sm:btn-sm btn-outline" onClick={() => decrement(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-xs sm:btn-sm btn-outline text-amber-700" onClick={() => increment(item.id)}>+</button>
                    <button className="btn btn-xs sm:btn-sm bg-amber-700 text-white" onClick={() => removeItem(item.id)}>X</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Actions */}
            {cart.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200">
                <div className="flex justify-between mb-2 text-sm sm:text-base">
                  <span className="font-bold">Subtotal:</span>
                  <span className="font-bold">${subtotal}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <button className="btn btn-primary bg-amber-700 btn-block sm:btn-md">View Cart</button>
                  <button className="btn btn-outline btn-block sm:btn-md" onClick={clearCart}>Clear Cart</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
