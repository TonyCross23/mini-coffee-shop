import { useFetchMenu } from "../../hooks/customer/useFetchMenu";


const UserHome: React.FC = () => {

    const {addToCart, error, filteredMenuItems, handleKeyDown, isLoading,searchInput, setSearchInput} = useFetchMenu()

    if (isLoading)  return <div>Loading...</div>;

    if (error) return <div>Error loading menu items.</div>;

    return (
        <div className="min-h-screen bg-[#F7F4EF] p-4 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#3E2723]">
                    Our Coffee Menu
                </h1>

                {/* Search */}
                <div className="relative w-full sm:w-72 mt-3 sm:mt-0">
                    <input
                        type="text"
                        placeholder="Search coffee..."
                        className="input input-bordered w-full pl-10 rounded-full text-gray-700 bg-white"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredMenuItems?.length === 0 && (
                    <div className="text-center mt-20 text-gray-500">
                        ☕ No coffee found
                    </div>
                )}
                {filteredMenuItems?.map((item) => (
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
                                <p className="text-[#6D4C41] font-bold mt-1">{item.price} Ks</p>
                            </div>

                            {/* Optional: Add to Cart button */}
                            <button onClick={() => addToCart({ ...item, id: String(item.id), quantity: 1 })} className="btn bg-amber-700 text-white w-full mt-4">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredMenuItems?.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    ☕ No coffee found
                </div>
            )}
        </div>
    );
};

export default UserHome;
