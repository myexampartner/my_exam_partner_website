"use client";
import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function WhatsAppFloatButton() {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+923290606108';
    const message = 'Hello! I want to know about your services.';
    
    // Format the phone number (remove + and spaces)
    const formattedNumber = phoneNumber.replace(/\s/g, '').replace('+', '');
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left">
      <Fab
        onClick={handleWhatsAppClick}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#25D366',
          color: 'white',
          width: 60,
          height: 60,
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          '&:hover': {
            backgroundColor: '#128C7E',
            transform: 'scale(1.1)',
            boxShadow: '0 6px 25px rgba(37, 211, 102, 0.6)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          // Responsive sizing
          '@media (max-width: 600px)': {
            width: 56,
            height: 56,
            bottom: 16,
            right: 16,
          },
        }}
        aria-label="WhatsApp Chat"
      >
        <WhatsAppIcon sx={{ fontSize: 32 }} />
      </Fab>
    </Tooltip>
  );
}

export default WhatsAppFloatButton;
