import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

// 1. Create the shelf
const AuthContext = createContext(null)

// 2. Build the provider (the thing that puts items ON the shelf)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getCurrentSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null)
        };

        getCurrentSession();

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        })
        return () => data.subscription.unsubscribe();
    }, [])
    

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. A shortcut hook so any component can grab from the shelf
export const useAuth = () => useContext(AuthContext);
