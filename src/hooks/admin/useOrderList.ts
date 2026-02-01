import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
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

export const useOrderList = () => {
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();
    const [orders, setOrders] = useState<Order[]>([]);
    const orderSound = new Audio("/sound/order.mp3");
    orderSound.volume = 0.7;

    // Fetch orders
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

    // Search filter
    const filteredOrders = useMemo(
        () =>
            ordersData?.filter((order) =>
                (order.customerName ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        [ordersData, search]
    );

    const deleteMutation = useMutation<void, Error, number>({
        mutationFn: async (orderId: number) => {
            await supabaseClient.from("order_items").delete().eq("order_id", orderId);
            await supabaseClient.from("orders").delete().eq("id", orderId);
        },
        onSuccess: () => {
            toast.success("Order deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            toast.error("Failed to delete order.");
        }
    })

    // Wrapper function
    const handleDeleteOrder = (orderId: number) => {
        if (!confirm("Are you sure you want to delete this order?")) return; 
        deleteMutation.mutate(orderId);
    };

    useEffect(() => {
        if (ordersData) setOrders(ordersData);
    }, [orders]);

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

    return {
        orders: filteredOrders,
        isLoading,
        error,
        search,
        setSearch,
        handleDeleteOrder,
        handleStatusChange,
    };


}