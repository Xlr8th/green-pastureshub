import Home from '../components/HomeClient'
import { supabase } from '../lib/supabase'

export const dynamic = 'force-dynamic'

const page = async () => {
  const { data: posts, error } = await supabase
  .from('posts')
  .select('*, comments(count)')
  .order('publishedDate', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const postsWithCount = posts?.map(post => ({ ...post,
    commentCount: post.comments?.[0]?.count || 0 })
  )
  return (
    <>
      <Home posts={postsWithCount || []} />
    </>
  )
}

export default page
