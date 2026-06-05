'use client'
import { useState } from 'react';
import './Header.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

const Header = () => {
  const router = useRouter();

  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(prev => !prev);

  const closeMenu = () => setIsOpen(false);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    router.push('/');
  };

  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">

          <div className="logo">
            <Link href ="/" onClick={closeMenu}>
              <img src='/image/logo.png' alt="Green Pastures logo" />
            </Link>
          </div>

          {/* Hamburger sits OUTSIDE nav so it always shows on mobile */}
          <button
            className={`hamburger ${isOpen ? 'hamburger-open' : ''}`}
            onClick={onToggle}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* nav gets the 'nav-open' class when isOpen is true */}
          <nav className={`nav ${isOpen ? 'nav-open' : ''}`}>
            <ul>
              <li><Link href="/" onClick={closeMenu}>Home</Link></li>
              <li><Link href="/#about" onClick={closeMenu}>About</Link></li>
              <li><Link href="/#category" onClick={closeMenu}>Categories</Link></li>
              <li><Link href="/#subscribe" onClick={closeMenu}>Subscribe</Link></li>
            </ul>
            <div className="header-actions">
              <div className="header-social-links">
                <a href="https://x.com/edith_oise" className="twitter link" aria-label="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="https://www.facebook.com/share/1D6T413E4a/" className="facebook link" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/edithoise?igsh=NTVldDhreGYzbmpy" className="instagram link" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>

              <div className="header-auth">
                {user ? (
                  <>
                    <span className="user-email">
                      {user.email.split('@')[0]}
                    </span>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href='/login' className='login-btn' onClick={closeMenu}>Login</Link>
                )}
              </div>
            </div>            
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;