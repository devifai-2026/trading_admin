import React, { useState } from 'react';
import { ArrowLeft, Package as PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddPackage = () => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState({
    name: '',
    price: '',
    users: '',
    storage: '',
    features: [''],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...packageData.features];
    newFeatures[index] = value;
    setPackageData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setPackageData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    if (packageData.features.length > 1) {
      const newFeatures = packageData.features.filter((_, i) => i !== index);
      setPackageData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package Data:', packageData);
    // Add your API call here
    alert('Package added successfully!');
    navigate('/package');
  };

  return (
    <div className="max-w-[95%] mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/package')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex items-center">
          <PackageIcon className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Add New Package</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Name *
              </label>
              <input
                type="text"
                name="name"
                value={packageData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Basic Plan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="text"
                  name="price"
                  value={packageData.price}
                  onChange={handleInputChange}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 799/month"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Users *
              </label>
              <input
                type="text"
                name="users"
                value={packageData.users}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Up to 5 users"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage *
              </label>
              <input
                type="text"
                name="storage"
                value={packageData.storage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., 10GB"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Features *
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors"
              >
                + Add Feature
              </button>
            </div>
            
            {packageData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 24/7 Support"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={packageData.features.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/package')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;