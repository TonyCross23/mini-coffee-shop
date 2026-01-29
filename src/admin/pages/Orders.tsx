import { useState, useMemo } from "react";

interface OrderItem {
  id: number;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Pending" | "Completed" | "Cancelled";
  date: string;
}

const initialOrders: OrderItem[] = [
  {
    id: 1,
    customerName: "John Doe",
    items: [
      { name: "Latte", quantity: 2, price: 5 },
      { name: "Mocha", quantity: 1, price: 7 },
    ],
    total: 17,
    status: "Pending",
    date: "2026-01-29",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    items: [
      { name: "Cappuccino", quantity: 1, price: 6 },
      { name: "Espresso", quantity: 2, price: 4 },
    ],
    total: 14,
    status: "Completed",
    date: "2026-01-28",
  },
  {
    id: 3,
    customerName: "Alice Brown",
    items: [{ name: "Americano", quantity: 3, price: 3 }],
    total: 9,
    status: "Cancelled",
    date: "2026-01-28",
  },
];

const AdminOrders: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(
    () =>
      initialOrders.filter((order) =>
        order.customerName.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <div className="p-4 sm:p-8 bg-[#F7F4EF] min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-[#3E2723]">
        Orders List
      </h1>

      {/* Search */}
      <div className="mb-4 w-full sm:w-72">
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
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="table w-full">
          <thead>
            <tr className="bg-[#3E2723] text-white">
              <th>ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>
                    {order.items.map((i) => (
                      <div key={i.name}>
                        {i.name} x{i.quantity}
                      </div>
                    ))}
                  </td>
                  <td>{order.total}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        order.status === "Pending"
                          ? "bg-yellow-500"
                          : order.status === "Completed"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
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
