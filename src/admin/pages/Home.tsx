import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import supabaseClient from "../../utils/SupabaseClient";
import { Link } from "react-router-dom";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

const AdminHome: React.FC = () => {
  const [search, setSearch] = useState("");

  const {data: menuItems, isLoading, error} = useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
        const {data, error} = await supabaseClient.from("menu_items").select("*").order("created_at", {ascending: true});
        if (error) throw error;
        return data
    }
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading menu items.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3E2723]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#6D4C41]">
            Manage your coffee menu
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 mt-3 sm:mt-0">
          <input
            type="text"
            placeholder="Search coffee..."
            className="input input-bordered w-full pl-10 rounded-full bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {
            menuItems?.length === 0 && <p>no items</p>
        }
        {menuItems?.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition flex flex-col"
          >
            {/* Image */}
            <div className="h-48 w-full overflow-hidden rounded-t-2xl">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h2 className="font-semibold text-lg text-[#3E2723]">
                  {item.name}
                </h2>
                <p className="text-[#6D4C41] font-bold mt-1">${item.price}</p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-center gap-2">
                <Link to={`/admin/noallow/menu/edit/${item.id}`} className="btn btn-sm btn-outline w-35">
                  Edit
                </Link>
                <button className="btn btn-sm bg-amber-700 text-white w-35">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {menuItems?.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          ☕ No coffee found
        </div>
      )}
    </div>
  );
};

export default AdminHome;
