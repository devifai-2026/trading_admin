import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Plus, Search, Filter, Clock, Users, 
  IndianRupee, Edit, Eye, Trash2, Star, Video, 
  Download, Calendar, BarChart
} from 'lucide-react';

const Course = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'React Masterclass 2024',
      instructor: 'John Doe',
      category: 'Web Development',
      price: 12999,
      duration: '45 hours',
      students: 1250,
      rating: 4.8,
      totalReviews: 342,
      level: 'Advanced',
      status: 'Published',
      createdAt: '2024-01-15',
      description: 'Complete React course with modern practices',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      modules: [
        { id: 1, title: 'Introduction to React', duration: '2 hours', completed: true },
        { id: 2, title: 'Components & Props', duration: '3 hours', completed: true },
        { id: 3, title: 'State & Lifecycle', duration: '4 hours', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Full Stack JavaScript Development',
      instructor: 'Jane Smith',
      category: 'Web Development',
      price: 19999,
      duration: '80 hours',
      students: 890,
      rating: 4.9,
      totalReviews: 256,
      level: 'Intermediate',
      status: 'Published',
      createdAt: '2024-01-10',
      description: 'Build full-stack applications with Node.js and React',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w-400',
      modules: [
        { id: 1, title: 'Node.js Fundamentals', duration: '5 hours' },
        { id: 2, title: 'Express.js & REST APIs', duration: '6 hours' },
        { id: 3, title: 'MongoDB & Mongoose', duration: '4 hours' }
      ]
    },
    {
      id: 3,
      title: 'Python for Data Science',
      instructor: 'Alex Johnson',
      category: 'Data Science',
      price: 14999,
      duration: '60 hours',
      students: 2100,
      rating: 4.7,
      totalReviews: 512,
      level: 'Beginner',
      status: 'Published',
      createdAt: '2024-01-05',
      description: 'Learn Python for data analysis and visualization',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      modules: [
        { id: 1, title: 'Python Basics', duration: '4 hours' },
        { id: 2, title: 'NumPy & Pandas', duration: '6 hours' },
        { id: 3, title: 'Data Visualization', duration: '5 hours' }
      ]
    },
    {
      id: 4,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Sarah Williams',
      category: 'Design',
      price: 8999,
      duration: '40 hours',
      students: 750,
      rating: 4.6,
      totalReviews: 189,
      level: 'Beginner',
      status: 'Draft',
      createdAt: '2024-01-18',
      description: 'Master UI/UX design principles and tools',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      modules: [
        { id: 1, title: 'Design Principles', duration: '3 hours' },
        { id: 2, title: 'Figma Basics', duration: '4 hours' }
      ]
    },
    {
      id: 5,
      title: 'Mobile App Development with Flutter',
      instructor: 'Mike Chen',
      category: 'Mobile Development',
      price: 16999,
      duration: '70 hours',
      students: 620,
      rating: 4.5,
      totalReviews: 145,
      level: 'Intermediate',
      status: 'Published',
      createdAt: '2024-01-12',
      description: 'Build cross-platform mobile apps with Flutter',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
      modules: [
        { id: 1, title: 'Flutter Basics', duration: '4 hours' },
        { id: 2, title: 'Widgets & Layouts', duration: '5 hours' },
        { id: 3, title: 'State Management', duration: '6 hours' }
      ]
    }
  ]);

  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');

  // Calculate stats
  const stats = {
    total: courses.length,
    published: courses.filter(course => course.status === 'Published').length,
    draft: courses.filter(course => course.status === 'Draft').length,
    totalStudents: courses.reduce((sum, course) => sum + course.students, 0),
    totalRevenue: courses.reduce((sum, course) => sum + course.price * course.students, 0),
    averageRating: courses.reduce((sum, course) => sum + course.rating, 0) / courses.length
  };

  // Filter courses
  React.useEffect(() => {
    let result = courses;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(course => course.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(course => course.status === filterStatus);
    }

    // Apply level filter
    if (filterLevel !== 'all') {
      result = result.filter(course => course.level === filterLevel);
    }

    setFilteredCourses(result);
  }, [searchTerm, filterCategory, filterStatus, filterLevel, courses]);

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get unique categories
  const categories = [...new Set(courses.map(course => course.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            Courses
          </h1>
          <p className="text-gray-600">Manage your course catalog and student enrollments</p>
        </div>
        <Link
          to="/course/add"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)}/5.0</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, instructor..."
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                  <span className="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {course.category}
                  </span>
                  <span className="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/course/view/${course.id}`}
                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50"
                    title="View"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/course/edit/${course.id}`}
                    className="text-green-600 hover:text-green-800 p-1.5 rounded-full hover:bg-green-50"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center mr-4">
                  <Users className="h-4 w-4 mr-1" />
                  {course.students.toLocaleString()} students
                </span>
                <span className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </span>
                <span className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {course.rating} ({course.totalReviews} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(course.price)}
                </div>
                <div className="text-sm text-gray-500">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Created: {course.createdAt}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Course Modules</h4>
              <div className="space-y-2">
                {course.modules.slice(0, 3).map((module) => (
                  <div key={module.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{module.title}</span>
                    <span className="text-gray-500">{module.duration}</span>
                  </div>
                ))}
                {course.modules.length > 3 && (
                  <div className="text-sm text-indigo-600 font-medium">
                    +{course.modules.length - 3} more modules
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            {courses.length === 0 
              ? 'Start by creating your first course' 
              : 'Try adjusting your filters or search term'}
          </p>
          {courses.length === 0 && (
            <Link
              to="/course/add"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Course
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Course;