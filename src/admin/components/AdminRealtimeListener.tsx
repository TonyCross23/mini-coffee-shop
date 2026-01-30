import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import supabaseClient from "../../utils/SupabaseClient";
import { printOrder } from "./print";


const AdminRealtimeListener = () => {
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sound/order.mp3");
    audioRef.current.volume = 0.8;

    const channel = supabaseClient
      .channel("admin-orders-global")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          // 🔔 Sound
          audioRef.current?.play().catch(() => {});

          // 🔔 Toast
          toast.success(
            `New order from ${payload.new.customer_name ?? "Unknown"}`
          );

          // 🧾 Fetch order items for printing
          const { data: items } = await supabaseClient
            .from("order_items")
            .select(`
              quantity,
              menu_items ( name )
            `)
            .eq("order_id", payload.new.id);

          const orderForPrint = {
            ...payload.new,
            items: items?.map((i: any) => ({
              name: i.menu_items?.name ?? "Unknown",
              quantity: i.quantity,
            })),
          };

          // 🖨️ Print
          printOrder(orderForPrint);

          // 🔄 Refresh orders list everywhere
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [queryClient]);

  return null; // UI မလို
};

export default AdminRealtimeListener;
