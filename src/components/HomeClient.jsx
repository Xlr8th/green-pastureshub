'use client'
import { useState, useEffect } from "react";
import FilterBar from "./Filters/FilterBar";
import Hero from "./Hero/Hero";
import PostsGrid from "./PostCard/PostsGrid";
import Welcome from "./Welcome/Welcome";
import { useSearchParams, useRouter } from 'next/navigation';


const Home = ({ posts: initialPosts }) => {
    const POSTS_PER_PAGE = 9;
    const searchParams = useSearchParams();
    const router = useRouter();

    // ✅ single source of truth: derive these directly from the URL every render
    const currentSubCategory = searchParams.get('category') || 'all';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentPage = Number(searchParams.get('page')) || 1;
    const urlSearchTerm = searchParams.get('search') || '';

    //states
    const [posts, setPosts] = useState(initialPosts)
    const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

    useEffect(() => {       
        setSearchTerm(urlSearchTerm);
    }, [urlSearchTerm]);

    const getPostBySubCategory = (currentSubCategory, posts) => currentSubCategory === 'all' ? posts : posts.filter(post => post.subCategory === currentSubCategory);

    const searchPost = (searchTerm, posts) => {
        const term = searchTerm.toLowerCase().trim();

        if(term === '') return posts;

        return posts.filter(({title, excerpt, author, tags}) => 
            title.toLowerCase().includes(term) || 
            excerpt.toLowerCase().includes(term) || 
            author.toLowerCase().includes(term) || 
            tags.some(tag => tag.toLowerCase().includes(term))
        );
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

    //helper function that builds the next URL from CURRENT url values + explicit overrides
    const buildUrl = (overrides = {}, caller = '?') => {
        const category = overrides.category ?? currentSubCategory;
        const search = overrides.search ?? searchTerm;
        const sort = overrides.sort ?? currentSort;
        const page = overrides.page ?? 1;

        console.log(`buildUrl [${caller}] →`, { category, search, sort, page, overrides })

        const params = new URLSearchParams();

        if (category !== 'all') {
            params.set('category', category);
        }

        if (search.trim()) {
            params.set('search', search);
        }

        if (sort !== 'newest') {
            params.set('sort', sort);
        }
        
        if (page > 1) {
            params.set('page', String(page));
        }

        const query = params.toString();

        return query ? `/?${query}` : '/';

    }
    
    //filter functions
    const handleSearch = (value) => {
        setSearchTerm(value);
        router.replace(
            buildUrl({search: value}),
            { scroll: false }
        );
    };

    const handleSort = (value) => {
        router.replace(
            buildUrl({sort: value}, 'handleSort'),
            { scroll: false }
        );
    };

    const handleSubCategory = (subCategory) => {
        router.replace(
            buildUrl({category: subCategory}, 'handleSubCategory'),
            { scroll: false }
        );

    };
    const handlePageChange = (page) => {

        router.replace(
            buildUrl({ page }, 'handlePageChange'),
            { scroll: false }
        );

        document.getElementById('category')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };
    
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;

    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);    

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
                posts={paginatedPosts}
            />

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <i className="bi bi-chevron-left"></i>
                        <span>Previous</span>
                    </button>

                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <span>Next</span>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            )}
        </>
    )
}

export default Home;