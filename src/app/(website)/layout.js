"use client"; // important since MUI uses hooks internally

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

const theme = createTheme({
  typography: {
    fontFamily: "'Quicksand', sans-serif",
  },
});

export default function WebLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      {children}
      <WhatsAppFloatButton />
      <Footer />
    </ThemeProvider>
  );
}
