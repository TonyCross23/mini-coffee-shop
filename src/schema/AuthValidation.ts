import z from "zod";

export const authValidationSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type AuthInput = z.infer<typeof authValidationSchema>;