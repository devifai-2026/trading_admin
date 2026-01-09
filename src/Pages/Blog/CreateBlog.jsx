import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Upload, X } from 'lucide-react'

const CreateBlog = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')

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
    const newPost = {
      id: Date.now(),
      title: data.title,
      author: data.author,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      status: data.status,
      category: data.category,
      tags: tags,
      content: data.content,
      excerpt: data.excerpt,
      featured: data.featured === 'true',
      ...(featuredImage && { imageUrl: featuredImage })
    }
    
    // In a real app, you would save to an API here
    console.log('New post created:', newPost)
    alert('Blog post created successfully!')
    navigate('/blog')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blog Posts
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p className="text-gray-500">Fill in the details to create a new blog post</p>
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
                {featuredImage ? (
                  <div className="relative">
                    <img
                      src={featuredImage}
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
                  Publish Post
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

export default CreateBlog