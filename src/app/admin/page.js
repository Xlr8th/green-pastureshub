"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import './admin.css'
import Toast from '../../components/Toast/Toast'

export default function AdminLogin() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isToastVisible, setIsToastVisible] = useState(false)

    const showToast = (message) => {
        setError(message)
        setIsToastVisible(true)

        setTimeout(() => {
            setError("")
            setIsToastVisible(false)
        }, 2500)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {

           const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            showToast(error.message)
            return
        }

        router.push("/admin/create") 
        }
        catch (error) {
            showToast('Something went wrong. Please try again.')
        }
        finally {
            setLoading(false)
        }
        
    }

    return (
        <div className="admin-container">
            <h1>Admin Login</h1>

            <form onSubmit={handleSubmit} className="admin-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                {error && <Toast 
                    isVisble={isToastVisible}
                    message={error}
                />}
            </form>
        </div>
    )
}