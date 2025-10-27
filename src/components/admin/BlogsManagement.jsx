"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Pagination,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Alert,
  Snackbar,
  Slide,
  DialogContentText,
  Divider,
  LinearProgress,
  Switch,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  Article,
  Star,
  Search,
  CloudUpload,
  TrendingUp,
  Refresh,
  Save,
  Cancel,
  CheckCircle,
  Error,
  Warning,
  Category,
  Publish,
  Bookmark,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import useBlogCache from '@/hooks/useBlogCache';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Blog categories
const CATEGORIES = [
  'Education', 'Technology', 'Tips & Tricks', 'Career', 
  'Study Material', 'Exam Preparation', 'News', 'Other'
];

// Status options
const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'archived', label: 'Archived', color: 'error' }
];

// Quill editor modules
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'blockquote', 'code-block',
  'list', 'bullet',
  'indent',
  'direction', 'align',
  'link', 'image', 'video'
];

// Styled Dialog
const StyledDialog = ({ children, ...props }) => (
  <Dialog
    {...props}
    sx={{
      '& .MuiDialog-paper': {
        zIndex: 1300,
        maxHeight: '90vh',
        margin: '16px',
      },
      '& .MuiBackdrop-root': {
        zIndex: 1299,
      },
      ...props.sx,
    }}
  >
    {children}
  </Dialog>
);

// Styled Snackbar
const StyledSnackbar = ({ children, ...props }) => (
  <Snackbar
    {...props}
    sx={{
      zIndex: 1400,
      ...props.sx,
    }}
  >
    {children}
  </Snackbar>
);

function BlogsManagement() {
  // Cache management hook
  const { invalidateBlogCache } = useBlogCache();
  
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  
  // Loading states
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    author: "Admin",
    category: "Education",
    tags: [],
    status: "draft",
    featured: false,
    image: null,
    imagePreview: "/images/blog-default.jpg",
    imagePublicId: ""
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    featured: "",
    page: 1,
    limit: 10
  });

  // Error and success states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tagInput, setTagInput] = useState("");

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/blogs?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setBlogs(result.data.blogs);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to fetch blogs');
        toast.error(result.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Network error. Please check your connection.');
      toast.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Load blogs on component mount and when filters change
  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  // Handle dialog operations
  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditMode(true);
      setSelectedBlog(blog);
      setFormData({
        ...blog,
        imagePreview: blog.image?.url || "/images/blog-default.jpg",
        image: blog.image?.url || null, // Keep existing image URL
        imagePublicId: blog.image?.public_id || "", // Keep existing public ID
        tags: blog.tags || []
      });
    } else {
      setEditMode(false);
      setSelectedBlog(null);
      setFormData({
        title: "",
        description: "",
        content: "",
        author: "Admin",
        category: "Education",
        tags: [],
        status: "draft",
        featured: false,
        image: null,
        imagePreview: "/images/blog-default.jpg",
        imagePublicId: ""
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;
    
    setOpenDialog(false);
    setEditMode(false);
    setSelectedBlog(null);
    setError(null);
    setSuccess(null);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setOpenViewDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle tags
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', 'exam-partner/blogs');

        console.log('Uploading image to Cloudinary...', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        console.log('Upload response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Upload result:', result);

        if (result.success) {
          setFormData(prev => ({
            ...prev,
            image: result.data.secure_url,
            imagePreview: result.data.secure_url,
            imagePublicId: result.data.public_id
          }));
          toast.success('Image uploaded successfully');
        } else {
          console.error('Upload failed:', result);
          toast.error(result.message || 'Failed to upload image');
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error(`Upload failed: ${error.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  // Save blog (create or update)
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Basic validation
      if (!formData.title || !formData.description || !formData.content || !formData.category) {
        setError('Please fill in all required fields');
        toast.error('Please fill in all required fields');
        setSaving(false);
        return;
      }

      const url = editMode ? `/api/blogs/${selectedBlog._id}` : '/api/blogs';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message);
        // Invalidate blog cache so website shows fresh data
        invalidateBlogCache();
        handleCloseDialog();
        fetchBlogs();
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setError('Network error. Please try again.');
      toast.error('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  // Delete blog with SweetAlert2
  const handleDelete = async (blog) => {
    const result = await Swal.fire({
      title: 'Delete Article?',
      html: `Are you sure you want to delete <strong>"${blog.title}"</strong>?<br/><small>This action cannot be undone.</small>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-professional',
        title: 'swal-title',
        htmlContainer: 'swal-text'
      },
      buttonsStyling: true,
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting...',
          text: 'Please wait',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const response = await fetch(`/api/blogs/${blog._id}`, {
        method: 'DELETE',
      });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Article has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#1a1a2e',
            timer: 2000,
            showConfirmButton: false
          });
          toast.success(data.message);
          // Invalidate blog cache so website shows fresh data
          invalidateBlogCache();
        fetchBlogs();
      } else {
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Failed to delete article.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
          });
          toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Network error. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d32f2f'
        });
      toast.error('Failed to delete blog');
      }
    }
  };

  // Handle pagination
  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  // Close success/error messages
  const handleCloseMessage = () => {
    setError(null);
    setSuccess(null);
  };

  // Calculate stats
  const stats = useMemo(() => ({
    total: pagination.totalCount,
    published: blogs.filter(b => b.status === 'published').length,
    draft: blogs.filter(b => b.status === 'draft').length,
    totalViews: blogs.reduce((acc, b) => acc + (b.views || 0), 0)
  }), [blogs, pagination.totalCount]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', position: 'relative' }}>
      {/* Success/Error Messages */}
      <StyledSnackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleCloseMessage}
          severity="success"
          variant="filled"
          icon={<CheckCircle />}
          sx={{ minWidth: '300px', zIndex: 1401 }}
        >
          {success}
        </Alert>
      </StyledSnackbar>

      <StyledSnackbar
        open={!!error}
        autoHideDuration={8000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleCloseMessage}
          severity="error"
          variant="filled"
          icon={<Error />}
          sx={{ minWidth: '300px', zIndex: 1401 }}
        >
          {error}
        </Alert>
      </StyledSnackbar>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
      >
        <Box>
            <Typography 
              variant="h4" 
              fontWeight="700" 
              sx={{ 
                color: '#1a1a2e',
                letterSpacing: '-0.5px',
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Blog Management
          </Typography>
            <Typography 
              color="text.secondary" 
              variant="body2"
              sx={{ fontWeight: 400 }}
            >
              {pagination.totalCount} total articles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
          sx={{
              background: "#1a1a2e",
            textTransform: "none",
              px: { xs: 1.5, sm: 3 },
              py: 1.2,
              borderRadius: 2,
              fontSize: { xs: '0.85rem', sm: '0.95rem' },
            fontWeight: 600,
              boxShadow: 'none',
            '&:hover': {
                background: "#2d2d44",
                boxShadow: '0 4px 12px rgba(26, 26, 46, 0.2)',
            },
            '&:disabled': {
              background: '#ccc',
            },
              transition: 'all 0.2s ease',
              '& .MuiButton-startIcon': {
                marginRight: { xs: 0, sm: 1 }
              },
              '& .MuiButton-label': {
                display: { xs: 'none', sm: 'flex' }
              }
          }}
        >
            New Article
        </Button>
      </Stack>
                </Box>


      {/* Filters */}
      <Paper sx={{ 
        p: 2.5, 
        mb: 3, 
        borderRadius: 2, 
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
        backgroundColor: '#fafafa'
      }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Search articles..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            disabled={loading}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: '#757575' }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: 280,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#e0e0e0' }
              }
            }}
          />
          
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category || ""}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
              disabled={loading}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#e0e0e0' }
              }}
            >
              <MenuItem value="">All</MenuItem>
              {CATEGORIES.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 130 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={loading}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#e0e0e0' }
              }}
            >
              <MenuItem value="">All</MenuItem>
              {STATUS_OPTIONS.map(status => (
                <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 130 }} size="small">
            <InputLabel>Featured</InputLabel>
            <Select
              value={filters.featured || ""}
              label="Featured"
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              disabled={loading}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1.5,
                '& fieldset': { borderColor: '#e0e0e0' }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            onClick={() => setFilters({ search: "", category: "", status: "", featured: "", page: 1, limit: 10 })}
            disabled={loading}
            sx={{ 
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#424242',
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: 'white'
              }
            }}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* Blogs Table */}
      <Paper sx={{ 
        borderRadius: 2, 
        border: '1px solid #e0e0e0',
        boxShadow: 'none', 
        overflow: 'hidden',
        backgroundColor: 'white'
      }}>
        {loading ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Article</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Skeleton variant="rounded" width={56} height={56} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="70%" height={24} />
                          <Skeleton variant="text" width="40%" height={20} />
          </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={100} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={60} height={18} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : blogs.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <Article sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" variant="h6" gutterBottom>
              No blogs found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {filters.search || filters.category || filters.status 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first blog'
              }
            </Typography>
            {!(filters.search || filters.category || filters.status) && (
              <Button
                variant="contained"
                onClick={() => handleOpenDialog()}
                startIcon={<Add />}
                sx={{ textTransform: 'none' }}
              >
                Create First Blog
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Article</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Author</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow
                      key={blog._id}
                      sx={{
                        '&:hover': { backgroundColor: '#fafafa' },
                        transition: 'background-color 0.15s ease',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar 
                            src={blog.image?.url || "/images/blog-default.jpg"} 
                            alt={blog.title}
                            variant="rounded"
                            sx={{ width: 56, height: 56, border: '1px solid #e0e0e0' }}
                          />
                          <Box>
                            <Typography fontWeight={600} variant="body1">
                              {blog.title}
                              {blog.featured && (
                                <Tooltip title="Featured">
                                  <Star sx={{ ml: 1, color: '#ffc107', fontSize: 18 }} />
                                </Tooltip>
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {blog.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={blog.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<Category />}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {blog.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {blog.readTime}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getStatusLabel(blog.status)}
                          color={getStatusColor(blog.status)}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() => handleViewBlog(blog)}
                              sx={{ 
                                color: '#616161',
                                '&:hover': { backgroundColor: '#f5f5f5', color: '#424242' }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(blog)}
                              sx={{ 
                                color: '#616161',
                                '&:hover': { backgroundColor: '#f5f5f5', color: '#1a1a2e' }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(blog)}
                              sx={{ 
                                color: '#616161',
                                '&:hover': { backgroundColor: '#ffebee', color: '#d32f2f' }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box display="flex" justifyContent="center" p={3}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <StyledDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="lg" 
        fullWidth
        disableEscapeKeyDown={saving}
      >
        <DialogTitle sx={{ 
          pb: 2.5, 
          pt: 3,
          px: 3,
          background: 'white', 
          color: '#1a1a2e',
          borderBottom: '1px solid #e0e0e0',
          position: 'relative'
        }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
              {editMode ? "Edit Article" : "Create New Article"}
            </Typography>
            <IconButton 
              onClick={handleCloseDialog} 
              sx={{ color: '#616161' }}
              disabled={saving}
            >
              <Close />
            </IconButton>
          </Stack>
          {saving && (
            <LinearProgress 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#1a1a2e'
                }
              }} 
            />
          )}
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {/* Error/Success Messages in Dialog */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={handleCloseMessage}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Image Upload */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', border: '2px dashed #e0e0e0' }}>
                <Avatar
                  src={formData.imagePreview}
                  alt="Blog"
                  variant="rounded"
                  sx={{ width: '100%', height: 180, margin: '0 auto', mb: 2 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                  disabled={uploading}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={uploading ? <CircularProgress size={16} /> : <CloudUpload />}
                    disabled={uploading}
                    sx={{ textTransform: 'none' }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </label>
                <Typography variant="caption" display="block" mt={1} color="text.secondary">
                  Recommended: 1200x630px (Max 5MB)
                </Typography>
              </Paper>
            </Grid>

            {/* Basic Information */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Blog Title"
                    fullWidth
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    disabled={saving}
                    error={!formData.title && error}
                    placeholder="Enter an engaging blog title..."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Author"
                    fullWidth
                    value={formData.author || ""}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    disabled={saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!formData.category && error}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={formData.category || "Education"}
                      label="Category"
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={saving}
                    >
                      {CATEGORIES.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status || "draft"}
                      label="Status"
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={saving}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        disabled={saving}
                      />
                    }
                    label="Featured Blog"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Short Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description || ""}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
                disabled={saving}
                error={!formData.description && error}
                placeholder="Write a brief description (max 500 characters)..."
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.description?.length || 0}/500 characters`}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Box>
                <TextField
                  label="Tags"
                  fullWidth
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  disabled={saving}
                  placeholder="Add tags and press Enter..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          size="small" 
                          onClick={handleAddTag}
                          disabled={!tagInput.trim() || saving}
                        >
                          Add
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" gap={1}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                      disabled={saving}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Rich Text Editor */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Blog Content *
              </Typography>
              <Box sx={{ 
                '& .quill': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                },
                '& .ql-container': {
                  minHeight: '400px',
                  fontSize: '16px',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                },
                '& .ql-toolbar': {
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  backgroundColor: '#f5f5f5'
                }
              }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content || ""}
                  onChange={(value) => handleInputChange('content', value)}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your blog content here..."
                  readOnly={saving}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2.5, background: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{ 
              textTransform: 'none',
              color: '#616161',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} /> : <Save />}
            sx={{
              background: "#1a1a2e",
              textTransform: 'none',
              px: 3,
              boxShadow: 'none',
              '&:hover': {
                background: "#2d2d44",
                boxShadow: 'none',
              },
              '&:disabled': {
                background: '#ccc',
              }
            }}
          >
            {saving ? 'Saving...' : (editMode ? "Update" : "Create")}
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* View Dialog */}
      <StyledDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'white', 
          color: '#1a1a2e',
          borderBottom: '1px solid #e0e0e0',
          pb: 2.5, 
          pt: 3,
          px: 3
        }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
              Article Details
            </Typography>
            <IconButton onClick={() => setOpenViewDialog(false)} sx={{ color: '#616161' }}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {selectedBlog && (
            <Stack spacing={3}>
              {/* Blog Image */}
              <Box>
                <img
                  src={selectedBlog.image?.url || "/images/blog-default.jpg"}
                  alt={selectedBlog.title}
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: 12,
                    maxHeight: 400,
                    objectFit: 'cover'
                  }}
                />
              </Box>

              {/* Blog Info */}
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {selectedBlog.title}
                  {selectedBlog.featured && (
                    <Star sx={{ ml: 1, color: '#ffc107', verticalAlign: 'middle' }} />
                  )}
                </Typography>
                <Stack direction="row" spacing={2} mb={2}>
                  <Chip label={selectedBlog.category} color="primary" size="small" />
                  <Chip 
                    label={getStatusLabel(selectedBlog.status)} 
                    color={getStatusColor(selectedBlog.status)} 
                    size="small" 
                  />
                </Stack>
                <Stack direction="row" spacing={3} color="text.secondary" mb={2}>
                  <Typography variant="body2">
                    By {selectedBlog.author}
                  </Typography>
                  <Typography variant="body2">
                    {selectedBlog.readTime}
                  </Typography>
                  <Typography variant="body2">
                    👁️ {selectedBlog.views || 0} views
                  </Typography>
                  <Typography variant="body2">
                    ❤️ {selectedBlog.likes || 0} likes
                  </Typography>
                </Stack>
              </Box>

              {/* Description */}
              <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                <Typography color="text.secondary" fontSize={12} gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedBlog.description}
                </Typography>
              </Paper>

              {/* Tags */}
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <Box>
                  <Typography color="text.secondary" fontSize={12} gutterBottom>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {selectedBlog.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Content */}
              <Box>
                <Typography color="text.secondary" fontSize={12} gutterBottom>
                  Content
                </Typography>
                <Paper sx={{ p: 3, maxHeight: 400, overflow: 'auto' }}>
                  <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                </Paper>
              </Box>
            </Stack>
          )}
        </DialogContent>
      </StyledDialog>
    </Box>
  );
}

export default BlogsManagement;

