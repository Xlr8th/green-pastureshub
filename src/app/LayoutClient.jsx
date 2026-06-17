'use client'
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import BackToTop from "../components/BackToTop/BackToTop";
import Toast from "../components/Toast/Toast";
import Footer from "../components/Footer/Footer";
import { AuthProvider } from "../lib/AuthContext";

const ClientLayout = ({ children }) => {
    const [backToTop, setBackToTop] = useState(false);
    const [isToastVisible, setIsToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (message) => {
        setToastMessage(message);
        setIsToastVisible(true);

        setTimeout(()=>{
            setToastMessage(null)
            setIsToastVisible(false)
        }, 2500);
    }

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
        <AuthProvider>
          <Header />

            <Toast 
                isVisible={isToastVisible}
                message={toastMessage}
            />
            
            <BackToTop
                backToTop={backToTop} 
            />

            {children}  {/* ← each page renders here */}

            <Footer 
                showToast={showToast}
            />  
        </AuthProvider>
            
        </>
    )
}

export default ClientLayout;