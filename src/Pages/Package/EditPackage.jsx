import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package as PackageIcon, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubscriptionById, updateSubscription, deleteSubscription } from '../../services/subscriptionService';
import toast from 'react-hot-toast';

const EditPackage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [packageData, setPackageData] = useState({
    name: '',
    durationInMonths: 1,
    price: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionById(id);
        if (response.success) {
          setPackageData(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch package details');
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

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
      setSaving(true);
      const response = await updateSubscription(id, packageData);
      if (response.success) {
        toast.success('Package updated successfully!');
        navigate('/package');
      } else {
        toast.error(response.message || 'Failed to update package');
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
        <p className="font-semibold text-gray-800">Delete this package?</p>
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
                setSaving(true);
                const response = await deleteSubscription(id);
                if (response.success) {
                  toast.success('Package deleted successfully!');
                  navigate('/package');
                } else {
                  toast.error(response.message || 'Failed to delete package');
                }
              } catch (err) {
                toast.error(err.message || 'Something went wrong');
              } finally {
                setSaving(false);
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
    );
  }

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
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center"
        >
          <Trash2 className="h-4 w-4 mr-2" />
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
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
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
              <span className="text-2xl font-bold text-gray-900">₹{packageData.price}</span>
              <span className="text-gray-500 ml-1">/ {packageData.durationInMonths} Months</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {packageData.description || 'No description provided.'}
            </p>
            
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