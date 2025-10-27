import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
  Avatar,
} from '@mui/material';
import {
  CalendarToday,
  Person,
  AccessTime,
  Visibility,
  Star,
} from '@mui/icons-material';

function BlogCard({ blog, onClick, featured = false }) {
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: featured 
          ? '0 8px 24px rgba(102, 126, 234, 0.2)' 
          : '0 2px 12px rgba(0,0,0,0.08)',
        border: featured ? '2px solid #667eea' : 'none',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)',
          '& .blog-image': {
            transform: 'scale(1.08)',
          },
          '& .blog-title': {
            color: '#764ba2',
          },
          '& .read-more': {
            transform: 'translateX(8px)',
            color: '#764ba2',
          },
        },
      }}
    >
   
      {featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            backgroundColor: '#FFD700',
            color: '#000',
            borderRadius: '20px',
            px: 2,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontWeight: 'bold',
            fontSize: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <Star sx={{ fontSize: 16 }} />
          Featured
        </Box>
      )}

      {/* Blog Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
        <CardMedia
          component="img"
          image={blog.image?.url || '/images/scholar.jpg'}
          alt={blog.title}
          className="blog-image"
          onError={(e) => {
            // Fallback to default image if the main image fails to load
            e.target.src = '/images/scholar.jpg';
          }}
          sx={{
            height: '100%',
            width: '100%',
            // objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#f5f5f5', // Background color while loading
          }}
        />
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
      </Box>

      {/* Blog Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={1.5}
          className="blog-title"
          sx={{
            color: 'var(--primary-color)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            minHeight: 56,
            transition: 'color 0.3s ease',
          }}
        >
          {blog.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
            minHeight: 72,
          }}
        >
          {blog.description}
        </Typography>

        {/* Meta Information */}
        <Stack spacing={1.5}>
          {/* Author & Date */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Person sx={{ fontSize: 16, color: '#667eea' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {blog.author}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarToday sx={{ fontSize: 14, color: '#667eea' }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </Typography>
            </Stack>
          </Stack>

          {/* Read Time & Views */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <AccessTime sx={{ fontSize: 16, color: '#667eea' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {blog.readTime}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Visibility sx={{ fontSize: 16, color: '#667eea' }} />
              <Typography variant="caption" color="text.secondary">
                {blog.views || 0} views
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <Stack direction="row" spacing={0.5} mt={2} flexWrap="wrap" gap={0.5}>
            {blog.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: 10,
                  height: 20,
                  borderColor: '#667eea',
                  color: '#667eea',
                }}
              />
            ))}
            {blog.tags.length > 3 && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, alignSelf: 'center' }}>
                +{blog.tags.length - 3} more
              </Typography>
            )}
          </Stack>
        )}

        {/* Read Full Button */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Box
            className="read-more"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#667eea',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: 'inherit',
              }}
            >
              Read Full Article
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: 20,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              →
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default BlogCard;

