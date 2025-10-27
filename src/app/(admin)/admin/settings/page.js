"use client";
import { Box, Typography, Paper } from "@mui/material";
import { Settings } from "@mui/icons-material";

export default function SettingsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
        <Settings sx={{ fontSize: 80, color: "#764ba2", mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" mb={1}>
          System Settings
        </Typography>
        <Typography color="var(--text-secondary)">
          Coming soon...
        </Typography>
      </Paper>
    </Box>
  );
}

