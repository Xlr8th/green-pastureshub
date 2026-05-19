'use client'
import { useState } from 'react';
import './Header.css';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => setIsOpen(prev => !prev);

  const closeMenu = () => setIsOpen(false);

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
              <li><Link href="/" onClick={closeMenu}>About</Link></li>
              <li><Link href="/" onClick={closeMenu}>Categories</Link></li>
              <li><Link href="" onClick={closeMenu}>Subscribe</Link></li>
            </ul>

            <div className="header-social-links">
              <a href="#" className="twitter link" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="facebook link" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="instagram link" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="linkedin link" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;