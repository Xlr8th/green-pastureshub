'use client'
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import BackToTop from "../components/BackToTop/BackToTop";
import Toast from "../components/Toast/Toast";
import Footer from "../components/Footer/Footer";

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
    };
    },[]);

    return (
        <>
            <Header />

            <Toast 
                isVisble={isToastVisible}
                message={toastMessage}
            />
            
            <BackToTop
                backToTop={backToTop} 
            />
            {children}  {/* ← each page renders here */}
            <Footer 
                showToast={showToast}
            />
        </>
    )
}

export default ClientLayout;