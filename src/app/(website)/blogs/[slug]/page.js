"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Avatar,
  Divider,
  Grid,
  Skeleton,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  AccessTime,
  Visibility,
  ThumbUp,
  Share,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  ArrowBack,
  ContentCopy,
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import BlogCard from '@/components/blogs/BlogCard';

function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sharingPlatform, setSharingPlatform] = useState('');

  // Fetch blog details
  useEffect(() => {
    // Increment view count
    const incrementViews = async (blogId, currentViews) => {
      try {
        await fetch(`/api/blogs/${blogId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ views: (currentViews || 0) + 1 }),
        });
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    const fetchBlog = async () => {
      try {
        setLoading(true);
        
        // First try to fetch by slug using a more specific search
        let response = await fetch(`/api/blogs?search=${params.slug}&limit=1&status=published`);
        let result = await response.json();
        
        let blogData = null;
        
        if (result.success && result.data.blogs.length > 0) {
          // Check if any blog matches the slug exactly
          blogData = result.data.blogs.find(blog => 
            blog.slug === params.slug || blog._id === params.slug
          );
        }
        
        // If no exact match found, try fetching by ID directly (only if it looks like a valid ObjectId)
        if (!blogData && /^[0-9a-fA-F]{24}$/.test(params.slug)) {
          response = await fetch(`/api/blogs/${params.slug}`);
          result = await response.json();
          
          if (result.success) {
            blogData = result.data;
          }
        }
        
        if (blogData) {
          setBlog(blogData);
          
          // Fetch related blogs based on category
          fetchRelatedBlogs(blogData.category, blogData._id);
          
          // Increment view count
          incrementViews(blogData._id, blogData.views);
        } else {
          console.error('Blog not found');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  // Fetch related blogs
  const fetchRelatedBlogs = async (category, currentBlogId) => {
    try {
      setRelatedLoading(true);
      const response = await fetch(`/api/blogs?category=${category}&limit=3&status=published`);
      const result = await response.json();
      
      if (result.success) {
        // Filter out current blog
        const filtered = result.data.blogs.filter(b => b._id !== currentBlogId);
        setRelatedBlogs(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    } finally {
      setRelatedLoading(false);
    }
  };


  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share handlers
  const getCurrentUrl = () => {
    // Get the full URL including protocol and hostname
    return window.location.href;
  };

  // Copy URL to clipboard function
  const copyUrlToClipboard = async (url, platform) => {
    try {
      await navigator.clipboard.writeText(url);
      setSharingPlatform(platform);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setSharingPlatform('');
      }, 3000); // Hide success message after 3 seconds
      return true;
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setSharingPlatform(platform);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setSharingPlatform('');
        }, 3000);
        return true;
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const shareOnFacebook = async () => {
    const url = getCurrentUrl();
    const copied = await copyUrlToClipboard(url, 'Facebook');
    if (copied) {
      // 2-second delay to let user read the alert before redirecting
      setTimeout(() => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      }, 2000);
    }
  };

  const shareOnTwitter = async () => {
    const url = getCurrentUrl();
    const text = blog?.title || '';
    const copied = await copyUrlToClipboard(url, 'Twitter');
    if (copied) {
      // 2-second delay to let user read the alert before redirecting
      setTimeout(() => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
      }, 2000);
    }
  };

  const shareOnLinkedIn = async () => {
    const url = getCurrentUrl();
    const copied = await copyUrlToClipboard(url, 'LinkedIn');
    if (copied) {
      // 2-second delay to let user read the alert before redirecting
      setTimeout(() => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      }, 2000);
    }
  };

  const shareOnInstagram = async () => {
    const url = getCurrentUrl();
    const copied = await copyUrlToClipboard(url, 'Instagram');
    if (copied) {
      // 2-second delay to let user read the alert before redirecting
      setTimeout(() => {
        // Instagram doesn't have a direct sharing URL, so we'll open Instagram web
        window.open('https://www.instagram.com/', '_blank');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 3, mb: 4 }} />
          <Skeleton variant="text" width="80%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="100%" height={200} />
        </Container>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Blog Not Found
          </Typography>
          <Typography color="text.secondary" mb={3}>
            The article you&apos;re looking for doesn&apos;t exist or has been removed.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/blogs')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              px: 4,
            }}
          >
            Back to Blogs
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{blog.title} - Exam Partner Blog</title>
        <meta name="description" content={blog.description} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.image?.url} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Back Button */}
        <Box sx={{ backgroundColor: 'white', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/blogs')}
            sx={{
              textTransform: 'none',
              color: '#667eea',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
              },
            }}
          >
            Back to Blogs
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Blog Header */}
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                mb: 4,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Featured Image with overlay */}
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <Box
                  component="img"
                  src={blog.image?.url || '/images/scholar.jpg'}
                  alt={blog.title}
                  onError={(e) => {
                    // Fallback to default image if the main image fails to load
                    e.target.src = '/images/scholar.jpg';
                  }}
                  sx={{
                    width: '100%',
                    height: { xs: 300, sm: 400, md: 500 },
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    backgroundColor: '#f5f5f5', // Background color while loading
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
                {/* Category Badge on Image */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    backgroundColor: 'rgba(102, 126, 234, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {blog.category}
                </Box>
              </Box>

              {/* Blog Info */}
              <Box sx={{ p: { xs: 4, md: 6 } }}>
                {/* Title */}
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    color: 'var(--primary-color)',
                    mb: 4,
                    fontSize: { xs: 32, sm: 40, md: 48 },
                    lineHeight: 1.2,
                    fontFamily: "'Quicksand', sans-serif",
                    letterSpacing: '-0.5px',
                  }}
                >
                  {blog.title}
                </Typography>

                {/* Meta Information - Enhanced Design */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    mb: 4,
                    pb: 4,
                    borderBottom: '2px solid #f0f0f0',
                  }}
                >
                  {/* Author */}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: '2px solid white',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      <Person sx={{ fontSize: 24 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        Written by
                      </Typography>
                      <Typography variant="body1" fontWeight={700} sx={{ color: 'var(--primary-color)' }}>
                        {blog.author}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Date */}
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 140 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CalendarToday sx={{ fontSize: 20, color: '#667eea' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        Published
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Read Time */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AccessTime sx={{ fontSize: 20, color: '#667eea' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        Reading time
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {blog.readTime}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Views */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Visibility sx={{ fontSize: 20, color: '#667eea' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        Views
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {blog.views || 0}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Description - Enhanced */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                    borderLeft: '5px solid',
                    borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
                    p: 4,
                    borderRadius: 3,
                    mb: 5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--primary-color)',
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      fontSize: { xs: 18, md: 20 },
                    }}
                  >
                    {blog.description}
                  </Typography>
                </Box>

                {/* Content - Enhanced Typography */}
                {blog.content && blog.content.trim() && !blog.content.includes('Create New Article') ? (
                  <Box
                    sx={{
                      '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 3,
                        my: 4,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                      '& p': {
                        fontSize: { xs: 16, md: 18 },
                        lineHeight: 1.9,
                        color: 'rgba(0,0,0,0.85)',
                        mb: 3,
                        fontFamily: "'Quicksand', sans-serif",
                      },
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        color: 'var(--primary-color)',
                        fontWeight: 'bold',
                        mt: 5,
                        mb: 3,
                        lineHeight: 1.3,
                        fontFamily: "'Quicksand', sans-serif",
                      },
                      '& h1': { fontSize: { xs: 28, md: 36 } },
                      '& h2': { fontSize: { xs: 24, md: 32 } },
                      '& h3': { fontSize: { xs: 20, md: 28 } },
                      '& ul, & ol': {
                        pl: 4,
                        mb: 3,
                      },
                      '& li': {
                        fontSize: { xs: 16, md: 18 },
                        lineHeight: 1.9,
                        mb: 1.5,
                      },
                      '& blockquote': {
                        borderLeft: '5px solid',
                        borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
                        pl: 4,
                        py: 2,
                        my: 4,
                        fontStyle: 'italic',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: '0 8px 8px 0',
                        fontSize: { xs: 16, md: 18 },
                      },
                      '& code': {
                        backgroundColor: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: 1,
                        fontSize: { xs: 14, md: 16 },
                        fontFamily: 'monospace',
                        border: '1px solid #e0e0e0',
                      },
                      '& pre': {
                        backgroundColor: '#f5f5f5',
                        p: 3,
                        borderRadius: 2,
                        overflow: 'auto',
                        mb: 3,
                        border: '1px solid #e0e0e0',
                        '& code': {
                          backgroundColor: 'transparent',
                          padding: 0,
                          border: 'none',
                        },
                      },
                      '& a': {
                        color: '#667eea',
                        textDecoration: 'none',
                        borderBottom: '2px solid rgba(102, 126, 234, 0.3)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderBottomColor: '#667eea',
                          color: '#764ba2',
                        },
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 3,
                      border: '2px dashed rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary" mb={2}>
                      📝 Content Coming Soon
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This article is being prepared. Please check back later for the full content.
                    </Typography>
                  </Box>
                )}

                {/* Tags - Enhanced */}
                {blog.tags && blog.tags.length > 0 && (
                  <Box sx={{ mt: 5, pt: 4, borderTop: '2px solid #f0f0f0' }}>
                    <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: 'var(--primary-color)' }}>
                      🏷️ Tags
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1.5}>
                      {blog.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={`#${tag}`}
                          sx={{
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            fontWeight: 600,
                            fontSize: 13,
                            px: 1,
                            height: 32,
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            '&:hover': {
                              backgroundColor: '#667eea',
                              color: 'white',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* Share Section - Enhanced */}
                <Box 
                  sx={{ 
                    mt: 5, 
                    pt: 4, 
                    borderTop: '2px solid #f0f0f0',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: 'var(--primary-color)' }}>
                    💬 Share this article
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                    <IconButton
                      onClick={shareOnFacebook}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#1877f2',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#145dbf',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(24, 119, 242, 0.4)',
                        },
                      }}
                    >
                      <Facebook />
                    </IconButton>
                    <IconButton
                      onClick={shareOnTwitter}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#1da1f2',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#0c85d0',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(29, 161, 242, 0.4)',
                        },
                      }}
                    >
                      <Twitter />
                    </IconButton>
                    <IconButton
                      onClick={shareOnLinkedIn}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#0077b5',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#005885',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(0, 119, 181, 0.4)',
                        },
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                    <IconButton
                      onClick={shareOnInstagram}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#E4405F',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#C13584',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 16px rgba(225, 48, 108, 0.4)',
                        },
                      }}
                    >
                      <Instagram />
                    </IconButton>
                  </Stack>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Author Box - Enhanced */}
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 4,
                p: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                mb: 3,
                textAlign: 'center',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: 40,
                  fontWeight: 'bold',
                  border: '4px solid white',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                }}
              >
                {blog.author.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight="bold" mb={0.5} sx={{ color: 'var(--primary-color)' }}>
                {blog.author}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Content Writer
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Sharing knowledge and insights to help you succeed
              </Typography>
            </Box>

            {/* Related Blogs - Enhanced */}
            {relatedBlogs.length > 0 && (
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  p: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              >
                <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: 'var(--primary-color)' }}>
                  📚 Related Articles
                </Typography>
                <Stack spacing={2}>
                  {relatedLoading ? (
                    [1, 2, 3].map((item) => (
                      <Box key={item}>
                        <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2, mb: 1 }} />
                        <Skeleton variant="text" width="80%" />
                      </Box>
                    ))
                  ) : (
                    relatedBlogs.map((relatedBlog) => (
                      <Box
                        key={relatedBlog._id}
                        onClick={() => router.push(`/blogs/${relatedBlog.slug || relatedBlog._id}`)}
                        sx={{
                          cursor: 'pointer',
                          p: 2,
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: '#f8f9fa',
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Box
                            component="img"
                            src={relatedBlog.image?.url || '/images/scholar.jpg'}
                            alt={relatedBlog.title}
                            onError={(e) => {
                              // Fallback to default image if the main image fails to load
                              e.target.src = '/images/scholar.jpg';
                            }}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 2,
                              backgroundColor: '#f5f5f5', // Background color while loading
                            }}
                          />
                          <Box flex={1}>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                mb: 0.5,
                              }}
                            >
                              {relatedBlog.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {relatedBlog.readTime}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))
                  )}
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* More Related Blogs Section */}
        {relatedBlogs.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={4}
              sx={{ color: 'var(--primary-color)' }}
            >
              You May Also Like
            </Typography>
            <Grid container spacing={3}>
              {relatedBlogs.map((relatedBlog) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={relatedBlog._id}>
                  <BlogCard
                    blog={relatedBlog}
                    onClick={() => router.push(`/blogs/${relatedBlog.slug || relatedBlog._id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>

    {/* Copy Success Snackbar */}
    <Snackbar
      open={copySuccess}
      autoHideDuration={3000}
      onClose={() => {
        setCopySuccess(false);
        setSharingPlatform('');
      }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => {
          setCopySuccess(false);
          setSharingPlatform('');
        }} 
        severity="success" 
        sx={{ 
          width: '100%',
          backgroundColor: '#4caf50',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white'
          },
          '& .MuiAlert-action': {
            color: 'white'
          },
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        icon={<ContentCopy sx={{ color: 'white' }} />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" fontWeight="bold" sx={{ color: 'white' }}>
            Blog link copied!
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Redirecting to {sharingPlatform}...
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
    </>
  );
}

export default BlogDetailPage;

