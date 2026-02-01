import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { menuItemSchema, type menuItemSchemaType } from "../../schema/MenuItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import supabaseClient from "../../utils/SupabaseClient";
import toast from "react-hot-toast";

export const useEditMenu = () => {
    const { id } = useParams()
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<menuItemSchemaType>({ resolver: zodResolver(menuItemSchema) });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { data: menuItem, isLoading, error } = useQuery({
        queryKey: ["menuItem", id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("menu_items").select("*").eq("id", id).single();
            if (error) throw error;

            // Pre-fill form values
            setValue("name", data.name);
            setValue("description", data.description);
            setValue("price", data.price);
            setPreview(data.image_url || null);

            return data
        }
    })

    const onSubmit = async (data: menuItemSchemaType) => {
        try {
            setLoading(true);

            let imageUrl: string | null = menuItem?.image_url || null;

            if (data.image instanceof File) {
                const fileName = `${Date.now()}-${data.image.name}`;
                const { error: uploadError } = await supabaseClient.storage.from("menu_images").upload(fileName, data.image);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: publicUrlData } = supabaseClient.storage.from("menu_images").getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
            }

            const { error: insertError } = await supabaseClient.from("menu_items").update({
                name: data.name,
                description: data.description,
                price: data.price,
                image_url: imageUrl,
            }).eq("id", id);

            if (insertError) {
                throw insertError;
            }
            toast.success("Menu item updated successfully!");
            reset();
            setPreview(null);
            navigate("/admin/noallow/");
            queryClient.invalidateQueries({ queryKey: ["menuItems"] });
        } catch (error: any) {
            console.error("Error updating menu item:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setValue("image", file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        handleFileChange,
        errors,
        loading,
        preview,
        isLoading,
        error,
    }
}