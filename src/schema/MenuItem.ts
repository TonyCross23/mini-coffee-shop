import { z } from "zod"

export const menuItemSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),

    description: z
        .string()
        .optional(),

    price: z
        .number()
        .min(0.01, "Price must be greater than 0"),

    image: z
        .any()
        .optional()
        .refine(
            (file) => !file || (file instanceof File && file.type.startsWith("image/")),
            "File must be an image"
        ),
})

export type menuItemSchemaType = z.infer<typeof menuItemSchema>;