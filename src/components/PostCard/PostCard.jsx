'use client'
import './PostCard.css'
import Link from 'next/link';

const PostCard = ({
    id, title, slug, author, category, subCategory,
    excerpt, thumbnail, publishedDate, price, duration,
    readTime, views, rating, featured,
    onViewPost, onAddToCart
  }) => {

  // Button text based on category
  const buttonText = {
      article: 'Read More',
      book: '🛒 Add to Cart',
      video: '▶️ Watch Now',
      audio: '🎧 Listen Now'
  };

  // Handle button click
  const handleActionClick = (e) => {
      e.stopPropagation();
      if (category === 'book') {
          onAddToCart(id);
      } else {
        onViewPost(slug);
      }
  };

  return (
        <Link href={`/post/${slug}`} style={{ textDecoration: 'none',
        color: 'inherit',
        display: 'block' }}>
            <div className="post-card" data-aos="fade-up">

                {/* Thumbnail */}
                <div className="post-thumbnail-wrapper">
                    {featured && (
                        <span className="featured-badge">Featured</span>
                    )}
                    <img
                        src={thumbnail}
                        alt={title}
                        className="post-thumbnail"
                    />
                    {subCategory && (
                        <span className="subcategory-badge">{subCategory}</span>
                    )}
                    {(category === 'video' || category === 'audio') && (
                        <span className="duration-badge">⏱️ {duration}</span>
                    )}
                </div>

                {/* Content */}
                <div className="post-content">
                    <span className={`post-category ${category}`}>
                        {category}
                    </span>

                    <h3 className="post-title">{title}</h3>

                    <div className="post-meta">
                        <span className="post-author"><i className="bi bi-person-circle icon-primary"></i> {author}</span>
                        <span className="post-date"><i className="bi bi-calendar-event icon-secondary"></i> {publishedDate}</span>
                    </div>

                    <p className="post-excerpt">{excerpt}</p>

                    {/* Category specific footer */}
                    {category === 'article' && (
                        <div className="post-footer">
                            <div className="post-stats">
                                <span><i className="bi bi-clock icon-muted"></i> {readTime} min</span>
                                <span><i className="bi bi-eye icon-faint"></i> {views}</span>
                            </div>
                        </div>
                    )}

                    {category === 'book' && (
                        <div className="post-footer">
                            <div className="book-price">
                                ₦{price?.toLocaleString()}
                            </div>
                            <div className="book-rating">
                                ⭐ {rating} / 5.0
                            </div>
                        </div>
                    )}

                    {(category === 'video' || category === 'audio') && (
                        <div className="post-footer">
                            <div className="post-stats">
                                <span>👁 {views?.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Action button */}
                    <button
                        className={category === 'book'
                            ? 'add-to-cart-btn'
                            : 'read-more-btn'
                        }
                        onClick={handleActionClick}
                    >
                        {buttonText[category]}
                    </button>

                </div>
            </div>  
        </Link>      
    );
};

export default PostCard;

