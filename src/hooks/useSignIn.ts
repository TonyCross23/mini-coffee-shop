import { useState } from "react"
import { UserAuth } from "../context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { authValidationSchema, type AuthInput } from "../schema/AuthValidation"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import supabaseClient from "../utils/SupabaseClient"

export const useSingIn = () => {
    const { signInUser } = UserAuth()
    const [isLoading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthInput>({ resolver: zodResolver(authValidationSchema) })
    const [authError, setAuthError] = useState<string | null>(null)
    const navigate = useNavigate()

    const onSubmit = async (data: AuthInput) => {
        setIsLoading(true)
        setAuthError(null)
        try {
            const result = await signInUser(data.email, data.password)
            if (result?.success) {
                const { data: profile } = await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", result.data.user.id)
                .single();

                const role = profile?.role;

                if(role === "admin") {
                    navigate("/admin/noallow", {replace: true})
                } else {
                    navigate('/', { replace: true });
                }
            }
        } catch (error: any) {
            setAuthError("Something went wrong during sign in.")
        } finally {
            setIsLoading(false)
        }
    }

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isLoading,
        authError,
    }
}