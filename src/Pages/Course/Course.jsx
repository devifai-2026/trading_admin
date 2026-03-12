import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Plus, Search, Edit, Eye, Trash2, 
  RefreshCw, AlertCircle, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { getAllCourses, deleteCourse } from '../../services/courseService';
import toast from 'react-hot-toast';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await getAllCourses();
      if (response.success) {
        setCourses(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch courses');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-semibold text-gray-800">Delete this course?</p>
        <p className="text-sm text-gray-600">This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await deleteCourse(id);
                if (response.success) {
                  toast.success('Course deleted successfully');
                  fetchCourses();
                } else {
                  toast.error(response.message || 'Failed to delete course');
                }
              } catch (err) {
                toast.error(err.message || 'Something went wrong');
              }
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
    });
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
            Course Management
          </h1>
          <p className="text-gray-600">List and manage your educational content</p>
        </div>
        <Link
          to="/course/add"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Course
        </Link>
      </div>

      {/* Search & Actions */}
      <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses by title..."
            className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Course List Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course URL</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-2 text-gray-500 font-medium">Loading courses...</p>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No courses found</p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                        {course.image ? (
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/400x400?text=No+Image';
                            }}
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created on {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {course.url.length > 30 ? course.url.substring(0, 30) + '...' : course.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/course/edit/${course._id}`}
                          className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Course;