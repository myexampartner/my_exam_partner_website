import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching pricing plans
export const fetchPricingPlans = createAsyncThunk(
  'pricing/fetchPricingPlans',
  async (isAdmin = false) => {
    const url = isAdmin ? '/api/pricing?admin=true' : '/api/pricing';
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch pricing plans');
    }
    
    return data.data;
  }
);

const pricingSlice = createSlice({
  name: 'pricing',
  initialState: {
    plans: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchPricingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = pricingSlice.actions;
export default pricingSlice.reducer;
