import { Package as PackageIcon, Star, Trash2, Edit, Plus, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllSubscriptions, deleteSubscription } from '../../services/subscriptionService'
import toast from 'react-hot-toast'

const Package = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const response = await getAllSubscriptions()
      if (response.success) {
        setPackages(response.data || [])
      } else {
        setError(response.message || 'Failed to fetch packages')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleDeleteClick = (pkg) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="font-semibold text-gray-800">Delete {pkg.name}?</p>
        <p className="text-sm text-gray-600">This will permanently remove the subscription plan. Existing subscribers will not be affected until their plan expires.</p>
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
                const response = await deleteSubscription(pkg._id);
                if (response.success) {
                  setPackages(prev => prev.filter(p => p._id !== pkg._id));
                  toast.success('Package deleted successfully!');
                } else {
                  toast.error(response.message || 'Failed to delete package');
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
      style: {
        minWidth: '350px',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #fee2e2'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchPackages}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>


      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
        <Link 
          to="/package/add"
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Package
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow relative group">
            <button
              onClick={() => handleDeleteClick(pkg)}
              className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 z-10 shadow-lg"
              title="Delete package"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <PackageIcon className="h-8 w-8 text-indigo-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
              </div>
              <Link 
                to={`/package/edit/${pkg._id}`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">₹{pkg.price}</span>
              <span className="text-gray-500 ml-1">/ {pkg.durationInMonths} Months</span>
            </div>
            
            <p className="text-gray-600 mb-6 line-clamp-3">
              {pkg.description || 'No description provided.'}
            </p>
            
            {!pkg.isActive && (
              <div className="mb-4">
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Inactive</span>
              </div>
            )}
            
            <div className="flex gap-2">
              <Link 
                to={`/package/edit/${pkg._id}`}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-center"
              >
                Manage Plan
              </Link>
              <button
                onClick={() => handleDeleteClick(pkg)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center md:hidden"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <PackageIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Packages Found</h3>
          <p className="text-gray-600 mb-6">Add your first package to get started</p>
          <Link 
            to="/package/add"
            className="inline-flex items-center bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Package
          </Link>
        </div>
      )}
    </div>
  )
}

export default Package