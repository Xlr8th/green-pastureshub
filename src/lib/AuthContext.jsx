import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

// 1. Create the shelf
const AuthContext = createContext(null)

// 2. Build the provider (the thing that puts items ON the shelf)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const fetchRole = async (userId) => {
        if (!userId) {
            setIsAdmin(false)
            return
        }
        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

        setIsAdmin(data?.role === 'admin')
    }

    useEffect(() => {
        const getCurrentSession = async () => {
            const { data } = await supabase.auth.getSession();
            const currentUser = data.session?.user ?? null
            setUser(currentUser)
            fetchRole(currentUser?.id)
        };

        getCurrentSession();

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            fetchRole(currentUser?.id);
        })
        return () => data.subscription.unsubscribe();
    }, [])
    

    return (
        <AuthContext.Provider value={{ user, setUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. A shortcut hook so any component can grab from the shelf
export const useAuth = () => useContext(AuthContext);
