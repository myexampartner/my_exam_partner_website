"use client";

import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  useMediaQuery,
  Stack,
  Menu,
  MenuItem,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SchoolIcon from "@mui/icons-material/School";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/components/providers/LoadingProvider";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [curriculumOpen, setCurriculumOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMobile = useMediaQuery("(max-width:900px)");
  const pathname = usePathname();
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const curriculumOptions = [
    { id: 1, title: "Canadian Curriculum", icon: "/images/canadian-curriculum.jpg" },
    { id: 2, title: "IB Curriculum", icon: "/images/IB.png" },
    { id: 3, title: "SABIS", icon: "/images/SABIS.jpg" },
    { id: 4, title: "British Curriculum", icon: "/images/british.png" },
    { id: 5, title: "HKDSE", icon: "/images/HKDSE.png" },
    { id: 6, title: "CBSE", icon: "/images/CBSE.png" },
  ];

  const handleCurriculumClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCurriculumClose = () => {
    setAnchorEl(null);
  };

  const handleCurriculumOptionClick = (id) => {
    setIsLoading(true);
    handleCurriculumClose();
    router.push(`/curriculum?id=${id}`);
    // Fast loader - instant navigation
    setTimeout(() => setIsLoading(false), 300);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/blogs", label: "Blogs" },
    { href: "/pricing", label: "Pricing" },
  ];

  const handleNavClick = (href) => {
    // Don't show loader if already on the same page
    if (pathname !== href) {
      setIsLoading(true);
      router.push(href);
      setTimeout(() => setIsLoading(false), 300);
    }
    setDrawerOpen(false);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ backgroundColor: "white", py: 1.2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          {/* Logo */}
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
            onClick={() => handleNavClick("/")}
            sx={{ cursor: "pointer" }}
          >
            <img
              src="/images/my-exam-partner-logo.jpg"
              alt="Logo"
              style={{ height: 50, width: 50 }}
            />
            <Typography
              color="var(--dark-color)"
              fontSize={20}
              fontWeight="bold"
            >
              MY EXAM PARTNER
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box display="flex" gap={[3,1,1,6]} alignItems="center">
              {navLinks.map((link, idx) => (
                <Typography
                  key={idx}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: "black",
                    fontWeight: 600,
                    fontSize: {xs: 16, sm: 12, md: 18},
                    backgroundColor:
                      pathname === link.href
                        ? "rgba(239, 246, 255, 1)"
                        : "transparent",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "0.3s ease",
                    "&:hover": { backgroundColor: "rgba(239, 246, 255, 0.7)" },
                  }}
                >
                  {link.label}
                </Typography>
              ))}

              <Button
                onClick={handleCurriculumClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ 
                  color: "black", 
                  fontWeight: 600, 
                  fontSize: 18,
                  textTransform: "none",
                }}
              >
                Curriculum
              </Button>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCurriculumClose}
                sx={{
                  "& .MuiPaper-root": {
                    marginTop: 1,
                    // minWidth: 260,
                    borderRadius: 2,
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {curriculumOptions.map((option) => (
                  <MenuItem
                    key={option.id}
                    onClick={() => handleCurriculumOptionClick(option.id)}
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      fontSize: 16,
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      "&:hover": {
                        backgroundColor: "rgba(239, 246, 255, 0.7)",
                      },
                    }}
                  >
                    <img
                      src={option.icon}
                      alt={option.title}
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: "contain",
                        borderRadius: "4px"
                      }}
                    />
                    <Typography fontSize={15}>{option.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Contact Button */}
          {!isMobile && (
            <Button
              onClick={() => handleNavClick("/contact")}
              sx={{
                px: 3,
                py: 1,
                color: "var(--dark-color)",
                border: "2px solid black",
                borderRadius: "50px",
                fontWeight: 550,
                cursor: "pointer",
              }}
            >
              Contact Us
            </Button>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton onClick={toggleDrawer(true)}>
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Drawer for Mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {navLinks.map((link, idx) => (
              <ListItem
                key={idx}
                onClick={() => handleNavClick(link.href)}
                sx={{
                  color: "black",
                  backgroundColor:
                    pathname === link.href
                      ? "rgba(239, 246, 255, 1)"
                      : "transparent",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}

            {/* Curriculum Tree Structure */}
            <ListItemButton
              onClick={() => setCurriculumOpen(!curriculumOpen)}
              sx={{
                color: "black",
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(239, 246, 255, 0.5)",
                },
              }}
            >
              <SchoolIcon sx={{ mr: 2, color: "var(--info-color)" }} />
              <ListItemText 
                primary="Curriculum" 
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              {curriculumOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </ListItemButton>

            <Collapse in={curriculumOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {curriculumOptions.map((option) => (
                  <ListItemButton
                    key={option.id}
                    sx={{
                      pl: 2,
                      pr: 1,
                      py: 1.2,
                      color: "black",
                      borderLeft: "3px solid transparent",
                      mx: 1,
                      borderRadius: "0 8px 8px 0",
                      "&:hover": {
                        backgroundColor: "rgba(239, 246, 255, 0.7)",
                        borderLeft: "3px solid var(--info-color)",
                      },
                    }}
                    onClick={() => {
                      handleCurriculumOptionClick(option.id);
                      setDrawerOpen(false);
                      setCurriculumOpen(false);
                    }}
                  >
                    <img
                      src={option.icon}
                      alt={option.title}
                      style={{
                        width: 20,
                        height: 20,
                        objectFit: "contain",
                        borderRadius: "4px",
                        marginRight: "12px"
                      }}
                    />
                    <ListItemText 
                      primary={option.title}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <ListItem>
              <Button
                fullWidth
                onClick={() => {
                  if (pathname !== "/contact") {
                    setIsLoading(true);
                    router.push("/contact");
                    setTimeout(() => setIsLoading(false), 300);
                  }
                  setDrawerOpen(false);
                }}
                sx={{
                  mt: 2,
                  color: "var(--dark-color)",
                  border: "2px solid black",
                  borderRadius: "50px",
                  fontWeight: 550,
                }}
              >
                Contact Us
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Promo Bar */}
      <Stack
        direction="row"
        gap={1}
        sx={{ backgroundColor: "rgba(239, 246, 255, 1)" }}
        py={0.5}
        px={1}
        alignItems="center"
        justifyContent="center"
        maxWidth="100%"
      >
        <img src="/images/promo-icon.png" alt="Promotional Offer" style={{ width: 34, height: 35 }} />

        <Typography
          color="var(--dark-color)"
          fontSize={14}
          fontWeight={550}
          textAlign="center"
        >
          PROMOTIONAL OFFER time is running out! World-class tutoring now
          $13/hr.
        </Typography>
      </Stack>
    </AppBar>
  );
}
