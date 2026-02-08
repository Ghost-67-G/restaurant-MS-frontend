import api from '../lib/api';

const invoiceService = {
  createInvoice: async (orderId) => {
    const response = await api.post('/invoices', { orderId });
    return response.data;
  },

  getInvoices: async (params) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  getInvoice: async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data;
  },

  getInvoiceByNumber: async (invoiceNumber) => {
    const response = await api.get(`/invoices/number/${invoiceNumber}`);
    return response.data;
  },

  getOrderInvoice: async (orderId) => {
    const response = await api.get(`/invoices/order/${orderId}`);
    return response.data;
  },
};

export default invoiceService;
