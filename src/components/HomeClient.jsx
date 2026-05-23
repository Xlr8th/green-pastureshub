'use client'
import { useState } from "react";
import FilterBar from "./Filters/FilterBar";
import Hero from "./Hero/Hero";
import PostsGrid from "./PostCard/PostsGrid";
import Welcome from "./Welcome/Welcome";

const Home = ({ posts: initialPosts }) => {
    //states
    const [posts, setPosts] = useState(initialPosts)
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSort, setCurrentSort] = useState('newest');
    const [currentSubCategory, setCurrentSubCategory] = useState('all');
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [selectedPost, setSelectedPost] = useState(null);

    const getPostBySubCategory = (currentSubCategory, posts) => currentSubCategory === 'all' ? posts : posts.filter(post => post.subCategory === currentSubCategory);

    const searchPost = (searchTerm, posts) => {
        const term = searchTerm.toLowerCase().trim();

        if(term === '') return posts;

        return posts.filter(({title, excerpt, author, tags}) => title.toLowerCase().includes(term) || excerpt.toLowerCase().includes(term) || author.toLowerCase().includes(term) || tags.some(tag => tag.toLowerCase().includes(term)));
    };

    const sortPosts = (posts, currentSort) => {
        const copyPosts = [...posts];

        if (currentSort === 'newest') return copyPosts.sort((a,b) => new Date(b.publishedDate) - new Date(a.publishedDate));

        else if ( currentSort === 'oldest') return copyPosts.sort((a,b) => new Date(a.publishedDate) - new Date(b.publishedDate));

        else if (currentSort === 'popular') return copyPosts.sort((a,b) => b.views - a.views );

        else if (currentSort === 'title') return copyPosts.sort((a,b) => a.title.localeCompare(b.title));

        else return copyPosts;

    };

    //derived data

    const filteredPosts = (() => {
        let result = posts;

        result = getPostBySubCategory(currentSubCategory, result);

        result = searchPost(searchTerm, result);
        
        result = sortPosts(result, currentSort);


        return result;
    })(); 

       
    //modal function
    // const openPost = async (slug) => {
    //     const post = posts.find(post => post.slug === slug);
    //     if (!post) {
    //         return;
    //     }

    //     const stored = localStorage.getItem('view_posts');
    //     const viewedPosts = JSON.parse(stored) || [];

    //     const hasViewed = viewedPosts.includes(slug);
    //     if(!hasViewed) {
    //         const updatedPosts = posts.map(p => p.slug === slug ? { ...p, views: p.views + 1 } : p );

    //         setPosts(updatedPosts);

    //         const newViewedPosts = [...viewedPosts, slug];

    //         localStorage.setItem('view_posts', JSON.stringify(newViewedPosts));
            
    //         const newViewsCount = post.views + 1;

    //         await supabase
    //         .from('posts')
    //         .update({ views: newViewsCount })
    //         .eq('slug', slug)
    //     }

    //     setSelectedPost(post);
    //     setIsModalOpen(true);
    // };

    // const closePost = () => {
    //     setIsModalOpen(false);
    //     setSelectedPost(null);
    // };
    
    //filter functions
    const handleSearch = (value) => {
        setSearchTerm(value)
    };

    const handleSort = (value) => {
        setCurrentSort(value);
    };

    const handleSubCategory = (subCategory) => {
        setCurrentSubCategory(subCategory);
    };

    return (
        <>
            
            {/* <PostModal
                post={selectedPost}
                isOpen={isModalOpen}
                onClose={closePost}
            /> */}
             
            <Hero 
                onSearch={handleSearch}
                searchTerm={searchTerm}
            />

            <section id="about">
               <Welcome /> 
            </section>
            
            <section id="category" >
                <FilterBar 
                    currentSubCategory={currentSubCategory}
                    onSubCategory={handleSubCategory}
                    currentSort={currentSort}
                    onSort={handleSort}
                />
            </section>

            <PostsGrid 
                posts={filteredPosts}
            />
        </>
    )
}

export default Home;