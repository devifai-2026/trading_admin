import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, RefreshCw, Info, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTradeById, updateTrade } from '../../services/tradeService';
import toast from 'react-hot-toast';

const EditTrade = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [modalRemarks, setModalRemarks] = useState('');
  
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
          setModalRemarks(response.data.remarks || '');
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

  const handleStatusClick = (status) => {
    setPendingStatus(status);
    setShowModal(true);
  };

  const handleConfirmUpdate = async () => {
    try {
      setSaving(true);
      const updatedData = {
        ...formData,
        status: pendingStatus.val,
        remarks: modalRemarks
      };
      
      const response = await updateTrade(id, updatedData);
      if (response.success) {
        toast.success(`Status updated to ${pendingStatus.label}!`);
        setFormData(response.data);
        setShowModal(false);
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
    <div className="max-w-4xl mx-auto space-y-6 relative">
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
          <p className="text-gray-500 tracking-tight">Only status and remarks can be updated</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section - Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 opacity-80">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Trade Details (Read-only)
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol / Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={formData.title}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={formData.shortDescription}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Remarks</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={formData.remarks}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
              Update Status
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
                  onClick={() => handleStatusClick(status)}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${formData.status === status.val ? status.color : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300'}`}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">
                Click a status button to open the update modal.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Configurations */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 opacity-80">
            <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Signal Config (Read-only)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Group</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
                  {formData.userType === 'subscribedUsers' ? 'Paid Only' : 'Free & Paid'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <div className={`p-2 rounded-lg text-center text-sm font-bold ${formData.transactionType === 'Buy' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {formData.transactionType.toUpperCase()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Type</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">{formData.marketType}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">{formData.category}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Cat</label>
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">{formData.subCategory}</div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => navigate('/trade')}
            className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in duration-200">
            <div className="bg-indigo-600 p-4 text-white">
              <h3 className="text-xl font-bold flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Update Signal Status
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm text-gray-500">Selected Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${pendingStatus.color}`}>
                  {pendingStatus.label}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks / Update Message</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] shadow-inner"
                  placeholder="Enter remarks for this status update..."
                  value={modalRemarks}
                  onChange={(e) => setModalRemarks(e.target.value)}
                />
                <p className="mt-2 text-[11px] text-gray-400">
                  These remarks will be sent as part of the notification.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  onClick={handleConfirmUpdate}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center"
                >
                  {saving ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'Confirm Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTrade;
