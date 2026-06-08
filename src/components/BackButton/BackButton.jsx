'use client';

import { useRouter } from 'next/navigation';
import './BackButton.css';

export default function BackButton({subCategory}) {
    const router = useRouter();

    const handleBack = () => {
        if (window.history.length > 1) {
            setTimeout(() => router.back(), 0);
        }
        else if (subCategory) {
            router.push(`/?category=${subCategory}`)
        }        
        else {
            router.push('/');
        }
        
    };

    return (
        <button
            className="back-button"
            onClick={handleBack}
            aria-label="Go back"
        >
            <i className="bi bi-arrow-left"></i>
            <span>Back</span>
        </button>
    );
}