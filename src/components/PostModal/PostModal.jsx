'use client'
import './PostModal.css'

const PostModal = ({post, onClose, isOpen, onAddToCart}) => {
  if (!post)return null;
  const { id, title, author, category, publishedDate, readTime, views, thumbnail, content, tags, price, rating, pages, inStock, duration, videoUrl, excerpt, audioUrl } = post;

  const formatCurrency = (number) => `₦${(number ?? 0).toLocaleString('en-NG')}`

  const handleClick = (e) => {
    onAddToCart(id);
    e.stopPropagation();
  };

  const renderTags = () => (tags?.map(tag => (
    <span key={tag} className="post-view-tag">#{tag}</span>
  )));
    
  return (
    <div>
      {/* Modal only renders when isOpen is true */}
      {isOpen && post && (
        <div className="post-modal active">
          {/* Clicking overlay closes modal */}
          <div
            className="post-modal-overlay"
            onClick={onClose}
          />
          <div className="post-modal-content">
            {/* Close button */}
            <button
              className="post-modal-close"
              onClick={onClose}
            >
              ×
            </button>
            <div id="post-modal-body">

              {post.category === 'article' && 
              <div>
                <div className="post-view-header">
                  <span className={`post-view-category ${category}`}><i className="bi bi-journal-text "></i> {category}</span>
                  <h1 className="post-view-title">
                    {title}
                  </h1>
                  
                  <div className="post-view-meta">
                    <div className="post-view-meta-item">
                      <span><i className="bi bi-person-circle icon-primary"></i></span>
                      <span>{author}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span><i className="bi bi-calendar-event icon-secondary"></i></span>
                      <span>{publishedDate}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span><i className="bi bi-clock icon-muted"></i></span>
                      <span>{readTime} min read</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span><i className="bi bi-eye icon-faint"></i></span>
                      <span>{views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
        
                <img src={thumbnail} alt={title} className="post-view-thumbnail" />
                
                <div className="post-view-content" dangerouslySetInnerHTML={{__html: content}}></div>
                
                <div className="post-view-tags">
                  {renderTags()}
                </div>
              </div>
              }
              {post.category === 'book' &&
              <div>
                <div className="post-view-header">
                  <span className={`post-view-category ${category}`}>📚 {category}</span>
                  <h1 className="post-view-title">{title}</h1>
                  
                  <div className="post-view-meta">
                    <div className="post-view-meta-item">
                      <span>✍️</span>
                      <span>{author}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>📅</span>
                      <span>{publishedDate}</span>
                    </div>
                  </div>
                </div>
            
                <img src={thumbnail} alt={title} className="post-view-thumbnail" />
                
                <div className="book-view-info">
                  <div className="book-view-price-section">
                    <div className="book-view-price">{formatCurrency(price)}</div>
                    <div className="book-view-rating">⭐ {rating} / 5.0</div>
                  </div>
                  
                  <div className="book-view-details">
                    <div className="book-view-detail">
                      <div className="book-view-detail-label">Pages</div>
                      <div className="book-view-detail-value">{pages}</div>
                    </div>
                    <div className="book-view-detail">
                      <div className="book-view-detail-label">Author</div>
                      <div className="book-view-detail-value">{author}</div>
                    </div>
                    <div className="book-view-detail">
                      <div className="book-view-detail-label">Availability</div>
                      <div className="book-view-detail-value">{inStock ? '✅ In Stock' : '❌ Out of Stock'}</div>
                    </div>
                  </div>
                  
                  <div className="book-view-actions">
                    <button className="book-buy-btn" onClick={handleClick}>
                      🛒 Add to Cart - {formatCurrency(price)}
                    </button>
                  </div>
                </div>
                
                <div className="post-view-content" dangerouslySetInnerHTML={{__html: content}}></div>
                
                <div className="post-view-tags">
                  {renderTags()}
                </div>
              </div>
              }
              {post.category === 'video' &&
              <div>
                <div className="post-view-header">
                  <span className={`post-view-category ${category}`}>🎥 {category}</span>
                  <h1 className="post-view-title">{title}</h1>
                    
                  <div className="post-view-meta">
                    <div className="post-view-meta-item">
                      <span>👤</span>
                      <span>{author}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>📅</span>
                      <span>{publishedDate}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>⏱</span>
                      <span>{duration}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>👁</span>
                      <span>{views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
                
                <iframe 
                  className="video-player" 
                  src={videoUrl} 
                  frameBorder={0} 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
                
                <div className="post-view-content" >
                  <p>{excerpt}</p>
                </div>
                
                <div className="post-view-tags">
                  {renderTags()}
                </div>
              </div>
              }
              {post.category === 'audio' && 
              <div>
                <div className="post-view-header">
                  <span className={`post-view-category ${category}`}>🎧 {category}</span>
                  <h1 className="post-view-title">{title}</h1>
                    
                  <div className="post-view-meta">
                    <div className="post-view-meta-item">
                      <span>👤</span>
                      <span>{author}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>📅</span>
                      <span>{publishedDate}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>⏱</span>
                      <span>{duration}</span>
                    </div>
                    <div className="post-view-meta-item">
                      <span>👁</span>
                      <span>{views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
                
                <img src={thumbnail} alt={title} className="post-view-thumbnail" />
                
                <audio className="audio-player" controls>
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                
                <div className="post-view-content" >
                  <p>{excerpt}</p>
                </div>
                
                <div className="post-view-tags">
                  {renderTags()}
                </div>
              </div>
              }
            </div>           

          </div>

        </div>
      )}
      
    </div>
  );
};

export default PostModal
