import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../../store/orderStore";
import { useState } from "react";
import supabaseClient from "../../utils/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Checkout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const items = useOrderStore((state) => state.items);
    const totalAmount = useOrderStore((state) => state.totalAmount);
    const clearCart = useOrderStore((state) => state.clearCart);
    const [tableNumber, setTableNumber] = useState<number | "">("");
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");

    const handlePlaceOrder = async () => {
        if (!tableNumber || items.length === 0) {
            alert("Please enter a valid table number and ensure your cart is not empty.");
            return;
        }

        try {
            setLoading(true);

            const { data: orderData, error: orderError } = await supabaseClient
                .from("orders")
                .insert({
                    table_number: tableNumber,
                    customer_name: customerName,
                    total: totalAmount(),
                    status: "pending",
                })
                .select()
                .single();

            if (orderError || !orderData) {
                throw orderError || new Error("Failed to create order");
            }

            const orderId = orderData.id;

            const orderItemsPayload = items.map((item) => ({
                order_id: orderId,
                menu_item_id: item.id,
                quantity: item.quantity,
            }));

            const { error: orderItemsError } = await supabaseClient
                .from("order_items")
                .insert(orderItemsPayload);

            if (orderItemsError) {
                throw orderItemsError;
            }
            toast.success("Order successfully placed!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            clearCart();
            navigate("/");
        } catch (error: any) {
            console.error("Error placing order:", error.message);
            alert("Failed to place order: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-[#F7F4EF] dark:bg-gray-900 transition-colors">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#3E2723] dark:text-gray-100">
                Checkout
            </h1>

            {items.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    Your cart is empty.
                </p>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Customer Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="font-semibold text-[#3E2723] dark:text-gray-100">Customer Name:</label>
                        <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="input input-bordered w-64 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                            placeholder="Enter your name"
                        />
                    </div>
                    {/* Table Number Input */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="font-semibold text-[#3E2723] dark:text-gray-100">
                            Table Number:
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={tableNumber}
                            onChange={(e) => setTableNumber(Number(e.target.value))}
                            className="input input-bordered w-32 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                        />
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2"
                            >
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                                    <br />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.price} Ks</span>
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-gray-100">
                                    {item.quantity} pcs
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2 text-gray-900 dark:text-gray-100">
                        <span>Total:</span>
                        <span>{totalAmount()} Ks</span>
                    </div>

                    {/* Place Order Button */}
                    <button
                        className="btn btn-primary bg-amber-700 w-full hover:bg-amber-600 text-white"
                        disabled={loading}
                        onClick={handlePlaceOrder}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
