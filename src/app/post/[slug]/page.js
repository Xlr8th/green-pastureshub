import { supabase } from "../../../lib/supabase";
import PostViewTracker from "../PostViewTracker";
import './post.css'

export async function generateMetadata({ params }) {
    const { slug } = await params

    const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single()

    return {
        title: post?.title,
        description: post?.excerpt
    }
}

const page = async ({ params }) => {
    const { slug } = await params
    
    const { data: post, error } = await supabase
    .from('posts')
    .select("*")
    .eq('slug', slug)
    .single()

    if (error || !post) {
        return <h1>Post not found</h1>
    }
    const { title, author, category, publishedDate, readTime, views, thumbnail, content, tags } = post;

  const renderTags = () => (tags?.map(tag => (
        <span key={tag} className="post-view-tag">#{tag}</span>
    )));

  return (
    <main className="page-post">
        <PostViewTracker post={post} />
      
        <article className="post-page-container">
            
                
            <header className="post-view-header">
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
            </header>
    
            <img src={thumbnail} alt={title} className="post-view-thumbnail" />
            
            <section className="post-view-content" dangerouslySetInnerHTML={{__html: content}} />
            
            <footer className="post-view-tags">
                {renderTags()}
            </footer>
                
                       
        </article>
      
    </main>
  )
}

export default page
