import { useEffect, useState } from "react";
import supabaseClient from "../utils/SupabaseClient";


export const    useUserRole = () => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        try {
            const fethcUserRole = async () => {
                const sessionResult = await supabaseClient.auth.getSession();

                const session = sessionResult.data.session;
                if (!session?.user) {
                    setRole(null);
                    setLoading(false);
                    return;
                }

                const userId = session.user.id;

                const { data, error } = await supabaseClient.from("profiles").select("role").eq("id", userId).single();

                if (error) {
                    console.error(error)
                    setRole(null);
                } else {
                    setRole(data?.role ?? null);
                }
                setLoading(false);
            }
            fethcUserRole();
        } catch (error) {

        }
    }, [])

    return { role, loading };
}