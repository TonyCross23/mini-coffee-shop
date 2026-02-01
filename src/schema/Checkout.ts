import z from "zod";

export const CheckoutSchema = z.object({
    table_number: z.number().refine((val) => val !== undefined, {
        message: "table number is required",
    }),
    customer_name: z.string().min(1, "customer name is reqired")
})

export type ChekoutType = z.infer<typeof CheckoutSchema>