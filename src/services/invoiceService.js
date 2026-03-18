import api from './api';

const invoiceService = {
  getAllInvoices: async (params) => {
    try {
      const response = await api.get('/invoices', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyInvoices: async () => {
    try {
      const response = await api.get('/invoices/my');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default invoiceService;
