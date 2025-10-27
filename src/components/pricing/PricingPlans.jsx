"use client";
import React, { useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useDispatch, useSelector } from "react-redux";
import { fetchPricingPlans } from "@/store/pricingSlice";

function PricingPlans() {
  const dispatch = useDispatch();
  const { plans: plansData, loading } = useSelector((state) => state.pricing);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    if (plansData.length === 0) {
      dispatch(fetchPricingPlans(false));
    }
  }, [dispatch, plansData.length]);

  if (loading) {
    return (
      <Stack
        alignItems="center"
        spacing={6}
        px={2}
        py={6}
        sx={{
          minHeight: "100vh",
        }}
        mt={5}
        minWidth={'100%'}
        maxWidth={'100%'}
      >
        <Stack spacing={1}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={60} />
        </Stack>

        {/* Skeleton Cards */}
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          gap={5}
          mt={4}
        >
          {[1, 2, 3].map((index) => (
            <Box
              key={index}
              sx={{
                width: { xs: "90%", sm: "80%", md: "400px" },
                minHeight: "500px",
                borderRadius: 8,
                boxShadow: 5,
                overflow: "hidden",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                p: 2,
              }}
            >
              <Box sx={{ boxShadow: 5, p: 2, borderRadius: 8 }}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              </Box>
              
              <Stack spacing={1.5} px={4} py={3} sx={{ flex: 1 }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Stack key={i} direction="row" gap={1} alignItems="flex-start">
                    <Skeleton variant="circular" width={18} height={18} sx={{ mt: 0.2 }} />
                    <Skeleton variant="text" width="85%" height={20} />
                  </Stack>
                ))}
              </Stack>

              <Box px={3} pb={3} sx={{ mt: "auto" }}>
                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 5 }} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      alignItems="center"
      spacing={6}
      px={2}
      py={6}
      sx={{
        minHeight: "100vh",
      }}
      mt={5}
      minWidth={'100%'}
      maxWidth={'100%'}
    >
      <Stack spacing={1}>
        <Typography
          fontSize={{ xs: 14, sm: 16 }}
          color="var(--info-color)"
          textAlign="center"
          fontWeight={"bold"}
        >
          ✳ Choose the right plan for your needs.
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="var(--primary-color)"
          textAlign="center"
        >
          Pricing Plans
        </Typography>
      </Stack>

      {/* Pricing Cards */}
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={5}
        mt={4}
      >
        {plansData.map((plan, index) => (
            <Box
            key={index}
            sx={{
              width: { xs: "90%", sm: "80%", md: "400px" },
              minHeight: "500px",
              borderRadius: 8,
              boxShadow: 5,
              overflow: "hidden",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": { 
                transform: "translateY(-12px) scale(1.02)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
                "& .card-top": {
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  transform: "scale(1.02)",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                }
              },
            }}
          >
            {/* Top Section */}
            <Box sx={{boxShadow:5,p:2,borderRadius:8}}>
              <Box
              className="card-top"
              sx={{
                background: plan.gradient,
                color: plan.textColor,
                px: 3,
                py: 4,
                position: "relative",
                borderRadius:8,
                boxShadow:5,
                transition: "all 0.3s ease",
              }}
            >
              <Typography fontSize={45} fontWeight="bold">
                $ {plan.price}
              </Typography>

              <Typography fontSize={14} mt={1}>
                Perfect for quick help & beginners
              </Typography>

              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  backgroundColor: "var(--text-primary)",
                  color: "var(--dark-color)",
                  borderRadius: "20px",
                  px: 2,
                  py: 1,
                  fontSize: 14,
                }}
              >
                {plan.title}
              </Box>
            </Box>
            </Box>
            

            {/* Features Section */}
            <Stack spacing={1.5} px={4} py={3} sx={{ flex: 1 }}>
              {plan.features.map((feature, i) => (
                <Stack key={i} direction={"row"} gap={1} alignItems={"flex-start"}>
                  <VerifiedIcon sx={{ fontSize: 18, color: "var(--primary-color)", mt: 0.2 }} />
                  <Typography
                    fontSize={14}
                    color="rgba(0,0,0,0.8)"
                    fontWeight={"bold"}
                    sx={{ lineHeight: 1.4 }}
                  >
                    {feature}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Button */}
            <Box px={3} pb={3} sx={{ mt: "auto" }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "var(--text-primary)",
                  color: "black",
                  borderRadius: "20px",
                  textTransform: "none",
                  border:1,
                  boxShadow:0,
                  fontWeight: 500,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#333",color:"var(--text-primary)" },
                }}
              >
                Upgrade
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
export default PricingPlans;
