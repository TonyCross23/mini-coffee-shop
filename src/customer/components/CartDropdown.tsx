import { Link } from "react-router-dom";
import { useOrderStore } from "../../store/orderStore";
import type { OrderItem } from "../../types/order";

interface CartDropdownProps {
  onClose: () => void;
}

const CartDropdown = ({ onClose }: CartDropdownProps) => {
  const items = useOrderStore(state => state.items);
  const removeFromCart = useOrderStore(state => state.removeFromCart);
  const clearCart = useOrderStore(state => state.clearCart);
  const totalAmount = useOrderStore(state => state.totalAmount);
  const updateQuantity = useOrderStore(state => state.updateQuantity);

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-xs sm:max-w-md rounded-lg shadow-lg bg-base-100 z-50">
      <div className="max-h-64 overflow-y-auto px-4 py-2">
        {items.length === 0 && (
          <p className="text-center py-4">Your cart is empty.</p>
        )}

        {items.map((item: OrderItem) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-gray-200 py-2"
          >
            <div>
              <span className="font-medium">{item.name}</span>
              <br />
              <span className="text-sm text-gray-500">{item.price} Ks</span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                className="btn btn-xs btn-outline"
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                -
              </button>

              <span className="px-2">{item.quantity}</span>

              <button
                className="btn btn-xs btn-outline text-amber-700"
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button>

              <button
                className="btn btn-xs bg-amber-700 text-white"
                onClick={() => removeFromCart(item.id)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Subtotal:</span>
            <span className="font-bold">{totalAmount()} Ks</span>
          </div>

          <div className="flex flex-col space-y-2">
            <Link to="/view/cart" className="btn btn-primary bg-amber-700">
              View Cart
            </Link>
            <button className="btn btn-outline" onClick={() => { clearCart(); onClose(); }}>
              Clear Cart
            </button>
            <button className="btn btn-ghost text-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
