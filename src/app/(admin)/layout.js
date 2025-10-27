"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
  Divider,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Settings,
  Logout,
  Notifications,
  EventAvailable,
  ContactMail,
  MenuBook,
  AttachMoney,
  People,
  Article,
  Email,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import Swal from 'sweetalert2';
import Image from 'next/image';

const drawerWidth = 260;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:900px)");
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      
      if (!userData || !isAuthenticated) {
        router.push("/login");
        return;
      }

      try {
        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
          router.push("/login");
          return;
        }
        setUser(user);
      } catch (error) {
        router.push("/login");
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Trial Bookings", icon: <EventAvailable />, path: "/admin/students" },
    { text: "Contact Forms", icon: <ContactMail />, path: "/admin/contacts" },
    { text: "Admins", icon: <People />, path: "/admin/users" },
    { text: "Tutors", icon: <School />, path: "/admin/tutors" },
    { text: "Blogs", icon: <Article />, path: "/admin/blogs" },
    { text: "Courses", icon: <MenuBook />, path: "/admin/courses" },
    { text: "Pricing Plans", icon: <AttachMoney />, path: "/admin/pricing" },
    // { text: "Subscribe Emails", icon: <Email />, path: "/admin/subscribe-emails" },
    // { text: "Settings", icon: <Settings />, path: "/admin/settings" },
  ];

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleAvatarClick = () => {
    Swal.fire({
      title: 'User Profile',
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
              ${user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div>
              <h3 style="margin: 0; color: #1a1a2e; font-size: 18px;">${user?.name || 'Admin User'}</h3>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${user?.email || 'admin@myexampartner.com'}</p>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #1a1a2e;">
            <h4 style="margin: 0 0 10px 0; color: #1a1a2e; font-size: 16px;">Account Details</h4>
            <div style="margin-bottom: 8px;">
              <strong style="color: #333;">Role:</strong> 
              <span style="color: #1a1a2e; background: #e3f2fd; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">
                ${user?.role?.toUpperCase() || 'ADMIN'}
              </span>
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="color: #333;">Status:</strong> 
              <span style="color: #4caf50; font-weight: 600; margin-left: 8px;">
                ${user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style="margin-bottom: 8px;">
              <strong style="color: #333;">Last Login:</strong> 
              <span style="color: #666; margin-left: 8px;">
                ${user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
              </span>
            </div>
            <div>
              <strong style="color: #333;">Member Since:</strong> 
              <span style="color: #666; margin-left: 8px;">
                ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#1a1a2e',
      showCancelButton: false,
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom'
      },
      width: '500px'
    });
  };

  const handleLogout = async () => {
    // Step 1: Confirmation
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1a1a2e',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      // Step 2: Loading
      Swal.fire({
        title: 'Logging out...',
        text: 'Please wait',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulate logout process (small delay for UX)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Call logout API
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout API error:', error);
      }

      // Clear authentication
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      document.cookie = "isAuthenticated=; path=/; max-age=0";
      document.cookie = "auth-token=; path=/; max-age=0";

      // Step 3: Success
      Swal.fire({
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonColor: '#1a1a2e',
        timer: 1500,
        showConfirmButton: false
      });

      // Step 4: Redirect to login after success message
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  const drawer = (
    <Box
      className="admin-sidebar"
      sx={{
        height: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#1a1a2e",
        color: "white",
      }}
    >

      {/* Logo Section */}
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "2px solid rgba(255,255,255,0.1)"
          }}
        >
          <Image
            src="/images/my-exam-partner-logo.jpg"
            alt="Exam Partner Logo"
            width={70}
            height={70}
            style={{
              objectFit: "contain",
              borderRadius: "8px"
            }}
          />
        </Box>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ 
            mt: 2, 
            color: "white",
            fontSize: "1.1rem",
            letterSpacing: "0.5px"
          }}
        >
          Exam Partner
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.7, 
            fontSize: '0.75rem',
            color: "white",
            display: "block",
            mt: 0.5
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />

      {/* Menu Items */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              cursor: "pointer",
              backgroundColor:
                pathname === item.path
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
              transition: "all 0.2s",
              py: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: "white", 
                minWidth: { xs: 0, sm: 40 },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: { xs: 12, sm: 14 },
                fontWeight: pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)", my: 2 }} />

      {/* Logout */}
      <List sx={{ px: 2, mb: 2 }}>
        <ListItem
          onClick={handleLogout}
          sx={{
            borderRadius: 1.5,
            cursor: "pointer",
            transition: "all 0.2s",
            py: 1,
            "&:hover": {
              backgroundColor: "rgba(255, 77, 77, 0.15)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "#ff6b6b", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItem>
      </List>
    </Box>
  );

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

      <Box className="admin-layout" sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "white",
          color: "#1a1a2e",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: '#1a1a2e',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {pathname.split("/").pop().charAt(0).toUpperCase() +
              pathname.split("/").pop().slice(1) || "Dashboard"}
          </Typography>

          <Stack direction="row" spacing={1.5}>
            <IconButton sx={{ color: '#424242' }}>
              <Notifications />
            </IconButton>
            <Avatar
              onClick={handleAvatarClick}
              sx={{
                width: 35,
                height: 35,
                background: "#1a1a2e",
                cursor: "pointer",
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 4px 12px rgba(26, 26, 46, 0.3)'
                }
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        className="admin-main-content"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "auto",
          background: "#f5f5f5",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
    </>
  );
}

