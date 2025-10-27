"use client";
import React, { useState } from "react";
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
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Close,
  School,
  MenuBook,
} from "@mui/icons-material";
import toast from "react-hot-toast";

function CoursesManagement() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "IGCSE Mathematics",
      curriculum: "IGCSE",
      level: "O-Level",
      duration: "12 months",
      sessions: "48 sessions",
      price: "$99/month",
      status: "active",
    },
    {
      id: 2,
      name: "A-Level Physics",
      curriculum: "A-Levels",
      level: "Advanced",
      duration: "18 months",
      sessions: "72 sessions",
      price: "$129/month",
      status: "active",
    },
    {
      id: 3,
      name: "IB Chemistry HL",
      curriculum: "IB",
      level: "Higher Level",
      duration: "24 months",
      sessions: "96 sessions",
      price: "$149/month",
      status: "inactive",
    },
    {
      id: 4,
      name: "SAT Math Prep",
      curriculum: "SAT",
      level: "Test Prep",
      duration: "6 months",
      sessions: "24 sessions",
      price: "$89/month",
      status: "active",
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    curriculum: "",
    level: "",
    duration: "",
    sessions: "",
    price: "",
    status: "active",
  });

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditMode(true);
      setFormData(course);
    } else {
      setEditMode(false);
      setFormData({
        name: "",
        curriculum: "",
        level: "",
        duration: "",
        sessions: "",
        price: "",
        status: "active",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setOpenViewDialog(true);
  };

  const handleSave = () => {
    if (editMode) {
      setCourses(courses.map((c) => (c.id === formData.id ? formData : c)));
      toast.success("Course updated successfully!");
    } else {
      const newCourse = {
        ...formData,
        id: courses.length + 1,
      };
      setCourses([...courses, newCourse]);
      toast.success("Course added successfully!");
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id));
      toast.success("Course deleted successfully!");
    }
  };

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "default";
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Courses Management
          </Typography>
          <Typography color="var(--text-secondary)">
            Manage all courses and curriculum offerings
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
          Add Course
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #6FD4E6, #8FDEF0)",
              color: "white",
              borderRadius: 3,
            }}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <MenuBook sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {courses.length}
                </Typography>
                <Typography>Total Courses</Typography>
              </Box>
            </Stack>
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
              {courses.filter((c) => c.status === "active").length}
            </Typography>
            <Typography>Active Courses</Typography>
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
              {new Set(courses.map((c) => c.curriculum)).size}
            </Typography>
            <Typography>Curriculums</Typography>
          </Paper>
        </Grid>
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
              {courses.reduce((acc, c) => acc + parseInt(c.sessions), 0)}
            </Typography>
            <Typography>Total Sessions</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgba(102, 126, 234, 0.1)" }}>
              <TableCell>
                <Typography fontWeight="bold">ID</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Course Name</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Curriculum</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Level</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Duration</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Sessions</Typography>
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">Price</Typography>
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
            {courses.map((course) => (
              <TableRow
                key={course.id}
                sx={{
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
                }}
              >
                <TableCell>{course.id}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <School color="primary" />
                    <Typography fontWeight={600}>{course.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.curriculum}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell>{course.sessions}</TableCell>
                <TableCell>
                  <Typography fontWeight={600} color="primary">
                    {course.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.status}
                    color={getStatusColor(course.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleViewCourse(course)}
                    sx={{ color: "#667eea" }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(course)}
                    sx={{ color: "#4facfe" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(course.id)}
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
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              {editMode ? "Edit Course" : "Add New Course"}
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
                label="Course Name"
                fullWidth
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                  <MenuItem value="CBSE">CBSE</MenuItem>
                  <MenuItem value="HKDSE">HKDSE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Level"
                fullWidth
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Duration (e.g., 12 months)"
                fullWidth
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Total Sessions (e.g., 48 sessions)"
                fullWidth
                value={formData.sessions}
                onChange={(e) =>
                  setFormData({ ...formData, sessions: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Price (e.g., $99/month)"
                fullWidth
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
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
              Course Details
            </Typography>
            <IconButton onClick={() => setOpenViewDialog(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <Stack spacing={2} mt={1}>
              <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                <Typography color="text.secondary" fontSize={12}>
                  Course Name
                </Typography>
                <Typography fontWeight="bold" fontSize={18}>
                  {selectedCourse.name}
                </Typography>
              </Paper>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>
                      Curriculum
                    </Typography>
                    <Chip
                      label={selectedCourse.curriculum}
                      color="primary"
                      size="small"
                    />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>
                      Level
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedCourse.level}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>
                      Duration
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedCourse.duration}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>
                      Total Sessions
                    </Typography>
                    <Typography fontWeight="bold">
                      {selectedCourse.sessions}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>
                      Price
                    </Typography>
                    <Typography fontWeight="bold" color="primary">
                      {selectedCourse.price}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: "rgba(239, 246, 255, 0.5)" }}>
                    <Typography color="text.secondary" fontSize={12}>
                      Status
                    </Typography>
                    <Chip
                      label={selectedCourse.status}
                      color={getStatusColor(selectedCourse.status)}
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

export default CoursesManagement;

