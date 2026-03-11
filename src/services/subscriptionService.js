import api from './api';

export const getAllSubscriptions = () => api.get('/subscriptions');
export const getSubscriptionById = (id) => api.get(`/subscriptions/${id}`);
export const createSubscription = (data) => api.post('/subscriptions', data);
export const updateSubscription = (id, data) => api.put(`/subscriptions/${id}`, data);
export const deleteSubscription = (id) => api.delete(`/subscriptions/${id}`);
export const getSubscriptionStats = () => api.get('/subscriptions/stats');
