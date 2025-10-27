"use client";
import React, { useState, useEffect } from "react";
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
  Backdrop,
  Alert,
  Snackbar,
  Fade,
  Slide,
  DialogContentText,
  Divider,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  School,
  Star,
  Search,
  CloudUpload,
  Person,
  Email,
  Phone,
  TrendingUp,
  Verified,
  Refresh,
  Save,
  Cancel,
  CheckCircle,
  Error,
  Warning,
  Info,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';

// Subject options
const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Urdu', 
  'Computer Science', 'Economics', 'Accounting', 'Business Studies', 
  'General Knowledge', 'Islamic Studies', 'Pakistan Studies',
  'Other (Type your own)'
];

// Status options
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'pending', label: 'Pending', color: 'warning' }
];

// Custom styled components for better z-index management
const StyledDialog = ({ children, ...props }) => (
  <Dialog
    {...props}
    sx={{
      '& .MuiDialog-paper': {
        zIndex: 1300, // Higher than default
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

const StyledSnackbar = ({ children, ...props }) => (
  <Snackbar
    {...props}
    sx={{
      zIndex: 1400, // Highest priority
      ...props.sx,
    }}
  >
    {children}
  </Snackbar>
);

function TutorsManagement() {
  // State management
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
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
    name: "",
    email: "",
    phone: "",
    subject: "",
    qualification: "",
    experience: "",
    rating: 4.5,
    status: "active",
    bio: "",
    specialization: [],
    availability: "flexible",
    hourlyRate: "",
    languages: ["English"],
    certifications: [],
    teachingMethods: [],
    studentCount: 0,
    successRate: 0,
    isVerified: false,
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      website: ""
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "Pakistan",
      zipCode: ""
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    },
    notes: "",
    image: null,
    imagePreview: "/images/tutor1.png"
  });

  // Filters and search
  const [filters, setFilters] = useState({
    search: "",
    subject: "",
    status: "",
    page: 1,
    limit: 10
  });

  // Error and success states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Custom subject state
  const [customSubject, setCustomSubject] = useState("");

  // Fetch tutors from API
  const fetchTutors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/tutors?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setTutors(result.data.tutors);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to fetch tutors');
        toast.error(result.message || 'Failed to fetch tutors');
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setError('Network error. Please check your connection.');
      toast.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  // Load tutors on component mount and when filters change
  useEffect(() => {
    fetchTutors();
  }, [filters]);

  // Handle dialog operations
  const handleOpenDialog = (tutor = null) => {
    if (tutor) {
      setEditMode(true);
      setSelectedTutor(tutor);
      // Check if subject is a custom one
      if (tutor.subject && !SUBJECTS.slice(0, -1).includes(tutor.subject)) {
        setCustomSubject(tutor.subject);
        setFormData({
          ...tutor,
          subject: 'Other (Type your own)',
          imagePreview: tutor.image?.url || "/images/tutor1.png",
          image: null
        });
      } else {
        setCustomSubject("");
        setFormData({
          ...tutor,
          imagePreview: tutor.image?.url || "/images/tutor1.png",
          image: null
        });
      }
    } else {
      setEditMode(false);
      setSelectedTutor(null);
      setCustomSubject("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        qualification: "",
        experience: "",
        rating: 4.5,
        status: "active",
        bio: "",
        specialization: [],
        availability: "flexible",
        hourlyRate: "",
        languages: ["English"],
        certifications: [],
        teachingMethods: [],
        studentCount: 0,
        successRate: 0,
        isVerified: false,
        socialLinks: {
          linkedin: "",
          twitter: "",
          facebook: "",
          website: ""
        },
        address: {
          street: "",
          city: "",
          state: "",
          country: "Pakistan",
          zipCode: ""
        },
        emergencyContact: {
          name: "",
          phone: "",
          relationship: ""
        },
        notes: "",
        image: null,
        imagePreview: "/images/tutor1.png"
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return; // Prevent closing while saving
    
    setOpenDialog(false);
    setEditMode(false);
    setSelectedTutor(null);
    setCustomSubject("");
    setError(null);
    setSuccess(null);
  };

  const handleViewTutor = (tutor) => {
    setSelectedTutor(tutor);
    setOpenViewDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result,
          imagePreview: e.target.result
        }));
        setUploading(false);
        toast.success('Image uploaded successfully');
      };
      reader.onerror = () => {
        setUploading(false);
        toast.error('Failed to upload image');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save tutor (create or update)
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Basic validation
      if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.qualification || !formData.experience) {
        setError('Please fill in all required fields');
        toast.error('Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Validate custom subject if "Other" is selected
      if (formData.subject === 'Other (Type your own)' && !customSubject.trim()) {
        setError('Please enter a custom subject');
        toast.error('Please enter a custom subject');
        setSaving(false);
        return;
      }

      // Prepare data with custom subject if selected
      const dataToSend = {
        ...formData,
        subject: formData.subject === 'Other (Type your own)' ? customSubject.trim() : formData.subject
      };

      const url = editMode ? `/api/tutors/${selectedTutor._id}` : '/api/tutors';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message);
        handleCloseDialog();
        fetchTutors(); // Refresh the list
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error saving tutor:', error);
      setError('Network error. Please try again.');
      toast.error('Failed to save tutor');
    } finally {
      setSaving(false);
    }
  };

  // Delete tutor
  // Delete tutor with SweetAlert2
  const handleDelete = async (tutor) => {
    const result = await Swal.fire({
      title: 'Delete Tutor?',
      html: `Are you sure you want to delete <strong>"${tutor.name}"</strong>?<br/><small>This action cannot be undone.</small>`,
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

        const response = await fetch(`/api/tutors/${tutor._id}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Tutor has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#1a1a2e',
            timer: 2000,
            showConfirmButton: false
          });
          toast.success(data.message);
          fetchTutors();
        } else {
          Swal.fire({
            title: 'Error!',
            text: data.message || 'Failed to delete tutor.',
            icon: 'error',
            confirmButtonColor: '#d32f2f'
          });
          toast.error(data.message);
        }
      } catch (error) {
        console.error('Error deleting tutor:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Network error. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d32f2f'
        });
        toast.error('Failed to delete tutor');
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
                fontSize: { xs: '1.5rem', sm: '2rem' }
              }}
            >
              Tutor Management
            </Typography>
            <Typography 
              color="text.secondary" 
              variant="body2"
              sx={{ fontWeight: 400 }}
            >
              {pagination.totalCount} total tutors
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
            New Tutor
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
            placeholder="Search tutors..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            disabled={loading}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
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
            <InputLabel>Subject</InputLabel>
            <Select
              value={filters.subject || ""}
              label="Subject"
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">All Subjects</MenuItem>
              {SUBJECTS.map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ""}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">All Status</MenuItem>
              {STATUS_OPTIONS.map(status => (
                <MenuItem key={status.value} value={status.value}>{status.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => setFilters({ search: "", subject: "", status: "", page: 1, limit: 10 })}
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            Reset
          </Button>
        </Stack>
      </Paper>

      {/* Tutors Table */}
      <Paper sx={{ 
        borderRadius: 2, 
        border: '1px solid #e0e0e0',
        boxShadow: 'none', 
        overflow: 'hidden',
        backgroundColor: 'white'
      }}>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography color="text.secondary">Loading tutors...</Typography>
          </Box>
        ) : error ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography color="error" variant="h6" gutterBottom>
              Failed to load tutors
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={fetchTutors}
              startIcon={<Refresh />}
              sx={{ textTransform: 'none' }}
            >
              Try Again
            </Button>
          </Box>
        ) : tutors.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={8}>
            <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography color="text.secondary" variant="h6" gutterBottom>
              No tutors found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {filters.search || filters.subject || filters.status 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first tutor'
              }
            </Typography>
            {!(filters.search || filters.subject || filters.status) && (
              <Button
                variant="contained"
                onClick={() => handleOpenDialog()}
                startIcon={<Add />}
                sx={{ textTransform: 'none' }}
              >
                Add First Tutor
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Tutor</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Experience</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tutors.map((tutor) => (
                    <TableRow
                      key={tutor._id}
                      sx={{
                        '&:hover': { backgroundColor: '#fafafa' },
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar 
                            src={tutor.image?.url || "/images/tutor1.png"} 
                            alt={tutor.name}
                            sx={{ width: 50, height: 50, border: '2px solid #e3f2fd' }}
                          />
                          <Box>
                            <Typography fontWeight={600} variant="body1">
                              {tutor.name}
                              {tutor.isVerified && (
                                <Tooltip title="Verified Tutor">
                                  <Verified sx={{ ml: 1, color: '#4caf50', fontSize: 18 }} />
                                </Tooltip>
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tutor.qualification}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                            <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {tutor.email}
                          </Typography>
                          <Typography variant="body2" display="flex" alignItems="center" gap={1}>
                            <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                            {tutor.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={tutor.subject}
                          size="small"
                          color="primary"
                          variant="outlined"
                          icon={<School />}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body2">
                          {tutor.experience}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tutor.studentCount || 0} students
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Star sx={{ color: '#ffc107', fontSize: 18 }} />
                          <Typography fontWeight={600}>{tutor.rating || 0}</Typography>
                        </Stack>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={getStatusLabel(tutor.status)}
                          color={getStatusColor(tutor.status)}
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewTutor(tutor)}
                              sx={{ color: '#616161', '&:hover': { backgroundColor: '#f5f5f5', color: '#424242' } }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Tutor">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(tutor)}
                              sx={{ color: '#616161', '&:hover': { backgroundColor: '#f5f5f5', color: '#1a1a2e' } }}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Tutor">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(tutor)}
                              sx={{ color: '#616161', '&:hover': { backgroundColor: '#ffebee', color: '#d32f2f' } }}
                            >
                              <Delete />
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
              {editMode ? "Edit Tutor" : "Add New Tutor"}
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
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              onClose={handleCloseMessage}
            >
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Image Upload */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: 'center', border: '2px dashed #e0e0e0' }}>
                <Avatar
                  src={formData.imagePreview}
                  alt="Tutor"
                  sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
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
                  Recommended: 500x500px (Max 5MB)
                </Typography>
              </Paper>
            </Grid>

            {/* Basic Information */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={saving}
                    error={!formData.name && error}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    disabled={saving}
                    error={!formData.email && error}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Phone"
                    fullWidth
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    disabled={saving}
                    error={!formData.phone && error}
                    placeholder="e.g., 3001234567"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required error={!formData.subject && error}>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={formData.subject || ""}
                      label="Subject"
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      disabled={saving}
                    >
                      {SUBJECTS.map(subject => (
                        <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Custom Subject Input - Show when "Other" is selected */}
                {formData.subject === 'Other (Type your own)' && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Enter Custom Subject"
                      fullWidth
                      required
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      disabled={saving}
                      placeholder="e.g., Web Development, Graphic Design"
                      error={!customSubject.trim() && error}
                      helperText={!customSubject.trim() && error ? "Custom subject is required" : ""}
                    />
                  </Grid>
                )}
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Qualification"
                    fullWidth
                    value={formData.qualification || ""}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    required
                    disabled={saving}
                    error={!formData.qualification && error}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Experience"
                    fullWidth
                    value={formData.experience || ""}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    required
                    disabled={saving}
                    error={!formData.experience && error}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Rating"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0, max: 5, step: 0.1 }}
                    value={formData.rating || ""}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                    disabled={saving}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status || "active"}
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
              </Grid>
            </Grid>

            {/* Additional Information */}
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Additional Information</Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={3}
                value={formData.bio || ""}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about the tutor..."
                disabled={saving}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Hourly Rate"
                fullWidth
                type="number"
                value={formData.hourlyRate || ""}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                disabled={saving}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                placeholder="e.g., 50"
                helperText="Rate in USD per hour"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={formData.availability || "flexible"}
                  label="Availability"
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  disabled={saving}
                >
                  <MenuItem value="full-time">Full Time</MenuItem>
                  <MenuItem value="part-time">Part Time</MenuItem>
                  <MenuItem value="flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Success Rate (%)"
                fullWidth
                type="number"
                inputProps={{ min: 0, max: 100 }}
                value={formData.successRate || ""}
                onChange={(e) => handleInputChange('successRate', parseInt(e.target.value) || 0)}
                disabled={saving}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={2}
                value={formData.notes || ""}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes about the tutor..."
                disabled={saving}
              />
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
        <DialogTitle sx={{ background: 'white', color: '#1a1a2e', borderBottom: '1px solid #e0e0e0', pb: 2.5, pt: 3, px: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
              Tutor Details
            </Typography>
            <IconButton onClick={() => setOpenViewDialog(false)} sx={{ color: '#616161' }}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {selectedTutor && (
            <Stack spacing={3}>
              {/* Profile Header */}
              <Box textAlign="center">
                <Avatar
                  src={selectedTutor.image?.url || "/images/tutor1.png"}
                  alt={selectedTutor.name}
                  sx={{ width: 120, height: 120, margin: "0 auto", mb: 2, border: '4px solid #e3f2fd' }}
                />
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedTutor.name}
                  {selectedTutor.isVerified && (
                    <Tooltip title="Verified Tutor">
                      <Verified sx={{ ml: 1, color: '#4caf50' }} />
                    </Tooltip>
                  )}
                </Typography>
                <Typography color="text.secondary" variant="body1" gutterBottom>
                  {selectedTutor.qualification}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                  mt={1}
                >
                  <Star sx={{ color: "#ffc107" }} />
                  <Typography fontWeight={600} variant="h6">
                    {selectedTutor.rating || 0}
                  </Typography>
                  <Chip
                    label={getStatusLabel(selectedTutor.status)}
                    color={getStatusColor(selectedTutor.status)}
                    size="small"
                    sx={{ ml: 2 }}
                  />
                </Stack>
              </Box>

              {/* Information Grid */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                    <Typography color="text.secondary" fontSize={12} gutterBottom>
                      Subject
                    </Typography>
                    <Typography fontWeight="bold" variant="body1">
                      {selectedTutor.subject}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                    <Typography color="text.secondary" fontSize={12} gutterBottom>
                      Experience
                    </Typography>
                    <Typography fontWeight="bold" variant="body1">
                      {selectedTutor.experience}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                    <Typography color="text.secondary" fontSize={12} gutterBottom>
                      Email
                    </Typography>
                    <Typography fontWeight="bold" variant="body1">
                      {selectedTutor.email}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                    <Typography color="text.secondary" fontSize={12} gutterBottom>
                      Phone
                    </Typography>
                    <Typography fontWeight="bold" variant="body1">
                      {selectedTutor.phone}
                    </Typography>
                  </Paper>
                </Grid>

                {selectedTutor.bio && (
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                      <Typography color="text.secondary" fontSize={12} gutterBottom>
                        Bio
                      </Typography>
                      <Typography fontWeight="bold" variant="body1">
                        {selectedTutor.bio}
                      </Typography>
                    </Paper>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                    <Typography color="text.secondary" fontSize={12} gutterBottom>
                      Students Taught
                    </Typography>
                    <Typography fontWeight="bold" variant="body1">
                      {selectedTutor.studentCount || 0}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                    <Typography color="text.secondary" fontSize={12} gutterBottom>
                      Success Rate
                    </Typography>
                    <Typography fontWeight="bold" variant="body1">
                      {selectedTutor.successRate || 0}%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
      </StyledDialog>
    </Box>
  );
}

export default TutorsManagement;