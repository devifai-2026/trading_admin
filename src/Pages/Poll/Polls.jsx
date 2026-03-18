import React, { useState, useEffect } from 'react';
import { Plus, Trash2, PieChart, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pollService from '../../services/pollService';
import toast from 'react-hot-toast';

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [selectedPollResults, setSelectedPollResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await pollService.getAllPolls();
      if (response.success) {
        setPolls(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch polls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (id) => {
    try {
      setResultsLoading(true);
      setShowResultsModal(true);
      const response = await pollService.getPollResults(id);
      if (response.success) {
        setSelectedPollResults(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch results');
      setShowResultsModal(false);
    } finally {
      setResultsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this poll?')) return;
    try {
      const response = await pollService.deletePoll(id);
      if (response.success) {
        toast.success('Poll deleted successfully');
        setPolls(polls.filter((poll) => poll._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete poll');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await pollService.togglePollStatus(id);
      if (response.success) {
        toast.success(`Poll ${response.data.isActive ? 'activated' : 'deactivated'}`);
        setPolls(polls.map((poll) => (poll._id === id ? { ...poll, isActive: response.data.isActive } : poll)));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Poll Management</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage polls for your users.</p>
        </div>
        <button
          onClick={() => navigate('/polls/add')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Create Poll
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {polls.length === 0 ? (
            <li className="px-6 py-12 text-center text-gray-500">No polls found. Create one to get started!</li>
          ) : (
            polls.map((poll) => (
              <li key={poll._id}>
                <div className="px-4 py-4 flex items-center justify-between sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{poll.question}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            poll.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {poll.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Expires: {new Date(poll.expires_at).toLocaleDateString()}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Options: {poll.options?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-4 items-center">
                    <button
                      onClick={() => handleViewResults(poll._id)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="View Results"
                    >
                      <PieChart size={20} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(poll._id)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title={poll.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {poll.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(poll._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowResultsModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Poll Results</h3>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    {resultsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                      </div>
                    ) : selectedPollResults ? (
                      <div className="space-y-4">
                        <p className="text-sm font-semibold text-gray-600 italic">
                            Total Votes: {selectedPollResults.totalVotes}
                        </p>
                        {selectedPollResults.results.map((res) => (
                          <div key={res.option_id} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">{res.option_text}</span>
                              <span className="text-gray-500">{res.vote_count} votes ({res.percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${res.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No results found.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setShowResultsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Polls;
