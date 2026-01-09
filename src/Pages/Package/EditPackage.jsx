import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package as PackageIcon, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - replace with actual API call
  const mockPackage = {
    id: 1,
    name: 'Basic Plan',
    price: '₹799/month',
    users: 'Up to 5 users',
    storage: '10GB',
    features: ['Basic Support', 'Email Support']
  };

  const [packageData, setPackageData] = useState(mockPackage);

  useEffect(() => {
    // Fetch package data based on ID
    // const fetchPackage = async () => {
    //   const response = await fetch(`/api/packages/${id}`);
    //   const data = await response.json();
    //   setPackageData(data);
    // };
    // fetchPackage();
  }, [id]);

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
    console.log('Updated Package Data:', packageData);
    // Add your update API call here
    alert('Package updated successfully!');
    navigate('/package');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      console.log('Delete package:', id);
      // Add your delete API call here
      alert('Package deleted successfully!');
      navigate('/package');
    }
  };

  return (
    <div className="max-w-[95%] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/package')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <PackageIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
        >
          Delete Package
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
                  Update Package
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            
            <div className="flex items-center mb-4">
              <PackageIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h4 className="text-xl font-bold text-gray-900">{packageData.name}</h4>
            </div>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-900">{packageData.price}</span>
            </div>
            
            <ul className="mb-4 space-y-2">
              <li className="flex items-center text-gray-600 text-sm">
                <span className="mr-2">👤</span> {packageData.users}
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <span className="mr-2">💾</span> {packageData.storage} Storage
              </li>
              {packageData.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600 text-sm">
                  <Star className="h-3 w-3 text-green-500 mr-2" /> {feature}
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              Select Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPackage;