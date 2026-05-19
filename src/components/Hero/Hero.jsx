'use client'
import { useEffect, useState } from 'react';
import './Hero.css';

const Hero = ({ searchTerm, onSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const slides = [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1600',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1600',
  ];

  useEffect(() => {
    const enterTimer = setTimeout(() => setLoaded(true), 80);
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => {
      clearTimeout(enterTimer);
      clearInterval(slideTimer);
    };
  }, []);

  return (
    <section className="hero">

      {/* Sliding background images */}
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide}')` }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className={`container hero-content ${loaded ? 'hero-loaded' : ''}`} >
        <p className="hero-eyebrow" data-aos="fade-down">— A space for everyday believers —</p>

        <h1 className="hero-title" data-aos="zoom-in">Green Pastures</h1>

        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span className="hero-divider-gem">✦</span>
          <span className="hero-divider-line" />
        </div>

        <p className="hero-subtitle">Where faith meets everyday living</p>

        <div className="search-container" data-aos="fade-up">
          <input
            type="text"
            id="search-input"
            value={searchTerm}
            placeholder="Search articles, books, videos..."
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Slide dots */}
      <div className="hero-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
};

export default Hero;