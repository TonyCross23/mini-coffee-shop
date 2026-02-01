import { useQueryClient } from "@tanstack/react-query";
import { menuItemSchema, type menuItemSchemaType } from "../../schema/MenuItem";
import supabaseClient from "../../utils/SupabaseClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCreateMenu = () => {
     const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<menuItemSchemaType>({ resolver: zodResolver(menuItemSchema) });



  const onSubmit = async (data: menuItemSchemaType) => {
    try {
      setLoading(true);

      let imageUrl: string | null = null;

      if (data.image instanceof File) {
        const fileName = `${Date.now()}-${data.image.name}`;
        const { error: uploadError } = await supabaseClient.storage.from("menu_images").upload(fileName, data.image);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabaseClient.storage.from("menu_images").getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabaseClient.from("menu_items").insert({
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: imageUrl,
      });

      if (insertError) {
        throw insertError;
      }

      alert("Menu item created successfully!");
      reset();
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    } catch (error: any) {
      console.error("Error creating menu item:", error.message);
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
    errors,
    loading,
    preview,
    handleFileChange,
  }

}