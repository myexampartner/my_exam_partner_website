"use client";

import React, { createContext, useContext, useState } from "react";
import { Box } from "@mui/material";
import { PulseLoader } from "react-spinners";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      
      {/* Navigation Loader with React Spinners */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(10px)",
          }}
        >
          <PulseLoader
            color="#667eea"
            size={20}
            speedMultiplier={0.8}
            margin={8}
          />
        </Box>
      )}
    </LoadingContext.Provider>
  );
}

