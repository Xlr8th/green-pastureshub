"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Toast from '../../components/Toast/Toast';
import './login.css'
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [toastMessage, setToastMessage] = useState("");
    const [isToastVisible, setIsToastVisible] = useState(false);

    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    const showToast = (message) => {
        setToastMessage(message)
        setIsToastVisible(true)

        setTimeout(() => {
            setToastMessage("")
            setIsToastVisible(false)
        }, 2500)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            if (isLogin) {
                const result = await supabase.auth.signInWithPassword({email, password});

                if (result.error) {
                    showToast(result.error.message)
                    return;
                }

                showToast("Successfully logged in.");

                setTimeout(() => {
                    router.push(redirect || '/');
                }, 2000);
            }
            else {

                const { data: existingProfile, error: checkError } = await supabase
                .from("profiles")
                .select("id")
                .eq("display_name", displayName)
                .maybeSingle();

                if (checkError) {
                    showToast("Unable to verify display name.");
                    return;
                }

                if (existingProfile) {
                    showToast("Display name already taken. Please choose another one.");
                    return;
                }

                const result = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: displayName
                        }
                    }
                });
                

                if (result.error) {
                    showToast(result.error.message);
                    return;
                }

                const user = result.data.user;

                if (!user) {
                    showToast('Unable to create account')
                    return;
                }

                showToast(
                    "Account created successfully. Check your email to confirm your account."
                );
                setTimeout(() => {
                    setIsLogin(true);
                }, 2000);
            }
       
        }
        catch (error) {
            showToast(error.message || 'Something went wrong. Please try again.')
        }
        finally {
            setLoading(false)
        }
        
    };    

    return (
        <section className="login-page">
            <div className="login-card">
                <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

                <p className="login-subtitle">
                    {isLogin ? 'sign in to continue.' : 'Create an account to get started.'}
                </p>
                <Toast 
                    isVisible={isToastVisible}
                    message={toastMessage}
                />
                <form onSubmit={handleSubmit}>

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>                    
                    

                    <button type="submit" disabled={loading}>
                        {loading
                            ? 'Please wait...'
                            : isLogin
                            ? 'Login'
                            : 'Register'}
                    </button>
                </form>

                <button
                    className="toggle-btn"
                    type="button"
                    onClick={() => setIsLogin((prev) => !prev)}
                >
                    {isLogin
                        ? "Don't have an account? Register"
                        : 'Already have an account? Login'}
                </button>
            </div>           
        </section>
    );
}
