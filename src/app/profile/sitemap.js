import { supabase } from '../../lib/supabase';

export default async function sitemap() {
  const baseUrl = 'https://greenpastureshub.com';

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, publishedDate');

  const postUrls = posts?.map((post) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...postUrls,
  ];
}