"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Pagination,
  Grid,
  Chip,
  Avatar,
  Skeleton,
  Container,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday,
  Person,
  AccessTime,
  Category as CategoryIcon,
  TrendingUp,
  Refresh,
  Article,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, fetchFeaturedBlogs, setFilters, resetFilters } from '@/store/blogsSlice';
import BlogCard from './BlogCard';
import BlogSkeleton from './BlogSkeleton';

const CATEGORIES = [
  'Education', 'Technology', 'Tips & Tricks', 'Career', 
  'Study Material', 'Exam Preparation', 'News', 'Other'
];

function Blogs() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Get state from Redux
  const { 
    blogs, 
    featuredBlogs, 
    loading, 
    pagination, 
    filters,
    lastFetched 
  } = useSelector((state) => state.blogs);

  // Cache duration: 10 minutes for better performance
  const CACHE_DURATION = 10 * 60 * 1000;

  // Check if cache is valid
  const isCacheValid = () => {
    if (!lastFetched) return false;
    return Date.now() - lastFetched < CACHE_DURATION;
  };

  // Fetch blogs (with cache check)
  useEffect(() => {
    // If cache is valid and blogs exist, don't refetch
    if (isCacheValid() && blogs.length > 0) {
      console.log('Using cached blogs');
      return;
    }
    
    // Fetch fresh data
    dispatch(fetchBlogs(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dispatch]);

  // Fetch featured blogs (once on mount)
  useEffect(() => {
    // Only fetch if not already loaded or cache expired
    if (featuredBlogs.length === 0 || !isCacheValid()) {
      dispatch(fetchFeaturedBlogs());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    dispatch(setFilters({ page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle blog click
  const handleBlogClick = (blog) => {
    router.push(`/blogs/${blog.slug || blog._id}`);
  };

  // Reset filters
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
      minHeight: '100vh',
    }}>
      {/* Banner Section */}
      <Stack
        sx={{
          background: "url('/images/about-banner-bg.png'), linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // color: 'white',
          // py: { xs: 6, md: 10 },
          // px: 3,
          // textAlign: 'center',
          // position: 'relative',
          // overflow: 'hidden',
        }}
        px={[2,5]}
        minWidth={"100%"}
        maxWidth={"100%"}
        alignItems={'center'}
        alignSelf={'center'}
        justifySelf={'center'}
        spacing={3}
        py={[8,12,15,20]}
      >
        
         <Typography fontSize={[30,40,50,75]} fontWeight={550} color="var(--text-primary)" textAlign={'center'}>Our Blogs</Typography>
         <Typography fontSize={[16,18]} color="var(--text-primary)" maxWidth={'700px'} textAlign={'center'}>Insights, tips, and resources to help you excel in your academic journey. Discover expert guidance and stay ahead in your studies.</Typography>
         <Button  sx={{backgroundColor:"rgba(255, 96, 74, 1)",color:"var(--text-primary)",py:{xs:1.5,sm:1.5,md:2},px:{xs:1.5,sm:2,md:3},borderRadius:10,fontSize:{xs:13,sm:15,md:18}}} endIcon={<Article sx={{height:{xs:20,sm:22,md:25},width:{xs:20,sm:22,md:25}}}/>}>Explore Articles</Button>
    
      </Stack>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Featured Blogs Section */}
        {featuredBlogs.length > 0 && (
          <Box mb={6}>
            <Stack direction="row" alignItems="center" mb={3} gap={1}>
              <TrendingUp sx={{ color: '#667eea', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="var(--primary-color)">
                Featured Articles
              </Typography>
            </Stack>
            <Grid container spacing={3}>
              {featuredBlogs.map((blog) => (
                <Grid size={{ xs: 12, md: 4 }} key={blog._id}>
                  <BlogCard blog={blog} onClick={() => handleBlogClick(blog)} featured />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Search and Filter Section */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            p: 3,
            mb: 4,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                  },
                },
              }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                    boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={handleResetFilters}
              startIcon={<Refresh />}
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#667eea',
                color: '#667eea',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#764ba2',
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                },
              }}
            >
              Reset
            </Button>
          </Stack>

          {/* Active filters display */}
          {(filters.search || filters.category) && (
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" gap={1}>
              {filters.search && (
                <Chip
                  label={`Search: ${filters.search}`}
                  onDelete={() => handleFilterChange('search', '')}
                  color="primary"
                  size="small"
                />
              )}
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  onDelete={() => handleFilterChange('category', '')}
                  color="primary"
                  size="small"
                />
              )}
            </Stack>
          )}
        </Box>

        {/* Results count */}
        <Box mb={3}>
          <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
            {loading ? (
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    border: '2px solid #667eea',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                Loading articles...
              </Box>
            ) : (
              `${pagination.totalCount} article${pagination.totalCount !== 1 ? 's' : ''} found`
            )}
          </Typography>
        </Box>

        {/* Blogs Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                <BlogSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : blogs.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              backgroundColor: 'white',
              borderRadius: 3,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <Typography variant="h5" color="text.secondary" mb={2}>
              No articles found
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="contained"
              onClick={handleResetFilters}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                borderRadius: 2,
                px: 4,
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={blog._id}>
                <BlogCard blog={blog} onClick={() => handleBlogClick(blog)} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={6}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important',
                  color: 'white',
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Blogs;
