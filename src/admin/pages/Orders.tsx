import React, { useState } from "react";
import { useOrderList } from "../../hooks/admin/useOrderList";

const AdminOrders: React.FC = () => {
    const { 
        handleDeleteOrder: handleDelete, 
        error, 
        handleStatusChange, 
        isLoading, 
        orders: filteredOrders, 
        search, 
        setSearch 
    } = useOrderList();
    
    const [activeTab, setActiveTab] = useState<"Pending" | "Completed" | "Cancelled">("Pending");

    if (isLoading) return <div className="flex justify-center items-center h-screen bg-[#F7F4EF]">
        <span className="loading loading-spinner loading-lg text-[#3E2723]"></span>
    </div>;
    
    if (error) return <div className="text-red-500 text-center p-10 bg-[#F7F4EF] min-h-screen">
        <div className="alert alert-error">Error loading orders. Please try again later.</div>
    </div>;

    // --- Stats Logic (Daily Summary) ---
    
    const todayLocal = new Date().toLocaleDateString();

    const todayOrders = filteredOrders?.filter(order => {
        const orderDateLocal = new Date(order.date).toLocaleDateString();
        return orderDateLocal === todayLocal;
    }) || [];

    const totalTodayOrdersCount = todayOrders.length;

    const todayCompletedRevenue = todayOrders
        .filter(order => order.status === "Completed")
        .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    const displayOrders = filteredOrders?.filter(order => order.status === activeTab) || [];

    return (
        <div className="p-4 sm:p-8 bg-[#F7F4EF] min-h-screen font-sans">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#3E2723] mb-2">
                    Orders Dashboard
                </h1>
                <p className="text-gray-600 italic">Manage your restaurant orders and track daily sales.</p>
            </header>

            {/* --- Stats Cards Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Today's Total Orders Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border-b-8 border-blue-400 flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Today's Orders</p>
                        <p className="text-4xl font-black text-[#3E2723] mt-1">{totalTodayOrdersCount}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl text-3xl">📦</div>
                </div>

                {/* Today's Completed Revenue Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border-b-8 border-green-400 flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Today's Sales (Completed)</p>
                        <p className="text-4xl font-black text-green-600 mt-1">
                            {todayCompletedRevenue.toLocaleString()} <span className="text-lg">Ks</span>
                        </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl text-3xl">💰</div>
                </div>
            </div>

            {/* --- Controls Section (Search & Tabs) --- */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
                {/* Search Input */}
                <div className="w-full lg:w-96 relative">
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        className="input input-bordered w-full rounded-2xl pl-12 bg-white shadow-sm focus:border-[#3E2723]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute left-4 top-2 text-xl">🔍</span>
                </div>

                {/* Tabs Switcher */}
                <div className="tabs tabs-boxed bg-white p-1.5 rounded-2xl shadow-sm border w-full lg:w-auto overflow-x-auto flex-nowrap">
                    {(["Pending", "Completed", "Cancelled"] as const).map((tab) => (
                        <button
                            key={tab}
                            className={`tab tab-lg px-8 font-bold transition-all duration-300 ${
                                activeTab === tab 
                                ? "bg-[#3E2723] text-white rounded-xl shadow-md" 
                                : "text-gray-400 hover:text-[#3E2723]"
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Orders Table --- */}
            <div className="overflow-x-auto bg-white rounded-3xl shadow-lg border border-gray-100">
                <table className="table w-full border-collapse">
                    <thead>
                        <tr className="bg-[#3E2723] text-white text-sm uppercase">
                            <th className="py-5 pl-8">Customer</th>
                            <th>Table</th>
                            <th>Order Details</th>
                            <th>Amount (Ks)</th>
                            <th>Status Control</th>
                            <th>Time</th>
                            <th className="pr-8 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-[#3E2723]">
                        {displayOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-20">
                                    <div className="flex flex-col items-center opacity-30">
                                        <span className="text-6xl mb-4">📑</span>
                                        <p className="text-xl font-bold">No {activeTab} orders found for now.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            displayOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-amber-50/30 transition-colors border-b border-gray-50">
                                    <td className="py-5 pl-8 font-bold text-lg">{order.customerName}</td>
                                    <td>
                                        <span className="badge badge-outline border-amber-700 text-amber-900 font-mono px-3 py-3">
                                            #{order.tableNumber ?? "N/A"}
                                        </span>
                                    </td>
                                    <td className="max-w-xs">
                                        {order.items.map((i, idx) => (
                                            <div key={idx} className="text-sm py-0.5">
                                                <span className="text-gray-400 mr-2">•</span>
                                                {i.name} <span className="font-black text-[#3E2723]">x{i.quantity}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="font-extrabold text-lg">
                                        {Number(order.total).toLocaleString()}
                                    </td>
                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                                            className={`select select-sm rounded-full font-bold text-white border-none ${
                                                order.status === "Pending" ? "bg-yellow-500 hover:bg-yellow-600" : 
                                                order.status === "Completed" ? "bg-green-500 hover:bg-green-600" : 
                                                "bg-red-500 hover:bg-red-600"
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="text-xs font-medium text-gray-500">
                                        {new Date(order.date).toLocaleDateString()} <br/>
                                        <span className="text-[#3E2723]">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </td>
                                    <td className="pr-8 text-center">
                                        <button
                                            onClick={() => handleDelete(order.id)}
                                            className="btn btn-circle btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                            title="Delete Order"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Summary */}
            <div className="mt-6 text-right text-gray-400 text-sm">
                Showing {displayOrders.length} {activeTab} orders
            </div>
        </div>
    );
};

export default AdminOrders;