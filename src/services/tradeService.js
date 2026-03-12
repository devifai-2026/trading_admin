import api from './api';

export const getAllTrades = (params = {}) => api.get('/trade', { params });
export const getTradeById = (id) => api.get(`/trade/${id}`);
export const createTrade = (tradeData) => api.post('/trade', tradeData);
export const updateTrade = (id, tradeData) => api.put(`/trade/${id}`, tradeData);
export const deleteTrade = (id) => api.delete(`/trade/${id}`);
export const getTradeStats = (params = {}) => api.get('/trade/stats/dashboard', { params });
