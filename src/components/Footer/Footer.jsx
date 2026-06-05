'use client'
import Subscribe from '../Subscribe/Subscribe';
import './Footer.css';
import Link from 'next/link';

const Footer = ({ showToast }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      {/* Main grid */}
      <div className="container footer-grid">

        {/* Brand column */}
        <div className="footer-brand" data-aos="fade-up">
          <img src='/image/footerLogo.png' alt="Green Pastures logo" />
          <p className="footer-tagline">Nourishing Faith. Growing Lives.</p>
          <p className="footer-description">
            A space for everyday believers walking with God, growing in His Word,
            and living out faith in real, practical ways.
          </p>

          {/* Social links */}
          <div className="footer-social">
            <a href="https://x.com/edith_oise" className="footer-social-link" aria-label="Twitter / X">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.facebook.com/share/1D6T413E4a/" className="footer-social-link" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/edithoise?igsh=NTVldDhreGYzbmpy" className="footer-social-link" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col" data-aos="fade-up">
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link href = "/">Home</Link></li>
            <li><Link href="/#about">About</Link></li>
            <li><Link href="/#category">Categories</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col" data-aos="fade-up">
          <h3 className="footer-col-title">Categories</h3>
          <ul className="footer-links">
            <li>
              <Link href="/?category=word#category">
                Word
              </Link>
            </li>
            <li>
              <Link href="/?category=parenting#category">
                Parenting
              </Link>
            </li>
            <li>
              <Link href="/?category=relationships#category">
                Relationships
              </Link>
            </li>
            <li>
              <Link href="/?category=lifestyle#category">
                Lifestyle
              </Link>
            </li>
          </ul>
        </div>

        {/* Scripture */}
        
        <div className="footer-col footer-scripture-col" data-aos="fade-up">
          <h3 className="footer-col-title">A Word</h3>
          <blockquote className="footer-scripture">
            <p>
              "He makes me lie down in green pastures. He leads me beside still waters.
              He restores my soul."
            </p>
            <cite>— Psalm 23:2–3</cite>
          </blockquote>
        </div> 

       
        <Subscribe 
          showToast={showToast}
        />
      
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            &copy; {currentYear} Green Pastures. All rights reserved.
          </p>
          <p className="footer-credit">
            Designed by{' '}
            <span className="footer-designer">GEORGE</span>
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;