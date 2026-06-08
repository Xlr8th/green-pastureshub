'use client'
import { useState, useEffect } from "react";
import FilterBar from "./Filters/FilterBar";
import Hero from "./Hero/Hero";
import PostsGrid from "./PostCard/PostsGrid";
import Welcome from "./Welcome/Welcome";
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";


const Home = ({ posts: initialPosts }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    //states
    const [posts, setPosts] = useState(initialPosts)
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [currentSort, setCurrentSort] = useState('newest');
    const [currentSubCategory, setCurrentSubCategory] = useState('all');

    useEffect(() => {
        const category = searchParams.get('category') || 'all';
        setCurrentSubCategory(prev => prev !== category ? category : prev);
    }, [searchParams]);

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
    
    //filter functions
    const handleSearch = (value) => {
        setSearchTerm(value);
        router.replace(value.trim() ? `/?search=${value}` : '/');
    };

    const handleSort = (value) => {
        setCurrentSort(value);
    };

    const handleSubCategory = (subCategory) => {
        setCurrentSubCategory(subCategory);
        router.replace(subCategory === 'all' ? '/' : `/?category=${subCategory}`, {scroll: false})

    };

    return (
        <>
            <Hero 
                onSearch={handleSearch}
                searchTerm={searchTerm}
                searchResults={searchTerm.trim() ? filteredPosts : []}
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