'use client'
import { useState } from "react";
import Link from "next/link";
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";
import './CommentSection.css'
import { useRouter } from "next/navigation";


const CommentThread = ({ comment, user, toggleLike, handleDelete }) => {
  return (
    <div className="comment-thread">

      <div className="comment-box">

        <div className="avatar-wrapper">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              comment.profiles?.display_name || "Anonymous"
            )}&background=random&size=64`}
            alt={comment.profiles?.display_name || "Anonymous"}
          />
        </div>

        <div className="comment-content">
          <div className="comment-header">
            <h4>{comment.profiles?.display_name || "Anonymous"}</h4>
            <span className="time">
              {new Date(comment.created_at).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>

          <div className="comment-body">
            <p>{comment.content}</p>
          </div>

          {/* Like & Delete Buttons */}
          <div className="comment-actions">
            <button
              type="button"
              className={`like-btn ${comment.liked ? "liked" : ""}`}
              onClick={() => toggleLike(comment.id)}
            >
              {comment.liked ? <AiFillLike /> : <AiOutlineLike />}
            </button>
            <span className="like-count">{comment.likes}</span>

            {/* Show delete button only for comment owner */}
            {user?.id === comment.user_id && (
              <button
                type="button"
                className="delete-btn"
                onClick={() => handleDelete(comment.id)}
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        </div>
      </div>

      
    </div>
  )
}


const CommentSection = ({ postId, initialComments, slug }) => {
    const { user } = useAuth();
    const router = useRouter();

    const [comments, setComments] = useState(
    (initialComments || []).map(comment => ({
        ...comment,
        likes: comment.comment_likes?.length || 0,
        liked: comment.comment_likes?.some(like => like.user_id === user?.id) || false
    }))
    )
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    //post comment
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!newComment.trim()) return;

      const freshComment = {
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      }

      setLoading(true);

      try {
          const { data, error } = await supabase
              .from("comments")
              .insert(freshComment)
              .select();

          if (error) {
            throw error;
          }
          // fetch comment
          const { data: fullComment, error: fetchError } = await supabase
              .from("comments")
              .select(`
                id,
                content,
                created_at,
                user_id,
                profiles (display_name)
              `)
              .eq("id", data[0].id)
              .single();

          if (fetchError) {
            throw fetchError;
          }

          setComments((prev) => [{...fullComment, likes: 0, liked: false }, ...prev]);

          setNewComment("");
      } 
      catch (error) {
        console.error("Error posting comment:", error.message);
      } 
      finally {
        setLoading(false);
      }
    };
    // toggle like 
    const toggleLike = async (commentId) => {
      if (!user) {
        router.push(`/login?redirect=/post/${slug}`)
        return;
      }
      try {
        const { data: existing } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle()

        if (existing) {
          await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existing.id)

          setComments(prev => prev.map(comment => {
          if (comment.id !== commentId) return comment
          return {
            ...comment,
            liked: false,
            likes:  comment.likes - 1
          }
          }))
        }
        else {
          await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id})

          setComments(prev => prev.map(comment => comment.id !== commentId ? comment : {
            ...comment, liked:true, likes: comment.likes + 1
          }))
        }
      }
      catch (error) {
        console.error('Error toggling like:', error.message)
      }
      
    };
    // Delete comment
    const handleDelete = async (commentId) => {
      
      if (!confirm("Are you sure you want to delete this comment?")) return;

      setLoading(true);

      try {
        const { error } = await supabase
          .from('comments')
          .delete()
          .eq('id', commentId)

        if (error) {
          throw error;
        }

        setComments(prev => prev.filter(c => c.id !== commentId))
      }
      catch (error) {
        console.error('Something went wrong', error.message)
      }
      finally {
        setLoading(false)
      }
  };

  return (
    <section>
      <div className="blog-comment-form">
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="section-header">
              <h3>Share Your Thoughts</h3>
              <p>Share your reflections on this post.</p>
            </div>
            <div className="row">
              <div className="col">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  required
                />
              </div>
              <div className="col">
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
            
          </form>
        ) : (
          <div className="login-prompt">
            <p>Login to leave a comment.</p>

            <Link href={`/login?redirect=/post/${slug}`}>
              Login
            </Link>
          </div>
        )
        }

        <div className="comment-section">
          <h2 className="comments-header">{comments.length} Comment(s)</h2>
          <div className="comment-container">

            { comments.length === 0 ? (
              <p> No comment yet. Be the first to comment!</p>
            ) : (
              <div>
                {comments.map(comment => (
                  <CommentThread 
                    key={comment.id}
                    comment={comment}
                    user={user}
                    toggleLike={toggleLike}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>
            ) } 
          </div>       
              
        </div>

      </div>
    </section>
    
  )
}

export default CommentSection;


