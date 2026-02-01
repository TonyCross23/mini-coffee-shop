import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import supabaseClient from "../../utils/SupabaseClient";

interface MenuItem {
    id: number;
    name: string;
    price: number;
    image_url: string;
}

export const useFetchMenu = () => {
        const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const { data: menuItems, isLoading, error } = useQuery<MenuItem[]>({
        queryKey: ["menuItems"],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("menu_items").select("*").order("created_at", { ascending: true });
            if (error) throw error;
            return data
        }
    })

    const filteredMenuItems = menuItems?.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    // Enter Key Handler
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearch(searchInput);
        }
    };

    return { menuItems: filteredMenuItems, isLoading, error, searchInput, setSearchInput, handleKeyDown };
}