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
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/subscriptions/vendor');
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

// Get all subscriptions (admin only)
export const getAllSubscriptions = createAsyncThunk(
  'subscriptions/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/subscriptions');
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

// Update subscription plan
export const updateSubscriptionPlan = createAsyncThunk(
  'subscriptions/updatePlan',
  async (planData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/subscriptions/plans/${planData.id}`, planData);
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
          plan.id === action.payload.id ? action.payload : plan
        );
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetSubscriptionSuccess } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;