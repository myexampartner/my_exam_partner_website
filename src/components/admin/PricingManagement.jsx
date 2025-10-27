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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  AttachMoney,
  TrendingUp,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchPricingPlans } from "@/store/pricingSlice";

function PricingManagement() {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state) => state.pricing);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    features: [""],
    isActive: true,
  });

  useEffect(() => {
    if (plans.length === 0) {
      dispatch(fetchPricingPlans(true));
    }
  }, [dispatch, plans.length]);

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setEditMode(true);
      setFormData({
        ...plan,
        features: plan.features || [""],
      });
    } else {
      setEditMode(false);
      setFormData({
        title: "",
        price: "",
        features: [""],
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setOpenViewDialog(true);
  };

  const handleSave = async () => {
    try {
      const filteredFeatures = formData.features.filter((f) => f.trim() !== "");
      
      if (!formData.title || !formData.price || filteredFeatures.length === 0) {
        toast.error("Please fill all required fields");
        return;
      }

      const url = editMode ? `/api/pricing/${formData._id}` : "/api/pricing";
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: filteredFeatures,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editMode ? "Plan updated successfully!" : "Plan added successfully!");
        dispatch(fetchPricingPlans(true));
        handleCloseDialog();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this pricing plan?")) {
      try {
        const res = await fetch(`/api/pricing/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (data.success) {
          toast.success("Plan deleted successfully!");
          dispatch(fetchPricingPlans(true));
        } else {
          toast.error(data.error || "Delete failed");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const getStatusColor = (isActive) => {
    return isActive ? "success" : "default";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Pricing Plans Management
          </Typography>
          <Typography color="var(--text-secondary)">
            Manage all pricing plans and features
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textTransform: "none",
            px: 3,
            py: 1.5,
            borderRadius: 3,
          }}
        >
          Add Plan
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #6FD4E6, #8FDEF0)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <AttachMoney sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {plans.length}
                </Typography>
                <Typography>Total Plans</Typography>
              </Box>
            </Stack>
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
              {plans.filter((p) => p.isActive).length}
            </Typography>
            <Typography>Active Plans</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <TrendingUp sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {plans.filter((p) => !p.isActive).length}
                </Typography>
                <Typography>Inactive Plans</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(102, 126, 234, 0.1)" }}>
              <TableCell><Typography fontWeight="bold">Title</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Price per Hour</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Features</Typography></TableCell>
              <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
              <TableCell align="center"><Typography fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow
                key={plan._id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                }}
              >
                <TableCell>
                  <Typography fontWeight={600}>{plan.title}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    {plan.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontSize={14}>
                    {plan.features?.length || 0} features
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={plan.isActive ? "Active" : "Inactive"}
                    color={getStatusColor(plan.isActive)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleViewPlan(plan)}
                    sx={{ color: "#667eea" }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(plan)}
                    sx={{ color: "#4facfe" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(plan._id)}
                    sx={{ color: "#f5576c" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {editMode ? "Edit Pricing Plan" : "Add New Pricing Plan"}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Plan Title *"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Price per Hour (e.g., $25/hour) *"
                fullWidth
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Grid>
            
            {/* Features */}
            <Grid size={{ xs: 12 }}>
              <Typography fontWeight="bold" mb={1}>Features *</Typography>
              {formData.features.map((feature, index) => (
                <Stack direction="row" spacing={1} mb={1} key={index}>
                  <TextField
                    fullWidth
                    placeholder="Enter feature"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  {formData.features.length > 1 && (
                    <IconButton onClick={() => removeFeature(index)} color="error">
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              ))}
              <Button startIcon={<Add />} onClick={addFeature} size="small">
                Add Feature
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.isActive}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Plan Details
            </Typography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Stack spacing={2} mt={1}>
              <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                <Typography color="text.secondary" fontSize={12}>Plan Title</Typography>
                <Typography fontWeight="bold" fontSize={18}>{selectedPlan.title}</Typography>
              </Paper>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>Price per Hour</Typography>
                    <Typography fontWeight="bold" color="primary">{selectedPlan.price}</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12} mb={1}>Features</Typography>
                    {selectedPlan.features?.map((feature, idx) => (
                      <Chip key={idx} label={feature} size="small" sx={{ m: 0.5 }} />
                    ))}
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>Status</Typography>
                    <Chip
                      label={selectedPlan.isActive ? "Active" : "Inactive"}
                      color={getStatusColor(selectedPlan.isActive)}
                      size="small"
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PricingManagement;

