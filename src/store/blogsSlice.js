import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  blogs: [],
  featuredBlogs: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    search: '',
    category: '',
    page: 1,
    limit: 9,
    status: 'published',
  },
  lastFetched: null, // timestamp for cache invalidation
};

// Async thunk to fetch blogs
export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (filters, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/blogs?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        return {
          blogs: result.data.blogs,
          pagination: result.data.pagination,
        };
      } else {
        return rejectWithValue(result.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch featured blogs
export const fetchFeaturedBlogs = createAsyncThunk(
  'blogs/fetchFeaturedBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/blogs?featured=true&limit=3&status=published');
      const result = await response.json();

      if (result.success) {
        return result.data.blogs;
      } else {
        return rejectWithValue(result.message || 'Failed to fetch featured blogs');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Blogs slice
const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to page 1 when filters change (except page itself)
      if (!action.payload.page) {
        state.filters.page = 1;
      }
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        page: 1,
        limit: 9,
        status: 'published',
      };
    },
    clearBlogs: (state) => {
      state.blogs = [];
      state.featuredBlogs = [];
      state.lastFetched = null;
    },
    invalidateCache: (state) => {
      // Mark cache as invalid by clearing timestamp
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
        state.lastFetched = Date.now();
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch featured blogs
    builder
      .addCase(fetchFeaturedBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBlogs = action.payload;
      })
      .addCase(fetchFeaturedBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, clearBlogs, invalidateCache } = blogsSlice.actions;
export default blogsSlice.reducer;

