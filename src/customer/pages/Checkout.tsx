import { useCheckout } from "../../hooks/customer/useCheckout";

const Checkout = () => {

    const {handlePlaceOrder,items,loading, totalAmount, errors, handleSubmit, register} = useCheckout()
    
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
                <form onSubmit={handleSubmit(handlePlaceOrder)} className="flex flex-col gap-6">
                    {/* Customer Name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="font-semibold text-[#3E2723] dark:text-gray-100">Customer Name:</label>
                        <input
                            type="text"
                            {...register("customer_name")}
                            className="input input-bordered w-64 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                            placeholder="Enter your name"
                        />
                        {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
                    </div>
                    {/* Table Number Input */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <label className="font-semibold text-[#3E2723] dark:text-gray-100">
                            Table Number:
                        </label>
                        <input
                            type="number"
                            min={1}
                           {...register("table_number", { valueAsNumber: true })}
                            className="input input-bordered w-32 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                        />
                        {errors.table_number && <p className="text-red-500 text-sm mt-1">{errors.table_number.message}</p>}
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
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Checkout;
