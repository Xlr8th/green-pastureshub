'use client'
import { createContext, useContext, useState } from 'react'
import Toast from '../components/Toast/Toast'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState(null)
    const [toastType, setToastType] = useState('error')

    const showToast = (message, type = 'error') => {
        setToastMessage(message)
        setToastType(type)
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage(null)}
            />
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)