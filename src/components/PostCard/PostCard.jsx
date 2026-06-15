'use client'
import './PostCard.css'
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';

const PostCard = ({
    id, title, slug, author, category, subCategory,
    excerpt, thumbnail, publishedDate, readTime, views, featured, commentCount
  }) => {
    const { isAdmin } = useAuth()

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
                                {isAdmin && (<span><i className="bi bi-eye icon-faint"></i> {views}</span>)}
                                <span><i className="bi bi-chat icon-muted"></i> {commentCount}</span>
                            </div>
                        </div>
                    )}

                    <button className='read-more-btn'>
                        Read More
                    </button>

                </div>
            </div>  
        </Link>      
    );
};

export default PostCard;

