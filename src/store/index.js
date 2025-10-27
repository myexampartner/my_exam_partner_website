import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers } from '@reduxjs/toolkit';
import pricingReducer from './pricingSlice';
import blogsReducer from './blogsSlice';

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// Use localStorage only on client side
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage();

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['blogs'], // Only persist blogs state
  blacklist: ['pricing'], // Don't persist pricing (if you want)
};

// Blogs persist config (for better control)
const blogsPersistConfig = {
  key: 'blogs',
  storage,
  whitelist: ['blogs', 'featuredBlogs', 'lastFetched', 'filters'], // What to persist
  blacklist: ['loading', 'error'], // Don't persist loading and error states
};

// Combine reducers
const rootReducer = combineReducers({
  pricing: pricingReducer,
  blogs: persistReducer(blogsPersistConfig, blogsReducer),
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/REGISTER',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
        ],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
