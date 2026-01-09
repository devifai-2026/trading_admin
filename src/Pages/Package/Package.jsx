import { Package as PackageIcon, Star, Trash2, Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Package = () => {
  const [packages, setPackages] = useState([
    { id: 1, name: 'Basic Plan', price: '₹799/month', users: 'Up to 5 users', storage: '10GB', features: ['Basic Support', 'Email Support'] },
    { id: 2, name: 'Pro Plan', price: '₹2,499/month', users: 'Up to 20 users', storage: '50GB', features: ['Priority Support', '24/7 Chat', 'Advanced Analytics'] },
    { id: 3, name: 'Enterprise', price: '₹8,299/month', users: 'Unlimited', storage: '500GB', features: ['Dedicated Support', 'Custom Solutions', 'SLA 99.9%'] },
  ])

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState(null)

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (packageToDelete) {
      setPackages(prev => prev.filter(p => p.id !== packageToDelete.id))
      console.log('Deleted package:', packageToDelete)
    }
    setShowDeleteModal(false)
    setPackageToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPackageToDelete(null)
  }

  return (
    <div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Package</h3>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 font-medium mb-1">Are you sure you want to delete?</p>
                <p className="text-red-600 text-sm">
                  Package: <span className="font-semibold">{packageToDelete?.name}</span>
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div key={pkg.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow relative group">
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
                to={`/package/edit/${pkg.id}`}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
            </div>
            
            <ul className="mb-6 space-y-2">
              <li className="flex items-center text-gray-600">
                <span className="mr-2">👤</span> {pkg.users}
              </li>
              <li className="flex items-center text-gray-600">
                <span className="mr-2">💾</span> {pkg.storage} Storage
              </li>
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 text-green-500 mr-2" /> {feature}
                </li>
              ))}
            </ul>
            
            <div className="flex gap-2">
              <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Select Plan
              </button>
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