'use client'
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import BackToTop from "../components/BackToTop/BackToTop";
import Toast from "../components/Toast/Toast";
import Footer from "../components/Footer/Footer";
import { AuthProvider } from "../lib/AuthContext";
import { ToastProvider, useToast } from "../lib/ToastContext";

const LayoutContent = ({ children }) => {
    const [backToTop, setBackToTop] = useState(false);
    const { showToast } = useToast();

    useEffect ( () => {
        //Add right-click and text selection restrictions across the site
    const handleContextMenu = (e) => e.preventDefault()
    const handleSelectStart = (e) => e.preventDefault()

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)

    //Back to the top function
    const handleScroll = () => {
        if(window.scrollY > 100) {
            setBackToTop(true);
        }
        else {
            setBackToTop(false);
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('contextmenu', handleContextMenu)
        document.removeEventListener('selectstart', handleSelectStart)
    };
    },[]);

    return (
        <>
            <Header />
            <BackToTop backToTop={backToTop} />
            {children}
            <Footer showToast={showToast} />
        </>
    )
}

const ClientLayout = ({ children }) => {
    return (
        <AuthProvider>
            <ToastProvider>
                <LayoutContent>{children}</LayoutContent>
            </ToastProvider>
        </AuthProvider>
    )
}

export default ClientLayout;