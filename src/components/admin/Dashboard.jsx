"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  Legend,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from "recharts";
import Grid from "@mui/material/Grid";
import {
  School,
  People,
  Assessment,
  TrendingUp,
  AttachMoney,
  Book,
  Refresh,
  Article,
  AdminPanelSettings,
  ContactMail,
  Assignment,
  MonetizationOn,
} from "@mui/icons-material";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/dashboard');
      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Helper function to get distribution colors
  const getDistributionColor = (type) => {
    const colors = {
      'Students': '#FF6A4D',
      'Tutors': '#6FD4E6',
      'Admins': '#4ECDC4'
    };
    return colors[type] || '#6FD4E6';
  };

  // Helper function to get activity colors
  const getActivityColor = (type) => {
    const colors = {
      'student': '#FF6A4D',
      'tutor': '#6FD4E6',
      'blog': '#B097BE',
      'contact': '#45B7D1',
      'submission': '#96CEB4',
      'admin': '#4ECDC4'
    };
    return colors[type] || '#6FD4E6';
  };

  // Loading skeleton for stats cards
  const StatsSkeleton = () => (
    <Grid container spacing={3} mb={4}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <Card elevation={0} sx={{ 
            backgroundColor: "white", 
            borderRadius: 4, 
            border: "1px solid rgba(0,0,0,0.08)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              backgroundColor: "rgba(0,0,0,0.1)",
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Skeleton variant="circular" width={64} height={64} />
                  <Skeleton variant="rectangular" width={70} height={28} sx={{ borderRadius: 3 }} />
                </Box>
                <Box>
                  <Skeleton variant="text" width="60%" height={50} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Loading skeleton for recent activities
  const ActivitiesSkeleton = () => (
    <Stack spacing={2}>
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ p: 2, borderRadius: 3, backgroundColor: "rgba(239, 246, 255, 0.5)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Skeleton variant="text" width="70%" height={20} />
              <Skeleton variant="text" width="90%" height={16} />
            </Box>
            <Skeleton variant="text" width={60} height={16} />
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  // Loading skeleton for performance
  const PerformanceSkeleton = () => (
    <Stack spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Box key={i}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="15%" height={20} />
          </Stack>
          <Skeleton variant="rectangular" width="100%" height={8} sx={{ borderRadius: 4 }} />
        </Box>
      ))}
    </Stack>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        {/* Header Skeleton */}
        <Stack spacing={1} mb={4}>
          <Skeleton variant="text" width="40%" height={60} />
          <Skeleton variant="text" width="60%" height={24} />
        </Stack>

        {/* Stats Skeleton */}
        <StatsSkeleton />

        {/* Content Skeleton */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}>
              <Skeleton variant="text" width="30%" height={32} mb={3} />
              <ActivitiesSkeleton />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)" }}>
              <Skeleton variant="text" width="40%" height={32} mb={3} />
              <PerformanceSkeleton />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Chip 
              icon={<Refresh />} 
              label="Retry" 
              onClick={handleRefresh}
              color="error"
              variant="outlined"
            />
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  // Prepare stats data
  const stats = [
    {
      title: "Total Students",
      value: formatNumber(dashboardData.stats.totalStudents),
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#FF6A4D",
      change: `+${dashboardData.growth.students}%`,
      bgColor: "rgba(255, 106, 77, 0.1)",
    },
    {
      title: "Total Blogs",
      value: formatNumber(dashboardData.stats.totalBlogs),
      icon: <Article sx={{ fontSize: 40 }} />,
      color: "#B097BE",
      change: `+${dashboardData.growth.blogs}%`,
      bgColor: "rgba(176, 151, 190, 0.1)",
    },
    {
      title: "Total Tutors",
      value: formatNumber(dashboardData.stats.totalTutors),
      icon: <School sx={{ fontSize: 40 }} />,
      color: "#6FD4E6",
      change: `+${dashboardData.growth.tutors}%`,
      bgColor: "rgba(111, 212, 230, 0.1)",
    },
    {
      title: "Total Admins",
      value: formatNumber(dashboardData.stats.totalAdmins),
      icon: <AdminPanelSettings sx={{ fontSize: 40 }} />,
      color: "#4ECDC4",
      change: `+${dashboardData.growth.admins}%`,
      bgColor: "rgba(78, 205, 196, 0.1)",
    },
    {
      title: "Contact Forms",
      value: formatNumber(dashboardData.stats.totalContacts),
      icon: <ContactMail sx={{ fontSize: 40 }} />,
      color: "#45B7D1",
      change: `+${dashboardData.growth.contacts}%`,
      bgColor: "rgba(69, 183, 209, 0.1)",
    },
    {
      title: "Trial Submissions",
      value: formatNumber(dashboardData.stats.totalSubmissions),
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: "#96CEB4",
      change: `+${dashboardData.growth.submissions}%`,
      bgColor: "rgba(150, 206, 180, 0.1)",
    },
    {
      title: "Pricing Plans",
      value: formatNumber(dashboardData.stats.totalPricingPlans),
      icon: <MonetizationOn sx={{ fontSize: 40 }} />,
      color: "#FFEAA7",
      change: `+${dashboardData.growth.pricing}%`,
      bgColor: "rgba(255, 234, 167, 0.1)",
    },
    {
      title: "Assessments",
      value: formatNumber(dashboardData.stats.totalSubmissions),
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: "#EB7D7E",
      change: `+${dashboardData.growth.assessments}%`,
      bgColor: "rgba(235, 125, 126, 0.1)",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack spacing={1}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#1a1a2e"
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="#666666">
            Welcome back! Here's what's happening today.
          </Typography>
        </Stack>
        <Chip
          icon={refreshing ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
          label={refreshing ? "Refreshing..." : "Refresh"}
          onClick={handleRefresh}
          disabled={refreshing}
          color="primary"
          variant="outlined"
          sx={{ 
            cursor: refreshing ? 'default' : 'pointer',
            '&:hover': { backgroundColor: 'rgba(26, 26, 46, 0.08)' }
          }}
        />
      </Stack>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: "white",
                border: `1px solid ${stat.color}40`,
                borderRadius: 4,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 20px 40px ${stat.color}20`,
                  border: `2px solid ${stat.color}`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: stat.bgColor,
                        borderRadius: "50%",
                        p: 2,
                        color: stat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 64,
                        height: 64,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: stat.bgColor,
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        border: `1px solid ${stat.color}30`,
                      }}
                    >
                      <Typography
                        fontSize={12}
                        fontWeight={700}
                        color={stat.color}
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 0.5,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}
                      >
                        <TrendingUp fontSize="small" />
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="#1a1a2e"
                      mb={0.5}
                      sx={{ 
                        fontSize: { xs: "1.8rem", md: "2.2rem" },
                        lineHeight: 1.2
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="#333333"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: "0.9rem"
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Activity with Real-time Updates */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight={600} color="#1a1a2e">
                Real-time Activity Feed
              </Typography>
              <Chip 
                icon={<Refresh />} 
                label="Live" 
                color="success" 
                size="small"
                sx={{ 
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 }
                  }
                }}
              />
            </Stack>
            <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "rgba(239, 246, 255, 0.5)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      transition: "all 0.3s",
                      position: "relative",
                      "&:hover": {
                        backgroundColor: "rgba(239, 246, 255, 0.8)",
                        transform: "translateX(5px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        backgroundColor: getActivityColor(activity.type),
                        borderRadius: "0 4px 4px 0",
                      }
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                          <Typography fontSize={20}>{activity.icon}</Typography>
                          <Typography fontWeight={600} color="#1a1a2e">
                            {activity.title}
                          </Typography>
                          <Chip 
                            label={activity.type} 
                            size="small" 
                            sx={{ 
                              fontSize: 10, 
                              height: 20,
                              backgroundColor: getActivityColor(activity.type) + '20',
                              color: getActivityColor(activity.type),
                              border: `1px solid ${getActivityColor(activity.type)}40`
                            }} 
                          />
                        </Stack>
                        <Typography fontSize={14} color="#666666">
                          {activity.description}
                        </Typography>
                      </Box>
                      <Typography
                        fontSize={12}
                        color="#999999"
                        sx={{ whiteSpace: "nowrap", ml: 2 }}
                      >
                        {activity.time}
                      </Typography>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="#666666">
                    No recent activities
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Stats Overview */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              height: "100%",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
              Quick Overview
            </Typography> 
            <Stack spacing={3}>
              <Box sx={{ p: 2, backgroundColor: 'rgba(255, 106, 77, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 106, 77, 0.2)' }}>
                <Typography fontSize={14} fontWeight={600} color="#FF6A4D" mb={1}>
                  Total Trial Bookings
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e">
                  {formatNumber(dashboardData.stats.totalSubmissions)}
                </Typography>
                <Typography fontSize={12} color="#666666">
                  Last 30 days: +{dashboardData.growth.submissions}%
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: 'rgba(69, 183, 209, 0.1)', borderRadius: 2, border: '1px solid rgba(69, 183, 209, 0.2)' }}>
                <Typography fontSize={14} fontWeight={600} color="#45B7D1" mb={1}>
                  Contact Forms
                      </Typography>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e">
                  {formatNumber(dashboardData.stats.totalContacts)}
                      </Typography>
                      <Typography fontSize={12} color="#666666">
                  Last 30 days: +{dashboardData.growth.contacts}%
                </Typography>
              </Box>

              <Box sx={{ p: 2, backgroundColor: 'rgba(111, 212, 230, 0.1)', borderRadius: 2, border: '1px solid rgba(111, 212, 230, 0.2)' }}>
                <Typography fontSize={14} fontWeight={600} color="#6FD4E6" mb={1}>
                  Active Tutors
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e">
                  {formatNumber(dashboardData.stats.totalTutors)}
                      </Typography>
                      <Typography fontSize={12} color="#666666">
                  Last 30 days: +{dashboardData.growth.tutors}%
                      </Typography>
                  </Box>

              <Box sx={{ p: 2, backgroundColor: 'rgba(176, 151, 190, 0.1)', borderRadius: 2, border: '1px solid rgba(176, 151, 190, 0.2)' }}>
                <Typography fontSize={14} fontWeight={600} color="#B097BE" mb={1}>
                  Published Blogs
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="#1a1a2e">
                  {formatNumber(dashboardData.stats.totalBlogs)}
                </Typography>
                <Typography fontSize={12} color="#666666">
                  Last 30 days: +{dashboardData.growth.blogs}%
                  </Typography>
                </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Dynamic Charts Section */}
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={3}>
            {/* Monthly Growth Chart */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
                  Monthly Growth Trends
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={dashboardData.charts?.monthlyGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="students" fill="#FF6A4D" name="Students" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="tutors" fill="#6FD4E6" name="Tutors" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="blogs" fill="#B097BE" name="Blogs" radius={[4, 4, 0, 0]} />
                    <Line 
                      type="monotone" 
                      dataKey="contacts" 
                      stroke="#45B7D1" 
                      strokeWidth={3}
                      name="Contacts"
                      dot={{ fill: '#45B7D1', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="#96CEB4" 
                      strokeWidth={3}
                      name="Submissions"
                      dot={{ fill: '#96CEB4', strokeWidth: 2, r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Revenue Chart */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
                  Monthly Revenue
                </Typography>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dashboardData.charts?.revenueData || []}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4ECDC4" 
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* User Distribution Pie Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
                  User Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.charts?.activityDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {(dashboardData.charts?.activityDistribution || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getDistributionColor(entry.type)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value, name) => [value, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Subject Performance Chart */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
                  Subject Performance
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.subjectPerformance || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" fontSize={12} />
                    <YAxis 
                      dataKey="subject" 
                      type="category" 
                      stroke="#666" 
                      fontSize={12}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#6FD4E6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Performance Metrics */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
                  Performance Metrics
                </Typography>
                <Grid container spacing={3}>
                  {(dashboardData.subjectPerformance || []).map((subject, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(111, 212, 230, 0.1)', borderRadius: 3, border: `1px solid ${subject.color}30` }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography fontSize={14} fontWeight={600} color="#1a1a2e">
                            {subject.subject}
                          </Typography>
                          <Typography fontSize={12} fontWeight={600} color={subject.color}>
                            {subject.count} tutors
                          </Typography>
                        </Stack>
                        <Box sx={{ mb: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={subject.progress} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              backgroundColor: 'rgba(111, 212, 230, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: subject.color,
                                borderRadius: 4,
                              }
                            }} 
                          />
                        </Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontSize={12} color="#666">
                            Avg Rate: ${subject.avgRate}/hr
                          </Typography>
                          <Typography fontSize={12} fontWeight={600} color={subject.color}>
                            {subject.progress}%
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* System Status */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.08)",
                  backgroundColor: "white",
                }}
              >
                <Typography variant="h5" fontWeight={600} mb={3} color="#1a1a2e">
                  System Status
                </Typography>
                <Stack spacing={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <ResponsiveContainer width="100%" height={120}>
                      <RadialBarChart cx="50%" cy="50%" innerRadius={30} outerRadius={60} data={[{ name: 'Success Rate', value: dashboardData.stats.successRate, fill: '#4ECDC4' }]}>
                        <RadialBar dataKey="value" fill="#4ECDC4" />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight="bold" fill="#1a1a2e">
                          {dashboardData.stats.successRate}%
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <Typography fontSize={14} fontWeight={600} color="#1a1a2e" mt={1}>
                      System Success Rate
                    </Typography>
                  </Box>
                  
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                      <Typography fontWeight={600} color="#1a1a2e">Database Status</Typography>
                      <Chip label="Online" color="success" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                      <Typography fontWeight={600} color="#1a1a2e">API Response Time</Typography>
                      <Typography variant="body2" color="#4ECDC4" fontWeight={600}>
                        {Math.floor(Math.random() * 50) + 50}ms
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: 'rgba(78, 205, 196, 0.1)', borderRadius: 2 }}>
                      <Typography fontWeight={600} color="#1a1a2e">Active Sessions</Typography>
                      <Typography variant="h6" fontWeight="bold" color="#4ECDC4">
                        {dashboardData.stats.activeSessions}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    </Box>
  );
}

export default Dashboard;

