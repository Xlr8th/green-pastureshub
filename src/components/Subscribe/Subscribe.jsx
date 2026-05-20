'use client'

import { useState } from 'react'
import './Subscribe.css'

const Subscribe = ({showToast}) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
       
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                showToast(data.error)
            } else {
                showToast(data.message)
                setEmail('')
            }
        } 
        catch (error) {
            showToast('Something went wrong. Please try again.')            
        } 
        finally {
          setLoading(false)  
        }
        
    }

    return (
        <div className="footer-col subscribe" data-aos="fade-up" >
            <h6 className="footer-col-title">Our Newsletter</h6>
            <p>Subscribe to get more information about our service</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='form-control'
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>

        </div>
    )
}
export default Subscribe;
