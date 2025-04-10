import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all subscription plans
export const getSubscriptionPlans = createAsyncThunk(
  'subscriptions/getPlans',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/subscriptions/plans');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get vendor subscription
export const getVendorSubscription = createAsyncThunk(
  'subscriptions/getVendorSubscription',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/subscriptions/vendor', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get all subscriptions (admin only)
export const getAllSubscriptions = createAsyncThunk(
  'subscriptions/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/subscriptions', config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update subscription plan
export const updateSubscriptionPlan = createAsyncThunk(
  'subscriptions/updatePlan',
  async (planData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // Use planId instead of id for API endpoint
      const { data } = await axios.put(`/api/subscriptions/plans/${planData.planId || planData.id}`, planData, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Verify subscription payment
export const verifySubscription = createAsyncThunk(
  'subscriptions/verify',
  async ({ id, paymentStatus }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`/api/subscriptions/${id}/verify`, { paymentStatus }, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create a new subscription plan
export const createSubscriptionPlan = createAsyncThunk(
  'subscriptions/createPlan',
  async (planData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post('/api/subscriptions/plans', planData, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create a new vendor subscription
export const createSubscription = createAsyncThunk(
  'subscriptions/create',
  async (subscriptionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post('/api/subscriptions', subscriptionData, config);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const initialState = {
  plans: [],
  subscriptions: [],
  vendorSubscription: null,
  loading: false,
  success: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    resetSubscriptionSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get subscription plans
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get vendor subscription
      .addCase(getVendorSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorSubscription = action.payload;
      })
      .addCase(getVendorSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all subscriptions
      .addCase(getAllSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(getAllSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update subscription plan
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the plan in the plans array
        state.plans = state.plans.map(plan => 
          (plan.id === action.payload.planId || plan.planId === action.payload.planId) ? action.payload : plan
        );
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Create subscription plan
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.plans.push(action.payload);
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Verify subscription
      .addCase(verifySubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifySubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update the subscription in the subscriptions array
        state.subscriptions = state.subscriptions.map(subscription => 
          subscription._id === action.payload._id ? action.payload : subscription
        );
      })
      .addCase(verifySubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.vendorSubscription = action.payload;
        // Add the new subscription to the subscriptions array if it exists
        if (state.subscriptions) {
          state.subscriptions.push(action.payload);
        }
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetSubscriptionSuccess } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;