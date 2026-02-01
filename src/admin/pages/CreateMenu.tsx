import { useCreateMenu } from "../../hooks/admin/useCreateMenu";


const CreateMenu = () => {

  const {errors, handleFileChange, handleSubmit, loading, onSubmit, preview, register} = useCreateMenu()
 
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Menu Item</h1>

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

export default CreateMenu;
