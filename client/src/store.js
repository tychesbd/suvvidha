import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import serviceReducer from './features/services/serviceSlice';
import categoryReducer from './features/categories/categorySlice';
import contentReducer from './features/content/contentSlice';
import notificationReducer from './features/notifications/notificationSlice';
import bookingReducer from './features/bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    categories: categoryReducer,
    content: contentReducer,
    notifications: notificationReducer,
    bookings: bookingReducer,
  },
});

export default store;