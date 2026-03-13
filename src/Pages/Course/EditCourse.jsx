import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  BookOpen, ArrowLeft, Upload, X, Save, RefreshCw, Trash2
} from 'lucide-react';
import { getCourseById, updateCourse, deleteCourse } from '../../services/courseService';
import toast from 'react-hot-toast';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await getCourseById(id);
        if (response.success) {
          setFormData({
            title: response.data.title,
            url: response.data.url,
            image: null // Reset image for update
          });
          setImagePreview(response.data.image);
        } else {
          toast.error(response.message || 'Failed to fetch course');
          navigate('/course');
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
        navigate('/course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

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
    try {
      setSaving(true);
      const response = await updateCourse(id, formData);
      if (response.success) {
        toast.success('Course updated successfully!');
        navigate('/course');
      } else {
        toast.error(response.message || 'Failed to update course');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
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
                  navigate('/course');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/course')}
            className="mr-4 p-2 rounded-full hover:bg-white shadow-sm transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-500">Update course details or image</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors shadow-sm bg-white"
          title="Delete Course"
        >
          <Trash2 className="h-6 w-6" />
        </button>
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
                Course Image (Optional - leave to keep current)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-500 transition-all relative group">
                {imagePreview ? (
                  <div className="relative w-full text-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-64 mx-auto rounded-lg object-contain mb-4"
                    />
                    <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <span>Change Image</span>
                      <input 
                        type="file" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(p => ({...p, image: null}));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Undo
                      </button>
                    )}
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
            disabled={saving}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? (
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
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

export default EditCourse;