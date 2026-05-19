'use client'

import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function PostViewTracker({ post }) {
  useEffect(() => {
    const trackView = async () => {
      const stored = localStorage.getItem('view_posts')
      const viewedPosts = JSON.parse(stored) || []

      const hasViewed = viewedPosts.includes(post.slug)

      if (!hasViewed) {
        const newViewedPosts = [...viewedPosts, post.slug]

        localStorage.setItem(
          'view_posts',
          JSON.stringify(newViewedPosts)
        )

        const newViewsCount = post.views + 1

        await supabase
          .from('posts')
          .update({ views: newViewsCount })
          .eq('slug', post.slug)
      }
    }

    trackView()
  }, [post])

  return null
}
