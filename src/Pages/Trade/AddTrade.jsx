import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Save, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createTrade } from '../../services/tradeService';
import toast from 'react-hot-toast';

const AddTrade = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    userType: 'subscribedUsers',
    marketType: 'Stock',
    category: 'Cash',
    subCategory: 'Intraday',
    transactionType: 'Buy',
    remarks: '',
    shortDescription: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await createTrade(formData);
      if (response.success) {
        toast.success('Trade alert created and notifications sent!');
        navigate('/trade');
      } else {
        toast.error(response.message || 'Failed to create trade');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/trade')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Trade</h1>
          <p className="text-gray-500">Send a new trading signal to users</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Signal Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol / Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. RELIANCE BUY ABOVE 2500"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  placeholder="Brief summary for notification..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detailed Remarks
                </label>
                <textarea
                  name="remarks"
                  placeholder="Entry, Targets, Stoploss details..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.remarks}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Notification:</strong> Creating this trade will automatically send a push notification to all users in the selected target group.
            </p>
          </div>
        </div>

        {/* Right Section - Configurations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Users *
                </label>
                <select
                  name="userType"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.userType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="subscribedUsers">Paid Subscribers Only</option>
                  <option value="allUsers">Free & Paid Users</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, transactionType: 'Buy'}))}
                    className={`p-2 rounded-lg border text-sm font-bold transition-all ${formData.transactionType === 'Buy' ? 'bg-green-600 text-white border-green-600 shadow-lg' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, transactionType: 'Sell'}))}
                    className={`p-2 rounded-lg border text-sm font-bold transition-all ${formData.transactionType === 'Sell' ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market Type *
                </label>
                <select
                  name="marketType"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.marketType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Stock">Stock</option>
                  <option value="Index">Index</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="FNO">F&O</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Cat *
                  </label>
                  <select
                    name="subCategory"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Intraday">Intraday</option>
                    <option value="BTST">BTST</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center font-bold"
            >
              {loading ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Create & Send Signal
            </button>
            <button
              type="button"
              onClick={() => navigate('/trade')}
              className="w-full mt-3 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTrade;
