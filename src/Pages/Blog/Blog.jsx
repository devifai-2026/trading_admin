import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

// Mock database for blog posts
const initialBlogPosts = [
  { 
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
  },
  { 
    id: 2, 
    title: 'Tailwind CSS Best Practices', 
    author: 'Jane Smith', 
    date: '2024-01-14', 
    views: 892, 
    status: 'Draft',
    category: 'CSS',
    tags: ['tailwind', 'css', 'styling'],
    content: 'Tailwind CSS has revolutionized the way we write CSS...',
    excerpt: 'Discover the best practices for using Tailwind CSS...',
    featured: false
  },
  { 
    id: 3, 
    title: 'Building APIs with Node.js', 
    author: 'Mike Johnson', 
    date: '2024-01-13', 
    views: 1567, 
    status: 'Published',
    category: 'Node.js',
    tags: ['nodejs', 'backend', 'api'],
    content: 'Node.js is a powerful runtime for building server-side applications...',
    excerpt: 'A step-by-step guide to building RESTful APIs with Node.js...',
    featured: true
  },
  { 
    id: 4, 
    title: 'Introduction to GraphQL', 
    author: 'Sarah Wilson', 
    date: '2024-01-12', 
    views: 734, 
    status: 'Published',
    category: 'GraphQL',
    tags: ['graphql', 'api', 'query'],
    content: 'GraphQL is a query language for your API...',
    excerpt: 'Learn the fundamentals of GraphQL and how it differs from REST...',
    featured: false
  },
  { 
    id: 5, 
    title: 'Web Security Fundamentals', 
    author: 'Alex Brown', 
    date: '2024-01-11', 
    views: 432, 
    status: 'Draft',
    category: 'Security',
    tags: ['security', 'web', 'authentication'],
    content: 'Web security is crucial for any online application...',
    excerpt: 'Essential security practices every web developer should know...',
    featured: false
  },
]

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts)
  const [filteredPosts, setFilteredPosts] = useState(initialBlogPosts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [selectedPosts, setSelectedPosts] = useState([])

  // Get unique categories
  const categories = ['all', ...new Set(blogPosts.map(post => post.category))]

  // Filter and search logic
  useEffect(() => {
    let result = blogPosts

    // Apply search filter
    if (searchTerm) {
      result = result.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(post => post.status === filterStatus)
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(post => post.category === filterCategory)
    }

    // Apply sorting
    switch (sortBy) {
      case 'date-desc':
        result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'date-asc':
        result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'views-desc':
        result = [...result].sort((a, b) => b.views - a.views)
        break
      case 'views-asc':
        result = [...result].sort((a, b) => a.views - b.views)
        break
      case 'title-asc':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title))
        break
      default:
        break
    }

    setFilteredPosts(result)
  }, [searchTerm, filterStatus, filterCategory, sortBy, blogPosts])

  // Handle delete
  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-semibold text-gray-800">Delete this post?</p>
        <p className="text-sm text-gray-600">The blog post will be permanently removed. This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setBlogPosts(blogPosts.filter(post => post.id !== id));
              toast.success('Post deleted successfully');
            }}
            className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '320px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #fee2e2'
      }
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-semibold text-gray-800">Delete {selectedPosts.length} posts?</p>
        <p className="text-sm text-gray-600">All selected posts will be permanently removed. This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setBlogPosts(blogPosts.filter(post => !selectedPosts.includes(post.id)));
              setSelectedPosts([]);
              toast.success(`${selectedPosts.length} posts deleted`);
            }}
            className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors shadow-sm"
          >
            Delete All
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '320px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #fee2e2'
      }
    });
  };

  // Handle bulk status change
  const handleBulkStatusChange = (status) => {
    setBlogPosts(blogPosts.map(post => 
      selectedPosts.includes(post.id) ? { ...post, status } : post
    ))
    setSelectedPosts([])
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id))
    }
  }

  // Handle individual selection
  const handleSelectPost = (id) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter(postId => postId !== id))
    } else {
      setSelectedPosts([...selectedPosts, id])
    }
  }

  // Calculate stats
  const stats = {
    total: blogPosts.length,
    published: blogPosts.filter(post => post.status === 'Published').length,
    draft: blogPosts.filter(post => post.status === 'Draft').length,
    featured: blogPosts.filter(post => post.featured).length,
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-full">
              <Edit className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Filter className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500">Manage your blog posts and content</p>
          </div>
          <Link
            to="/blog/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 w-full border border-gray-300 rounded-lg p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="views-desc">Views (High to Low)</option>
              <option value="views-asc">Views (Low to High)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                {selectedPosts.length} post(s) selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkStatusChange('Published')}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Publish Selected
              </button>
              <button
                onClick={() => handleBulkStatusChange('Draft')}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
              >
                Move to Draft
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">{post.excerpt}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{post.views.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/blog/view/${post.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        to={`/blog/edit/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-4">
            {blogPosts.length === 0 
              ? 'Start by creating your first blog post.' 
              : 'Try adjusting your filters or search term.'}
          </p>
          {blogPosts.length === 0 && (
            <Link
              to="/blog/create"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Post
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog