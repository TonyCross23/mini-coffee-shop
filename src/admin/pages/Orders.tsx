import { useOrderList } from "../../hooks/admin/useOrderList";

const AdminOrders: React.FC = () => {

    const {handleDeleteOrder: handleDelete, error, handleStatusChange, isLoading, orders: filteredOrders, search, setSearch} = useOrderList()
    
    if (isLoading) return <div>Loading orders...</div>;
    if (error) return <div>Error loading orders</div>;

    return (
        <div className="p-4 sm:p-8 bg-[#F7F4EF] min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#3E2723]">
                Orders List
            </h1>

            {/* Search */}
            <div className="mb-4 w-full sm:w-72 relative">
                <input
                    type="text"
                    placeholder="Search customer..."
                    className="input input-bordered w-full rounded-full pl-10 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="absolute left-6 top-2 text-gray-400">🔍</span>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto bg-white dark:bg-amber-900 rounded-2xl shadow">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-[#3E2723] text-white">
                            <th>Customer</th>
                            <th>Table</th>
                            <th>Items</th>
                            <th>Total (Ks)</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders?.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 py-4">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            filteredOrders?.filter((order) => order.status === "Pending").map((order) => (
                                <tr key={order.id} className="hover:bg-amber-800">
                                    <td>{order.customerName}</td>
                                    <td>{order.tableNumber ?? "-"}</td>
                                    <td>
                                        {order.items.map((i) => (
                                            <div key={i.name}>
                                                {i.name} x{i.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td>{order.total}</td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                                            className={`px-2 py-1 rounded-full text-white text-sm ${order.status === "Pending"
                                                ? "bg-yellow-500"
                                                : order.status === "Completed"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>

                                    </td>
                                    <td>{order.date}</td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="btn btn-xs bg-red-600 border-none text-white"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
