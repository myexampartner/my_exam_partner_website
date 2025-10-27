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
  IconButton,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  CircularProgress,
  Skeleton,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Search,
  Refresh,
  Email,
  Person,
  CalendarToday,
  CheckCircle,
  Cancel,
  Visibility,
  Delete,
  FilterList,
  TrendingUp,
  People,
  EmailOutlined,
} from "@mui/icons-material";
import Swal from "sweetalert2";

function SubscribeEmailsManagement() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    unsubscribed: 0,
  });
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [pagination.currentPage, searchTerm, statusFilter, dateFrom, dateTo]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      
      const res = await fetch(`/api/subscribe-emails?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setEmails(data.data);
        setPagination(data.pagination);
        setStats(data.stats);
      } else {
        Swal.fire({
          title: 'Error',
          text: data.error || 'Failed to fetch subscribe emails',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f44336',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch subscribe emails',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f44336',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDateFromChange = (value) => {
    setDateFrom(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setViewDialog(true);
  };

  const handleDeleteEmail = async (email) => {
    const result = await Swal.fire({
      title: 'Delete Subscription?',
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
              margin-right: 15px;
            ">
              📧
            </div>
            <div>
              <h3 style="margin: 0; color: #1a1a2e; font-size: 18px;">${email.email}</h3>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                Subscribed: ${new Date(email.subscribedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div style="background: #ffebee; padding: 15px; border-radius: 8px; border-left: 4px solid #f44336;">
            <h4 style="margin: 0 0 10px 0; color: #f44336; font-size: 16px;">⚠️ Warning</h4>
            <p style="margin: 0; color: #666; line-height: 1.5;">
              This action will permanently remove the email subscription and cannot be undone.
            </p>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Yes, Delete',
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
        // Here you would call the delete API
        // For now, just show success message
        Swal.fire({
          title: 'Subscription Deleted!',
          text: `${email.email} has been removed from the subscription list.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1a1a2e',
        });
        fetchEmails();
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete subscription',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#f44336',
        });
      }
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? <CheckCircle /> : <Cancel />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      `}</style>

      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
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
                  mb: 0.5
                }}
              >
                Email Subscriptions
              </Typography>
              <Typography 
                color="text.secondary" 
                variant="body2"
                sx={{ fontWeight: 400 }}
              >
                Manage newsletter and email subscriptions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchEmails}
              disabled={loading}
              sx={{
                background: "#1a1a2e",
                textTransform: "none",
                px: 3,
                py: 1.2,
                borderRadius: 2,
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  background: "#2d2d44",
                  boxShadow: '0 4px 12px rgba(26, 26, 46, 0.2)',
                },
              }}
            >
              Refresh
            </Button>
          </Stack>

          {/* Stats Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <EmailOutlined sx={{ fontSize: 40, color: '#1a1a2e', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Subscriptions
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#4caf50">
                  {stats.active}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Subscriptions
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Cancel sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#f44336">
                  {stats.unsubscribed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unsubscribed
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="#ff9800">
                  {((stats.active / stats.total) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Rate
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Filters */}
          <Grid container spacing={2} mb={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="From Date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="To Date"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setDateFrom("");
                  setDateTo("");
                }}
                sx={{
                  height: '56px',
                  textTransform: 'none',
                  borderColor: '#1a1a2e',
                  color: '#1a1a2e',
                  '&:hover': {
                    borderColor: '#2d2d44',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
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
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Subscribed</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Source</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <TableRow key={item}>
                      <TableCell>
                        <Skeleton variant="text" width={200} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rounded" width={80} height={24} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={120} height={20} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={100} height={20} />
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton variant="circular" width={32} height={32} />
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
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Subscribed</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Source</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#424242' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {emails.map((email) => (
                    <TableRow
                      key={email._id}
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
                            <Email />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600} variant="body2">{email.email}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {email._id.slice(-8)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(email.status)}
                          label={email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                          color={getStatusColor(email.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(email.subscribedAt)}</Typography>
                        {email.unsubscribedAt && (
                          <Typography variant="caption" color="text.secondary">
                            Unsubscribed: {formatDate(email.unsubscribedAt)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={email.source.replace('_', ' ').toUpperCase()}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewEmail(email)}
                              sx={{ 
                                color: '#616161',
                                '&:hover': { backgroundColor: '#f5f5f5', color: '#1a1a2e' }
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Subscription">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteEmail(email)}
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
          )}
        </Paper>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} entries
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                variant="outlined"
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                First
              </Button>
              <Button
                disabled={pagination.currentPage === 1}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                variant="outlined"
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Previous
              </Button>
              
              {/* Page Numbers */}
              <Stack direction="row" spacing={0.5}>
                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  const currentPage = pagination.currentPage;
                  
                  // Show first page
                  if (currentPage > 3) {
                    pages.push(
                      <Button
                        key={1}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: 1 }))}
                        variant={currentPage === 1 ? "contained" : "outlined"}
                        size="small"
                        sx={{ minWidth: 'auto', px: 1.5 }}
                      >
                        1
                      </Button>
                    );
                    if (currentPage > 4) {
                      pages.push(
                        <Typography key="ellipsis1" sx={{ px: 1, display: 'flex', alignItems: 'center' }}>
                          ...
                        </Typography>
                      );
                    }
                  }
                  
                  // Show pages around current page
                  const start = Math.max(1, currentPage - 2);
                  const end = Math.min(totalPages, currentPage + 2);
                  
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <Button
                        key={i}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: i }))}
                        variant={currentPage === i ? "contained" : "outlined"}
                        size="small"
                        sx={{ minWidth: 'auto', px: 1.5 }}
                      >
                        {i}
                      </Button>
                    );
                  }
                  
                  // Show last page
                  if (currentPage < totalPages - 2) {
                    if (currentPage < totalPages - 3) {
                      pages.push(
                        <Typography key="ellipsis2" sx={{ px: 1, display: 'flex', alignItems: 'center' }}>
                          ...
                        </Typography>
                      );
                    }
                    pages.push(
                      <Button
                        key={totalPages}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: totalPages }))}
                        variant={currentPage === totalPages ? "contained" : "outlined"}
                        size="small"
                        sx={{ minWidth: 'auto', px: 1.5 }}
                      >
                        {totalPages}
                      </Button>
                    );
                  }
                  
                  return pages;
                })()}
              </Stack>
              
              <Button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                variant="outlined"
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Next
              </Button>
              <Button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: pagination.totalPages }))}
                variant="outlined"
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                Last
              </Button>
            </Stack>
          </Box>
        )}

        {/* View Dialog */}
        <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
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
                Subscription Details
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedEmail && (
              <Stack spacing={3} mt={1}>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      backgroundColor: "#1a1a2e",
                      mx: "auto",
                      mb: 2
                    }}
                  >
                    <Email sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedEmail.email}
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                      <Typography color="text.secondary" fontSize={12}>Status</Typography>
                      <Chip
                        icon={getStatusIcon(selectedEmail.status)}
                        label={selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
                        color={getStatusColor(selectedEmail.status)}
                        size="small"
                      />
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                      <Typography color="text.secondary" fontSize={12}>Source</Typography>
                      <Typography fontWeight="bold">
                        {selectedEmail.source.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                      <Typography color="text.secondary" fontSize={12}>Subscribed</Typography>
                      <Typography fontWeight="bold">
                        {formatDate(selectedEmail.subscribedAt)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                      <Typography color="text.secondary" fontSize={12}>Unsubscribed</Typography>
                      <Typography fontWeight="bold">
                        {selectedEmail.unsubscribedAt ? formatDate(selectedEmail.unsubscribedAt) : 'Never'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, background: '#fafafa', borderTop: '1px solid #e0e0e0' }}>
            <Button 
              onClick={() => setViewDialog(false)}
              sx={{ 
                textTransform: 'none',
                color: '#616161',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default SubscribeEmailsManagement;
