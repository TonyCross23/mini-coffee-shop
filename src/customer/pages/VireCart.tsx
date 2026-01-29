import { useOrderStore } from "../../store/orderStore";
import type { OrderItem } from "../../types/order";
import { useNavigate } from "react-router-dom";

const ViewCart = () => {
  const navigate = useNavigate();
  const items = useOrderStore((state) => state.items);
  const removeFromCart = useOrderStore((state) => state.rmoveFromCart);
  const clearCart = useOrderStore((state) => state.clearCart);
  const totalAmount = useOrderStore((state) => state.totalAmount);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);

  return (
    <div className="mt-20 flex flex-col min-h-[80vh] relative">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
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

      {/* Fixed Footer Buttons */}
      {items.length > 0 && (
        <div className="px-4 py-4 border-t border-gray-200 dark:bg-amber-900 bg-white sticky bottom-0 shadow-lg">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Subtotal:</span>
            <span className="font-bold">{totalAmount()} Ks</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <button
              className="btn btn-primary bg-amber-700 border-gray-50 py-3 flex-1"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
            <button
              className="btn btn-outline py-3 flex-1"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCart;
