import api from './api';

const pollService = {
  getAllPolls: (isActive) => api.get(`/polls${isActive !== undefined ? `?isActive=${isActive}` : ''}`),
  getPollById: (id) => api.get(`/polls/${id}`),
  getPollResults: (id) => api.get(`/polls/${id}/results`),
  createPoll: (pollData) => api.post('/polls', pollData),
  deletePoll: (id) => api.delete(`/polls/${id}`),
  togglePollStatus: (id) => api.patch(`/polls/${id}/status`),
};

export default pollService;
