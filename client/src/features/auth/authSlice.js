import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user from localStorage
const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('/api/users', userData);
      if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('/api/users/login', userData);
      if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('userInfo');
});

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      
      // Check if userData is FormData (for file uploads)
      const isFormData = userData instanceof FormData;
      
      const config = {
        headers: {
          // Don't set Content-Type for FormData, browser will set it with boundary
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          Authorization: `Bearer ${token}`,
        },
        // Add timeout to prevent request hanging indefinitely
        timeout: 30000,
      };
      
      // Log FormData contents for debugging (in development only)
      if (isFormData) {
        console.log('FormData contents:');
        for (let pair of userData.entries()) {
          console.log(pair[0] + ': ' + (pair[0] === 'idProofDocument' ? 'File object' : pair[1]));
        }
      }
      
      // Make the API request with simplified error handling
      const response = await axios.put('/api/users/profile', userData, config);
      
      // Ensure we have response data before proceeding
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      // Make sure the token is properly included in the response data
      // If the server didn't return a token, use the existing one
      const responseWithToken = {
        ...response.data,
        token: response.data.token || token
      };
      
      // Update localStorage immediately with the complete data including token
      localStorage.setItem('userInfo', JSON.stringify(responseWithToken));
      
      console.log('Profile updated successfully:', responseWithToken);
      return responseWithToken;
    } catch (error) {
      console.error('Profile update error:', error);
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put('/api/users/change-password', passwordData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userInfo = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userInfo = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
        // Ensure updated user info is saved to localStorage with the token
        // This is redundant since we already save it in the thunk, but keeping it for safety
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;