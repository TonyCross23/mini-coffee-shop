import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import supabaseClient from "../utils/SupabaseClient";
import type { Session } from "@supabase/supabase-js";

interface AuthContextType {
    session: Session | null;
    signUpUser: (email: string, password: string) => Promise<{
        success: boolean;
        data: any;
    }>
    signInUser: (email: string, password: string) => Promise<{ success: boolean; data: any } | undefined>;
    signOutUser: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null);

    // signUp
    const signUpUser = async (email: string, password: string) => {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
        })

        if (error) throw error;

        if (data.user) {
            await supabaseClient.from("profiles").insert({
                id: data.user.id,
                email: data.user.email,
                role: "user",
            })
        }

        return { success: true, data }
    }

    //  signIn
    const signInUser = async (email: string, password: string) => {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error;

            return { success: true, data }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })

        supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })
    }, [])

    // signOut
    const signOutUser = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    }

    return (
        <AuthContext.Provider value={{ signUpUser, signInUser, signOutUser, session }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("UserAuth must be used within AuthContextProvider");
    }

    return context;
};