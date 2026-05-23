import Home from '../components/HomeClient'
import { supabase } from '../lib/supabase'

export const dynamic = 'force-dynamic'

const page = async () => {
  const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .order('publishedDate', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }
  return (
    <>
      <Home posts={posts || []} />
    </>
  )
}

export default page
