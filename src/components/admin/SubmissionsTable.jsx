"use client";
import React, { useState, useEffect } from 'react';
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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'warning',
  contacted: 'info',
  enrolled: 'success',
  rejected: 'error',
};

function SubmissionsTable() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ status: '', notes: '' });

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/submissions');
      const result = await response.json();
      
      if (result.success) {
        setSubmissions(result.data);
      } else {
        toast.error('Failed to fetch submissions');
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Network error while fetching submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Update submission
  const updateSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/${selectedSubmission._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Submission updated successfully');
        setEditDialogOpen(false);
        fetchSubmissions();
      } else {
        toast.error(result.error || 'Failed to update submission');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Network error while updating submission');
    }
  };

  // Delete submission
  const deleteSubmission = async () => {
    try {
      const response = await fetch(`/api/submissions/${selectedSubmission._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Submission deleted successfully');
        setDeleteDialogOpen(false);
        fetchSubmissions();
      } else {
        toast.error(result.error || 'Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Network error while deleting submission');
    }
  };

  const handleEdit = (submission) => {
    setSelectedSubmission(submission);
    setEditData({ status: submission.status, notes: submission.notes || '' });
    setEditDialogOpen(true);
  };

  const handleView = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleDelete = (submission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Trial Bookings ({submissions.length})
        </Typography>
        <IconButton onClick={fetchSubmissions} color="primary">
          <Refresh />
        </IconButton>
      </Stack>

      {submissions.length === 0 ? (
        <Alert severity="info">
          No trial bookings found. Submissions will appear here when users fill out the form.
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <TableCell fontWeight={600}>Name</TableCell>
                <TableCell fontWeight={600}>Email</TableCell>
                <TableCell fontWeight={600}>Phone</TableCell>
                <TableCell fontWeight={600}>Curriculum</TableCell>
                <TableCell fontWeight={600}>Grade</TableCell>
                <TableCell fontWeight={600}>Status</TableCell>
                <TableCell fontWeight={600}>Date</TableCell>
                <TableCell fontWeight={600}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id} hover>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone}</TableCell>
                  <TableCell>{submission.curriculum}</TableCell>
                  <TableCell>{submission.grade}%</TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status}
                      color={statusColors[submission.status] || 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleView(submission)} color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleEdit(submission)} color="warning">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(submission)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submission Details</DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Stack spacing={2} mt={1}>
              <TextField
                label="Name"
                value={selectedSubmission.name}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Email"
                value={selectedSubmission.email}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Phone"
                value={selectedSubmission.phone}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Curriculum"
                value={selectedSubmission.curriculum}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Grade"
                value={`${selectedSubmission.grade}%`}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <TextField
                label="Status"
                value={selectedSubmission.status}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              {selectedSubmission.notes && (
                <TextField
                  label="Notes"
                  value={selectedSubmission.notes}
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={3}
                  fullWidth
                />
              )}
              <TextField
                label="Submitted At"
                value={formatDate(selectedSubmission.createdAt)}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Submission</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="enrolled">Enrolled</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
              multiline
              rows={3}
              fullWidth
              placeholder="Add any notes about this submission..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={updateSubmission} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Submission</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the submission from {selectedSubmission?.name}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={deleteSubmission} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SubmissionsTable;
