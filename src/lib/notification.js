import { supabase } from './supabase'



export const createNotifications = async ({
    commenterUserId,
    postId,
    commentId,
    type,
    parentCommentOwnerId = null
}) => {
    console.log('createNotifications called with:', { commenterUserId, postId, commentId, type, parentCommentOwnerId })
    try {
        // 1. Check if commenter is admin — if yes, skip
        const { data: commenterProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', commenterUserId)
            .single()

        // 2. Fetch all admin IDs
        const { data: admins } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'admin')

        // 3. Build notifications array for admins
        const notifications = [];
        const commenterIsAdmin = commenterProfile?.role === 'admin';

        // Only notify admins if commenter is NOT an admin
        if (!commenterIsAdmin) {
        const adminNotifications = (admins || []).map(admin => ({
            user_id: admin.id,
            triggered_by: commenterUserId,
            post_id: postId,
            comment_id: commentId,
            type: type,
            read: false
        }))
        notifications.push(...adminNotifications)
        }

        // 4. For replies — add root comment owner if eligible
        if (type === 'new_reply' && parentCommentOwnerId) {
            const isAdmin = (admins || []).some(admin => admin.id === parentCommentOwnerId)
            const isSelf = parentCommentOwnerId === commenterUserId

            if (!isAdmin && !isSelf) {
                notifications.push({
                    user_id: parentCommentOwnerId,
                    triggered_by: commenterUserId,
                    post_id: postId,
                    comment_id: commentId,
                    type: type,
                    read: false
                })
            }
        }

        // 5. Insert all notifications
        if (notifications.length > 0) {
            await supabase.from('notifications').insert(notifications)
        }

    } catch (err) {
        console.error('Error creating notifications:', err.message)
    }
}