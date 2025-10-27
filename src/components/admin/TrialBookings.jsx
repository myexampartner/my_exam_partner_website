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
  Alert,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  CheckCircle,
  Pending,
  Refresh,
} from "@mui/icons-material";
import toast from "react-hot-toast";

function TrialBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    curriculum: "",
    grade: "",
    status: "pending",
    notes: "",
  });

  // Fetch bookings from API
  const fetchBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch('/api/submissions');
      const result = await response.json();
      
      if (result.success) {
        setBookings(result.data);
        if (isRefresh) {
          toast.success('Bookings refreshed successfully!');
        }
      } else {
        toast.error('Failed to fetch trial bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Network error while fetching bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenDialog = (booking = null) => {
    if (booking) {
      setEditMode(true);
      setFormData({
        name: booking.name,
        phone: booking.phone,
        email: booking.email,
        curriculum: booking.curriculum,
        grade: booking.grade,
        status: booking.status,
        notes: booking.notes || '',
        _id: booking._id,
      });
    } else {
      setEditMode(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        curriculum: "",
        grade: "",
        status: "pending",
        notes: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      curriculum: "",
      grade: "",
      status: "pending",
      notes: "",
    });
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setOpenViewDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        setUpdatingId(formData._id);
        // Update existing booking
        const response = await fetch(`/api/submissions/${formData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: formData.status,
            notes: formData.notes || '',
          }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Booking updated successfully!");
          fetchBookings(true);
        } else {
          toast.error(result.error || 'Failed to update booking');
        }
      } else {
        setUpdatingId('new');
        // Add new booking (this would typically be done through the form, but keeping for admin use)
        const response = await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Booking added successfully!");
          fetchBookings(true);
        } else {
          toast.error(result.error || 'Failed to add booking');
        }
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error('Network error while saving booking');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;
    
    setDeletingId(bookingToDelete._id);
    try {
      const response = await fetch(`/api/submissions/${bookingToDelete._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Booking deleted successfully!");
        fetchBookings(true);
        setOpenDeleteDialog(false);
        setBookingToDelete(null);
      } else {
        toast.error(result.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Network error while deleting booking');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setBookingToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "enrolled":
        return "success";
      case "contacted":
        return "info";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
          >
            Trial Bookings ({bookings.length})
          </Typography>
          <Typography color="var(--text-secondary)">
            Manage all free trial class bookings from website form
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <IconButton 
            onClick={() => fetchBookings(true)} 
            color="primary"
            disabled={refreshing}
          >
            {refreshing ? <CircularProgress size={20} /> : <Refresh />}
          </IconButton>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textTransform: "none",
            px: { xs: 1.5, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            borderRadius: 3,
            fontSize: { xs: '0.85rem', sm: '1rem' },
            '& .MuiButton-startIcon': {
              marginRight: { xs: 0, sm: 1 }
            },
            '& .MuiButton-label': {
              display: { xs: 'none', sm: 'flex' }
            }
          }}
        >
          Add Booking
        </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #FF6A4D, #FF8A70)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {bookings.length}
            </Typography>
            <Typography>Total Bookings</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {bookings.filter((b) => b.status === "pending").length}
            </Typography>
            <Typography>Pending</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {bookings.filter((b) => b.status === "enrolled").length}
            </Typography>
            <Typography>Enrolled</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Alert severity="info">
          No trial bookings found. Submissions will appear here when users fill out the form on the website.
        </Alert>
      ) : (
        /* Table */
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(102, 126, 234, 0.1)" }}>
              <TableCell>
                <Typography fontWeight="bold">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Email</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Phone</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Curriculum</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Grade</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Status</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Date</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight="bold">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                }}
              >
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.curriculum}</TableCell>
                <TableCell>{booking.grade}%</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton
                    size="small"
                    onClick={() => handleViewBooking(booking)}
                    sx={{ color: "#667eea" }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(booking)}
                    disabled={updatingId === booking._id}
                    sx={{ color: "#4facfe" }}
                  >
                    {updatingId === booking._id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Edit />
                    )}
                  </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(booking)}
                      disabled={deletingId === booking._id}
                      sx={{ color: "#f5576c" }}
                    >
                      {deletingId === booking._id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <Delete />
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              {editMode ? "Edit Booking" : "Add New Booking"}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Curriculum</InputLabel>
              <Select
                value={formData.curriculum}
                label="Curriculum"
                onChange={(e) =>
                  setFormData({ ...formData, curriculum: e.target.value })
                }
              >
                <MenuItem value="IGCSE">IGCSE</MenuItem>
                <MenuItem value="A-Levels">A-Levels</MenuItem>
                <MenuItem value="IB">IB</MenuItem>
                <MenuItem value="SAT">SAT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Grade (%)"
              fullWidth
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="enrolled">Enrolled</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any notes about this submission..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} disabled={updatingId}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={updatingId}
            startIcon={updatingId ? <CircularProgress size={16} /> : null}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {updatingId ? "Saving..." : (editMode ? "Update" : "Add")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Booking Details
            </Typography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Stack spacing={2}>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Name
                </Typography>
                <Typography fontWeight="bold">
                  {selectedBooking.name}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Phone
                </Typography>
                <Typography fontWeight="bold">
                  {selectedBooking.phone}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Email
                </Typography>
                <Typography fontWeight="bold">
                  {selectedBooking.email}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Curriculum
                </Typography>
                <Typography fontWeight="bold">
                  {selectedBooking.curriculum}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Grade
                </Typography>
                <Typography fontWeight="bold">
                  {selectedBooking.grade}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Date
                </Typography>
                <Typography fontWeight="bold">
                  {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Status
                </Typography>
                <Chip
                  label={selectedBooking.status}
                  color={getStatusColor(selectedBooking.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
              {selectedBooking.notes && (
                <Box>
                  <Typography color="text.secondary" fontSize={14}>
                    Notes
                  </Typography>
                  <Typography fontWeight="bold">
                    {selectedBooking.notes}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold" color="error">
              Delete Booking
            </Typography>
            <IconButton onClick={handleDeleteCancel}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This action cannot be undone. The booking will be permanently deleted.
            </Alert>
            {bookingToDelete && (
              <Box>
                <Typography color="text.secondary" fontSize={14}>
                  Are you sure you want to delete the booking for:
                </Typography>
                <Typography fontWeight="bold" fontSize={16} mt={1}>
                  {bookingToDelete.name}
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                  Email: {bookingToDelete.email}
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                  Curriculum: {bookingToDelete.curriculum} - Grade: {bookingToDelete.grade}%
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDeleteCancel} disabled={deletingId}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deletingId}
            startIcon={deletingId ? <CircularProgress size={16} /> : null}
          >
            {deletingId ? "Deleting..." : "Delete Booking"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TrialBookings;

