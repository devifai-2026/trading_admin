import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  Edit, 
  Share2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check
} from 'lucide-react'

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
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    content: `
      <h2>Introduction to React</h2>
      <p>React is a JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most popular frontend libraries in the world.</p>
      
      <h3>Why React?</h3>
      <ul>
        <li><strong>Component-Based Architecture:</strong> Build encapsulated components that manage their own state</li>
        <li><strong>Declarative Syntax:</strong> React makes it painless to create interactive UIs</li>
        <li><strong>Learn Once, Write Anywhere:</strong> You can develop new features without rewriting existing code</li>
        <li><strong>Rich Ecosystem:</strong> Large community and extensive package ecosystem</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>To start a new React project, you can use Create React App:</p>
      
      <pre><code>npx create-react-app my-app
cd my-app
npm start</code></pre>
      
      <h3>Key Concepts</h3>
      <p>Understanding these concepts is crucial for React development:</p>
      
      <ol>
        <li><strong>JSX:</strong> JavaScript XML syntax extension</li>
        <li><strong>Components:</strong> Reusable UI building blocks</li>
        <li><strong>Props:</strong> Inputs passed to components</li>
        <li><strong>State:</strong> Internal data of components</li>
        <li><strong>Hooks:</strong> Functions that let you use state and lifecycle features</li>
      </ol>
      
      <h3>Best Practices</h3>
      <p>Follow these best practices for better React development:</p>
      
      <ul>
        <li>Keep components small and focused</li>
        <li>Use functional components with hooks</li>
        <li>Implement propTypes for type checking</li>
        <li>Optimize performance with React.memo and useMemo</li>
        <li>Write tests for your components</li>
      </ul>
      
      <h3>Conclusion</h3>
      <p>React continues to evolve with new features and improvements. Staying up-to-date with the latest developments and best practices will help you build better applications.</p>
    `,
    excerpt: 'Learn how to build modern web applications with React...',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    authorBio: 'Senior Frontend Developer with 8+ years of experience in React and modern web technologies.',
    readTime: '5 min read',
    comments: 24,
    likes: 156
  },
  2: {
    id: 2,
    title: 'Tailwind CSS Best Practices',
    author: 'Jane Smith',
    date: '2024-01-14',
    views: 892,
    status: 'Draft',
    category: 'CSS',
    tags: ['tailwind', 'css', 'styling', 'utility-first'],
    content: 'Tailwind CSS has revolutionized the way we write CSS...',
    excerpt: 'Discover the best practices for using Tailwind CSS...',
    featured: false
  }
}

const ViewBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    { id: 1, user: 'Alice Johnson', text: 'Great article! Very helpful for beginners.', date: '2024-01-16' },
    { id: 2, user: 'Bob Williams', text: 'Could you expand more on React Hooks?', date: '2024-01-15' },
  ])
  const [relatedPosts] = useState([
    { id: 2, title: 'Tailwind CSS Best Practices', category: 'CSS', date: '2024-01-14' },
    { id: 3, title: 'Building APIs with Node.js', category: 'Node.js', date: '2024-01-13' },
    { id: 4, title: 'Introduction to GraphQL', category: 'GraphQL', date: '2024-01-12' },
  ])

  useEffect(() => {
    // In a real app, you would fetch the post by ID from an API
    const foundPost = mockPosts[id]
    if (foundPost) {
      setPost(foundPost)
    } else {
      navigate('/blog')
    }
  }, [id, navigate])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: 'You',
        text: newComment,
        date: new Date().toISOString().split('T')[0]
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Blog Posts
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Image */}
        {post.imageUrl && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <span className="px-3 py-1 bg-indigo-600 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
              {post.readTime && (
                <div className="flex items-center">
                  <span>•</span>
                  <span className="ml-2">{post.readTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <div className="flex items-center mb-3">
              <Tag className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {/* Author Bio */}
          {post.authorBio && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Author</h3>
              <p className="text-gray-600">{post.authorBio}</p>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Link
                  to={`/blog/edit/${post.id}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Post
                </Link>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Bookmark className="h-5 w-5 mr-2" />
                  Save
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Share:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    title="Copy link"
                  >
                    {copySuccess ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
                  </button>
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Twitter className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg">
                    <Linkedin className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Comments ({comments.length})</h3>
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </button>
            </div>

            {showComments && (
              <div className="space-y-6">
                {/* Add Comment */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full border border-gray-300 rounded-lg p-3 mb-3"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className={`px-4 py-2 rounded-lg ${
                        newComment.trim()
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{comment.user}</span>
                          <span className="ml-2 text-sm text-gray-500">{comment.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Posts */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Related Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/view/${relatedPost.id}`)}
                >
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mb-3">
                    {relatedPost.category}
                  </span>
                  <h4 className="font-medium text-gray-900 mb-2">{relatedPost.title}</h4>
                  <p className="text-sm text-gray-500">{relatedPost.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(`/blog/view/${parseInt(id) - 1}`)}
          disabled={parseInt(id) <= 1}
          className={`flex items-center px-4 py-2 rounded-lg ${
            parseInt(id) <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Previous
        </button>
        <button
          onClick={() => navigate(`/blog/view/${parseInt(id) + 1}`)}
          disabled={parseInt(id) >= Object.keys(mockPosts).length}
          className={`flex items-center px-4 py-2 rounded-lg ${
            parseInt(id) >= Object.keys(mockPosts).length
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Next
          <ChevronRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  )
}

export default ViewBlog