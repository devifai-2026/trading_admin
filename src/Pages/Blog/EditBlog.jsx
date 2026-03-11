import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

// Mock data - in real app, you would fetch from API
const mockPosts = {
  1: {
    id: 1,
    title: 'Getting Started with React',
    author: 'John Doe',
    date: '2024-01-15',
    views: 1245,
    status: 'Published',
    category: 'React',
    tags: ['react', 'javascript', 'frontend'],
    content: 'This is a comprehensive guide to getting started with React...',
    excerpt: 'Learn how to build modern web applications with React...',
    featured: true
  }
}

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [post, setPost] = useState(null)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the post by ID from an API
    const foundPost = mockPosts[id]
    if (foundPost) {
      setPost(foundPost)
      setTags(foundPost.tags || [])
      reset({
        title: foundPost.title,
        author: foundPost.author,
        status: foundPost.status,
        category: foundPost.category,
        content: foundPost.content,
        excerpt: foundPost.excerpt,
        featured: foundPost.featured ? 'true' : 'false'
      })
    }
    setIsLoading(false)
  }, [id, reset])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFeaturedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data) => {
    const updatedPost = {
      ...post,
      title: data.title,
      author: data.author,
      status: data.status,
      category: data.category,
      tags: tags,
      content: data.content,
      excerpt: data.excerpt,
      featured: data.featured === 'true',
      ...(featuredImage && { imageUrl: featuredImage })
    }
    
    // In a real app, you would save to an API here
    console.log('Post updated:', updatedPost)
    toast.success('Blog post updated successfully!')
    navigate('/blog')
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p className="text-gray-600 mb-4">The blog post you're trying to edit doesn't exist.</p>
        <button
          onClick={() => navigate('/blog')}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Back to Blog Posts
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[95%] mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blog Posts
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-500">Update the details of your blog post</p>
          </div>
        
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg p-3 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter blog post title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                rows={12}
                className={`w-full border rounded-lg p-3 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write your blog post content here..."
                {...register('content', { required: 'Content is required' })}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3"
                placeholder="Brief summary of your blog post"
                {...register('excerpt')}
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Post Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium">{post.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{post.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    post.status === 'Published' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {post.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3"
                {...register('status', { required: 'Status is required' })}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* Author */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                className={`w-full border rounded-lg p-3 ${
                  errors.author ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Author name"
                {...register('author', { required: 'Author is required' })}
              />
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3"
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select a category</option>
                <option value="React">React</option>
                <option value="CSS">CSS</option>
                <option value="Node.js">Node.js</option>
                <option value="GraphQL">GraphQL</option>
                <option value="Security">Security</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex mb-3">
                <input
                  type="text"
                  className="flex-grow border border-gray-300 rounded-l-lg p-2"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-4 hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {featuredImage || post.imageUrl ? (
                  <div className="relative">
                    <img
                      src={featuredImage || post.imageUrl}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Post */}
            <div className="bg-white p-6 rounded-lg shadow">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 rounded"
                  {...register('featured')}
                />
                <span className="ml-2 text-sm text-gray-700">Mark as featured post</span>
              </label>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Update Post
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/blog')}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditBlog