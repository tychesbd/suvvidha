import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/bookings';

// Get user bookings
export const getUserBookings = createAsyncThunk(
  'bookings/getUserBookings',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get booking counts
export const getBookingCounts = createAsyncThunk(
  'bookings/getBookingCounts',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/counts`, config);
      return response.data;
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  bookings: [],
  counts: {
    active: 0,
    completed: 0,
    cancelled: 0
  },
  loading: false,
  error: null,
  success: false,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user bookings
      .addCase(getUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.success = true;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get booking counts
      .addCase(getBookingCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.counts = action.payload;
        state.success = true;
      })
      .addCase(getBookingCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;