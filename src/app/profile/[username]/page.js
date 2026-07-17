import ProfileClient from "../../../components/ProfileClient";
import { supabase } from "../../../lib/supabase";

const Page = async ({params}) => {
    
    const {username} = await params;
    const decoded = decodeURIComponent(username)
    const {data: profile, error} = await supabase
    .from('profiles')
    .select('*')
    .eq('display_name', decoded)
    .single()

    if (error || !profile) {
        return <h1>Profile not found</h1>
    }

    const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select(`
        id,
        content,
        created_at,
        posts(title, slug, excerpt)
    `)
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

    if (commentsError) {
        console.error('Error fetching comments:', commentsError.message)
    }

    const isProfileAdmin = profile.role === 'admin';

    const { data: posts , error: postsError } = await supabase
    .from('posts')
    .select('*')
    .order('publishedDate', { ascending: false })

    if (postsError) {
        console.error('Error fetching posts:', postsError.message)
    }

    const { data: subscribers, error: subscribersError } = isProfileAdmin ? await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', {ascending: false})
    : {data:[]}

    if(subscribersError) {
        console.error('Error fetching subscribers:', subscribersError.message)
    };

    
    return (
    <ProfileClient 
      profile={profile}
      comments={comments}
      subscribers={subscribers}
      posts={posts}
    />
  );
}

export default Page;