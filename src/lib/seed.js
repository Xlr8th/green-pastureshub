import { supabase } from './supabase.js'
import { posts } from '../data/posts.js'

const seedPosts = async () => {
    console.log('Seeding posts...')

    const postWithoutId = posts.map(({ id, ...rest }) => rest)
    
    const { data, error } = await supabase
        .from('posts')
        .insert(posts)
    
    if (error) {
        console.error('Error seeding posts:', error)
    } else {
        console.log('Posts seeded successfully!')
    }
}

seedPosts()