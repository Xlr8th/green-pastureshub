'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import './Notification.css'


const NotificationBell = ({ user, instanceId = 'default' }) => {
    const [notifications, setNotifications] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const dropdownRef = useRef(null)

    useEffect(() => {
        if (!user) return

        const channelName = `notifications-${user.id}-${instanceId}`

        // Remove any existing channel with this name first
        supabase.removeChannel(supabase.channel(channelName))

        // Fetch unread notifications
        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('id, type, post_id, created_at, read, posts(slug)')
                .eq('user_id', user.id)
                .eq('read', false)
                .order('created_at', { ascending: false })

            if (!error) {
                setNotifications(data || [])
            }
        }

        fetchNotifications()
        // Realtime listener
        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    setNotifications(prev => [payload.new, ...prev])
                }
            )
            .subscribe()
        // Close dropdown when clicking outside
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            supabase.removeChannel(channel)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [user?.id, instanceId])

    const markAllRead = async () => {
        if (!notifications.length) return

        const ids = notifications.map(n => n.id)

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .in('id', ids)
            .eq('user_id', user.id)
            .eq('read', false)

        if (!error) {
            setNotifications([])
        }
    }

    const handleOpen = () => {
        setIsOpen(prev => !prev)
        if (!isOpen && notifications.length > 0) {
            markAllRead()
        }
    }

    const getNotificationText = (type) => {
        if (type === 'new_comment') return 'Someone commented on a post'
        if (type === 'new_reply') return 'Someone replied to your comment'
        return 'New notification'
    }



    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button
                className="bell-btn"
                onClick={handleOpen}
                aria-label="Notifications"
            >
                <i className="bi bi-bell"></i>
                {notifications.length > 0 && (
                    <span className="bell-badge">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="notification-empty">No new notifications</p>
                    ) : (
                         <ul className="notification-list">
                            {notifications.map(notification => (
                                <li
                                    key={notification.id}
                                    className="notification-item"
                                    onClick={() => {
                                        router.push(`/post/${notification.posts?.slug}`)
                                        setIsOpen(false)
                                    }}
                                >
                                    <p>{getNotificationText(notification.type)}</p>
                                    <span className="notification-time">
                                        {new Date(notification.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationBell;