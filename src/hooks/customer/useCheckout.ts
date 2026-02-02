import toast from "react-hot-toast";
import supabaseClient from "../../utils/SupabaseClient";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useOrderStore } from "../../store/orderStore";
import { useState } from "react";
import { CheckoutSchema, type ChekoutType } from "../../schema/Checkout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const useCheckout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const items = useOrderStore((state) => state.items);
    const totalAmount = useOrderStore((state) => state.totalAmount);
    const clearCart = useOrderStore((state) => state.clearCart);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChekoutType>({ resolver: zodResolver(CheckoutSchema)})

    const handlePlaceOrder = async (data: ChekoutType) => {

        try {
            setLoading(true);

            const { data: orderData, error: insertError } = await supabaseClient
                .from("orders")
                .insert({
                    table_number: data.table_number ,
                    customer_name: data.customer_name,
                    total: totalAmount(),
                    status: "pending",
                })
                .select()
                .single();

            if (insertError) throw insertError

            const orderId = orderData.id;

            const orderItemsPayload = items.map((item) => ({
                order_id: orderId,
                menu_item_id: item.id,
                quantity: item.quantity,
            }));

            const { error: orderItemsError } = await supabaseClient
                .from("order_items")
                .insert(orderItemsPayload);

            if (orderItemsError) {
                throw orderItemsError;
            }
            toast.success("Order successfully placed!");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            clearCart();
            navigate("/");
        } catch (error: any) {
            console.error("Error placing order:", error.message);
            alert("Failed to place order: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        handlePlaceOrder,
        clearCart,
        totalAmount,
        errors,
        items,
        loading,
    }

}