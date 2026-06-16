import api from './axios';

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const walletAPI = {
  getBalance: () => api.get('/api/wallet/balance'),
  getTransactions: (params) => api.get('/api/wallet/transactions', { params }),
};

export const transactionAPI = {
  deposit: (data) => api.post('/api/transactions/deposit', data),
  withdraw: (data) => api.post('/api/transactions/withdraw', data),
  requestOTP: (data) => api.post('/api/transactions/transfer/request-otp', data),
  transfer: (data) => api.post('/api/transactions/transfer', data),
};