import { useDispatch } from 'react-redux';
import { invalidateCache } from '@/store/blogsSlice';

/**
 * Hook to manage blog cache invalidation
 * Use this in admin panel after creating/updating/deleting blogs
 */
export const useBlogCache = () => {
  const dispatch = useDispatch();

  // Invalidate cache - forces refetch on next visit to blogs page
  const invalidateBlogCache = () => {
    dispatch(invalidateCache());
    console.log('✅ Blog cache invalidated');
  };

  return {
    invalidateBlogCache,
  };
};

export default useBlogCache;

