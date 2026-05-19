'use client'
import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import BackToTop from "../components/BackToTop/BackToTop";

const ClientLayout = ({ children }) => {
    const [backToTop, setBackToTop] = useState(false);

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
            <BackToTop
                backToTop={backToTop} 
            />
            {children}  {/* ← each page renders here */}
        </>
    )
}

export default ClientLayout;