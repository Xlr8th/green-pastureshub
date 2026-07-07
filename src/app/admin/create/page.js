'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../lib/AuthContext'
import { useToast } from '../../../lib/ToastContext'
import './create.css'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css'

export default function CreatePost() {
    const router = useRouter();
    const { authLoading, isAdmin, user } = useAuth();
    const { showToast } = useToast()
    

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        excerpt: '',
        tags: '',
        thumbnail: '',
        content: '',
        readTime: '',
        subCategory: '',
        featured: false
    });

    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const generateSlug = (title) => {
        return title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
    };

    const validateForm = () => {

        const validationErrors = []

        if (!formData.title) {
            validationErrors.push('Title is required')
        }

        if (!formData.author) {
            validationErrors.push('Author is required')
        }

        if (!formData.excerpt) {
            validationErrors.push('Excerpt is required')
        }

        if (!formData.content) {
            validationErrors.push('Content is required')
        }

        if (!formData.readTime) {
            validationErrors.push('Reading time is required')
        }

        const excerptLength = formData.excerpt.trim().length

        if (excerptLength < 50 || excerptLength > 300) {
            validationErrors.push(
                'Excerpt must be between 50 and 300 characters'
            )
        }

        const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')

        if (tagsArray.length < 2 || tagsArray.length > 5) {
            validationErrors.push(
                'Please enter between 2 and 5 tags'
            )
        }

        return {
            valid: validationErrors.length === 0,
            errors: validationErrors
        }
    }

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (event) => {

        event.preventDefault()

        if (!isAdmin) {
            showToast('You are not authorized to perform this action.', 'error')
            return
        }

        const { valid, errors } = validateForm()

        if (!valid) {
            setErrors(errors)
            return
        }

        setLoading(true)

        const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')

        const post = {
            category: 'article',
            title: formData.title,
            slug: generateSlug(formData.title),
            author: formData.author,
            excerpt: formData.excerpt,
            tags: tagsArray,
            thumbnail: formData.thumbnail,
            content: formData.content,
            readTime: Number(formData.readTime),
            subCategory: formData.subCategory,
            featured: formData.featured,
            views: 0,
            publishedDate: new Date().toISOString()
        }

        try {

            const { error } = await supabase
                .from('posts')
                .insert(post)

            if (error) {
                // Postgres RLS violations surface as error code 4250 ("insufficient_privilege"). 
                if (error.code === '42501') {
                    setErrors(['You are not authorized to perform this action.'])
                } else {
                    setErrors([error.message])
                }
                setLoading(false)
                return
            }

            router.push('/')

        } 
        catch (error) {

            setErrors(['Something went wrong'])

        } 
        finally {

            setLoading(false)

        }
    }

    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                window.location.reload()
            }
        }
        window.addEventListener('pageshow', handlePageShow)
        return () => window.removeEventListener('pageshow', handlePageShow)
    }, [])


    // Guard: once auth state has settled, bounce anyone who isn't a logged-in admin. AuthContext already tracks `user` and `isAdmin`
    useEffect(() => {
        if (authLoading) return

        if (!user) {
            router.replace('/login')
            return
        }

        if (!isAdmin) {
            showToast('You are not authorized to access that page.', 'error')
            router.replace('/')
        }
            
    }, [user, isAdmin, authLoading])

    // --- Instant gating: never render the form until we KNOW the user is an admin.
    if (authLoading) return null;

    if (!isAdmin) return null;

    return (
        <section className="create-post-section">
            <div className="container">
                <div className="create-post-header">
                    <h2>✍️ Create New Post</h2>
                    <p>Share your thoughts and teachings with the world.</p>
                </div>

                <form className="create-post-form" onSubmit={handleSubmit}>
                    
                    {/* Basic Information */}
                    <div className="form-section">
                        <h3>Basic Information</h3>

                        <div className="form-group">
                            <label htmlFor="title">Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter your post title..."
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="author">Author Name *</label>
                            <input
                                type="text"
                                name="author"
                                placeholder="Author"
                                value={formData.author}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="excerpt">
                                Short Description / Excerpt *
                            </label>

                            <textarea
                                name="excerpt"
                                placeholder="Write a short summary..."
                                value={formData.excerpt}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">
                                Tags (comma-separated) *
                            </label>

                            <input
                                type="text"
                                name="tags"
                                placeholder="Faith, Prayer"
                                value={formData.tags}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="thumbnail">
                                Thumbnail Image URL *
                            </label>

                            <input
                                type="url"
                                name="thumbnail"
                                placeholder="Thumbnail URL"
                                value={formData.thumbnail}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Article Details */}
                    <div className="form-section">
                        <h3>Article Details</h3>

                        <div className="form-group">
                            <label htmlFor="content">
                                Article Content *
                            </label>

                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(value) => setFormData(prev => ({...prev, content: value}))}
                                placeholder="Write your article content here..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="readTime">
                                    Reading Time (minutes) *
                                </label>

                                <input
                                type="number"
                                name="readTime"
                                placeholder="Read Time"
                                value={formData.readTime}
                                onChange={handleChange}
                            />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subCategory">
                                    Sub Category *
                                </label>

                                <select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        -- Select Sub Category --
                                    </option>

                                    <option value="word">Word</option>
                                    <option value="parenting">
                                        Parenting
                                    </option>
                                    <option value="marriage">
                                        Marriage
                                    </option>
                                    <option value="lifestyle">
                                        Lifestyle
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="form-section">
                        <h3>Additional Options</h3>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />

                                Mark as Featured Post
                            </label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        
                        {errors.length > 0 && (
                            <div>
                                {errors.map(error => (
                                    <p key={error}>{error}</p>
                                ))}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className='btn-primary'>
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}