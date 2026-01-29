import { useState } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema, type menuItemSchemaType } from "../../schema/MenuItem";
import supabaseClient from "../../utils/SupabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const EditMenu = () => {
    const { id } = useParams()
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<menuItemSchemaType>({ resolver: zodResolver(menuItemSchema) });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

    const {data: menuItem , isLoading, error} = useQuery({
    queryKey: ["menuItem", id],
    queryFn: async () => {
        const {data, error} = await supabaseClient.from("menu_items").select("*").eq("id", id).single();
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

  if(isLoading) {
    return <div>Loading...</div>;
  }

  if(error) {
    return <div>Error loading menu item.</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Menu Item</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full"
            {...register("name", { required: true })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

        </div>
        <input
          type="text"
          placeholder="Description"
          className="input input-bordered w-full"
          {...register("description", { required: true })}
        />

        <div>
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            className="input input-bordered w-full"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}

        </div>
        {/* Image */}
        <div>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
          />
          {Boolean(errors.image) && (
            <p className="text-red-500 text-sm mt-1 ">
              {typeof errors.image === "string" ? errors.image : (errors.image as any)?.message}
            </p>
          )}
          {preview && <img src={preview} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-md" />}
        </div>

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Creating..." : "Create Menu Item"}
        </button>
      </form>
    </div>
  );
};

export default EditMenu;
