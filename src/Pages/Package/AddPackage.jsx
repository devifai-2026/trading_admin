import React, { useState } from 'react';
import { ArrowLeft, Package as PackageIcon, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createSubscription } from '../../services/subscriptionService';
import toast from 'react-hot-toast';

const AddPackage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState({
    name: '1 Month',
    durationInMonths: 1,
    price: '',
    description: '',
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setPackageData(prev => {
      let val = value;
      if (name === 'price' && type === 'number') {
        // Remove any non-digit characters to prevent decimals
        val = value.replace(/[^0-9]/g, '');
      }
      const newData = { ...prev, [name]: type === 'checkbox' ? checked : val };
      
      // Auto-sync duration if name is changed
      if (name === 'name') {
        if (value === '1 Month') newData.durationInMonths = 1;
        if (value === '6 Months') newData.durationInMonths = 6;
        if (value === '1 Year') newData.durationInMonths = 12;
      }
      
      // Auto-sync name if duration is changed
      if (name === 'durationInMonths') {
        const months = parseInt(value);
        newData.durationInMonths = months;
        if (months === 1) newData.name = '1 Month';
        if (months === 6) newData.name = '6 Months';
        if (months === 12) newData.name = '1 Year';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate price
    if (parseFloat(packageData.price) < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    try {
      setLoading(true);
      const response = await createSubscription(packageData);
      if (response.success) {
        toast.success('Package added successfully!');
        navigate('/package');
      } else {
        toast.error(response.message || 'Failed to add package');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
                Plan Name *
              </label>
              <select
                name="name"
                value={packageData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="1 Month">1 Month</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Months) *
              </label>
              <select
                name="durationInMonths"
                value={packageData.durationInMonths}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value={1}>1 Month</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="price"
                  value={packageData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="1"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., 799"
                  required
                />
              </div>
            </div>

            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={packageData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Plan
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={packageData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter plan details..."
            />
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
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Create Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPackage;