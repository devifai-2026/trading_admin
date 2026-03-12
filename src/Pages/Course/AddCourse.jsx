import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, ArrowLeft, Upload, X, Save, RefreshCw
} from 'lucide-react';
import { createCourse } from '../../services/courseService';
import toast from 'react-hot-toast';

const AddCourse = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setLoading(true);
      const response = await createCourse(formData);
      if (response.success) {
        toast.success('Course created successfully!');
        navigate('/course');
      } else {
        toast.error(response.message || 'Failed to create course');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/course')}
          className="mr-4 p-2 rounded-full hover:bg-white shadow-sm transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
          <p className="text-gray-500">Create a new entry in your course catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Enter course title"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Course URL *
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="https://example.com/course"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Course Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 transition-all relative group">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(p => ({...p, image: null}));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <div className="flex justify-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                      <Upload className="h-12 w-12" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/course')}
            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;