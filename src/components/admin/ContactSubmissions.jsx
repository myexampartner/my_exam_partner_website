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
  IconButton,
  Chip,
  Stack,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility,
  Delete,
  Close,
  Email,
  Phone,
  CheckCircle,
  MarkEmailRead,
  Refresh,
  Edit,
} from "@mui/icons-material";
import toast from "react-hot-toast";

function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch contacts from API
  const fetchContacts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await fetch('/api/contacts');
      const result = await response.json();
      
      if (result.success) {
        setSubmissions(result.data);
        if (isRefresh) {
          toast.success('Contacts refreshed successfully!');
        }
      } else {
        toast.error('Failed to fetch contact submissions');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Network error while fetching contacts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleViewSubmission = async (submission) => {
    // Mark as read when viewing if it's new
    if (submission.status === "new") {
      try {
        const response = await fetch(`/api/contacts/${submission._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'read' }),
        });

        if (response.ok) {
          fetchContacts(true);
        }
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
    setSelectedSubmission(submission);
    setOpenViewDialog(true);
  };

  const handleDelete = async (contactId) => {
    setDeletingId(contactId);
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Contact submission deleted successfully!");
        fetchContacts(true);
      } else {
        toast.error(result.error || 'Failed to delete submission');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Network error while deleting submission');
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkResponded = async (contactId) => {
    setUpdatingId(contactId);
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'responded' }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Marked as responded!");
        fetchContacts(true);
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Network error while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "error";
      case "read":
        return "warning";
      case "responded":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Contact Form Submissions ({submissions.length})
          </Typography>
          <Typography color="var(--text-secondary)">
            View and manage all contact form inquiries from website
          </Typography>
        </Box>
        <IconButton 
          onClick={() => fetchContacts(true)} 
          color="primary"
          disabled={refreshing}
        >
          {refreshing ? <CircularProgress size={20} /> : <Refresh />}
        </IconButton>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {submissions.length}
            </Typography>
            <Typography>Total Submissions</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {submissions.filter((s) => s.status === "new").length}
            </Typography>
            <Typography>New Messages</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {submissions.filter((s) => s.status === "read").length}
            </Typography>
            <Typography>Read</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {submissions.filter((s) => s.status === "responded").length}
            </Typography>
            <Typography>Responded</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : submissions.length === 0 ? (
        <Alert severity="info">
          No contact submissions found. Submissions will appear here when users fill out the contact form.
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
                <Typography fontWeight="bold">Message Preview</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Status</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography fontWeight="bold">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow
                key={submission._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                  backgroundColor:
                    submission.status === "new"
                      ? "rgba(255, 106, 77, 0.05)"
                      : "transparent",
                }}
              >
                <TableCell>{submission.name}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Email fontSize="small" color="action" />
                    {submission.email}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Phone fontSize="small" color="action" />
                    {submission.phone}
                  </Stack>
                </TableCell>
                <TableCell>{submission.curriculum}</TableCell>
                <TableCell>
                  <Typography fontSize={13} color="text.secondary">
                    {submission.message.substring(0, 30)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(submission.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={submission.status}
                    color={getStatusColor(submission.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewSubmission(submission)}
                      sx={{ color: "#667eea" }}
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMarkResponded(submission._id)}
                      disabled={updatingId === submission._id}
                      sx={{ color: "#4facfe" }}
                    >
                      {updatingId === submission._id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <CheckCircle />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(submission._id)}
                      disabled={deletingId === submission._id}
                      sx={{ color: "#f5576c" }}
                    >
                      {deletingId === submission._id ? (
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

      {/* View Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <MarkEmailRead color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Contact Submission Details
              </Typography>
            </Stack>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Stack spacing={3} mt={1}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={0.5}>
                      Name
                    </Typography>
                    <Typography fontWeight="bold" fontSize={16}>
                      {selectedSubmission.name}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={0.5}>
                      Email
                    </Typography>
                    <Typography fontWeight="bold" fontSize={16}>
                      {selectedSubmission.email}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={0.5}>
                      Phone
                    </Typography>
                    <Typography fontWeight="bold" fontSize={16}>
                      {selectedSubmission.phone}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={0.5}>
                      Curriculum
                    </Typography>
                    <Typography fontWeight="bold" fontSize={16}>
                      {selectedSubmission.curriculum}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={0.5}>
                      Date Submitted
                    </Typography>
                    <Typography fontWeight="bold" fontSize={16}>
                      {new Date(selectedSubmission.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={0.5}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedSubmission.status}
                      color={getStatusColor(selectedSubmission.status)}
                      size="small"
                    />
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 3, backgroundColor: "rgba(239, 246, 255, 0.3)" }}>
                <Typography color="text.secondary" fontSize={12} mb={1}>
                  Message
                </Typography>
                <Typography fontSize={15} lineHeight={1.8}>
                  {selectedSubmission.message}
                </Typography>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setOpenViewDialog(false)}
          >
            Close
          </Button>
          {selectedSubmission && selectedSubmission.status !== "responded" && (
            <Button
              variant="contained"
              startIcon={<CheckCircle />}
              disabled={updatingId === selectedSubmission._id}
              onClick={() => {
                handleMarkResponded(selectedSubmission._id);
                setOpenViewDialog(false);
              }}
              sx={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              }}
            >
              Mark as Responded
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContactSubmissions;

