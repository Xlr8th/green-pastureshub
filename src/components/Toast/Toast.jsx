'use client'
import { useEffect, useState } from 'react';
import './Toast.css'


const Toast = ({message, type = 'error', duration = 4000, onClose}) => {

  const [visible, setVisible] = useState(!!message)
 
  useEffect(() => {
    if (!message) return

    setVisible(true)
    const timer = setTimeout(() => {
        setVisible(false)
        onClose?.()
    }, duration)

    return () => clearTimeout(timer)

  }, [message, duration, onClose])

  if (!message || !visible) return null;
  return (
    <div className={`toast toast-${type}`} role="alert"> 
        {message}     
    </div>
  )
}

export default Toast;
