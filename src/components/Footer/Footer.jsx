'use client'
import Subscribe from '../Subscribe/Subscribe';
import './Footer.css';
import Link from 'next/link';

const Footer = ({ onScrollToSection, showToast }) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
            <a href="#" className="footer-social-link" aria-label="Twitter / X">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" className="footer-social-link" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="footer-social-link" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col" data-aos="fade-up">
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link href = "/">Home</Link></li>
            <li><button onClick={() => scrollTo('about')}>About</button></li>
            <li><button onClick={() => scrollTo('category')}>Categories</button></li>
            <li><button>Subscribe</button></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col" data-aos="fade-up">
          <h3 className="footer-col-title">Categories</h3>
          <ul className="footer-links">
            <li><button onClick={() => scrollTo('category')}>Word</button></li>
            <li><button onClick={() => scrollTo('category')}>Parenting</button></li>
            <li><button onClick={() => scrollTo('category')}>Marriage</button></li>
            <li><button onClick={() => scrollTo('category')}>Lifestyle</button></li>
          </ul>
        </div>

        {/* Scripture */}
        <Subscribe 
          showToast={showToast}
        />
        {/* <div className="footer-col footer-scripture-col" data-aos="fade-up">
          <h3 className="footer-col-title">A Word</h3>
          <blockquote className="footer-scripture">
            <p>
              "He makes me lie down in green pastures. He leads me beside still waters.
              He restores my soul."
            </p>
            <cite>— Psalm 23:2–3</cite>
          </blockquote>
        </div> */}

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