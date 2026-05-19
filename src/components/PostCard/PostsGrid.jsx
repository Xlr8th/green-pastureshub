import PostCard from './PostCard';
import './PostCard.css'

const PostsGrid = ({ posts, onViewPost, onAddToCart }) => {
  return (
    <main className="main">
      <div className="container">

        {/* Empty state */}
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts found</h3>
            <p>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard
                key={post.id}
                {...post}
                onViewPost={onViewPost}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default PostsGrid;
