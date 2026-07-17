import { supabase } from "../../../lib/supabase";
import PostViewTracker from "../PostViewTracker";
import CommentSection from "../../../components/Comment/CommentSection";
import './post.css'
import BackButton from "../../../components/BackButton/BackButton";
import AdminViews from "../../../components/AdminViews";

export async function generateMetadata({ params }) {
    const { slug } = await params

    const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, thumbnail')
    .eq('slug', slug)
    .single()

    return {
        title: post?.title,
        description: post?.excerpt,
        openGraph: {
            images: post?.thumbnail ? [post.thumbnail] : [],
        }
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
    const { title, author, category, publishedDate, readTime, views, thumbnail, content, tags, subCategory } = post;

  const renderTags = () => (tags?.map(tag => (
        <span key={tag} className="post-view-tag">#{tag}</span>
    )));

    const { data: initialComments } = await supabase
    .from('comments')
    .select(`
        id,
        content,
        created_at,
        user_id,
        parent_id,
        profiles (display_name, role),
        comment_likes (id, user_id)
    `)
    .eq('post_id', post.id)
    .order('created_at', { ascending: false });

    const commentCount= initialComments?.length || 0;

  return (
    <main className="page-post">
        <PostViewTracker post={post} />
        
      
        <article className="post-page-container">
            <BackButton
                category={subCategory}
            />
                
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
                    <AdminViews views={views} />
                    <div className="post-view-meta-item">
                        <span><i className="bi bi-chat icon-muted"></i> {commentCount} comment(s)</span>
                    </div>
                </div>
            </header>
    
            <img src={thumbnail} alt={title} className="post-view-thumbnail" />
            
            <section className="post-view-content" dangerouslySetInnerHTML={{__html: content}} />
            
            <footer className="post-view-tags">
                {renderTags()}
            </footer>
            <CommentSection
                postId={post.id}
                slug={slug}
                initialComments={initialComments || []}
            />
                
                       
        </article>
        
      
    </main>
  )
}

export default page
