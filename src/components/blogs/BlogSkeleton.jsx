import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Box,
} from '@mui/material';

function BlogSkeleton() {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        height={220}
        animation="pulse"
        sx={{ 
          borderRadius: 0,
          animationDuration: '1.2s',
        }}
      />

      {/* Content Skeleton */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width="90%"
          height={32}
          animation="pulse"
          sx={{ 
            mb: 1,
            animationDuration: '1.2s',
          }}
        />
        <Skeleton
          variant="text"
          width="70%"
          height={32}
          animation="pulse"
          sx={{ 
            mb: 2,
            animationDuration: '1.2s',
          }}
        />

        {/* Description Skeleton */}
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          animation="pulse"
          sx={{ 
            mb: 0.5,
            animationDuration: '1.2s',
          }}
        />
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          animation="pulse"
          sx={{ 
            mb: 0.5,
            animationDuration: '1.2s',
          }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          animation="pulse"
          sx={{ 
            mb: 2,
            animationDuration: '1.2s',
          }}
        />

        {/* Meta Information Skeleton */}
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="text" width={100} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
            <Skeleton variant="text" width={100} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Skeleton variant="text" width={80} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
            <Skeleton variant="text" width={80} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
          </Stack>
        </Stack>

        {/* Tags Skeleton */}
        <Stack direction="row" spacing={1} mt={2}>
          <Skeleton variant="rounded" width={60} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
          <Skeleton variant="rounded" width={70} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
          <Skeleton variant="rounded" width={50} height={20} animation="pulse" sx={{ animationDuration: '1.2s' }} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default BlogSkeleton;

