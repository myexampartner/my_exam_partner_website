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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Avatar,
  Switch,
  FormControlLabel,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  People,
  AdminPanelSettings,
  Person,
  Save,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditMode(true);
      setSelectedUser(user);
      setFormData({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setEditMode(false);
      setSelectedUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "admin",
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewDialog(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!editMode && !formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      setFormLoading(true);
      const url = editMode ? `/api/users/${formData._id}` : "/api/users";
      const method = editMode ? "PUT" : "POST";

      const body = { ...formData };
      if (editMode && !body.password) {
        delete body.password; // Don't send empty password on edit
      }

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editMode ? "Admin updated successfully!" : "Admin added successfully!");
        fetchUsers();
        handleCloseDialog();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (user) => {
    // Check if this is the last admin
    const adminCount = users.filter(u => u.role === 'admin' && u.isActive).length;
    
    if (adminCount <= 1) {
      Swal.fire({
        title: 'Cannot Delete Admin',
        html: `
          <div style="text-align: center; margin: 20px 0;">
            <div style="
              width: 80px; 
              height: 80px; 
              background: #ffebee; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              margin: 0 auto 20px;
              border: 3px solid #f44336;
            ">
              <span style="font-size: 40px; color: #f44336;">⚠️</span>
            </div>
            <h3 style="color: #f44336; margin: 0 0 10px 0; font-size: 1.5rem;">Minimum Admin Required</h3>
            <p style="color: #666; margin: 0; line-height: 1.5;">
              You cannot delete the last active admin. At least one admin must remain in the system to manage the platform.
            </p>
            <div style="
              background: #fff3cd; 
              border: 1px solid #ffeaa7; 
              border-radius: 8px; 
              padding: 15px; 
              margin: 20px 0;
              color: #856404;
            ">
              <strong>💡 Tip:</strong> Add another admin first, then you can delete this one.
            </div>
          </div>
        `,
        showConfirmButton: true,
        confirmButtonText: 'Understood',
        confirmButtonColor: '#f44336',
        showCancelButton: false,
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom'
        },
        width: '500px'
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Delete Admin?',
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="
              width: 60px; 
              height: 60px; 
              background: #1a1a2e; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-size: 24px; 
              font-weight: bold;
              margin-right: 15px;
            ">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style="margin: 0; color: #1a1a2e; font-size: 18px;">${user.name}</h3>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${user.email}</p>
            </div>
          </div>
          
          <div style="background: #ffebee; padding: 15px; border-radius: 8px; border-left: 4px solid #f44336;">
            <h4 style="margin: 0 0 10px 0; color: #f44336; font-size: 16px;">⚠️ Warning</h4>
            <p style="margin: 0; color: #666; line-height: 1.5;">
              This action will permanently delete the admin account and cannot be undone. 
              All associated data will be lost.
            </p>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Yes, Delete Admin',
      confirmButtonColor: '#f44336',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6c757d',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom'
      },
      width: '500px'
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(user._id);
        const res = await fetch(`/api/users/${user._id}`, { 
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            title: 'Admin Deleted!',
            text: `${user.name} has been successfully removed from the system.`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#1a1a2e',
            customClass: {
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom'
            }
          });
          fetchUsers();
        } else {
          Swal.fire({
            title: 'Delete Failed',
            text: data.error || 'Failed to delete admin. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#f44336',
            customClass: {
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom'
            }
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while deleting the admin. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f44336',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom'
          }
        });
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const getRoleColor = (role) => {
    return "error"; // All users are admin
  };

  const getRoleIcon = (role) => {
    return <AdminPanelSettings />; // All users are admin
  };

  // Loading handled in JSX with skeleton

  return (
    <>
      {/* Custom SweetAlert2 Styles */}
      <style jsx global>{`
        .swal2-popup-custom {
          border-radius: 16px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: 1px solid rgba(0,0,0,0.08) !important;
          backdrop-filter: blur(10px) !important;
        }
        
        .swal2-title-custom {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #1a1a2e !important;
          margin-bottom: 0.5rem !important;
        }
        
        .swal2-content-custom {
          font-size: 1rem !important;
          color: #666666 !important;
          line-height: 1.5 !important;
        }
        
        .swal2-confirm {
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          font-size: 1rem !important;
          text-transform: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        
        .swal2-confirm:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }
        
        .swal2-cancel {
          border-radius: 8px !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          font-size: 1rem !important;
          text-transform: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
        }
        
        .swal2-cancel:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>

      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
              Admin Management
            </Typography>
            <Typography 
              color="text.secondary" 
              variant="body2"
              sx={{ fontWeight: 400 }}
            >
              {users.length} total administrators
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
            New Admin
          </Button>
        </Stack>
      </Box>

      {/* Table */}
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
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Admin</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <TableRow key={item}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={120} height={24} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={180} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={70} height={24} />
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
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Admin</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      '&:hover': { backgroundColor: '#fafafa' },
                      transition: 'background-color 0.15s ease',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          backgroundColor: "#1a1a2e",
                          width: 40,
                          height: 40
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} variant="body2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.isActive ? "Active" : "Inactive"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.lastLogin ? `Last login: ${new Date(user.lastLogin).toLocaleDateString()}` : "Never logged in"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label="ADMIN"
                        color="default"
                        size="small"
                        sx={{ 
                          backgroundColor: '#f5f5f5',
                          color: '#424242',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? "Active" : "Inactive"}
                        color={user.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton
                          size="small"
                          onClick={() => handleViewUser(user)}
                          sx={{ 
                            color: '#616161',
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#424242' }
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                          sx={{ 
                            color: '#616161',
                            '&:hover': { backgroundColor: '#f5f5f5', color: '#1a1a2e' }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user)}
                          disabled={deleteLoading === user._id}
                          sx={{ 
                            color: '#616161',
                            '&:hover': { backgroundColor: '#ffebee', color: '#d32f2f' },
                            '&:disabled': { opacity: 0.5 }
                          }}
                        >
                          {deleteLoading === user._id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          pb: 2.5, 
          pt: 3,
          px: 3,
          background: 'white', 
          color: '#1a1a2e',
          borderBottom: '1px solid #e0e0e0',
          position: 'relative'
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
              {editMode ? "Edit Admin" : "Add New Admin"}
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: '#616161' }}>
              <Close />
            </IconButton>
          </Stack>
          {formLoading && (
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
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Full Name *"
                fullWidth
                value={formData.name}
                error={!!formErrors.name}
                helperText={formErrors.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) {
                    setFormErrors({ ...formErrors, name: "" });
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email *"
                type="email"
                fullWidth
                value={formData.email}
                error={!!formErrors.email}
                helperText={formErrors.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (formErrors.email) {
                    setFormErrors({ ...formErrors, email: "" });
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label={editMode ? "New Password (leave empty to keep current)" : "Password *"}
                type="password"
                fullWidth
                value={formData.password}
                error={!!formErrors.password}
                helperText={formErrors.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (formErrors.password) {
                    setFormErrors({ ...formErrors, password: "" });
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    sx={{
                      width: 58,
                      height: 34,
                      padding: 0,
                      '& .MuiSwitch-switchBase': {
                        padding: 0,
                        margin: '2px',
                        transitionDuration: '300ms',
                        '&.Mui-checked': {
                          transform: 'translateX(24px)',
                          color: '#fff',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#34C759',
                            opacity: 1,
                            border: 0,
                          },
                          '&.Mui-disabled + .MuiSwitch-track': {
                            opacity: 0.5,
                          },
                        },
                        '&.Mui-focusVisible .MuiSwitch-thumb': {
                          color: '#34C759',
                          border: '6px solid #fff',
                        },
                        '&.Mui-disabled .MuiSwitch-thumb': {
                          color: '#e0e0e0',
                        },
                        '&.Mui-disabled + .MuiSwitch-track': {
                          opacity: 0.3,
                        },
                      },
                      '& .MuiSwitch-thumb': {
                        boxSizing: 'border-box',
                        width: 30,
                        height: 30,
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.15)',
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 34 / 2,
                        backgroundColor: '#E0E0E0',
                        opacity: 1,
                        transition: 'background-color 300ms',
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="body2" fontWeight={500}>Active Admin</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formData.isActive ? "Admin can access the system" : "Admin is disabled"}
                    </Typography>
                  </Box>
                }
                sx={{ 
                  m: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
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
            disabled={formLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} /> : <Save />}
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
            {formLoading ? 'Saving...' : (editMode ? "Update" : "Create")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: 'white', 
          color: '#1a1a2e',
          borderBottom: '1px solid #e0e0e0',
          pb: 2.5, 
          pt: 3,
          px: 3
        }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: '-0.3px' }}>
              Admin Details
            </Typography>
            <IconButton onClick={() => setOpenViewDialog(false)} sx={{ color: '#616161' }}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={2} mt={1}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: "#f5576c",
                    mx: "auto",
                    mb: 1
                  }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {selectedUser.name}
                </Typography>
                <Typography color="text.secondary">
                  {selectedUser.email}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>Role</Typography>
                    <Chip
                      icon={getRoleIcon(selectedUser.role)}
                      label="ADMIN"
                      color={getRoleColor(selectedUser.role)}
                      size="small"
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>Status</Typography>
                    <Chip
                      label={selectedUser.isActive ? "Active" : "Inactive"}
                      color={selectedUser.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>Created</Typography>
                    <Typography fontWeight="bold">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>Last Login</Typography>
                    <Typography fontWeight="bold">
                      {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : "Never"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
    </>
  );
}

export default UserManagement;
