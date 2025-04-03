import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import serviceReducer from './features/services/serviceSlice';
import categoryReducer from './features/categories/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    categories: categoryReducer,
  },
});

export default store;