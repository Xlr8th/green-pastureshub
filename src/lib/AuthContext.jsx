import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabase'

// 1. Create the shelf
const AuthContext = createContext(null)

// 2. Build the provider (the thing that puts items ON the shelf)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [displayName, setDisplayName] = useState('')

    const fetchRole = async (userId) => {
        if (!userId) {
            setIsAdmin(false)
            setAuthLoading(false)
            return
        }
        const { data } = await supabase
            .from('profiles')
            .select('role, display_name')
            .eq('id', userId)
            .single()

        setIsAdmin(data?.role === 'admin');
        setDisplayName(data?.display_name);
        setAuthLoading(false);
    }

    useEffect(() => {

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            fetchRole(currentUser?.id);
        })
        return () => data.subscription.unsubscribe();
    }, [])
    

    return (
        <AuthContext.Provider value={{ user, setUser, isAdmin, authLoading, displayName }}>
            {children}
        </AuthContext.Provider>
    )
}

// 3. A shortcut hook so any component can grab from the shelf
export const useAuth = () => useContext(AuthContext);
