'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { FaChevronDown, FaChevronUp, FaTrashAlt, FaReply } from 'react-icons/fa';
import { useAuth } from "../../lib/AuthContext";
import { supabase } from "../../lib/supabase";
import './CommentSection.css'
import { useRouter } from "next/navigation";
import { createNotifications } from "../../lib/notification";


// _____helpers_______


const buildTree = (flat, userId) => {
  const map = {};
  const roots = [];

  // First pass — index every comment
  flat.forEach((comment) => {
    map[comment.id] = {
      ...comment,
      likes: comment.comment_likes?.length || 0,
      liked: comment.comment_likes?.some((like) => like.user_id === userId) || false,
      replies: [],
    };
  });

  // Second pass — wire up parent → child
  flat.forEach((comment) => {
    if (comment.parent_id && map[comment.parent_id]) {
      map[comment.parent_id].replies.push(map[comment.id]);
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
};

const formatDate = (ts) => new Date(ts).toLocaleString('en-US', {dateStyle: 'medium', timeStyle: 'short'});


const CommentThread = ({slug, comment, user, toggleLike, handleDelete, handleReply, replyingTo, setReplyingTo, depth = 0, likingIds }) => {
  const { isAdmin } = useAuth()
  const admin = isAdmin
  const [replyText, setReplyText] = useState('');
  const [repliesOpen, setRepliesOpen] = useState(true);
  const [posting, setPosting] = useState(false);

  const router = useRouter();
  const canDelete = user?.id === comment.user_id || admin;
  const hasReplies = comment.replies?.length > 0;

  const submitReply = async () => {
    console.log('submitReply called', comment.id, comment.user_id)
    if (!replyText.trim()) return;
    setPosting(true);
    await handleReply(comment.id, replyText.trim(), comment.user_id);
    setReplyText('');
    setReplyingTo(null);
    setPosting(false);
    setRepliesOpen(true); // expand so new reply is vidible

  };

  const onReplyClick = () => {
    if (!user) {
      router.push(`/login?redirect=/post/${slug}`);
      return;
    }
    if (replyingTo === comment.id) {
      setReplyingTo(null);
    }
    else {
      setReplyingTo(comment.id);
    }
  };

  return (
    <div className={`comment-thread ${depth > 0 ? "comment-thread-reply" : ""}`}>

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
            <h4>
              {comment.profiles?.display_name || "Anonymous"}
              {comment.profiles?.role === 'admin' && (
                <span className="admin-badge">Admin</span>
              )}
            </h4>
            <span className="time">
              {formatDate(comment.created_at)}
            </span>
          </div>

          <div className="comment-body">
            <p>{comment.content}</p>
          </div>

          {/* Actions */}
          <div className="comment-actions">
            {/* Like */}
            <button
              type="button"
              className={`like-btn ${comment.liked ? "liked" : ""}`}
              onClick={() => toggleLike(comment.id)}
              disabled={likingIds.has(comment.id)}
            >
              {comment.liked ? <AiFillLike /> : <AiOutlineLike />}
            </button>
            <span className="like-count">{comment.likes}</span>

            {/* Reply — only on root comments to keep nesting shallow */}
            {depth === 0 && (
              <button
                type="button"
                className={`reply-btn ${replyingTo === comment.id ? "active" : ""}`}
                onClick={onReplyClick}
                aria-label="Reply"
              >
                <FaReply /> <span>Reply</span>
              </button>
            )}

            {/* Show delete button for comment owner and admin */}
            {canDelete && (
              <button
                type="button"
                className={`delete-btn ${admin && user?.id !== comment.user_id ? 'delete-btn-admin' : ''}`}
                onClick={() => handleDelete(comment.id)}
                aria-label="Delete"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
          {/* Inline reply form */}
          {replyingTo === comment.id && (
            <div className="reply_form">
              <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to ${comment.profiles?.display_name || 'Anonymous'}...`}
              rows={3}
              autoFocus
              />
              <div className="reply-form-actions">
                <button
                  type="button"
                  className="btn-submit btn-submit-sm"
                  onClick={submitReply}
                  disabled={posting || !replyText.trim()}
                >
                  {posting ? 'Posting...' : 'Post Reply'}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => { setReplyingTo(null); setReplyText(''); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {hasReplies && (
        <div className="replies-wrapper">
          <button
            type="button"
            className="toggle-replies-btn"
            onClick={() => setRepliesOpen((open) => !open)}
          >
            {repliesOpen ? <FaChevronUp /> : <FaChevronDown />}
            {repliesOpen ? 'Hide ' : 'Show '}
            {comment.replies.length}
            {comment.replies.length === 1 ? ' reply' : ' replies'}
          </button>

          {repliesOpen && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <CommentThread 
                  key={reply.id}
                  comment={reply}
                  user={user}
                  slug={slug}
                  toggleLike={toggleLike}
                  handleDelete={handleDelete}
                  handleReply={handleReply}
                  depth={depth + 1}
                  replyingTo={replyingTo}
                  setReplyingTo={setReplyingTo}
                  likingIds={likingIds}
                />
              ))}
            </div>
          )}
        </div>
      )}      
    </div>
  );
};


const CommentSection = ({ postId, initialComments, slug }) => {
    const { user } = useAuth();
    const router = useRouter();

    const [commentTree, setCommentTree] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [likingIds, setLikingIds] = useState(new Set());

    useEffect(() => {
      setCommentTree(buildTree(initialComments, user?.id));
    }, [initialComments, user?.id]);


    // ____Helpers_____________________________

    //  Recursively update a single comment in the tree
    const updateNodeInTree = (nodes, commentId, updater) =>
    nodes.map((n) => {
      // DOOR CHECK — is this the comment we're looking for?
      if (n.id === commentId) {
        return updater(n)  // found it — apply the update and return
      }
      // FLOOR CHECK — does this comment have replies (a next floor)?
      if (n.replies?.length) {
        return { 
          ...n,  // keep everything about this comment the same
          replies: updateNodeInTree(n.replies, commentId, updater) // go deeper
        }
      }
      // DEAD END — not the target, no replies — return unchanged
      return n
    });

    const removeNodeFromTree = (nodes, commentId) =>
    nodes.filter((n) => n.id !== commentId)  // remove if this is the target
      .map((n) => ({
        ...n,
        replies: n.replies?.length ? removeNodeFromTree(n.replies, commentId) : [],  // go deeper into survivors
      }))

    // append a reply under its parent in the tree
    const appendReplyInTree = (nodes, parentId, newReply) =>
    nodes.map((n) => {
      if (n.id === parentId) {
        return { ...n, replies: [...(n.replies || []), newReply] }
      }
      if (n.replies?.length) {
        return { ...n, replies: appendReplyInTree(n.replies, parentId, newReply) }
      }
      return n
    })

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
                parent_id,
                profiles (display_name)
              `)
              .eq("id", data[0].id)
              .single();

          if (fetchError) {
            throw fetchError;
          }

          setCommentTree((prev) => [{...fullComment, likes: 0, liked: false, replies:[] }, ...prev]);

          setNewComment("");
          await createNotifications({
            commenterUserId: user.id,
            postId,
            commentId: data[0].id,
            type: 'new_comment'
          })
      } 
      catch (error) {
        console.error("Error posting comment:", error.message);
      } 
      finally {
        setLoading(false);
      }
      
    };

    // ------ Post a reply --------
    const handleReply = async (parentId, replyText, parentCommentOwnerId) => {
      if (!replyText.trim()) return;

      const freshReply = {
        post_id: postId,
        user_id: user.id,
        content: replyText,
        parent_id: parentId
      }
      setLoading(true)

      try {
        const { data, error } = await supabase
        .from('comments')
        .insert(freshReply)
        .select();

        if(error) throw error;

        const { data: fullReply, error: fetchError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          parent_id,
          profiles (display_name)
        `)
        .eq('id', data[0].id)
        .single();

        if (fetchError) throw fetchError;

        const node = { ...fullReply, likes: 0, liked: false, replies: [] };

        setCommentTree((prev) => appendReplyInTree(prev, parentId, node));

        console.log('createNotifications params:', {
            commenterUserId: user.id,
            postId,
            commentId: data[0].id,
            type: 'new_reply',
            parentCommentOwnerId
        })

        await createNotifications({
            commenterUserId: user.id,
            postId,
            commentId: data[0].id,
            type: 'new_reply',
            parentCommentOwnerId
        })

        }
        catch (err) {
          console.error("Error posting reply:", err.message);
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
        // Prevent double-clicks while this comment is processing
        if (likingIds.has(commentId)) return;

        setLikingIds(prev => new Set(prev).add(commentId));
      try {
        const { data: existing, error } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .maybeSingle()

        if (error) throw error;

        if (existing) {
          const { error: deleteError } = await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existing.id)

          if(deleteError) throw deleteError;

          setCommentTree( prev => updateNodeInTree(prev, commentId, (n) => ({
            ...n,
            liked: false,
            likes: Math.max(0, n.likes - 1),
          })));

        }
        else {
          const { error: insertError } = await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id});

          if (insertError) throw insertError;

          setCommentTree((prev) =>
          updateNodeInTree(prev, commentId, (n) => ({
            ...n,
            liked: true,
            likes: n.likes + 1,
          }))
        );
        }
      }
      catch (error) {
        console.error('Error toggling like:', error.message)
      }
      finally {
        setLikingIds(prev => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
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

        setCommentTree((prev) => removeNodeFromTree(prev, commentId));
      }
      catch (error) {
        console.error('Error deleting comment', error.message)
      }
      finally {
        setLoading(false)
      }
    };
  // ── Count all comments (including replies) for the header ─────────────────

  const countAll = (nodes) =>
    nodes.reduce((sum, n) => sum + 1 + countAll(n.replies || []), 0);

  const totalCount = countAll(commentTree);

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
          <h2 className="comments-header">
            {totalCount} {totalCount <= 1 ? "Comment" : "Comments"}
          </h2>
          <div className="comment-container">

            { commentTree.length === 0 ? (
              <p> No comment yet. Be the first to comment!</p>
            ) : (
              <div>
                {commentTree.map(comment => (
                  <CommentThread 
                    key={comment.id}
                    comment={comment}
                    user={user}
                    slug={slug}
                    toggleLike={toggleLike}
                    handleDelete={handleDelete}
                    handleReply={handleReply}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    depth={0}
                    likingIds={likingIds}
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


