import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Save, RefreshCw, Info, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTradeById, updateTrade } from '../../services/tradeService';
import toast from 'react-hot-toast';

const EditTrade = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    userType: 'subscribedUsers',
    marketType: 'Stock',
    category: 'Cash',
    subCategory: 'Intraday',
    transactionType: 'Buy',
    status: 'OPEN',
    remarks: '',
    shortDescription: ''
  });

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        setLoading(true);
        const response = await getTradeById(id);
        if (response.success) {
          setFormData(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch trade details');
        }
      } catch (err) {
        toast.error(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchTrade();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await updateTrade(id, formData);
      if (response.success) {
        toast.success('Trade updated successfully!');
        navigate('/trade');
      } else {
        toast.error(response.message || 'Failed to update trade');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Trade</h1>
          <p className="text-gray-500 tracking-tight">Update status and details for Trade ID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              General Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol / Title *
                </label>
                <input
                  type="text"
                  name="title"
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
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.remarks}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
              Real-time Status Update
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { val: 'OPEN', label: 'OPEN', color: 'bg-blue-600 text-white border-blue-600' },
                { val: 'STOPLOSS_HIT', label: 'STOPLOSS HIT', color: 'bg-red-600 text-white border-red-600' },
                { val: 'TARGET_1_DONE', label: 'TARGET 1', color: 'bg-green-600 text-white border-green-600' },
                { val: 'TARGET_2_DONE', label: 'TARGET 2', color: 'bg-green-700 text-white border-green-700' },
                { val: 'PROFITABLE', label: 'PROFITABLE', color: 'bg-emerald-600 text-white border-emerald-600' },
                { val: 'LEVEL_NOT_COME', label: 'LEVEL NOT COME', color: 'bg-gray-600 text-white border-gray-600' }
              ].map((status) => (
                <button
                  key={status.val}
                  type="button"
                  onClick={() => setFormData(p => ({...p, status: status.val}))}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${formData.status === status.val ? status.color : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">
                Updating the status will send an instant notification to users informing them about the update.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Configurations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Signal Config</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Group
                </label>
                <select
                  name="userType"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  value={formData.userType}
                  onChange={handleInputChange}
                  disabled
                >
                  <option value="subscribedUsers">Paid Only</option>
                  <option value="allUsers">Free & Paid</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">Target group cannot be changed after creation</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, transactionType: 'Buy'}))}
                    className={`p-2 rounded-lg border text-sm font-bold transition-all ${formData.transactionType === 'Buy' ? 'bg-green-600 text-white border-green-600 shadow-sm' : 'bg-white text-gray-600 border-gray-300'}`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({...p, transactionType: 'Sell'}))}
                    className={`p-2 rounded-lg border text-sm font-bold transition-all ${formData.transactionType === 'Sell' ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-white text-gray-600 border-gray-300'}`}
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
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center font-bold shadow-md"
            >
              {saving ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Update Signal
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

export default EditTrade;
