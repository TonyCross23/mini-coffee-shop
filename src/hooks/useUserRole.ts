import { useEffect, useState } from "react";
import supabaseClient from "../utils/SupabaseClient";


export const useUserRole = () => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserRole = async (userId: string) => {
            const { data, error } = await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", userId)
                .single();
            if (!error) setRole(data?.role ?? null);
            setLoading(false);
        };

        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session) fetchUserRole(session.user.id);
            else setLoading(false);
        });

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return { role, loading };
}