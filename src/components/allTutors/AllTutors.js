'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  Box,
  Skeleton,
  Pagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useMediaQuery,
  Rating,
  IconButton,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Search,
  School,
  Star,
  Verified,
  Email,
  Phone,
  TrendingUp,
  Clear,
  SearchOutlined
} from '@mui/icons-material';

// Skeleton Card Component
function TutorCardSkeleton() {
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 3, 
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease'
    }}>
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Skeleton variant="circular" width={120} height={120} />
          <Skeleton variant="text" width="70%" height={32} />
          <Skeleton variant="text" width="50%" height={24} />
          <Skeleton variant="rectangular" width="80%" height={20} />
          <Stack direction="row" spacing={1} width="100%">
            <Skeleton variant="rectangular" width="48%" height={36} />
            <Skeleton variant="rectangular" width="48%" height={36} />
          </Stack>
          <Skeleton variant="text" width="90%" height={60} />
        </Stack>
      </CardContent>
    </Card>
  );
}

// Tutor Card Component
function TutorCard({ tutor }) {
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 3, 
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(249, 250, 255, 1))',
      border: '1px solid rgba(102, 126, 234, 0.1)',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.12), 0 8px 32px rgba(102, 126, 234, 0.18)',
        transform: 'translateY(-8px)',
        border: '1px solid rgba(102, 126, 234, 0.3)'
      }
    }}>
      <CardContent>
        <Stack spacing={2} alignItems="center">
          {/* Avatar */}
          <Avatar
            src={tutor.image?.url || '/images/tutor1.png'}
            alt={tutor.name}
            sx={{ 
              width: 120, 
              height: 120,
              border: '4px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 2px 12px rgba(102, 126, 234, 0.15), 0 4px 20px rgba(102, 126, 234, 0.1)'
            }}
          />

          {/* Name with Verification */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" fontWeight={600} textAlign="center">
              {tutor.name}
            </Typography>
            {tutor.isVerified && (
              <Verified sx={{ color: '#4caf50', fontSize: 20 }} />
            )}
          </Stack>

          {/* Qualification */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            textAlign="center"
            sx={{ minHeight: 40 }}
          >
            {tutor.qualification}
          </Typography>

          {/* Subject Chip */}
          <Chip
            label={tutor.subject}
            icon={<School />}
            sx={{ 
              fontWeight: 500,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              color: '#667eea',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))'
              }
            }}
          />

          {/* Rating and Experience */}
          <Stack direction="row" spacing={2} width="100%" justifyContent="center">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Star sx={{ color: '#ffc107', fontSize: 20 }} />
              <Typography variant="body2" fontWeight={600}>
                {tutor.rating || 0}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {tutor.experience}
            </Typography>
          </Stack>

          {/* Status and Student Count */}
          <Stack direction="row" spacing={1} width="100%" justifyContent="center">
            <Chip
              label={tutor.status}
              color={tutor.status === 'active' ? 'success' : 'default'}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
            <Chip
              label={`${tutor.studentCount || 0} Students`}
              size="small"
              variant="outlined"
            />
          </Stack>

          {/* Bio */}
          {tutor.bio && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              textAlign="center"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 60
              }}
            >
              {tutor.bio}
            </Typography>
          )}

          {/* Contact Info */}
          <Stack spacing={0.5} width="100%">
            <Stack direction="row" spacing={1} alignItems="center">
              <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" noWrap>
                {tutor.email}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption">
                {tutor.phone}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function AllTutors() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'active', // Only show active tutors
    page: 1,
    limit: 9
  });

  const [searchInput, setSearchInput] = useState('');

  // Fetch tutors
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await fetch(`/api/tutors?${queryParams}`);
        const result = await response.json();

        if (result.success) {
          setTutors(result.data.tutors);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error('Error fetching tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [filters]);

  // Auto search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 500); // 500ms delay for auto-search

    return () => clearTimeout(delayDebounce);
  }, [searchInput, filters.search]);

  // Handle page change
  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  // Handle search button click
  const handleSearchClick = () => {
    setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
  };

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '', page: 1, status: 'active' }));
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Expert Online Tutors',
            description: 'Qualified tutors for IGCSE, GCSE, A-Level, and IB programs',
            numberOfItems: pagination.totalCount,
            itemListElement: tutors.slice(0, 10).map((tutor, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Person',
                name: tutor.name,
                jobTitle: `${tutor.subject} Tutor`,
                description: tutor.bio || `Expert ${tutor.subject} tutor with ${tutor.experience} of experience`,
                email: tutor.email,
                telephone: tutor.phone,
                image: tutor.image?.url,
                aggregateRating: tutor.rating ? {
                  '@type': 'AggregateRating',
                  ratingValue: tutor.rating,
                  bestRating: 5,
                } : undefined,
              },
            })),
          }),
        }}
      />

    {/* <Box sx={{ 
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 50%, rgba(26, 26, 46, 0.08) 100%)',
      minHeight: '100vh'
    }}> */}
      {/* Full Width Header Banner */}
      {/* <Box 
        sx={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 50%, rgba(26, 26, 46, 0.95) 100%)',
          py: 8,
          mb: 6,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center">
            <Typography 
              variant={isMobile ? 'h4' : 'h3'} 
              fontWeight={700}
              color="white"
              textAlign="center"
              sx={{
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.5px'
              }}
            >
              Our Expert Tutors
            </Typography>
            <Typography 
              variant="body1" 
              color="rgba(255, 255, 255, 0.95)"
              textAlign="center"
              maxWidth="600px"
              sx={{
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              Meet our qualified and experienced tutors ready to help you excel in your studies
            </Typography>
            <Typography 
              variant="h6" 
              color="white" 
              fontWeight={600}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                px: 3,
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
              }}
            >
              {pagination.totalCount} Tutors Available
            </Typography>
          </Stack>
        </Container>
      </Box> */}

      <Stack
        sx={{
          background: "url('/images/pricing-banner-bg.png'), linear-gradient(135deg, #EB7D7E, #B097BE, #6FD4E6)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        px={[2,5]}
        mb={10}
        minWidth={"100%"}
        maxWidth={"100%"}
        minHeight={"90vh"}
        alignItems={'center'}
        alignSelf={'center'}
        justifySelf={'center'}
        spacing={3}
        py={[8,12,15,20]}
      >
        <Typography fontSize={[30,40,50,75]} fontWeight={550} color="var(--text-primary)" textAlign={'center'}>Our Expert Tutors</Typography>
        <Typography fontSize={[16,18]} color="var(--text-primary)" maxWidth={'700px'} textAlign={'center'}>
        Meet our qualified and experienced tutors ready to help you excel in your studies</Typography>
        <Typography 
              variant="h6" 
              color="white" 
              fontWeight={600}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                px: 3,
                py: 1,
                borderRadius: 2,
                backdropFilter: 'blur(10px)'
              }}
            >
              {pagination.totalCount} Tutors Available
            </Typography>
      </Stack>

      <Container maxWidth="lg" sx={{ pb: 8 }}>

        {/* Enhanced Search & Filters */}
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06), 0 4px 20px rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 255, 1))',
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}>
          <Grid container spacing={2} alignItems="stretch">
            {/* Enhanced Search Bar */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={1} height="100%">
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="Search by name, email, subject, or qualification..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'white',
                        '&:hover': {
                          '& > fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.5)',
                          }
                        },
                        '&.Mui-focused': {
                          '& > fieldset': {
                            borderColor: 'rgba(102, 126, 234, 0.8)',
                            borderWidth: '2px'
                          }
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined sx={{ color: 'rgba(102, 126, 234, 0.7)', fontSize: 24 }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchInput && (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={handleClearSearch}
                            sx={{ 
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main'
                              }
                            }}
                          >
                            <Clear />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    size='small'
                    sx={{
                      minWidth: '120px',
                     backgroundColor: 'rgba(255, 96, 74, 1)',
                      color: 'white',
                      fontWeight: 600,
                      transition: 'all 0.3s ease'
                    }}
                    startIcon={<Search />}
                  >
                    Search
                  </Button>
                </Stack>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    fontStyle: 'italic',
                    ml: 0.5
                  }}
                >
                  💡 Auto-search enabled - results update as you type
                </Typography>
              </Stack>
            </Grid>
            
            {/* Status Filter */}
            {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Filter by Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{
                    background: 'white',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(102, 126, 234, 0.5)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(102, 126, 234, 0.8)',
                      borderWidth: '2px'
                    }
                  }}
                >
                  <MenuItem value="">All Tutors</MenuItem>
                  <MenuItem value="active">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                      <span>Active</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="inactive">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
                      <span>Inactive</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="pending">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
                      <span>Pending</span>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid> */}

            {/* Reset Button */}
            {/* <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchInput('');
                  setFilters({ search: '', status: '', page: 1, limit: 9 });
                }}
                disabled={!searchInput && !filters.status}
                sx={{
                  height: '56px',
                  borderColor: 'rgba(102, 126, 234, 0.5)',
                  color: '#667eea',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'rgba(102, 126, 234, 0.8)',
                    background: 'rgba(102, 126, 234, 0.05)'
                  },
                  '&:disabled': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)'
                  }
                }}
                startIcon={<Clear />}
              >
                Reset
              </Button>
            </Grid> */}

          </Grid>
        </Paper>

        {/* Tutors Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Show skeletons while loading
            Array.from(new Array(9)).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <TutorCardSkeleton />
              </Grid>
            ))
          ) : tutors.length > 0 ? (
            // Show only active tutors
            tutors
              .filter(tutor => tutor.status === 'active')
              .map((tutor) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tutor._id}>
                  <TutorCard tutor={tutor} />
                </Grid>
              ))
          ) : (
            // No tutors found
            <Grid size={{ xs: 12 }}>
              <Stack 
                alignItems="center" 
                spacing={2} 
                py={8}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                  borderRadius: 3,
                  border: '2px dashed rgba(102, 126, 234, 0.3)'
                }}
              >
                <School sx={{ fontSize: 80, color: '#667eea' }} />
                <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 600 }}>
                  No tutors found
                </Typography>
                <Typography color="text.secondary">
                  {filters.search || filters.status 
                    ? 'Try adjusting your search or filters using the Reset button above'
                    : 'No tutors available at the moment'
                  }
                </Typography>
              </Stack>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <Stack alignItems="center" mt={6}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'medium' : 'large'}
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 1), rgba(118, 75, 162, 1))'
                    }
                  }
                }
              }}
            />
          </Stack>
        )}
      </Container>
    {/* </Box> */}
    </>
  );
}

export default AllTutors;