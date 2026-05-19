'use client'
import './BackToTop.css'

const BackToTop = ({ backToTop }) => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

  return (
    <>
      <div className={`scroll-top ${backToTop ? 'active' : ''}`} onClick={scrollToTop}>
        <span>↑</span>
      </div>
    </>
  )
}

export default BackToTop
