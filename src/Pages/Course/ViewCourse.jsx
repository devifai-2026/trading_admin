import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, ArrowLeft, Edit, Calendar, Clock, Users, 
  IndianRupee, Star, Video, CheckCircle, Play, 
  Download, Share2, BarChart, FileText, MessageCircle,
  Bookmark, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const ViewCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock course data
  const mockCourse = {
    id: 1,
    title: 'React Masterclass 2024',
    instructor: 'John Doe',
    instructorBio: 'Senior React Developer with 8+ years of experience',
    category: 'Web Development',
    price: 12999,
    duration: '45 hours',
    students: 1250,
    rating: 4.8,
    totalReviews: 342,
    level: 'Advanced',
    status: 'Published',
    createdAt: '2024-01-15',
    lastUpdated: '2024-03-20',
    description: 'Complete React course covering modern practices, hooks, context API, and state management. Learn to build production-ready applications.',
    detailedDescription: `This comprehensive React Masterclass takes you from React fundamentals to advanced concepts. You'll learn about:

• React Hooks (useState, useEffect, useContext, useReducer, custom hooks)
• State Management with Context API and Redux Toolkit
• Performance Optimization techniques
• Server-side rendering with Next.js
• Testing with Jest and React Testing Library
• Deployment strategies

By the end of this course, you'll be able to build scalable, production-ready React applications.`,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    modules: [
      { id: 1, title: 'Introduction to React', duration: '2 hours', videoCount: 12, completed: true, description: 'Learn React basics and setup development environment' },
      { id: 2, title: 'Components & Props', duration: '3 hours', videoCount: 18, completed: true, description: 'Understanding components, props, and composition' },
      { id: 3, title: 'State & Lifecycle', duration: '4 hours', videoCount: 24, completed: false, description: 'Manage component state and lifecycle methods' },
      { id: 4, title: 'Hooks Deep Dive', duration: '5 hours', videoCount: 30, completed: false, description: 'Master React hooks and custom hooks' },
      { id: 5, title: 'Context API & State Management', duration: '6 hours', videoCount: 32, completed: false, description: 'Global state management with Context API' },
      { id: 6, title: 'Performance Optimization', duration: '4 hours', videoCount: 20, completed: false, description: 'Optimize React application performance' }
    ],
    requirements: [
      'Basic JavaScript knowledge',
      'HTML & CSS fundamentals',
      'Node.js and npm installed',
      'Code editor (VS Code recommended)'
    ],
    learningOutcomes: [
      'Build complex React applications',
      'Implement state management solutions',
      'Optimize application performance',
      'Test React applications',
      'Deploy React apps to production'
    ],
    reviews: [
      { id: 1, user: 'Alice Johnson', rating: 5, date: '2024-02-15', comment: 'Excellent course! The instructor explains complex concepts clearly.' },
      { id: 2, user: 'Bob Smith', rating: 4, date: '2024-02-10', comment: 'Great content, but some sections could use more examples.' },
      { id: 3, user: 'Carol Williams', rating: 5, date: '2024-02-05', comment: 'Best React course I have taken. Highly recommended!' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 500);
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateCompletion = () => {
    if (!course) return 0;
    const completed = course.modules.filter(m => m.completed).length;
    return Math.round((completed / course.modules.length) * 100);
  };

  const handleEnroll = () => {
    toast.info('Enrollment functionality would be implemented here!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h3>
        <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
        <Link
          to="/course"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            to="/course"
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600">Course ID: {course.id}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to={`/course/edit/${id}`}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit Course
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-64">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                  {course.status}
                </span>
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {course.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {['overview', 'curriculum', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 whitespace-pre-line">{course.detailedDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                      <ul className="space-y-2">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Course Curriculum</h3>
                    <div className="text-sm text-gray-500">
                      {course.modules.length} modules • {course.duration}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {course.modules.map((module) => (
                      <div
                        key={module.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Video className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <h4 className="font-medium text-gray-900">{module.title}</h4>
                              <p className="text-sm text-gray-500">{module.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{module.duration}</span>
                            <span className="text-sm text-gray-500">{module.videoCount} videos</span>
                            {module.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Play className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-2xl font-bold">{course.rating}</span>
                      <span className="text-gray-500 ml-2">({course.totalReviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {course.reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                              <span className="font-medium text-indigo-600">
                                {review.user.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{review.user}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Instructor Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-indigo-600">
                  {course.instructor.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{course.instructor}</h4>
                <p className="text-sm text-gray-600">{course.instructorBio}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>{course.students.toLocaleString()} students</span>
            </div>
          </div>

          {/* Course Info Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(course.price)}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{course.duration} total length</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Video className="h-5 w-5 mr-3" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>Created: {course.createdAt}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BarChart className="h-5 w-5 mr-3" />
                  <span>Level: {course.level}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-gray-900">{calculateCompletion()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${calculateCompletion()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            
            <div className="space-y-3">
             

              <button className="w-full border border-indigo-600 text-indigo-600 py-3 px-4 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center">
                <Bookmark className="h-5 w-5 mr-2" />
                Save for Later
              </button>

              <div className="flex space-x-3">
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Download className="h-5 w-5 mr-2" />
                  Materials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;