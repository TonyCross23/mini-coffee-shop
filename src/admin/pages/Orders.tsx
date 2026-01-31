import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabaseClient from "../../utils/SupabaseClient";
import toast from "react-hot-toast";

interface OrderItemDetail {
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    customerName: string;
    tableNumber: number | null;
    items: OrderItemDetail[];
    total: number;
    status: "Pending" | "Completed" | "Cancelled";
    date: string;
}

const AdminOrders: React.FC = () => {
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const [orders, setOrders] = useState<Order[]>([]);
    const orderSound = new Audio("/sound/order.mp3");
    orderSound.volume = 0.7;

    // ✅ Fetch orders
    const { data: ordersData, isLoading, error } = useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            const { data: orders, error: ordersError } = await supabaseClient
                .from("orders")
                .select("*")
                .order("created_at", { ascending: false });
            if (ordersError || !orders) throw ordersError;

            const { data: orderItems, error: orderItemsError } = await supabaseClient
                .from("order_items")
                .select("*");
            if (orderItemsError || !orderItems) throw orderItemsError;

            const { data: menuItems, error: menuItemsError } = await supabaseClient
                .from("menu_items")
                .select("*");
            if (menuItemsError || !menuItems) throw menuItemsError;

            return orders.map((order) => {
                const orderItemsForThisOrder: OrderItemDetail[] = orderItems
                    .filter((oi) => oi.order_id === order.id)
                    .map((oi) => {
                        const menu = menuItems.find((m) => m.id === oi.menu_item_id);
                        return {
                            name: menu?.name || "Unknown",
                            price: menu?.price || 0,
                            quantity: oi.quantity,
                        };
                    });

                return {
                    id: order.id,
                    customerName: order.customer_name || "Unknown",
                    tableNumber: order.table_number ?? null,
                    items: orderItemsForThisOrder,
                    total: order.total || 0,
                    status:
                        order.status === "pending"
                            ? "Pending"
                            : order.status === "completed"
                                ? "Completed"
                                : "Cancelled",
                    date: order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "-",
                };
            });
        },
    });

    // ✅ Search filter
    const filteredOrders = useMemo(
        () =>
            ordersData?.filter((order) =>
                (order.customerName ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        [ordersData, search]
    );

    // ✅ Delete order
    const handleDelete = async (orderId: number) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        try {
            await supabaseClient.from("order_items").delete().eq("order_id", orderId);
            await supabaseClient.from("orders").delete().eq("id", orderId);

            toast.success("Order deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete order.");
        }
    };

    useEffect(() => {
        if (ordersData) setOrders(ordersData);
    }, [ordersData]);

    const handleStatusChange = async (orderId: number, newStatus: "Pending" | "Completed" | "Cancelled") => {
        try {
            await supabaseClient.from("orders").update({ status: newStatus.toLowerCase() }).eq("id", orderId);

            // local state update
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
            );

            toast.success(`Order marked as ${newStatus}`);
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        } catch (err) {
            toast.error("Failed to update order status");
        }
    };

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
                                <tr key={order.id} className="hover:bg-gray-400">
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
                                            className="btn btn-xs bg-red-600 text-white"
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
