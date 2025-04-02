import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import serviceReducer from './features/services/serviceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
  },
});

export default store;